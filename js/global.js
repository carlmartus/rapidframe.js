//=============================================================================
// Offscreen canvas
//=============================================================================

/**
 * Helper function to create a HTML5 canvas.
 * @param {int} width Canvas width.
 * @param {int} height Canvas height.
 * @return {HTML2dCanvas} Standard HTML5 2D canvas.
 */
function rfCanvas_makeOffscreen(width, height) {
	var can = document.createElement('canvas');
	can.width = width;
	can.height = height;
	return can.getContext('2d');
};

/**
 * Create a new WebGL texture from a HTML5 2D canvas.
 * @param {GlContext} gl
 * @param {HTML5Canvas}
 * @param filterMin Minification filter (eg. gl.NEAREST).
 * @param filterMag Magnification filter (eg. gl.LINEAR).
 * @param {boolean} mipmap Generate mipmaps?
 */
function rfCanvas_canvas2GlTexture(gl, can, filterMag, filterMin, mipmap) {
	var tex = gl.createTexture();

	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, can.canvas);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMag);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMag);

	if (mipmap) {
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	return tex;
};

/**
 * Set WebGL default vertical flip of textures.
 * @param {boolean} on
 */
function rfGl_textureFlipY(on) {
	this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, on);
};

