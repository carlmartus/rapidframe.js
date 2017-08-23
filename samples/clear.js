var rf, gl;

function mainClear() {
	rf = new rfGame('canvas');
	gl = rf.setupWebGl();

	gl.clearColor(0.6, 0.7, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

