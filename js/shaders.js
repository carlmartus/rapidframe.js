function rfProgram(gl) {
	this.gl = gl;
	this.program = gl.createProgram();
	this.uniformLinks = []
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
	for (var i=0; i<this.uniformLinks.length; i++) {
		var link = this.uniformLinks[i];
		if (link[0] != link[1].magic) {
			link[1].cb(gl, link[2]);
			link[0] = link[1].magic;
		}
	}
};

rfProgram.prototype.addUniformLink = function(uniform) {
	var loc = this.getUniform(uniform.name);

	this.uniformLinks.push([0, uniform, loc]);
};


function rfUniformLink(name, cb) {
	this.magic = 1;
	this.name = name;
	this.cb = cb;
}

rfUniformLink.prototype.update = function() {
	this.magic++;
};

