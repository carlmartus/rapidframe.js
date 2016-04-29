/**
 * @class
 * @classdesc Content downloader for images, audio clips and images directly
 * converted to OpenGL textures. Async callback when all downloadeds are
 * completed. A simple OpenGL download progressbar can be rendered.
 */
function rfLoader() {
	this.list = [];
}

rfLoader.prototype.LOAD_IMAGE = 1;
rfLoader.prototype.LOAD_AUDIO = 2;
rfLoader.prototype.LOAD_TEXTURE = 3;

rfLoader.prototype.GLLOD_BG = 16;
rfLoader.prototype.GLLOD_FG = 12;

/**
 * Queue Image to download.
 * @param {string} url Image URL
 * @return {Image}
 */
rfLoader.prototype.loadImage = function(url) {
	var obj = new Image();
	this.list.push([obj, url, this.LOAD_IMAGE]);
	return obj;
}

/**
 * Queue Image download. When the file is downloaded it will be converted to a
 * OpenGL texture.
 * @param {GlContext} gl
 * @param {string} url Image URL
 * @param filterMin Minification filter (eg. gl.NEAREST).
 * @param filterMag Magnification filter (eg. gl.LINEAR).
 * @return {GlTexture}
 */
rfLoader.prototype.loadTexture = function(gl, url, filterMag, filterMin) {
	var tex = gl.createTexture();
	this.list.push([tex, url, this.LOAD_TEXTURE]);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMag);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMag);
	/*
	if (generateMipMap) {
		gl.generateMipmap(gl.TEXTURE_2D);
	}*/
	return tex;
}

/**
 * Queue Audio clip download.
 * @param {string} url Image URL
 * @return {Audio}
 */
rfLoader.prototype.loadAudio = function(url) {
	var obj = new Audio();
	this.list.push([obj, url, this.LOAD_AUDIO]);
	return obj;
}

function renderGlLoadingScreen(gl, step, count) {
	var dims = gl.getParameter(gl.VIEWPORT);
	var x = dims[0];
	var y = dims[1];
	var w = dims[2];
	var h = dims[3];

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.enable(gl.SCISSOR_TEST);

	// Bar background
	gl.scissor(
			x + rfLoader.GLLOD_BG,
			y + h/2 - rfLoader.GLLOD_BG,
			w - 2*rfLoader.GLLOD_BG,
			rfLoader.GLLOD_BG*2);
	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Bar forground
	gl.scissor(
			x + (rfLoader.GLLOD_BG + (rfLoader.GLLOD_BG - rfLoader.GLLOD_FG)),
			y + h/2 - rfLoader.GLLOD_FG,
			(step / count) * (w - 2.0*(rfLoader.GLLOD_BG + (rfLoader.GLLOD_BG - rfLoader.GLLOD_FG))),
			rfLoader.GLLOD_FG*2);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.disable(gl.SCISSOR_TEST);

	gl.viewport(x, y, w, h);
};

/**
 * Callback executed each time one of the download are completed.
 * @callback downloadsStep
 * @param {number} step Amount of files downloaded
 * @param {number} count Total amount of both finnished and und
 */

/**
 * Callback executed when all downloads are completed.
 * @callback downloadsCompleted
 */

/**
 * Display OpenGL download progress bar.
 * @param {GlContext} gl OpenGL target
 * @param {downloadsCompleted} Callback When downloads are completed
 */
rfLoader.prototype.downloadWithGlScreen = function(gl, callback) {
	renderGlLoadingScreen(gl, 0, 1);
	return this.download(callback, function(step, count) {
		renderGlLoadingScreen(gl, step, count);
	}, gl);
};

function createTextureDownload(callback, obj, img) {
	return function(a, b) {
		gl.bindTexture(gl.TEXTURE_2D, obj);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		callback(a, b);
	};
};


/**
 * Async callback for downloads.
 * @param {downloadsCompleted} callback When downloads are completed
 * @param {downloadsStep} step When one of the downloads are completed
 * @param {GlContext} [gl]
 */
rfLoader.prototype.download = function(callback, step, gl) {
	var length = this.list.length;
	var left = length;

	for (var i=0; i<this.list.length; i++) {
		var entry = this.list[i];
		var obj = entry[0];
		var listUrl = entry[1];
		var type = entry[2];

		var func = (function(obj, url) {
			return function() {
				left--;
				if (step) {
					step(length-left, length);
				}

				if (left == 0) {
					callback();
				}
			}
		})(obj, listUrl);

		switch (type) {
			default :
			case this.LOAD_IMAGE :
				obj.onload = func;
				obj.src = listUrl;
				break;

			case this.LOAD_AUDIO :
				obj.addEventListener('canplaythrough', func, false);
				obj.src = listUrl;
				break;

			case this.LOAD_TEXTURE :
				var img = new Image();
				img.onload = createTextureDownload(func, obj, img);
				img.src = listUrl;
				break;
		}
	}
};

