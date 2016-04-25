// Vector 2 component
// ===================

/**
 * @class rfVec2
 * @classdesc Fast 2D vector class
 * @deprecated Use rfVec2_create
 */

/**
 * Create vector
 * @memberof rfVec2
 */
function rfVec2_create() {
	return new Float32Array([0.0, 0.0]);
}

/**
 * Create 2D vector from numbers.
 * @memberof rfVec2
 * @param {float} x X component
 * @param {float} y Y component
 * @return {rfVec2}
 */
function rfVec2_parse(x, y) {
	return new Float32Array([x, y]);
}

/**
 * 2D component wise addition.
 * @memberof rfVec2
 * @param {rfVec2} out Result destination
 * @param {rfVec2} v0 Vector 1
 * @param {rfVec2} v1 Vector 2
 */
function rfVec2_add(out, v0, v1) {
	out[0] = v0[0] + v1[0];
	out[1] = v0[1] + v1[1];
}

/**
 * 2D component wise subtraction.
 * @memberof rfVec2
 * @param {rfVec2} out Result destination
 * @param {rfVec2} v0 Vector 1
 * @param {rfVec2} v1 Vector 2
 */
function rfVec2_sub(out, v0, v1) {
	out[0] = v0[0] - v1[0];
	out[1] = v0[1] - v1[1];
}

/**
 * 2D vector multiplication with constant.
 * @memberof rfVec2
 * @param {rfVec2} out Result destination
 * @param {rfVec2} v Vector
 * @param {float} k Konstant
 */
function rfVec2_mulk(out, v, k) {
	out[0] = k*v[0];
	out[1] = k*v[1];
}

/**
 * Length of a vector (Pythagorean theorem).
 * @memberof rfVec2
 * @param {rfVec2} v Vector
 * @return {float} Length
 */
function rfVec2_length(v) {
	return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
}

/**
 * 2D vector dot/scalar product
 * @memberof rfVec2
 * @param {rfVec2} v0 Vector 1
 * @param {rfVec2} v1 Vector 2
 * @return {float} Scalar product
 */
function rfVec2_dot(v0, v1) {
	return v0[0]*v1[0] + v0[1]*v1[1];
}

/**
 * Has vector coordinates at origo.
 * @memberof rfVec2
 * @param {rfVec2} v Vector
 * @return {boolean}
 */
function rfVec2_isZero(v) {
	return v[0]==0.0 && v[1]==0.0;
}

/**
 * Create normalized vector.
 * @memberof rfVec2
 * @param {rfVec2} out Result destination
 * @param {rfVec2} v Vector
 * @param {float} len Length of normalized vector
 */
function rfVec3_normalize(out, v, len) {
	var inv = 1.0 / rfVec2_length(v);
	if (len) inv *= len;
	out[0] = inv*v[0];
	out[1] = inv*v[1];
}


// Vector 3 components
// ===================

/**
 * @class rfVec3
 * @classdesc Fast 3D vector class
 * @deprecated Use rfVec3_create
 */

/**
 * Create vector
 * @memberof rfVec3
 */
function rfVec3_create() {
	return new Float32Array([0.0, 0.0, 0.0]);
}

/**
 * Create 3D vector from numbers.
 * @memberof rfVec3
 * @param {float} x X component
 * @param {float} y Y component
 * @param {float} z Z component
 * @return {rfVec3}
 */
function rfVec3_parse(x, y, z) {
	return new Float32Array([x, y, z]);
}

/**
 * 3D component wise addition.
 * @memberof rfVec3
 * @param {rfVec3} out Result destination
 * @param {rfVec3} v0 Vector 1
 * @param {rfVec3} v1 Vector 2
 */
function rfVec3_add(out, v0, v1) {
	out[0] = v0[0] + v1[0];
	out[1] = v0[1] + v1[1];
	out[2] = v0[2] + v1[2];
}

/**
 * 3D component wise subtraction.
 * @memberof rfVec3
 * @param {rfVec3} out Result destination
 * @param {rfVec3} v0 Vector 1
 * @param {rfVec3} v1 Vector 2
 */
function rfVec3_sub(out, v0, v1) {
	out[0] = v0[0] - v1[0];
	out[1] = v0[1] - v1[1];
	out[2] = v0[2] - v1[2];
}

/**
 * 3D vector multiplication with constant.
 * @memberof rfVec3
 * @param {rfVec3} out Result destination
 * @param {rfVec3} v Vector
 * @param {float} k Konstant
 */
function rfVec3_mulk(out, v, k) {
	out[0] = k*v[0];
	out[1] = k*v[1];
	out[2] = k*v[2];
}

/**
 * Length of a vector (Pythagorean theorem).
 * @memberof rfVec3
 * @param {rfVec3} v Vector
 * @return {float} Length
 */
