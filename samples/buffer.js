var bufShVert = `
attribute vec2 atLoc;
attribute vec3 atCol;
varying vec3 vaCol;
void main() {
	vaCol = atCol;
	gl_Position = vec4(atLoc, 0, 1);
}`

var bufShFrag = `
varying vec3 vaCol;
void main() {
	gl_FragColor = vec4(vaCol, 1);
}`

function mainBuffer() {
	var rf = new rfGame('canvas');
	var gl = rf.setupWebGl({antialiasing: false});
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Each vertex is 13 bytes
	var bu = new rfBuffer(12*3);

	function pushVert(bu, x, y, r, g, b, a) {
		bu.pushFloat32(x);
		bu.pushFloat32(y);
		bu.pushUint8(r);
		bu.pushUint8(g);
		bu.pushUint8(b);
		bu.pushUint8(a);
	};

	// Vertex data
	pushVert(bu, -1.0, -1.0, 255, 0, 0);
	pushVert(bu,  1.0, -1.0, 0, 255, 0);
	pushVert(bu, -1.0,  1.0, 0, 0, 255);

	// Geometry
	var geo = new rfGeometry(rf);
	var va = bu.createGlArrayBuffer(gl, gl.STATIC_DRAW);
	geo.addBuffer(va);
	geo.addVertexAttrib(0, 2, gl.FLOAT, false, 12, 0);
	geo.addVertexAttrib(0, 3, gl.UNSIGNED_BYTE, true, 12, 8);

	// Shader
	var pr = new rfProgram(gl);
	pr.addShaderTextDual(bufShVert, bufShFrag, pr.MEDIUMP);
	pr.enumerateAttributes(['atLoc', 'atCol']);
	pr.link();

	pr.use();
	geo.render(gl.TRIANGLES, 0, 3);
};

