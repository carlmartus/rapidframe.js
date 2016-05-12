function rfWebAudio(channelCount) {
	this.pos = rfVec3_create();
	this.dir = rfVec3_create();
	this.dir[1] = 1.0;

	this.context = new (window.AudioContext || window.webkitAudioContext)();

	this.channels = [];
	for (var i=0; i<channelCount; i++) this.channels.push(null);
};

rfWebAudio.prototype.setListenPosition = function(x, y, z, dx, dy, dz) {
	this.pos[0] = x;
	this.pos[1] = y;
	this.pos[2] = z;
	this.dir[0] = dx;
	this.dir[1] = dy;
	this.dir[2] = dz;

	var mat;

	for (var i=0; i<channelCount; i++) {
		if (this.channels[i].usingPanner) {
			this.channels[i].updatePanner(mat);
		}
	}
};

rfWebAudio.prototype.setChannelMono = function(id, sound, maxChannels) {
	this.setChannel(id, sound.buffer, false, maxChannels);
};

rfWebAudio.prototype.setChannel3d = function(id, sound, maxChannels) {
	this.setChannel(id, sound.buffer, true, maxChannels);
};

rfWebAudio.prototype.setChannel = function(id, buffer, usePanner, maxChannels) {
	this.channels[id] = new rfAudioChannels(this.context, buffer, usePanner, maxChannels);
};

rfWebAudio.prototype.stopChannel = function(id) {
	this.channels[id].stopAll();
};

rfWebAudio.prototype.stopAll = function() {
	for (var i=0; i<this.channels.length; i++) {
		this.stopChannel(i);
	}
};

rfWebAudio.prototype.playMono = function(id, loop) {
	this.channels[id].playNext(0, 0, 0, loop);
};

rfWebAudio.prototype.play3d = function(id, x, y, z, loop) {
};


function rfAudioChannels(context, buffer, usePanner, count) {
	this.next = 0;
	this.count = count;
	this.channels = [];
	this.usingPanner = usePanner;

	for (var i=0; i<count; i++) {
		var source = context.createBufferSource();
		var panner = null;

		source.buffer = buffer;

		if (usePanner) {
			var panner = context.createPanner();
			source.connect(panner);
			panner.connect(context.destination);
		} else {
			source.connect(context.destination);
		}

		this.channels[i] = new rfAudioPlay(source, panner);
	}
};

rfAudioChannels.prototype.playNext = function(x, y, z, loop) {
	var ch = this.channels[this.next];

	ch.source.loop = loop;
	ch.source.start(0);


	console.log('Next', this.next);
	this.next = (this.next+1) % this.count;
};

rfAudioChannels.prototype.stopAll = function() {
	console.log('Stop all!');
	this.channels.forEach(rfAudioPlay.prototype.stop);
};


function rfAudioPlay(source, panner) {
	this.source = source;
	this.panner = panner;
	//panner.setPosition(1, 0, 0);
};

rfAudioPlay.prototype.play = function() {
	this.source.play(0);
};

rfAudioPlay.prototype.stop = function() {
	this.source.stop(0);
};

