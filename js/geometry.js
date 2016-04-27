function rfGeometry(rf) {
	this.rf = rf;
	this.gl = rf.gl;
	this.buffers = [];
	this.vertexAttribs = [];
};

rfGeometry.prototype.addBuffer = function(drawType, arr) {
	var gl = this.gl;

	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	if (typeof(arr) == 'number') {
		gl.bufferData(gl.ARRAY_BUFFER, new ArrayBuffer(arr), drawType);
	} else {
		gl.bufferData(gl.ARRAY_BUFFER, arr, drawType);
	}

	this.buffers.push(buf);
	return buf;
};

rfGeometry.prototype.updateBuffer = function(bufferId, offset, arr) {
	var gl = this.gl;
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.bufferSubData(gl.ARRAY_BUFFER, offset, arr);
};

rfGeometry.prototype.addVertexAttrib = function(bufferId, elemCount, dataType,
		normalize, stride, offset) {
	var va = {
		bufferId: bufferId,
		elemCount: elemCount,
		dataType: dataType,
		normalize: normalize,
		stride: stride,
		offset: offset,
	};
	this.vertexAttribs.push(va);
};

rfGeometry.prototype.render = function(primitiveType, vertOffset, vertCount) {
	var gl = this.gl;
	var lastBufId = -1;

	this.rf.glArrayCount(this.vertexAttribs.length);

	for (var i=0; i<this.vertexAttribs.length; i++) {
		var va = this.vertexAttribs[i];

		if (va.bufferId != lastBufId) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[va.bufferId]);
		}
		gl.vertexAttribPointer(i, va.elemCount, va.dataType, va.normalize,
				va.stride, va.offset);
	}

	gl.drawArrays(primitiveType, vertOffset, vertCount);
};

