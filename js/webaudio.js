//=============================================================================
// Web audio container
//=============================================================================

/**
 * @class
 * @classdesc 3D sound fx base system using WebAudio.
 * @param {int} channelCount Maximum amount of different sounds.
 */
function rfWebAudio(channelCount) {
	this.vecForward = rfVec3_create();
	this.vecSide = rfVec3_create();
	this.vecUp = rfVec3_create();
	this.mat = rfMat4_create();
	rfMat4_identity(this.mat);

	this.context = new (window.AudioContext || window.webkitAudioContext)();

	this.channels = [];
	for (let i=0; i<channelCount; i++) this.channels.push(null);
};

/**
 * Set listening position.
 * @param {float} x Absolute X position.
 * @param {float} y Absolute Y position.
 * @param {float} z Absolute Z position.
 * @param {float} dx Relative looking X direction.
 * @param {float} dy Relative looking Y direction.
 * @param {float} dz Relative looking Z direction.
 * @param {float} ux Relative upward X direction.
 * @param {float} uy Relative upward Y direction.
 * @param {float} uz Relative upward Z direction.
 * @param {boolean} normalize Should be true if the directions are not
 * normalized.
 */
rfWebAudio.prototype.setListenPosition = function(
		x, y, z,
		dx, dy, dz,
		ux, uy, uz, normalize) {

	this.vecForward[0] = dx;
	this.vecForward[1] = dy;
	this.vecForward[2] = dz;
	this.vecUp[0] = ux;
	this.vecUp[1] = uy;
	this.vecUp[2] = uz;

	if (normalize) {
		rfVec3_normalize(this.vecForward, this.vecForward);
		rfVec3_normalize(this.vecUp, this.vecUp);
	}

	rfVec3_cross(this.vecSide, this.vecForward, this.vecUp);

	this.mat[ 0] = this.vecSide[0];
	this.mat[ 4] = this.vecSide[1];
	this.mat[ 8] = this.vecSide[2];
	this.mat[ 1] = -this.vecForward[0];
	this.mat[ 5] = -this.vecForward[1];
	this.mat[ 9] = -this.vecForward[2];
	this.mat[ 2] = this.vecUp[0];
	this.mat[ 6] = this.vecUp[1];
	this.mat[10] = this.vecUp[2];

	this.mat[ 3] = -x;
	this.mat[ 7] = -y;
	this.mat[11] = -z;

	for (let chans of this.channels) {
		if (chans && chans.usingPanner) {
			chans.updatePanner(this.mat);
		}
	}
};

/**
 * Setup a channel as mono sound playback.
 * @param {int} id Channel ID.
 * @param {SoundBuffer} sound Sound buffer. From rfLoader.
 * @param {int} maxChannels Maximum simultanious playing sound of this clip.
 */
rfWebAudio.prototype.setChannelMono = function(id, sound, maxChannels) {
	this.setChannel(id, sound.buffer, false, maxChannels);
};

/**
 * Setup a channel as 3D sound playback.
 * @param {int} id Channel ID.
 * @param {SoundBuffer} sound Sound buffer. From rfLoader.
 * @param {int} maxChannels Maximum simultanious playing sound of this clip.
 */
rfWebAudio.prototype.setChannel3d = function(id, sound, maxChannels) {
	this.setChannel(id, sound.buffer, true, maxChannels);
};

rfWebAudio.prototype.setChannel = function(id, buffer, usePanner, maxChannels) {
	this.channels[id] = new rfAudioChannels(this.context, this.mat,
			buffer, usePanner, maxChannels);
};

/**
 * Stop all sounds on channel.
 * @param {int} id Channel ID.
 */
rfWebAudio.prototype.stopChannel = function(id) {
	this.channels[id].stopAll();
};

/**
 * Stop all sounds on all channels.
 */
rfWebAudio.prototype.stopAll = function() {
	for (let i=0; i<this.channels.length; i++) {
		this.stopChannel(i);
	}
};

/**
 * Play a sound on a mono channel.
 * @param {int} id Channel ID.
 * @param {boolean} loop Loop sound?
 */
rfWebAudio.prototype.playMono = function(id, loop) {
	this.channels[id].playNext(0, 0, 0, loop);
};

/**
 * Play a sound on a 3D channel.
 * @param {int} id Channel ID.
 * @param {float} x Sound origin absolute X position.
 * @param {float} y Sound origin absolute Y position.
 * @param {float} z Sound origin absolute Z position.
 * @param {boolean} loop Loop sound?
 */
rfWebAudio.prototype.play3d = function(id, x, y, z, loop) {
	let chans = this.channels[id];
	let play = chans.playNext(x, y, z, loop);

	return play;
};


//=============================================================================
// Sound clip with multiple channels
// Internal
//=============================================================================

function rfAudioChannels(context, mat, buffer, usePanner, count) {
	this.next = 0;
	this.count = count;
	this.channels = [];
	this.usingPanner = usePanner;

	for (let i=0; i<count; i++) {
		let source = context.createBufferSource();
		let panner = null;

		source.buffer = buffer;

		if (usePanner) {
			panner = context.createPanner();
			source.connect(panner);
			panner.connect(context.destination);
		} else {
			source.connect(context.destination);
		}

		this.channels[i] = new rfAudioPlay(mat, source, panner);
	}
};

rfAudioChannels.prototype.playNext = function(x, y, z, loop) {
	let ch = this.channels[this.next];

	if (this.usingPanner) {
		ch.setLocalPosition(x, y, z);
	};

	ch.play(loop);

	this.next = (this.next+1) % this.count;
	return ch;
};

rfAudioChannels.prototype.stopAll = function() {
	for (let play of this.channels) play.stop();
};

rfAudioChannels.prototype.updatePanner = function(mat) {
	for (let play of this.channels) play.applyPosition(mat);
};


//=============================================================================
// Sound play component
// Internal
//=============================================================================

function rfAudioPlay(mat, source, panner) {
	this.mat = mat;
	this.source = source;
	this.panner = panner;
	this.localPosition = rfVec3_create();
	this.relativePosition = rfVec3_create();
	this.stopCount = 0;

	var self = this;
	this.source.onended = function() {
		if (!self.source.loop) {
			self.tickUnplay;
		}
	};
};

rfAudioPlay.prototype.setLocalPosition = function(x, y, z) {
	this.localPosition[0] = x;
	this.localPosition[1] = y;
	this.localPosition[2] = z;
	//console.log('Set local position', this.localPosition);

	this.applyPosition();
};

rfAudioPlay.prototype.applyPosition = function() {
	rfMat4_mulVec3(this.relativePosition, this.mat, this.localPosition);

	//console.log('Set relative position', this.relativePosition);
	this.panner.setPosition(
			-this.relativePosition[0],
			-this.relativePosition[1],
			-this.relativePosition[2]);
};

rfAudioPlay.prototype.tickUnplay = function() {
	this.stopCount++;
};

rfAudioPlay.prototype.getStopCount = function() {
	return this.stopCount;
};

rfAudioPlay.prototype.play = function(loop) {
	this.source.loop = loop;
	this.source.start(0);
};

rfAudioPlay.prototype.stop = function() {
	this.source.stop(0);
};

