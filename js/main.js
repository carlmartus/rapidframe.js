function rfGame(tagId) {
	var self = this;

	this.tagId = tagId;
	this.tag = document.getElementById(this.tagId);
	this.clientW = this.tag.clientWidth;
	this.clientH = this.tag.clientHeight;
	this.gl = null;
	this.gl_arrayCount = 0;
	this.mouseAutoCapture = false;
	this.gameState = null;

	this.cbResize = null;
	this.cbMouseMove = null;
	this.cbMouseClick = null;

	this.blockRender = false;
	this.enabledFullscreen = false;
	this.enabledFullframe = false,
	this.enabledKeyboard = false;
	this.enabledMouse = false;
	this.enabledLogKeys = false;

	this.keyBinds = {};

	window.addEventListener('blur', function() {
		self.blockRender = true;
	});
	window.addEventListener('focus', function() {
		self.blockRender = false;
	});

	// Resize event
	this.tag.addEventListener('resize', function() {
		self._resize();
	}, false);

	// Fullscreen events
	if (this.tag.requestFullscreen) {
		document.addEventListener('fullscreenchange', function() {
			self._eventFullScreen(document.fullScreenEnabled);
		}, false);
	} else if (this.tag.mozRequestFullScreen) {
		document.addEventListener('mozfullscreenchange', function() {
			self._eventFullScreen(document.mozFullScreenElement != null);
		}, false);
	} else if (this.tag.webkitRequestFullscreen) {
		document.addEventListener('webkitfullscreenchange', function() {
			self._eventFullScreen(document.webkitFullscreenElement != null);
		}, false);
	}
}

rfGame.prototype.setupWebGl = function(webGlOptions) {
	this.gl = null;
	try {
		this.gl = this.tag.getContext('webgl', webGlOptions);
	} catch (e) {}

	if (this.gl == null) {
		try {
			this.gl = this.tag.getContext('experimental-webgl', webGlOptions);
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

rfGame.prototype.setState = function(state) {
	this.gameState = state;
};

rfGame.prototype.captureMouse = function() {
	var el = this.tag;

	if (el.requestPointerLock) {
		el.requestPointerLock();
	} else if (el.mozRequestPointerLock) {
		el.mozRequestPointerLock();
	} else if (el.webkitRequestPointerLock) {
		el.webkitRequestPointerLock();
	}
};

rfGame.prototype.setMouseCallback = function(cbMove, cbClick) {
	this.cbMouseMove = cbMove;
	this.cbMouseClick = cbClick;

	if (!this.enabledMouse) {
		this._listenMouse();
	}
};

rfGame.prototype.isFullscreen = function(on) {
	return this.enabledFullscreen;
};

rfGame.prototype.setFullscreen = function(on) {
	if (on && !this.enabledFullscreen) {
		_goFullscreen(this.tag);
	} else if (this.enabledFullscreen) {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
};

rfGame.prototype.enableFullFrame = function() {
	this.enabledFullframe = true,
	this.tag.style = 'padding: 0px; margin: 0px; position: absolute; left: 0px; top: 0px;';
	this._resize();
};

rfGame.prototype.bindKey = function(key, cb) {
	var self = this;
	if (!this.enabledKeyboard) {
		document.addEventListener('keydown', function(event) {
			self._keyEvent(event, true);
		});
		document.addEventListener('keyup', function(event) {
			self._keyEvent(event, false);
		});
		this.enabledKeyboard = true;
	}

	this.keyBinds[key] = cb;
};

rfGame.prototype.setLogKeys = function(on) {
	this.enabledLogKeys = on;
};

rfGame.prototype.setResizeCallback = function(cb) {
	this.cbResize = cb;
};

rfGame.prototype.setMouseMoveCallback = function(cb) {
};

// GL Misc help
// ============

rfGame.prototype.glArrayCount = function(count) {
	while (this.gl_arrayCount > count) {
		this.gl.disableVertexAttribArray(--this.gl_arrayCount);
	}

	while (count > this.gl_arrayCount) {
		this.gl.enableVertexAttribArray(this.gl_arrayCount++);
	}
};

// Internal
// ========

rfGame.prototype._resize = function() {
	if (this.enabledFullframe) {
		var w = window.innerWidth;
		var h = window.innerHeight;

		this.tag.width = w;
		this.tag.height = h;
	}

	if (this.cbResize) {
		this.cbResize(this.tag.width, this.tag.height);
	}
};

rfGame.prototype._keyEvent = function(event, press) {
	if (event.repeat) return;

	if (press && this.enabledLogKeys) {
		console.log(event, 'Press:', press);
	}

	var bind = this.keyBinds[event.keyCode];
	if (bind) bind(event.keyCode, press, event);
};

rfGame.prototype._eventFullScreen = function(set) {
	this.enabledFullscreen = set;

	if (set) {
		this.tag.width = screen.width;
		this.tag.height = screen.height;
		this._resize();
	} else {
		this.tag.width = this.clientW;
		this.tag.height = this.clientH;
		this._resize();
	}
};

rfGame.prototype._eventMouseLockChange = function(event) {
	var can = this.tag;
	if (
			document.pointerLockElement === can ||
			document.mozPointerLockElement === can ||
			document.webkitPointerLockElement === can) {
		this.mouseAutoCapture = true;
		console.log(true);
	} else {
		this.mouseAutoCapture = false;
		console.log(false);
	}
};

rfGame.prototype._listenMouse = function() {
	var self = this;

	document.addEventListener('pointerlockchange', this._eventMouseLockChange, false);
	document.addEventListener('mozpointerlockchange', this._eventMouseLockChange, false);
	document.addEventListener('webkitpointerlockchange', this._eventMouseLockChange, false);

	this.tag.addEventListener('mousemove', function(event) {
		var x = event.clientX - self.tag.offsetLeft;
		var y = event.clientY - self.tag.offsetTop;

		var dx =
			event.movementX ||
			event.mozMovementX ||
			event.webkitMovementX ||
			0;
		var dy =
			event.movementY ||
			event.mozMovementY ||
			event.webkitMovementY ||
			0;

		if (self.cbMouseMove)	self.cbMouseMove(x, y, dx, dy);
	}, false);

	this.tag.addEventListener('mousedown', function(event) {
		if (self.cbMouseClick)	self.cbMouseClick(true);
	}, false);

	this.tag.addEventListener('mouseup', function(event) {
		if (self.cbMouseClick)	self.cbMouseClick(false);
	}, false);
}

function _goFullscreen(el) {
	if (el.requestFullscreen) {
		el.requestFullscreen();
	} else if (el.mozRequestFullScreen) {
		el.mozRequestFullScreen();
	} else if (el.webkitRequestFullscreen) {
		el.webkitRequestFullscreen();
	} else if (el.msRequestFullscreen) {
		el.msRequestFullscreen();
	}
}

