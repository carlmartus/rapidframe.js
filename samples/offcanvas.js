var ocShVert = `
attribute vec2 atLoc;
attribute vec2 atUv;
varying vec2 vaUv;
void main() {
	vaUv = atUv;
	gl_Position = vec4(atLoc, 0, 1);
}`;

var ocShFrag = `
varying vec2 vaUv;
uniform sampler2D unTex0;
void main() {
	gl_FragColor = texture2D(unTex0, vaUv);
}`;

function mainOffCanvas() {
	var rf = new rfGame('canvas');
	var gl = rf.setupWebGl({antialias: false});

	gl.clear(gl.COLOR_BUFFER_BIT);

	// Shader
	var pr = new rfProgram(gl);
	pr.addShaderTextDual(ocShVert, ocShFrag, pr.MEDIUMP);
	pr.enumerateAttributes(['atLoc', 'atUv']);
	pr.link();
	pr.enumerateTextureUniforms(['unTex0']);

	// Geometry
	var vertData = [
		-1, -1, 0, 0,
		 1, -1, 1, 0,
		-1,  1, 0, 1,
		 1, -1, 1, 0,
		 1,  1, 1, 1,
		-1,  1, 0, 1,
	];
	var geo = new rfGeometry(rf);
	geo.createBuffer(gl.STATIC_DRAW, new Int8Array(vertData));
	geo.addVertexAttrib(0, 2, gl.BYTE, false, 4, 0);
	geo.addVertexAttrib(0, 2, gl.UNSIGNED_BYTE, false, 4, 2);

	// Texture
	var oc = rfCanvas_makeOffscreen(32, 32);

	// Draw something
	oc.fillStyle = "red";
	oc.fillText('HELLO', 8, 8);
	oc.fillRect(0, 16, 32, 16);

	var texture = rfCanvas_canvas2GlTexture(gl, oc,
			gl.NEAREST, gl.NEAREST, true);
	console.log('Gl Texture', texture);

	gl.bindTexture(gl.TEXTURE_2D, texture);
	pr.use();

	geo.render(gl.TRIANGLES, 0, 6);
};