function rfVec3_length(v) {
	return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}

/**
 * 3D vector dot/scalar product
 * @memberof rfVec3
 * @param {rfVec3} v0 Vector 1
 * @param {rfVec3} v1 Vector 2
 * @return {float} Scalar product
 */
function rfVec3_dot(v0, v1) {
	return v0[0]*v1[0] + v0[1]*v1[1] + v0[2]*v1[2];
}

/**
 * Has vector coordinates at origo.
 * @memberof rfVec3
 * @param {rfVec3} v Vector
 * @return {boolean}
 */
function rfVec3_isZero(v) {
	return v[0]==0.0 && v[1]==0.0 && v[2]==0.0;
}

/**
 * Create cross product vector.
 * @memberof rfVec3
 * @param {rfVec3} out Result destination
 * @param {rfVec3} v0 Vector 1
 * @param {rfVec3} v1 Vector 2
 */
function rfVec3_cross(out, v0, v1) {
	out[0] = v0[1]*v1[2] - v0[2]*v1[1];
	out[1] = v0[2]*v1[0] - v0[0]*v1[2];
	out[2] = v0[0]*v1[1] - v0[1]*v1[0];
}

/**
 * Create normalized vector.
 * @memberof rfVec3
 * @param {rfVec3} out Result destination
 * @param {rfVec3} v Vector
 * @param {float} len Length of normalized vector
 */
function rfVec3_normalize(out, v, len) {
	var inv = 1.0 / rfVec3_length(v);
	if (len) inv *= len;
	out[0] = inv*v[0];
	out[1] = inv*v[1];
	out[2] = inv*v[2];
}


// Martix 4x4 component
// ===================

/**
 * @class rfMat4
 * @classdesc Fast 4x4 matrix class.
 * @deprecated Use rfMat4_create
 */

/**
 * Create new 4x4 matrix.
 * @memberof rfMat4
 * @return {rfMat4}
 */
function rfMat4_create() {
	return new Float32Array([
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0]);
}

/**
 * Set matrix as identidy matrix.
 * @memberof rfMat4
 * @param {rfMat4} out Matrix destination
 */
function rfMat4_identity(out) {
	out[ 0] = 1.0;
	out[ 1] = out[ 2] = out[ 3] = 0.0;

	out[ 5] = 1.0;
	out[ 4] = out[ 6] = out[ 7] = 0.0;

	out[10] = 1.0;
	out[ 8] = out[ 9] = out[11] = 0.0;

	out[15] = 1.0;
	out[12] = out[13] = out[14] = 0.0;
}

/**
 * Multiplication between two matrices.
 * @memberof rfMat4
 * @param {rfMat4} out Matrix destination
 * @param {rfMat4} m0 Matrix 1
 * @param {rfMat4} m0 Matrix 2
 */
function rfMat4_mul(out, m0, m1) {
	out[ 0] = m1[ 0]*m0[ 0] + m1[ 1]*m0[ 4] + m1[ 2]*m0[ 8] + m1[ 3]*m0[12];
	out[ 1] = m1[ 0]*m0[ 1] + m1[ 1]*m0[ 5] + m1[ 2]*m0[ 9] + m1[ 3]*m0[13];
	out[ 2] = m1[ 0]*m0[ 2] + m1[ 1]*m0[ 6] + m1[ 2]*m0[10] + m1[ 3]*m0[14];
	out[ 3] = m1[ 0]*m0[ 3] + m1[ 1]*m0[ 7] + m1[ 2]*m0[11] + m1[ 3]*m0[15];

	out[ 4] = m1[ 4]*m0[ 0] + m1[ 5]*m0[ 4] + m1[ 6]*m0[ 8] + m1[ 7]*m0[12];
	out[ 5] = m1[ 4]*m0[ 1] + m1[ 5]*m0[ 5] + m1[ 6]*m0[ 9] + m1[ 7]*m0[13];
	out[ 6] = m1[ 4]*m0[ 2] + m1[ 5]*m0[ 6] + m1[ 6]*m0[10] + m1[ 7]*m0[14];
	out[ 7] = m1[ 4]*m0[ 3] + m1[ 5]*m0[ 7] + m1[ 6]*m0[11] + m1[ 7]*m0[15];

	out[ 8] = m1[ 8]*m0[ 0] + m1[ 9]*m0[ 4] + m1[10]*m0[ 8] + m1[11]*m0[12];
	out[ 9] = m1[ 8]*m0[ 1] + m1[ 9]*m0[ 5] + m1[10]*m0[ 9] + m1[11]*m0[13];
	out[10] = m1[ 8]*m0[ 2] + m1[ 9]*m0[ 6] + m1[10]*m0[10] + m1[11]*m0[14];
	out[11] = m1[ 8]*m0[ 3] + m1[ 9]*m0[ 7] + m1[10]*m0[11] + m1[11]*m0[15];

	out[12] = m1[12]*m0[ 0] + m1[13]*m0[ 4] + m1[14]*m0[ 8] + m1[15]*m0[12];
	out[13] = m1[12]*m0[ 1] + m1[13]*m0[ 5] + m1[14]*m0[ 9] + m1[15]*m0[13];
	out[14] = m1[12]*m0[ 2] + m1[13]*m0[ 6] + m1[14]*m0[10] + m1[15]*m0[14];
	out[15] = m1[12]*m0[ 3] + m1[13]*m0[ 7] + m1[14]*m0[11] + m1[15]*m0[15];
}

