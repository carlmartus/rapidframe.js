var rf, gl, camera;

var GLSL_VERT = `
attribute vec2 at_loc;
uniform mat4 un_mvp;
varying vec2 va_loc;

void main() {
	va_loc = at_loc;
	gl_Position = un_mvp*vec4(at_loc, 0, 1);
}`;

var GLSL_FRAG = `
varying vec2 va_loc;

void main() {
	gl_FragColor = vec4(va_loc, 0, 1);
}`;

var time = 0.0;
var camera;

var unMvp, program, vba;

function frame(ft, blurred) {
	time += ft;
	return true;
}

function render() {
	rfMat4_camera(camera, 1.4, 1.333, 0.1, 20.0,
			rfVec3_parse(2.0*Math.cos(time), 2.0*Math.sin(time), 1.0),
			rfVec3_parse(0.0, 0.0, 0.0),
			rfVec3_parse(0.0, 0.0, 1.0));
	unMvp.update();

	gl.clearColor(0.6, 0.7, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Draw content
	program.use();
	rf.glArrayCount(1);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, gl.FALSE, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function mainCamera() {
	rf = new rfGame('canvas');
	gl = rf.setupWebGl({antialias: false});
	rf.setResizeCallback(function(w, h) {
		gl.viewport(0, 0, w, h);
	});

	rf.bindKey(70, function(key, press) {
		if (press) {
			var current = rf.isFullscreen();
			rf.setFullscreen(!current);
		}
	});

	rf.bindKey(77, function(key, press) {
		if (press) {
			rf.captureMouse();
		}
	});

	rf.setMouseCallback(function(x, y, dx, dy) {
		console.log('Move', x, y, dx, dy);
	}, function(press) {
		console.log('Press', press);
	});

	rf.setLogKeys(true);
	//rf.captureMouse(true);

	rf.setResizeCallback(function(w, h) {
		gl.viewport(0, 0, w, h);
	});

	// Uniform link
	unMvp = new rfUniformLink('un_mvp', function(gl, loc) {
		gl.uniformMatrix4fv(loc, false, camera);
	});
	camera = rfMat4_create();

	// Shader
	program = new rfProgram(gl);
	program.addShaderText(GLSL_VERT, program.VERT, program.MEDIUMP);
	program.addShaderText(GLSL_FRAG, program.FRAG, program.MEDIUMP);
	program.link();
	program.addUniformLink(unMvp);

	// VBA
	var vertData = [
		0.0, 0.0,
		1.0, 0.0,
		0.0, 1.0,
	];
	vba = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vba);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertData), gl.STATIC_DRAW);

	rf.startLoop(frame, render);
}

