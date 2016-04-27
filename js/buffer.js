/**
 * @class
 * @classdesc Data packing of low level data types. Data supplied with push
 * functions will sequentially put data in buffer.
 * @param {int} initAlloc Initial buffer size allocation.
 */
function rfBuffer(initAlloc) {
	this.max = initAlloc;
	this.buf = new DataView(new ArrayBuffer(this.max));
	this.offset = 0;
};

/**
 * Change current writing position.
 * @param {int} pos Position to set writer to.
 */
rfBuffer.prototype.setPosition = function(pos) {
	this.offset = pos;
};

/**
 * Rewind writer to start of buffer.
 */
rfBuffer.prototype.rewind = function() {
	this.offset = 0;
};

/**
 * Check if the buffer is full.
 * @return {boolean} Has writer position exceeded limits?
 */
rfBuffer.prototype.isFull = function() {
	return this.offset >= this.max;
};

/**
 * Write Int 8
 * @param {number} n Number
 */
rfBuffer.prototype.pushInt8		= function(n) { this.buf.setInt8(this.offset, n);	this.offset += 1; };

/**
 * Write UInt 8
 * @param {number} n Number
 */
rfBuffer.prototype.pushUInt8	= function(n) { this.buf.setUInt8(this.offset, n);	this.offset += 1; };

/**
 * Write Int 16
 * @param {number} n Number
 */
rfBuffer.prototype.pushInt16	= function(n) { this.buf.setInt16(this.offset, n);	this.offset += 2; };

/**
 * Write UInt 16
 * @param {number} n Number
 */
rfBuffer.prototype.pushUInt16	= function(n) { this.buf.setUInt16(this.offset, n);	this.offset += 2; };

/**
 * Write Int 32
 * @param {number} n Number
 */
rfBuffer.prototype.pushInt32	= function(n) { this.buf.setInt32(this.offset, n);	this.offset += 4; };

/**
 * Write UInt 32
 * @param {number} n Number
 */
rfBuffer.prototype.pushUInt32	= function(n) { this.buf.setUInt32(this.offset, n);	this.offset += 4; };

/**
 * Write Float 32
 * @param {number} n Number
 */
rfBuffer.prototype.pushFloat32	= function(n) { this.buf.setFloat32(this.offset, n);this.offset += 4;};

/**
 * Write Float 64
 * @param {number} n Number
 */
rfBuffer.prototype.pushFloat64	= function(n) { this.buf.setFloat32(this.offset, n);this.offset += 8;};

/**
 * Get data view used to store information.
 * @return {DataView} Contains all written data.
 */

rfBuffer.prototype.getDataView = function() {
	return this.buf;
};

/**
 * Create a new OpenGL array buffer from data stored in buffer.
 * @param {GlContext} gl OpenGL context.
 * @param {GlUsage} usage gl.STATIC_DRAW or similar.
 * @return {GlBuffer} gl.ARRAY_BUFFER object.
 */
rfBuffer.prototype.createGlArray = function(gl, usage) {
	var va = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, va);
	gl.bufferData(gl.ARRAY_BUFFER, this.buf, usage);
};

