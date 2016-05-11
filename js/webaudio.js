function rfWebAudio(channelCount) {
	this.pos = rfVec3_create();
	this.dir = rfVec3_create();
	this.dir[1] = 1.0;

	this.channels = [];
	for (var i=0; i<channelCount; i++) {
		this.channel.push(null);
	}
};

rfWebAudio.prototype.setPosition = function(x, y, z, dx, dy, dz) {
	this.pos[0] = x;
	this.pos[1] = y;
	this.pos[2] = z;
	this.dir[0] = dx;
	this.dir[1] = dy;
	this.dir[2] = dz;
};

rfWebAudio.prototype.setChannelMono = function(id, sound) {
};

rfWebAudio.prototype.setChannel3d = function(id, sound, maxChannels) {
	var chan = {
		next: 0,
		max: maxChannels,
	};
	this.channels[id] = chan;
};

rfWebAudio.prototype.stopChannel = function(id) {
};

rfWebAudio.prototype.stopAll = function() {
	for (var i=0; i<this.channel.length; i++) {
		this.stopChannel(i);
	}
};

