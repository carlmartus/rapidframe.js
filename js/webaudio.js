function rfWebAudio(channelCount) {
	this.pos = rfVec3_create();
	this.dir = rfVec3_create();
	this.dir[1] = 1.0;

	this.context = new (window.AudioContext || window.webkitAudioContext)();

	this.channels = [];
	for (var i=0; i<channelCount; i++) this.channels.push(null);
};

rfWebAudio.prototype.setPosition = function(x, y, z, dx, dy, dz) {
	this.pos[0] = x;
	this.pos[1] = y;
	this.pos[2] = z;
	this.dir[0] = dx;
	this.dir[1] = dy;
	this.dir[2] = dz;
};

rfWebAudio.prototype.setChannelMono = function(id, sound, maxChannels) {
	this.setChannel(id, sound.buffer, maxChannels);
};

rfWebAudio.prototype.setChannel3d = function(id, sound, maxChannels) {
};

rfWebAudio.prototype.setChannel = function(id, buffer, maxChannels) {
	this.channels[id] = new rfAudioChannels(this.context, buffer, maxChannels);
};

rfWebAudio.prototype.stopChannel = function(id) {
};

rfWebAudio.prototype.stopAll = function() {
	for (var i=0; i<this.channels.length; i++) {
		this.stopChannel(i);
	}
};

rfWebAudio.prototype.playMono = function(id, loop) {
	console.log('Play mono', id, this.channels);
	this.channels[id].playNext(loop);
};


function rfAudioChannels(context, buffer, count) {
	this.next = 0;
	this.count = count;
	this.channels = [];

	for (var i=0; i<count; i++) {
		var source = context.createBufferSource();
		source.buffer = buffer;

		var panner = context.createPanner();
		source.connect(panner);
		panner.connect(context.destination);

		var obj = {
			source: source,
			panner: panner,
		};
		this.channels[i] = obj;
	}
};

rfAudioChannels.prototype.playNext = function(loop) {
	var ch = this.channels[this.next];

	ch.source.loop = loop;
	ch.source.start(0);


	console.log('Next', this.next);
	this.next = (this.next+1) % this.count;
};

