var geoShFrag = `
void main() {
	gl_FragColor = vec4(1, 0, 0, 1);
}`;

var geoShVert = `
attribute vec3 atLoc;
void main() {
	gl_Position = vec4(atLoc, 1);
}`;

function mainGeometry() {
	var rf = new rfGame('canvas');
	var gl = rf.setupWebGl({antialias: false});

	gl.clear(gl.COLOR_BUFFER_BIT);

	var vertData = new Uint8Array([
		0, 0,
		1, 0,
		0, 1 ]);

	var geo = new rfGeometry(rf);
	geo.addBuffer(gl.STATIC_DRAW, vertData);
	geo.addVertexAttrib(0, 2, gl.UNSIGNED_BYTE, false, 0, 0);

	var pr = new rfProgram(gl);
	pr.addShaderTextDual(geoShVert, geoShFrag, pr.MEDIUMP);
	pr.enumerateAttributes(['atLoc']);
	pr.link();

	pr.use();
	geo.render(gl.TRIANGLES, 0, 3);
};

