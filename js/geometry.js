/**
 * @class
 * @classdesc Array buffer abstraction for easier initialization and rendering.
 * @param {rfGame} rf Rapidframe instance.
 */
function rfGeometry(rf) {
	this.rf = rf;
	this.gl = rf.gl;
	this.buffers = [];
	this.vertexAttribs = [];
};

/**
 * Create new array buffer. ID of buffers will begin at 0 and increment from
 * there.
 * @param {GlUsage} usage gl.STATIC_DRAW or similar
 * @param {int|ArrayBuffer} arr Content. If integer is given, there will be a
 * mere allocation of data and updateBuffer will have to be used to fill the
 * buffer.
 */
rfGeometry.prototype.addBuffer = function(usage, arr) {
	var gl = this.gl;

	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	if (typeof(arr) == 'number') {
		gl.bufferData(gl.ARRAY_BUFFER, new ArrayBuffer(arr), usage);
	} else {
		gl.bufferData(gl.ARRAY_BUFFER, arr, usage);
	}

	this.buffers.push(buf);
	return buf;
};

/**
 * Update data in buffer.
 * @param {int} bufferId Buffer ID, first buffer has ID 0, second 1, etc.
 * @param {int} offset Data will be put att this offset of the target buffer.
 * @param {ArrayBuffer} arr Data to be put in target buffer.
 */
rfGeometry.prototype.updateBuffer = function(bufferId, offset, arr) {
	var gl = this.gl;
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.bufferSubData(gl.ARRAY_BUFFER, offset, arr);
};

/**
 * Add vertex attribute description.
 * @param {int} bufferId Buffer to be used.
 * @param {int} elemCount Amount of elements (ex. 2 or 3).
 * @param {GlDatatype} dataType Type for attribute (ex. gl.FLOAT).
 * @param {boolean} normalize Shall OpenGL normalize non-float data within 0-1?
 * @param {int} stride Iteration step, can be 0 if buffer only has 1 vertex
 * attribute.
 * @param {int} offset Offset within stride in bytes.
 */
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

/**
 * Execute OpenGL rendering.
 * @param {GlPrimitive} primitiveType What to render (eq. gl.TRIANGLES)?
 * @param {int} vertOffset Start rendering at offset.
 * @param {int} vertCount Render this many vertices.
 */
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

