function rfGame(tagId) {
	this.tagId = tagId;
	this.gl = null;
	this.gl_arrayCount = 0;
	this.cbResize = null;

	this.blockRender = false;
	this.enabledFullscreen = false;
	this.enabledKeyboard = false;
	this.keyBinds = {};

	var self = this;

	window.addEventListener('blur', function() {
		self.blockRender = true;
	});
	window.addEventListener('focus', function() {
		self.blockRender = false;
	});
}

rfGame.prototype.setupWebGl = function(webGlOptions) {
	var tag = document.getElementById(this.tagId);

	this.gl = null;
	try {
		this.gl = tag.getContext('webgl', webGlOptions);
	} catch (e) {}

	if (this.gl == null) {
		try {
			this.gl = tag.getContext('experimental-webgl', webGlOptions);
		} catch (e) {
			alert('Could not initialize WebGL');
		}
	}

	return this.gl;
};

rfGame.prototype.startLoop = function(frame, render) {
	var lastTime = Date.now();

	var requestAnimFrame;
	if (window && window.requestAnimationFrame) {
		requestAnimationFrame = window.requestAnimationFrame;
	} else {
		requestAnimationFrame = function(callback) {
			window.setTimeout(callback, 1000.0 / 60.0);
		};
	}

	var self = this;
	function clo() {
		var now = Date.now();
		if (frame((now - lastTime) * 0.001, !self.blockRender)) {
			if (!self.blockRender) render();
			requestAnimationFrame(clo);
		}
		lastTime = now;
	}

	requestAnimationFrame(clo);
};

rfGame.prototype.isFullscreen = function(on) {
	return this.enabledFullscreen;
};

rfGame.prototype.setFullscreen = function(on) {
};

rfGame.prototype.setMouseMoveCallback = function(cb) {
};

rfGame.prototype._keyEvent = function(event, press) {
	console.log('Key', event.keyCode, press);
	var bind = this.keyBinds[event.keyCode];
	if (bind) bind(event.keyCode, press, event);
};

rfGame.prototype.bindKey = function(key, cb) {
	var self = this;
	if (!this.enabledKeyboard) {
		document.addEventListener('keydown', function(event) {
			self._keyEvent(event.keyCode, true);
		});
		document.addEventListener('keyup', function(event) {
			self._keyEvent(event.keyCode, false);
		});
		this.enabledKeyboard = true;
	}

	this.keyBinds[key] = cb;
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