/**
 * Create orthogonal view projection in matrix.
 * @memberof rfMat4
 * @param {rfMat4} out Matrix destination
 * @param {float} x0 Start X
 * @param {float} y0 Start Y
 * @param {float} x1 Stop X
 * @param {float} y1 Stop Y
 */
function rfMat4_ortho(out, x0, y0, x1, y1) {
	out[ 1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[8] = out[9] = 0.0;
	out[ 0] = 2.0 / (x1-x0);
	out[ 5] = 2.0 / (y1-y0);
	out[10] = 1.0;
	out[15] = 1.0;
	out[12] = -(x1+x0)/(x1-x0);
	out[13] = -(y1+y0)/(y1-y0);
	out[14] = 0.0;
}

/**
 * Create projection matrix looking at point.
 * @memberof rfMat4
 * @param {rfMat4} out Matrix destination
 * @param {rfVec3} eye Eye position
 * @param {rfVec3} at Look at position
 * @param {rfVec3} up Projection upward vector
 */
function rfMat4_lookAt(out, eye, at, up) {
	var forw_ = rfVec3_create();
	rfVec3_sub(forw_, at, eye);
	var forw = rfVec3_create();
	rfVec3_normalize(forw, forw_);

	var side_ = rfVec3_create();
	rfVec3_cross(side_, up, forw);
	var side = rfVec3_create();
	rfVec3_normalize(side, side_);

	var upn = rfVec3_create();
	rfVec3_cross(upn, forw, side);

	var m0 = rfMat4_create();
	rfMat4_identity(m0);
	m0[ 0] = side[0];
	m0[ 4] = side[1];
	m0[ 8] = side[2];
	m0[ 1] = upn[0];
	m0[ 5] = upn[1];
	m0[ 9] = upn[2];
	m0[ 2] = -forw[0];
	m0[ 6] = -forw[1];
	m0[10] = -forw[2];

	var m1 = rfMat4_create();
	rfMat4_identity(m1);
	m1[12] = -eye[0];
	m1[13] = -eye[1];
	m1[14] = -eye[2];

	rfMat4_mul(out, m0, m1);
}

/**
 * Create matrix perspective projection.
 * @memberof rfMat4
 * @param {rfMat4} out Matrix destination
 * @param {float} fov Field of view in radiances
 * @param {float} ratio Screen ratio (width divided by height)
 * @param {float} near Near clipping distance
 * @param {float} far Far clipping distance
 */
function rfMat4_perspective(out, fov, ratio, near, far) {
	var size = near * Math.tan(fov * 0.5);
	var left = -size;
	var right = size;
	var bottom = -size / ratio;
	var top = size / ratio;

	out[ 0] = 2.0 * near / (right - left);
	out[ 1] = 0.0;
	out[ 2] = 0.0;
	out[ 3] = 0.0;
	out[ 4] = 0.0;
	out[ 5] = 2.0 * near / (top - bottom);
	out[ 6] = 0.0;
	out[ 7] = 0.0;
	out[ 8] = (right + left) / (right - left);
	out[ 9] = (top + bottom) / (top - bottom);
	out[10] = -(far + near) / (far - near);
	out[11] = -1.0;
	out[12] = 0.0;
	out[13] = 0.0;
	out[14] = -(2.0 * far * near) / (far - near);
	out[15] = 0.0;
}

/**
 * Full 3D camera projection. Combination of rfMat4_lookAt, rfMat4_perspective.
 * @memberof rfMat4
 * @param {rfMat4} out Matrix destination
 * @param {float} fov Field of view in radiances
 * @param {float} ratio Screen ratio (width divided by height)
 * @param {float} near Near clipping distance
 * @param {float} far Far clipping distance
 * @param {rfVec3} eye Eye position
 * @param {rfVec3} at Look at position
 * @param {rfVec3} up Projection upward vector
 */
function rfMat4_camera(out, fov, ratio, near, far, eye, at, up) {
	var persp = rfMat4_create();
	rfMat4_perspective(persp, fov, ratio, near, far);

	var look = rfMat4_create();
	rfMat4_lookAt(look, eye, at, up);

	rfMat4_mul(out, persp, look);
}

