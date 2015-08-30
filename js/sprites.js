RF_SPRITE_GLSL_VERT = `
attribute vec3 at_loc;

void main() {
	gl_Position = vec4(at_loc.xy, 0, 1);
}
`;

RF_SPRITE_GLSL_FRAG = `
void main() {
	gl_FragColor = vec4(0, 1, 0, 1);
}
`;

function rfSprites(gl, texture, maxSprites) {
	this.gl = gl;
	this.texture = texture;
	this.maxSprites = maxSprites;
	this.scale = 1.0;
	this.unScale = new rfUniformLink('un_scale', function(gl, loc) {
		gl.uniform1f(loc, this.scale);
	});
}

rfSprites.prototype.push = function(x, y) {
};

rfSprites.prototype.render = function() {
};

rfSprites.prototype.setScale = function(scale) {
	this.scale = 1.0;
	this.unScale.update();
};

