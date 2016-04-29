var bufShVert = `
attribute vec2 atLoc;
attribute vec4 atCol;
varying vec4 vaCol;
void main() {
	//vaCol = atCol;
	vaCol = vec4(atLoc, 0, 1) + atCol;
	gl_Position = vec4(atLoc, 0, 1);
}`

var bufShFrag = `
varying vec4 vaCol;
void main() {
	gl_FragColor = vaCol;
	//gl_FragColor = vec4(1, 0, 0, 1);
}`

function mainBuffer() {
	var rf = new rfGame('canvas');
	var gl = rf.setupWebGl({antialias: false});
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Each vertex is 13 bytes
	//var bu = new rfBuffer(12*4);
	//var bu = new rfBuffer(8*4);
	var bu = new rfBuffer(200);

	function pushVert(bu, x, y, r, g, b, a) {
		bu.pushFloat32(x);
		bu.pushFloat32(y);

		bu.pushUint8(r);
		bu.pushUint8(g);
		bu.pushUint8(b);
		bu.pushUint8(a);
	};

	var tmpBuf = new Float32Array(bu.buf.buffer);
	for (var i=0; i<8; i++) {
		console.log(i + ' = ' + tmpBuf[i]);
	};

	// Vertex data
	pushVert(bu, -0.9, -0.8, 255, 0, 0);
	pushVert(bu,  0.7, -0.9, 0, 255, 0);
	pushVert(bu, -0.5,  0.95, 0, 0, 255);
	pushVert(bu,  0.9,  0.9, 255, 0, 255);

	// Geometry
	var geo = new rfGeometry(rf);
	var va = bu.createGlArrayBuffer(gl, gl.STATIC_DRAW);
	geo.addBuffer(va);
	//geo.createBuffer(gl.STATIC_DRAW, bu.buf.buffer);
	/*
	geo.createBuffer(gl.STATIC_DRAW, new Float32Array([
				0, 0,
				1, 0,
				0, 1,
				1, 1,]));*/
	//geo.addVertexAttrib(0, 2, gl.FLOAT, false, 0, 0);
	geo.addVertexAttrib(0, 2, gl.FLOAT, false, 12, 0);
	geo.addVertexAttrib(0, 4, gl.UNSIGNED_BYTE, true, 12, 8);

	// Shader
	var pr = new rfProgram(gl);
	pr.addShaderTextDual(bufShVert, bufShFrag, pr.MEDIUMP);
	pr.enumerateAttributes(['atLoc', 'atCol']);
	//pr.enumerateAttributes(['atLoc']);
	pr.link();

	pr.use();
	geo.render(gl.TRIANGLE_STRIP, 0, 4);
};

