function rfProgram(gl) {
	this.gl = gl;
	this.program = gl.createProgram();
}

rfProgram.prototype.VERT = 1;
rfProgram.prototype.FRAG = 2;

rfProgram.prototype.LOWP	= "#version 100\nprecision lowp float;\n";
rfProgram.prototype.MEDIUMP	= "#version 100\nprecision mediump float;\n";
rfProgram.prototype.HIGHP	= "#version 100\nprecision highp float;\n";

rfProgram.prototype.addShaderId = function(idName, type, header) {
	this.addShaderText(document.getElementById(idName).text, type, header);
};

rfProgram.prototype.addShaderText = function(text, type, header) {
	if (header) text = header + text;

	var shader = gl.createShader(type == this.FRAG ?
			gl.FRAGMENT_SHADER:gl.VERTEX_SHADER);
	gl.shaderSource(shader, text);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
	}

	this.gl.attachShader(this.program, shader);
};

rfProgram.prototype.bindAttribute = function(id, name) {
	this.gl.bindAttribLocation(this.program, id, name);
};

rfProgram.prototype.link = function() {
	this.gl.linkProgram(this.program);
};

rfProgram.prototype.getUniform = function(name) {
	return this.gl.getUniformLocation(this.program, name);
};

rfProgram.prototype.use = function() {
	this.gl.useProgram(this.program);
};

