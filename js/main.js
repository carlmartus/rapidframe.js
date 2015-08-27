function rfGame(tagId) {
	this.tagId = tagId;
	this.gl = null;
	this.gl_arrayCount = 0;
	this.cbResize = null;
}

rfGame.prototype.setupWebGl = function(webGlOptions) {
	var tag = document.getElementById(this.tagId);

	this.gl = null;
	try {
		this.gl = tag.getContext('webgl', webGlOptions);
	} catch (e) {}

	if (this.gl == null) {
		this.gl = tag.getContext('experimental-webgl', webGlOptions);
	}

	return this.gl;
};

rfGame.prototype.startLoop = function(frame) {
	var lastTime = Date.now();

	var requestAnimFrame;
	if (window && window.requestAnimationFrame) {
		requestAnimationFrame = window.requestAnimationFrame;
	} else {
		requestAnimationFrame = function(callback) {
			window.setTimeout(callback, 1000.0 / 60.0);
		};
	}

	function clo() {
		var now = Date.now();
		if (!func((now - lastTime) * 0.001)) {
			requestAnimationFrame(clo);
		}
		lastTime = now;
	}

	requestAnimationFrame(clo);
};

rfGame.prototype.setResizeCallback = function(cb) {
	this.cbResize = cb;
};

rfGame.prototype.glArrayCount = function(count) {
	while (this.gl_arrayCount > count) {
		this.gl.disableVertexAttribArray(--this.gl_arrayCount);
	}

	while (count > this.gl_arrayCount) {
		this.gl.enableVertexAttribArray(this.gl_arrayCount++);
	}
};

