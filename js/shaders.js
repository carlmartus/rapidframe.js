/**
 * OpenGL shader program.
 * @class
 * @param {GlContext} WebGL context.
 */
function rfProgram(gl) {
	this.gl = gl;
	this.program = gl.createProgram();
	this.uniformLinks = []
}


//=============================================================================
// Shader type
//=============================================================================

/** @typedef rfProgramType */

/**
 * @constant {rfProgramType} VERT Vertex shader.
 * @memberof rfProgram
 */
rfProgram.prototype.VERT = 1;

/**
 * @constant {rfProgramType} FRAG Fragment shader.
 * @memberof rfProgram
 */
rfProgram.prototype.FRAG = 2;


//=============================================================================
// Shader precision
//=============================================================================

/** @typedef rfProgramPrecision */

/**
 * @constant {rfProgramPrecision} LOWP Shader low precision header.
 * @memberof rfProgram
 */
rfProgram.prototype.LOWP	= "#version 100\nprecision lowp float;\n";

/**
 * @constant {rfProgramPrecision} MEDIUMP Shader medium precision header.
 * @memberof rfProgram
 */
rfProgram.prototype.MEDIUMP	= "#version 100\nprecision mediump float;\n";

/**
 * @constant {rfProgramPrecision} HIGHP Shader high precision header.
 * @memberof rfProgram
 */
rfProgram.prototype.HIGHP	= "#version 100\nprecision highp float;\n";


//=============================================================================
// Program member functions
//=============================================================================

/**
 * Compile and add shader to program with source from HTML element. Don't
 * include #version string and precision in source. That will be attained from
 * the header parameter.
 * @param {string} idName Element identifier.
 * @param {rfProgramType} type Shader type.
 * @param {rfProgramPrecision} header Shader precision and header.
 */
rfProgram.prototype.addShaderId = function(idName, type, header) {
	this.addShaderText(document.getElementById(idName).text, type, header);
};

/**
 * Compile and add shader to program with source from string. Don't include
 * #version string and precision in source. That will be attained from the
 * header parameter.
 * @param {string} text GLSL source.
 * @param {rfProgramType} type Shader type.
 * @param {rfProgramPrecision} header Shader precision and header.
 */
rfProgram.prototype.addShaderText = function(text, type, header) {
	if (header) text = header + text;

	var shader = this.gl.createShader(type == this.FRAG ?
			this.gl.FRAGMENT_SHADER:this.gl.VERTEX_SHADER);
	this.gl.shaderSource(shader, text);
	this.gl.compileShader(shader);

	if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
		alert(this.gl.getShaderInfoLog(shader));
	}

	this.gl.attachShader(this.program, shader);
};

/**
 * Bind a attribute to an OpenGL attribute location. This operation should be
 * executed before linking the program.
 * @param {int} id Location.
 * @param {string} name Name of attribute in GLSL source.
 */
rfProgram.prototype.bindAttribute = function(id, name) {
	this.gl.bindAttribLocation(this.program, id, name);
};

/** Link OpenGL shader program. */
rfProgram.prototype.link = function() {
	this.gl.linkProgram(this.program);

	if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
		alert(this.gl.getProgramInfoLog(this.program));
	}
};

/**
 * Get uniform location.
 * @param {string} name Name of uniform in GLSL source.
 * @return {GlUniformLocation} Location that can be used with uniform operations
 * in OpenGL.
 */
rfProgram.prototype.getUniform = function(name) {
	return this.gl.getUniformLocation(this.program, name);
};

/** Activate shader program. */
rfProgram.prototype.use = function() {
	this.gl.useProgram(this.program);
	for (var i=0; i<this.uniformLinks.length; i++) {
		var link = this.uniformLinks[i];
		if (link[0] != link[1].magic) {
			link[1].cb(gl, link[2]);
			link[0] = link[1].magic;
		}
	}
};

/**
 * Linked a uniform value that can be shared between many different shader
 * programs.
 * @param {rfUniformLink} uniform Linked uniform.
 */
rfProgram.prototype.addUniformLink = function(uniform) {
	var loc = this.getUniform(uniform.name);

	this.uniformLinks.push([0, uniform, loc]);
};


/**
 * @callback uniformLink
 * @param {GlContext} gl OpenGL context.
 * @param {GlUniformLocation} loc Uniform location.
 */

/**
 * Create a linked uniform object.
 * @class
 * @param {string} name GLSL uniform source name.
 * @param {uniformLink} cb Callback when the constanc needs to be applied.
 */
function rfUniformLink(name, cb) {
	this.magic = 1;
	this.name = name;
	this.cb = cb;
}

/**
 * Notify linked uniform update. Next time a shader program is used with this
 * uniform link, the uniformLink callback will be triggered.
 */
rfUniformLink.prototype.update = function() {
	this.magic++;
};

