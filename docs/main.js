(function () {
	'use strict';

	const REVISION = '137dev';
	const CullFaceNone = 0;
	const CullFaceBack = 1;
	const CullFaceFront = 2;
	const FrontSide = 0;
	const BackSide = 1;
	const DoubleSide = 2;
	const FlatShading = 1;
	const NoBlending = 0;
	const NormalBlending = 1;
	const CustomBlending = 5;
	const AddEquation = 100;
	const SubtractEquation = 101;
	const ReverseSubtractEquation = 102;
	const MinEquation = 103;
	const MaxEquation = 104;
	const ZeroFactor = 200;
	const OneFactor = 201;
	const SrcColorFactor = 202;
	const OneMinusSrcColorFactor = 203;
	const SrcAlphaFactor = 204;
	const OneMinusSrcAlphaFactor = 205;
	const DstAlphaFactor = 206;
	const OneMinusDstAlphaFactor = 207;
	const DstColorFactor = 208;
	const OneMinusDstColorFactor = 209;
	const SrcAlphaSaturateFactor = 210;
	const NeverDepth = 0;
	const AlwaysDepth = 1;
	const LessDepth = 2;
	const LessEqualDepth = 3;
	const EqualDepth = 4;
	const GreaterEqualDepth = 5;
	const GreaterDepth = 6;
	const NotEqualDepth = 7;
	const NoToneMapping = 0;

	const UVMapping = 300;
	const RepeatWrapping = 1000;
	const ClampToEdgeWrapping = 1001;
	const MirroredRepeatWrapping = 1002;
	const NearestFilter = 1003;
	const LinearFilter = 1006;
	const LinearMipmapLinearFilter = 1008;
	const UnsignedByteType = 1009;
	const HalfFloatType = 1016;
	const RGBAFormat = 1023;
	const LinearEncoding = 3000;
	const KeepStencilOp = 7680;
	const AlwaysStencilFunc = 519;

	const StaticDrawUsage = 35044;

	/**
	 * https://github.com/mrdoob/eventdispatcher.js/
	 */

	class EventDispatcher {

		addEventListener( type, listener ) {

			if ( this._listeners === undefined ) this._listeners = {};

			const listeners = this._listeners;

			if ( listeners[ type ] === undefined ) {

				listeners[ type ] = [];

			}

			if ( listeners[ type ].indexOf( listener ) === - 1 ) {

				listeners[ type ].push( listener );

			}

		}

		hasEventListener( type, listener ) {

			if ( this._listeners === undefined ) return false;

			const listeners = this._listeners;

			return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

		}

		removeEventListener( type, listener ) {

			if ( this._listeners === undefined ) return;

			const listeners = this._listeners;
			const listenerArray = listeners[ type ];

			if ( listenerArray !== undefined ) {

				const index = listenerArray.indexOf( listener );

				if ( index !== - 1 ) {

					listenerArray.splice( index, 1 );

				}

			}

		}

		dispatchEvent( event ) {

			if ( this._listeners === undefined ) return;

			const listeners = this._listeners;
			const listenerArray = listeners[ event.type ];

			if ( listenerArray !== undefined ) {

				event.target = this;

				// Make a copy, in case listeners are removed while iterating.
				const array = listenerArray.slice( 0 );

				for ( let i = 0, l = array.length; i < l; i ++ ) {

					array[ i ].call( this, event );

				}

				event.target = null;

			}

		}

	}

	const _lut = [];

	for ( let i = 0; i < 256; i ++ ) {

		_lut[ i ] = ( i < 16 ? '0' : '' ) + ( i ).toString( 16 );

	}


	const DEG2RAD = Math.PI / 180;
	const RAD2DEG = 180 / Math.PI;

	// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
	function generateUUID() {

		const d0 = Math.random() * 0xffffffff | 0;
		const d1 = Math.random() * 0xffffffff | 0;
		const d2 = Math.random() * 0xffffffff | 0;
		const d3 = Math.random() * 0xffffffff | 0;
		const uuid = _lut[ d0 & 0xff ] + _lut[ d0 >> 8 & 0xff ] + _lut[ d0 >> 16 & 0xff ] + _lut[ d0 >> 24 & 0xff ] + '-' +
				_lut[ d1 & 0xff ] + _lut[ d1 >> 8 & 0xff ] + '-' + _lut[ d1 >> 16 & 0x0f | 0x40 ] + _lut[ d1 >> 24 & 0xff ] + '-' +
				_lut[ d2 & 0x3f | 0x80 ] + _lut[ d2 >> 8 & 0xff ] + '-' + _lut[ d2 >> 16 & 0xff ] + _lut[ d2 >> 24 & 0xff ] +
				_lut[ d3 & 0xff ] + _lut[ d3 >> 8 & 0xff ] + _lut[ d3 >> 16 & 0xff ] + _lut[ d3 >> 24 & 0xff ];

		// .toUpperCase() here flattens concatenated strings to save heap memory space.
		return uuid.toUpperCase();

	}

	function clamp( value, min, max ) {

		return Math.max( min, Math.min( max, value ) );

	}

	class Vector2 {

		constructor( x = 0, y = 0 ) {

			this.x = x;
			this.y = y;

		}

		get width() {

			return this.x;

		}

		set width( value ) {

			this.x = value;

		}

		get height() {

			return this.y;

		}

		set height( value ) {

			this.y = value;

		}

		set( x, y ) {

			this.x = x;
			this.y = y;

			return this;

		}

		setScalar( scalar ) {

			this.x = scalar;
			this.y = scalar;

			return this;

		}

		setX( x ) {

			this.x = x;

			return this;

		}

		setY( y ) {

			this.y = y;

			return this;

		}

		setComponent( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				// default: throw new Error( 'index is out of range: ' + index );
				default: throw new Error();

			}

			return this;

		}

		getComponent( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				default: throw new Error();

			}

		}

		clone() {

			return new this.constructor( this.x, this.y );

		}

		copy( v ) {

			this.x = v.x;
			this.y = v.y;

			return this;

		}

		add( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
				return this.addVectors( v, w );

			}

			this.x += v.x;
			this.y += v.y;

			return this;

		}

		addScalar( s ) {

			this.x += s;
			this.y += s;

			return this;

		}

		addVectors( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;

			return this;

		}

		addScaledVector( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;

			return this;

		}

		sub( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
				return this.subVectors( v, w );

			}

			this.x -= v.x;
			this.y -= v.y;

			return this;

		}

		subScalar( s ) {

			this.x -= s;
			this.y -= s;

			return this;

		}

		subVectors( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;

			return this;

		}

		multiply( v ) {

			this.x *= v.x;
			this.y *= v.y;

			return this;

		}

		multiplyScalar( scalar ) {

			this.x *= scalar;
			this.y *= scalar;

			return this;

		}

		divide( v ) {

			this.x /= v.x;
			this.y /= v.y;

			return this;

		}

		divideScalar( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		}

		applyMatrix3( m ) {

			const x = this.x, y = this.y;
			const e = m.elements;

			this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ];
			this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ];

			return this;

		}

		min( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );

			return this;

		}

		max( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );

			return this;

		}

		clamp( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );

			return this;

		}

		clampScalar( minVal, maxVal ) {

			this.x = Math.max( minVal, Math.min( maxVal, this.x ) );
			this.y = Math.max( minVal, Math.min( maxVal, this.y ) );

			return this;

		}

		clampLength( min, max ) {

			const length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		}

		floor() {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );

			return this;

		}

		ceil() {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );

			return this;

		}

		round() {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );

			return this;

		}

		roundToZero() {

			this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
			this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

			return this;

		}

		negate() {

			this.x = - this.x;
			this.y = - this.y;

			return this;

		}

		dot( v ) {

			return this.x * v.x + this.y * v.y;

		}

		cross( v ) {

			return this.x * v.y - this.y * v.x;

		}

		lengthSq() {

			return this.x * this.x + this.y * this.y;

		}

		length() {

			return Math.sqrt( this.x * this.x + this.y * this.y );

		}

		manhattanLength() {

			return Math.abs( this.x ) + Math.abs( this.y );

		}

		normalize() {

			return this.divideScalar( this.length() || 1 );

		}

		angle() {

			// computes the angle in radians with respect to the positive x-axis

			const angle = Math.atan2( - this.y, - this.x ) + Math.PI;

			return angle;

		}

		distanceTo( v ) {

			return Math.sqrt( this.distanceToSquared( v ) );

		}

		distanceToSquared( v ) {

			const dx = this.x - v.x, dy = this.y - v.y;
			return dx * dx + dy * dy;

		}

		manhattanDistanceTo( v ) {

			return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y );

		}

		setLength( length ) {

			return this.normalize().multiplyScalar( length );

		}

		lerp( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;

			return this;

		}

		lerpVectors( v1, v2, alpha ) {

			this.x = v1.x + ( v2.x - v1.x ) * alpha;
			this.y = v1.y + ( v2.y - v1.y ) * alpha;

			return this;

		}

		equals( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) );

		}

		fromArray( array, offset = 0 ) {

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;

			return array;

		}

		fromBufferAttribute( attribute, index, offset ) {

			if ( offset !== undefined ) {

				console.warn( 'THREE.Vector2: offset has been removed from .fromBufferAttribute().' );

			}

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );

			return this;

		}

		rotateAround( center, angle ) {

			const c = Math.cos( angle ), s = Math.sin( angle );

			const x = this.x - center.x;
			const y = this.y - center.y;

			this.x = x * c - y * s + center.x;
			this.y = x * s + y * c + center.y;

			return this;

		}

		random() {

			this.x = Math.random();
			this.y = Math.random();

			return this;

		}

		*[ Symbol.iterator ]() {

			yield this.x;
			yield this.y;

		}

	}

	Vector2.prototype.isVector2 = true;

	class Matrix3 {

		constructor() {

			this.elements = [

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			];

			if ( arguments.length > 0 ) {

				console.error( 'THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.' );

			}

		}

		set( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

			const te = this.elements;

			te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
			te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
			te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;

			return this;

		}

		identity() {

			this.set(

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			);

			return this;

		}

		copy( m ) {

			const te = this.elements;
			const me = m.elements;

			te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ];
			te[ 3 ] = me[ 3 ]; te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ];
			te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ]; te[ 8 ] = me[ 8 ];

			return this;

		}

		extractBasis( xAxis, yAxis, zAxis ) {

			xAxis.setFromMatrix3Column( this, 0 );
			yAxis.setFromMatrix3Column( this, 1 );
			zAxis.setFromMatrix3Column( this, 2 );

			return this;

		}

		setFromMatrix4( m ) {

			const me = m.elements;

			this.set(

				me[ 0 ], me[ 4 ], me[ 8 ],
				me[ 1 ], me[ 5 ], me[ 9 ],
				me[ 2 ], me[ 6 ], me[ 10 ]

			);

			return this;

		}

		multiply( m ) {

			return this.multiplyMatrices( this, m );

		}

		premultiply( m ) {

			return this.multiplyMatrices( m, this );

		}

		multiplyMatrices( a, b ) {

			const ae = a.elements;
			const be = b.elements;
			const te = this.elements;

			const a11 = ae[ 0 ], a12 = ae[ 3 ], a13 = ae[ 6 ];
			const a21 = ae[ 1 ], a22 = ae[ 4 ], a23 = ae[ 7 ];
			const a31 = ae[ 2 ], a32 = ae[ 5 ], a33 = ae[ 8 ];

			const b11 = be[ 0 ], b12 = be[ 3 ], b13 = be[ 6 ];
			const b21 = be[ 1 ], b22 = be[ 4 ], b23 = be[ 7 ];
			const b31 = be[ 2 ], b32 = be[ 5 ], b33 = be[ 8 ];

			te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
			te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
			te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

			te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
			te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
			te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

			te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
			te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
			te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

			return this;

		}

		multiplyScalar( s ) {

			const te = this.elements;

			te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
			te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
			te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

			return this;

		}

		determinant() {

			const te = this.elements;

			const a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
				d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
				g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

			return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

		}

		invert() {

			const te = this.elements,

				n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ],
				n12 = te[ 3 ], n22 = te[ 4 ], n32 = te[ 5 ],
				n13 = te[ 6 ], n23 = te[ 7 ], n33 = te[ 8 ],

				t11 = n33 * n22 - n32 * n23,
				t12 = n32 * n13 - n33 * n12,
				t13 = n23 * n12 - n22 * n13,

				det = n11 * t11 + n21 * t12 + n31 * t13;

			if ( det === 0 ) return this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0 );

			const detInv = 1 / det;

			te[ 0 ] = t11 * detInv;
			te[ 1 ] = ( n31 * n23 - n33 * n21 ) * detInv;
			te[ 2 ] = ( n32 * n21 - n31 * n22 ) * detInv;

			te[ 3 ] = t12 * detInv;
			te[ 4 ] = ( n33 * n11 - n31 * n13 ) * detInv;
			te[ 5 ] = ( n31 * n12 - n32 * n11 ) * detInv;

			te[ 6 ] = t13 * detInv;
			te[ 7 ] = ( n21 * n13 - n23 * n11 ) * detInv;
			te[ 8 ] = ( n22 * n11 - n21 * n12 ) * detInv;

			return this;

		}

		transpose() {

			let tmp;
			const m = this.elements;

			tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
			tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
			tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

			return this;

		}

		getNormalMatrix( matrix4 ) {

			return this.setFromMatrix4( matrix4 ).invert().transpose();

		}

		transposeIntoArray( r ) {

			const m = this.elements;

			r[ 0 ] = m[ 0 ];
			r[ 1 ] = m[ 3 ];
			r[ 2 ] = m[ 6 ];
			r[ 3 ] = m[ 1 ];
			r[ 4 ] = m[ 4 ];
			r[ 5 ] = m[ 7 ];
			r[ 6 ] = m[ 2 ];
			r[ 7 ] = m[ 5 ];
			r[ 8 ] = m[ 8 ];

			return this;

		}

		setUvTransform( tx, ty, sx, sy, rotation, cx, cy ) {

			const c = Math.cos( rotation );
			const s = Math.sin( rotation );

			this.set(
				sx * c, sx * s, - sx * ( c * cx + s * cy ) + cx + tx,
				- sy * s, sy * c, - sy * ( - s * cx + c * cy ) + cy + ty,
				0, 0, 1
			);

			return this;

		}

		scale( sx, sy ) {

			const te = this.elements;

			te[ 0 ] *= sx; te[ 3 ] *= sx; te[ 6 ] *= sx;
			te[ 1 ] *= sy; te[ 4 ] *= sy; te[ 7 ] *= sy;

			return this;

		}

		rotate( theta ) {

			const c = Math.cos( theta );
			const s = Math.sin( theta );

			const te = this.elements;

			const a11 = te[ 0 ], a12 = te[ 3 ], a13 = te[ 6 ];
			const a21 = te[ 1 ], a22 = te[ 4 ], a23 = te[ 7 ];

			te[ 0 ] = c * a11 + s * a21;
			te[ 3 ] = c * a12 + s * a22;
			te[ 6 ] = c * a13 + s * a23;

			te[ 1 ] = - s * a11 + c * a21;
			te[ 4 ] = - s * a12 + c * a22;
			te[ 7 ] = - s * a13 + c * a23;

			return this;

		}

		translate( tx, ty ) {

			const te = this.elements;

			te[ 0 ] += tx * te[ 2 ]; te[ 3 ] += tx * te[ 5 ]; te[ 6 ] += tx * te[ 8 ];
			te[ 1 ] += ty * te[ 2 ]; te[ 4 ] += ty * te[ 5 ]; te[ 7 ] += ty * te[ 8 ];

			return this;

		}

		equals( matrix ) {

			const te = this.elements;
			const me = matrix.elements;

			for ( let i = 0; i < 9; i ++ ) {

				if ( te[ i ] !== me[ i ] ) return false;

			}

			return true;

		}

		fromArray( array, offset = 0 ) {

			for ( let i = 0; i < 9; i ++ ) {

				this.elements[ i ] = array[ i + offset ];

			}

			return this;

		}

		toArray( array = [], offset = 0 ) {

			const te = this.elements;

			array[ offset ] = te[ 0 ];
			array[ offset + 1 ] = te[ 1 ];
			array[ offset + 2 ] = te[ 2 ];

			array[ offset + 3 ] = te[ 3 ];
			array[ offset + 4 ] = te[ 4 ];
			array[ offset + 5 ] = te[ 5 ];

			array[ offset + 6 ] = te[ 6 ];
			array[ offset + 7 ] = te[ 7 ];
			array[ offset + 8 ] = te[ 8 ];

			return array;

		}

		clone() {

			return new this.constructor().fromArray( this.elements );

		}

	}

	Matrix3.prototype.isMatrix3 = true;

	let textureId = 0;

	class Texture extends EventDispatcher {

		constructor( image = Texture.DEFAULT_IMAGE, mapping = Texture.DEFAULT_MAPPING, wrapS = ClampToEdgeWrapping, wrapT = ClampToEdgeWrapping, magFilter = LinearFilter, minFilter = LinearMipmapLinearFilter, format = RGBAFormat, type = UnsignedByteType, anisotropy = 1, encoding = LinearEncoding ) {

			super();

			Object.defineProperty( this, 'id', { value: textureId ++ } );

			this.uuid = generateUUID();

			this.name = '';

			this.image = image;
			this.mipmaps = [];

			this.mapping = mapping;

			this.wrapS = wrapS;
			this.wrapT = wrapT;

			this.magFilter = magFilter;
			this.minFilter = minFilter;

			this.anisotropy = anisotropy;

			this.format = format;
			this.internalFormat = null;
			this.type = type;

			this.offset = new Vector2( 0, 0 );
			this.repeat = new Vector2( 1, 1 );
			this.center = new Vector2( 0, 0 );
			this.rotation = 0;

			this.matrixAutoUpdate = true;
			this.matrix = new Matrix3();

			this.generateMipmaps = true;
			this.premultiplyAlpha = false;
			this.flipY = true;
			this.unpackAlignment = 4;	// valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)

			// Values of encoding !== THREE.LinearEncoding only supported on map, envMap and emissiveMap.
			//
			// Also changing the encoding after already used by a Material will not automatically make the Material
			// update. You need to explicitly call Material.needsUpdate to trigger it to recompile.
			this.encoding = encoding;

			this.userData = {};

			this.version = 0;
			this.onUpdate = null;

			this.isRenderTargetTexture = false; // indicates whether a texture belongs to a render target or not
			this.needsPMREMUpdate = false; // indicates whether this texture should be processed by PMREMGenerator or not (only relevant for render target textures)

		}

		updateMatrix() {

			this.matrix.setUvTransform( this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y );

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( source ) {

			this.name = source.name;

			this.image = source.image;
			this.mipmaps = source.mipmaps.slice( 0 );

			this.mapping = source.mapping;

			this.wrapS = source.wrapS;
			this.wrapT = source.wrapT;

			this.magFilter = source.magFilter;
			this.minFilter = source.minFilter;

			this.anisotropy = source.anisotropy;

			this.format = source.format;
			this.internalFormat = source.internalFormat;
			this.type = source.type;

			this.offset.copy( source.offset );
			this.repeat.copy( source.repeat );
			this.center.copy( source.center );
			this.rotation = source.rotation;

			this.matrixAutoUpdate = source.matrixAutoUpdate;
			this.matrix.copy( source.matrix );

			this.generateMipmaps = source.generateMipmaps;
			this.premultiplyAlpha = source.premultiplyAlpha;
			this.flipY = source.flipY;
			this.unpackAlignment = source.unpackAlignment;
			this.encoding = source.encoding;

			this.userData = JSON.parse( JSON.stringify( source.userData ) );

			return this;

		}

		dispose() {

			this.dispatchEvent( { type: 'dispose' } );

		}

		transformUv( uv ) {

			if ( this.mapping !== UVMapping ) return uv;

			uv.applyMatrix3( this.matrix );

			if ( uv.x < 0 || uv.x > 1 ) {

				switch ( this.wrapS ) {

					case RepeatWrapping:

						uv.x = uv.x - Math.floor( uv.x );
						break;

					case ClampToEdgeWrapping:

						uv.x = uv.x < 0 ? 0 : 1;
						break;

					case MirroredRepeatWrapping:

						if ( Math.abs( Math.floor( uv.x ) % 2 ) === 1 ) {

							uv.x = Math.ceil( uv.x ) - uv.x;

						} else {

							uv.x = uv.x - Math.floor( uv.x );

						}

						break;

				}

			}

			if ( uv.y < 0 || uv.y > 1 ) {

				switch ( this.wrapT ) {

					case RepeatWrapping:

						uv.y = uv.y - Math.floor( uv.y );
						break;

					case ClampToEdgeWrapping:

						uv.y = uv.y < 0 ? 0 : 1;
						break;

					case MirroredRepeatWrapping:

						if ( Math.abs( Math.floor( uv.y ) % 2 ) === 1 ) {

							uv.y = Math.ceil( uv.y ) - uv.y;

						} else {

							uv.y = uv.y - Math.floor( uv.y );

						}

						break;

				}

			}

			if ( this.flipY ) {

				uv.y = 1 - uv.y;

			}

			return uv;

		}

		set needsUpdate( value ) {

			if ( value === true ) this.version ++;

		}

	}

	Texture.DEFAULT_IMAGE = undefined;
	Texture.DEFAULT_MAPPING = UVMapping;

	Texture.prototype.isTexture = true;

	class Vector4 {

		constructor( x = 0, y = 0, z = 0, w = 1 ) {

			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;

		}

		get width() {

			return this.z;

		}

		set width( value ) {

			this.z = value;

		}

		get height() {

			return this.w;

		}

		set height( value ) {

			this.w = value;

		}

		set( x, y, z, w ) {

			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;

			return this;

		}

		setScalar( scalar ) {

			this.x = scalar;
			this.y = scalar;
			this.z = scalar;
			this.w = scalar;

			return this;

		}

		setX( x ) {

			this.x = x;

			return this;

		}

		setY( y ) {

			this.y = y;

			return this;

		}

		setZ( z ) {

			this.z = z;

			return this;

		}

		setW( w ) {

			this.w = w;

			return this;

		}

		setComponent( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				case 2: this.z = value; break;
				case 3: this.w = value; break;
				default: throw new Error();

			}

			return this;

		}

		getComponent( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				case 2: return this.z;
				case 3: return this.w;
				default: throw new Error();

			}

		}

		clone() {

			return new this.constructor( this.x, this.y, this.z, this.w );

		}

		copy( v ) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
			this.w = ( v.w !== undefined ) ? v.w : 1;

			return this;

		}

		add( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
				return this.addVectors( v, w );

			}

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
			this.w += v.w;

			return this;

		}

		addScalar( s ) {

			this.x += s;
			this.y += s;
			this.z += s;
			this.w += s;

			return this;

		}

		addVectors( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;
			this.w = a.w + b.w;

			return this;

		}

		addScaledVector( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;
			this.w += v.w * s;

			return this;

		}

		sub( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
				return this.subVectors( v, w );

			}

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
			this.w -= v.w;

			return this;

		}

		subScalar( s ) {

			this.x -= s;
			this.y -= s;
			this.z -= s;
			this.w -= s;

			return this;

		}

		subVectors( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;
			this.w = a.w - b.w;

			return this;

		}

		multiply( v ) {

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;
			this.w *= v.w;

			return this;

		}

		multiplyScalar( scalar ) {

			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
			this.w *= scalar;

			return this;

		}

		applyMatrix4( m ) {

			const x = this.x, y = this.y, z = this.z, w = this.w;
			const e = m.elements;

			this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
			this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
			this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
			this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

			return this;

		}

		divideScalar( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		}

		setAxisAngleFromQuaternion( q ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

			// q is assumed to be normalized

			this.w = 2 * Math.acos( q.w );

			const s = Math.sqrt( 1 - q.w * q.w );

			if ( s < 0.0001 ) {

				this.x = 1;
				this.y = 0;
				this.z = 0;

			} else {

				this.x = q.x / s;
				this.y = q.y / s;
				this.z = q.z / s;

			}

			return this;

		}

		setAxisAngleFromRotationMatrix( m ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			let angle, x, y, z; // variables for result
			const epsilon = 0.01,		// margin to allow for rounding errors
				epsilon2 = 0.1,		// margin to distinguish between 0 and 180 degrees

				te = m.elements,

				m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
				m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
				m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

			if ( ( Math.abs( m12 - m21 ) < epsilon ) &&
			     ( Math.abs( m13 - m31 ) < epsilon ) &&
			     ( Math.abs( m23 - m32 ) < epsilon ) ) {

				// singularity found
				// first check for identity matrix which must have +1 for all terms
				// in leading diagonal and zero in other terms

				if ( ( Math.abs( m12 + m21 ) < epsilon2 ) &&
				     ( Math.abs( m13 + m31 ) < epsilon2 ) &&
				     ( Math.abs( m23 + m32 ) < epsilon2 ) &&
				     ( Math.abs( m11 + m22 + m33 - 3 ) < epsilon2 ) ) {

					// this singularity is identity matrix so angle = 0

					this.set( 1, 0, 0, 0 );

					return this; // zero angle, arbitrary axis

				}

				// otherwise this singularity is angle = 180

				angle = Math.PI;

				const xx = ( m11 + 1 ) / 2;
				const yy = ( m22 + 1 ) / 2;
				const zz = ( m33 + 1 ) / 2;
				const xy = ( m12 + m21 ) / 4;
				const xz = ( m13 + m31 ) / 4;
				const yz = ( m23 + m32 ) / 4;

				if ( ( xx > yy ) && ( xx > zz ) ) {

					// m11 is the largest diagonal term

					if ( xx < epsilon ) {

						x = 0;
						y = 0.707106781;
						z = 0.707106781;

					} else {

						x = Math.sqrt( xx );
						y = xy / x;
						z = xz / x;

					}

				} else if ( yy > zz ) {

					// m22 is the largest diagonal term

					if ( yy < epsilon ) {

						x = 0.707106781;
						y = 0;
						z = 0.707106781;

					} else {

						y = Math.sqrt( yy );
						x = xy / y;
						z = yz / y;

					}

				} else {

					// m33 is the largest diagonal term so base result on this

					if ( zz < epsilon ) {

						x = 0.707106781;
						y = 0.707106781;
						z = 0;

					} else {

						z = Math.sqrt( zz );
						x = xz / z;
						y = yz / z;

					}

				}

				this.set( x, y, z, angle );

				return this; // return 180 deg rotation

			}

			// as we have reached here there are no singularities so we can handle normally

			let s = Math.sqrt( ( m32 - m23 ) * ( m32 - m23 ) +
				( m13 - m31 ) * ( m13 - m31 ) +
				( m21 - m12 ) * ( m21 - m12 ) ); // used to normalize

			if ( Math.abs( s ) < 0.001 ) s = 1;

			// prevent divide by zero, should not happen if matrix is orthogonal and should be
			// caught by singularity test above, but I've left it in just in case

			this.x = ( m32 - m23 ) / s;
			this.y = ( m13 - m31 ) / s;
			this.z = ( m21 - m12 ) / s;
			this.w = Math.acos( ( m11 + m22 + m33 - 1 ) / 2 );

			return this;

		}

		min( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );
			this.z = Math.min( this.z, v.z );
			this.w = Math.min( this.w, v.w );

			return this;

		}

		max( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );
			this.z = Math.max( this.z, v.z );
			this.w = Math.max( this.w, v.w );

			return this;

		}

		clamp( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );
			this.z = Math.max( min.z, Math.min( max.z, this.z ) );
			this.w = Math.max( min.w, Math.min( max.w, this.w ) );

			return this;

		}

		clampScalar( minVal, maxVal ) {

			this.x = Math.max( minVal, Math.min( maxVal, this.x ) );
			this.y = Math.max( minVal, Math.min( maxVal, this.y ) );
			this.z = Math.max( minVal, Math.min( maxVal, this.z ) );
			this.w = Math.max( minVal, Math.min( maxVal, this.w ) );

			return this;

		}

		clampLength( min, max ) {

			const length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		}

		floor() {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );
			this.z = Math.floor( this.z );
			this.w = Math.floor( this.w );

			return this;

		}

		ceil() {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );
			this.z = Math.ceil( this.z );
			this.w = Math.ceil( this.w );

			return this;

		}

		round() {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );
			this.z = Math.round( this.z );
			this.w = Math.round( this.w );

			return this;

		}

		roundToZero() {

			this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
			this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
			this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
			this.w = ( this.w < 0 ) ? Math.ceil( this.w ) : Math.floor( this.w );

			return this;

		}

		negate() {

			this.x = - this.x;
			this.y = - this.y;
			this.z = - this.z;
			this.w = - this.w;

			return this;

		}

		dot( v ) {

			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

		}

		lengthSq() {

			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

		}

		length() {

			return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

		}

		manhattanLength() {

			return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z ) + Math.abs( this.w );

		}

		normalize() {

			return this.divideScalar( this.length() || 1 );

		}

		setLength( length ) {

			return this.normalize().multiplyScalar( length );

		}

		lerp( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;
			this.z += ( v.z - this.z ) * alpha;
			this.w += ( v.w - this.w ) * alpha;

			return this;

		}

		lerpVectors( v1, v2, alpha ) {

			this.x = v1.x + ( v2.x - v1.x ) * alpha;
			this.y = v1.y + ( v2.y - v1.y ) * alpha;
			this.z = v1.z + ( v2.z - v1.z ) * alpha;
			this.w = v1.w + ( v2.w - v1.w ) * alpha;

			return this;

		}

		equals( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );

		}

		fromArray( array, offset = 0 ) {

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];
			this.z = array[ offset + 2 ];
			this.w = array[ offset + 3 ];

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;
			array[ offset + 2 ] = this.z;
			array[ offset + 3 ] = this.w;

			return array;

		}

		fromBufferAttribute( attribute, index, offset ) {

			if ( offset !== undefined ) {

				console.warn( 'THREE.Vector4: offset has been removed from .fromBufferAttribute().' );

			}

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );
			this.z = attribute.getZ( index );
			this.w = attribute.getW( index );

			return this;

		}

		random() {

			this.x = Math.random();
			this.y = Math.random();
			this.z = Math.random();
			this.w = Math.random();

			return this;

		}

		*[ Symbol.iterator ]() {

			yield this.x;
			yield this.y;
			yield this.z;
			yield this.w;

		}

	}

	Vector4.prototype.isVector4 = true;

	/*
	 In options, we can specify:
	 * Texture parameters for an auto-generated target texture
	 * depthBuffer/stencilBuffer: Booleans to indicate if we should generate these buffers
	*/
	class WebGLRenderTarget extends EventDispatcher {

		constructor( width, height, options = {} ) {

			super();

			this.width = width;
			this.height = height;
			this.depth = 1;

			this.scissor = new Vector4( 0, 0, width, height );
			this.scissorTest = false;

			this.viewport = new Vector4( 0, 0, width, height );

			this.texture = new Texture( undefined, options.mapping, options.wrapS, options.wrapT, options.magFilter, options.minFilter, options.format, options.type, options.anisotropy, options.encoding );
			this.texture.isRenderTargetTexture = true;

			this.texture.image = { width: width, height: height, depth: 1 };

			this.texture.generateMipmaps = options.generateMipmaps !== undefined ? options.generateMipmaps : false;
			this.texture.internalFormat = options.internalFormat !== undefined ? options.internalFormat : null;
			this.texture.minFilter = options.minFilter !== undefined ? options.minFilter : LinearFilter;

			this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
			this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : false;
			this.depthTexture = options.depthTexture !== undefined ? options.depthTexture : null;

		}

		setTexture( texture ) {

			texture.image = {
				width: this.width,
				height: this.height,
				depth: this.depth
			};

			this.texture = texture;

		}

		setSize( width, height, depth = 1 ) {

			if ( this.width !== width || this.height !== height || this.depth !== depth ) {

				this.width = width;
				this.height = height;
				this.depth = depth;

				this.texture.image.width = width;
				this.texture.image.height = height;
				this.texture.image.depth = depth;

				this.dispose();

			}

			this.viewport.set( 0, 0, width, height );
			this.scissor.set( 0, 0, width, height );

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( source ) {

			this.width = source.width;
			this.height = source.height;
			this.depth = source.depth;

			this.viewport.copy( source.viewport );

			this.texture = source.texture.clone();

			// ensure image object is not shared, see #20328

			this.texture.image = Object.assign( {}, source.texture.image );

			this.depthBuffer = source.depthBuffer;
			this.stencilBuffer = source.stencilBuffer;
			this.depthTexture = source.depthTexture;

			return this;

		}

		dispose() {

			this.dispatchEvent( { type: 'dispose' } );

		}

	}

	WebGLRenderTarget.prototype.isWebGLRenderTarget = true;

	class WebGLMultisampleRenderTarget extends WebGLRenderTarget {

		constructor( width, height, options = {} ) {

			super( width, height, options );

			this.samples = 4;

			this.ignoreDepthForMultisampleCopy = options.ignoreDepth !== undefined ? options.ignoreDepth : true;
			this.useRenderToTexture = ( options.useRenderToTexture !== undefined ) ? options.useRenderToTexture : false;
			this.useRenderbuffer = this.useRenderToTexture === false;

		}

		copy( source ) {

			super.copy.call( this, source );

			this.samples = source.samples;
			this.useRenderToTexture = source.useRenderToTexture;
			this.useRenderbuffer = source.useRenderbuffer;

			return this;

		}

	}

	WebGLMultisampleRenderTarget.prototype.isWebGLMultisampleRenderTarget = true;

	class Quaternion {

		constructor( x = 0, y = 0, z = 0, w = 1 ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._w = w;

		}

		static slerp( qa, qb, qm, t ) {

			console.warn( 'THREE.Quaternion: Static .slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead.' );
			return qm.slerpQuaternions( qa, qb, t );

		}

		static slerpFlat( dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t ) {

			// fuzz-free, array-based Quaternion SLERP operation

			let x0 = src0[ srcOffset0 + 0 ],
				y0 = src0[ srcOffset0 + 1 ],
				z0 = src0[ srcOffset0 + 2 ],
				w0 = src0[ srcOffset0 + 3 ];

			const x1 = src1[ srcOffset1 + 0 ],
				y1 = src1[ srcOffset1 + 1 ],
				z1 = src1[ srcOffset1 + 2 ],
				w1 = src1[ srcOffset1 + 3 ];

			if ( t === 0 ) {

				dst[ dstOffset + 0 ] = x0;
				dst[ dstOffset + 1 ] = y0;
				dst[ dstOffset + 2 ] = z0;
				dst[ dstOffset + 3 ] = w0;
				return;

			}

			if ( t === 1 ) {

				dst[ dstOffset + 0 ] = x1;
				dst[ dstOffset + 1 ] = y1;
				dst[ dstOffset + 2 ] = z1;
				dst[ dstOffset + 3 ] = w1;
				return;

			}

			if ( w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1 ) {

				let s = 1 - t;
				const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
					dir = ( cos >= 0 ? 1 : - 1 ),
					sqrSin = 1 - cos * cos;

				// Skip the Slerp for tiny steps to avoid numeric problems:
				if ( sqrSin > Number.EPSILON ) {

					const sin = Math.sqrt( sqrSin ),
						len = Math.atan2( sin, cos * dir );

					s = Math.sin( s * len ) / sin;
					t = Math.sin( t * len ) / sin;

				}

				const tDir = t * dir;

				x0 = x0 * s + x1 * tDir;
				y0 = y0 * s + y1 * tDir;
				z0 = z0 * s + z1 * tDir;
				w0 = w0 * s + w1 * tDir;

				// Normalize in case we just did a lerp:
				if ( s === 1 - t ) {

					const f = 1 / Math.sqrt( x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0 );

					x0 *= f;
					y0 *= f;
					z0 *= f;
					w0 *= f;

				}

			}

			dst[ dstOffset ] = x0;
			dst[ dstOffset + 1 ] = y0;
			dst[ dstOffset + 2 ] = z0;
			dst[ dstOffset + 3 ] = w0;

		}

		static multiplyQuaternionsFlat( dst, dstOffset, src0, srcOffset0, src1, srcOffset1 ) {

			const x0 = src0[ srcOffset0 ];
			const y0 = src0[ srcOffset0 + 1 ];
			const z0 = src0[ srcOffset0 + 2 ];
			const w0 = src0[ srcOffset0 + 3 ];

			const x1 = src1[ srcOffset1 ];
			const y1 = src1[ srcOffset1 + 1 ];
			const z1 = src1[ srcOffset1 + 2 ];
			const w1 = src1[ srcOffset1 + 3 ];

			dst[ dstOffset ] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
			dst[ dstOffset + 1 ] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
			dst[ dstOffset + 2 ] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
			dst[ dstOffset + 3 ] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;

			return dst;

		}

		get x() {

			return this._x;

		}

		set x( value ) {

			this._x = value;
			this._onChangeCallback();

		}

		get y() {

			return this._y;

		}

		set y( value ) {

			this._y = value;
			this._onChangeCallback();

		}

		get z() {

			return this._z;

		}

		set z( value ) {

			this._z = value;
			this._onChangeCallback();

		}

		get w() {

			return this._w;

		}

		set w( value ) {

			this._w = value;
			this._onChangeCallback();

		}

		set( x, y, z, w ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._w = w;

			this._onChangeCallback();

			return this;

		}

		clone() {

			return new this.constructor( this._x, this._y, this._z, this._w );

		}

		copy( quaternion ) {

			this._x = quaternion.x;
			this._y = quaternion.y;
			this._z = quaternion.z;
			this._w = quaternion.w;

			this._onChangeCallback();

			return this;

		}

		setFromEuler( euler, update ) {

			if ( ! ( euler && euler.isEuler ) ) {

				throw new Error('');
				//throw new Error( 'THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.' );

			}

			const x = euler._x, y = euler._y, z = euler._z, order = euler._order;

			// http://www.mathworks.com/matlabcentral/fileexchange/
			// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
			//	content/SpinCalc.m

			const cos = Math.cos;
			const sin = Math.sin;

			const c1 = cos( x / 2 );
			const c2 = cos( y / 2 );
			const c3 = cos( z / 2 );

			const s1 = sin( x / 2 );
			const s2 = sin( y / 2 );
			const s3 = sin( z / 2 );

			switch ( order ) {

				case 'XYZ':
					this._x = s1 * c2 * c3 + c1 * s2 * s3;
					this._y = c1 * s2 * c3 - s1 * c2 * s3;
					this._z = c1 * c2 * s3 + s1 * s2 * c3;
					this._w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case 'YXZ':
					this._x = s1 * c2 * c3 + c1 * s2 * s3;
					this._y = c1 * s2 * c3 - s1 * c2 * s3;
					this._z = c1 * c2 * s3 - s1 * s2 * c3;
					this._w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

				case 'ZXY':
					this._x = s1 * c2 * c3 - c1 * s2 * s3;
					this._y = c1 * s2 * c3 + s1 * c2 * s3;
					this._z = c1 * c2 * s3 + s1 * s2 * c3;
					this._w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case 'ZYX':
					this._x = s1 * c2 * c3 - c1 * s2 * s3;
					this._y = c1 * s2 * c3 + s1 * c2 * s3;
					this._z = c1 * c2 * s3 - s1 * s2 * c3;
					this._w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

				case 'YZX':
					this._x = s1 * c2 * c3 + c1 * s2 * s3;
					this._y = c1 * s2 * c3 + s1 * c2 * s3;
					this._z = c1 * c2 * s3 - s1 * s2 * c3;
					this._w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case 'XZY':
					this._x = s1 * c2 * c3 - c1 * s2 * s3;
					this._y = c1 * s2 * c3 - s1 * c2 * s3;
					this._z = c1 * c2 * s3 + s1 * s2 * c3;
					this._w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

				default:
					console.warn( 'THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + order );

			}

			if ( update !== false ) this._onChangeCallback();

			return this;

		}

		setFromAxisAngle( axis, angle ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

			// assumes axis is normalized

			const halfAngle = angle / 2, s = Math.sin( halfAngle );

			this._x = axis.x * s;
			this._y = axis.y * s;
			this._z = axis.z * s;
			this._w = Math.cos( halfAngle );

			this._onChangeCallback();

			return this;

		}

		setFromRotationMatrix( m ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			const te = m.elements,

				m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
				m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
				m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

				trace = m11 + m22 + m33;

			if ( trace > 0 ) {

				const s = 0.5 / Math.sqrt( trace + 1.0 );

				this._w = 0.25 / s;
				this._x = ( m32 - m23 ) * s;
				this._y = ( m13 - m31 ) * s;
				this._z = ( m21 - m12 ) * s;

			} else if ( m11 > m22 && m11 > m33 ) {

				const s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

				this._w = ( m32 - m23 ) / s;
				this._x = 0.25 * s;
				this._y = ( m12 + m21 ) / s;
				this._z = ( m13 + m31 ) / s;

			} else if ( m22 > m33 ) {

				const s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

				this._w = ( m13 - m31 ) / s;
				this._x = ( m12 + m21 ) / s;
				this._y = 0.25 * s;
				this._z = ( m23 + m32 ) / s;

			} else {

				const s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

				this._w = ( m21 - m12 ) / s;
				this._x = ( m13 + m31 ) / s;
				this._y = ( m23 + m32 ) / s;
				this._z = 0.25 * s;

			}

			this._onChangeCallback();

			return this;

		}

		setFromUnitVectors( vFrom, vTo ) {

			// assumes direction vectors vFrom and vTo are normalized

			let r = vFrom.dot( vTo ) + 1;

			if ( r < Number.EPSILON ) {

				// vFrom and vTo point in opposite directions

				r = 0;

				if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

					this._x = - vFrom.y;
					this._y = vFrom.x;
					this._z = 0;
					this._w = r;

				} else {

					this._x = 0;
					this._y = - vFrom.z;
					this._z = vFrom.y;
					this._w = r;

				}

			} else {

				// crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3

				this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
				this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
				this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
				this._w = r;

			}

			return this.normalize();

		}

		angleTo( q ) {

			return 2 * Math.acos( Math.abs( clamp( this.dot( q ), - 1, 1 ) ) );

		}

		rotateTowards( q, step ) {

			const angle = this.angleTo( q );

			if ( angle === 0 ) return this;

			const t = Math.min( 1, step / angle );

			this.slerp( q, t );

			return this;

		}

		identity() {

			return this.set( 0, 0, 0, 1 );

		}

		invert() {

			// quaternion is assumed to have unit length

			return this.conjugate();

		}

		conjugate() {

			this._x *= - 1;
			this._y *= - 1;
			this._z *= - 1;

			this._onChangeCallback();

			return this;

		}

		dot( v ) {

			return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

		}

		lengthSq() {

			return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

		}

		length() {

			return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

		}

		normalize() {

			let l = this.length();

			if ( l === 0 ) {

				this._x = 0;
				this._y = 0;
				this._z = 0;
				this._w = 1;

			} else {

				l = 1 / l;

				this._x = this._x * l;
				this._y = this._y * l;
				this._z = this._z * l;
				this._w = this._w * l;

			}

			this._onChangeCallback();

			return this;

		}

		multiply( q, p ) {

			if ( p !== undefined ) {

				console.warn( 'THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
				return this.multiplyQuaternions( q, p );

			}

			return this.multiplyQuaternions( this, q );

		}

		premultiply( q ) {

			return this.multiplyQuaternions( q, this );

		}

		multiplyQuaternions( a, b ) {

			// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

			const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
			const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

			this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
			this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
			this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
			this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

			this._onChangeCallback();

			return this;

		}

		slerp( qb, t ) {

			if ( t === 0 ) return this;
			if ( t === 1 ) return this.copy( qb );

			const x = this._x, y = this._y, z = this._z, w = this._w;

			// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

			let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

			if ( cosHalfTheta < 0 ) {

				this._w = - qb._w;
				this._x = - qb._x;
				this._y = - qb._y;
				this._z = - qb._z;

				cosHalfTheta = - cosHalfTheta;

			} else {

				this.copy( qb );

			}

			if ( cosHalfTheta >= 1.0 ) {

				this._w = w;
				this._x = x;
				this._y = y;
				this._z = z;

				return this;

			}

			const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

			if ( sqrSinHalfTheta <= Number.EPSILON ) {

				const s = 1 - t;
				this._w = s * w + t * this._w;
				this._x = s * x + t * this._x;
				this._y = s * y + t * this._y;
				this._z = s * z + t * this._z;

				this.normalize();
				this._onChangeCallback();

				return this;

			}

			const sinHalfTheta = Math.sqrt( sqrSinHalfTheta );
			const halfTheta = Math.atan2( sinHalfTheta, cosHalfTheta );
			const ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
				ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

			this._w = ( w * ratioA + this._w * ratioB );
			this._x = ( x * ratioA + this._x * ratioB );
			this._y = ( y * ratioA + this._y * ratioB );
			this._z = ( z * ratioA + this._z * ratioB );

			this._onChangeCallback();

			return this;

		}

		slerpQuaternions( qa, qb, t ) {

			return this.copy( qa ).slerp( qb, t );

		}

		random() {

			// Derived from http://planning.cs.uiuc.edu/node198.html
			// Note, this source uses w, x, y, z ordering,
			// so we swap the order below.

			const u1 = Math.random();
			const sqrt1u1 = Math.sqrt( 1 - u1 );
			const sqrtu1 = Math.sqrt( u1 );

			const u2 = 2 * Math.PI * Math.random();

			const u3 = 2 * Math.PI * Math.random();

			return this.set(
				sqrt1u1 * Math.cos( u2 ),
				sqrtu1 * Math.sin( u3 ),
				sqrtu1 * Math.cos( u3 ),
				sqrt1u1 * Math.sin( u2 ),
			);

		}

		equals( quaternion ) {

			return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

		}

		fromArray( array, offset = 0 ) {

			this._x = array[ offset ];
			this._y = array[ offset + 1 ];
			this._z = array[ offset + 2 ];
			this._w = array[ offset + 3 ];

			this._onChangeCallback();

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this._x;
			array[ offset + 1 ] = this._y;
			array[ offset + 2 ] = this._z;
			array[ offset + 3 ] = this._w;

			return array;

		}

		fromBufferAttribute( attribute, index ) {

			this._x = attribute.getX( index );
			this._y = attribute.getY( index );
			this._z = attribute.getZ( index );
			this._w = attribute.getW( index );

			return this;

		}

		_onChange( callback ) {

			this._onChangeCallback = callback;

			return this;

		}

		_onChangeCallback() {}

	}

	Quaternion.prototype.isQuaternion = true;

	class Vector3 {

		constructor( x = 0, y = 0, z = 0 ) {

			this.x = x;
			this.y = y;
			this.z = z;

		}

		set( x, y, z ) {

			if ( z === undefined ) z = this.z; // sprite.scale.set(x,y)

			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		}

		setScalar( scalar ) {

			this.x = scalar;
			this.y = scalar;
			this.z = scalar;

			return this;

		}

		setX( x ) {

			this.x = x;

			return this;

		}

		setY( y ) {

			this.y = y;

			return this;

		}

		setZ( z ) {

			this.z = z;

			return this;

		}

		setComponent( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				case 2: this.z = value; break;
				default: throw new Error();

			}

			return this;

		}

		getComponent( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				case 2: return this.z;
				default: throw new Error();

			}

		}

		clone() {

			return new this.constructor( this.x, this.y, this.z );

		}

		copy( v ) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;

			return this;

		}

		add( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
				return this.addVectors( v, w );

			}

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;

			return this;

		}

		addScalar( s ) {

			this.x += s;
			this.y += s;
			this.z += s;

			return this;

		}

		addVectors( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;

			return this;

		}

		addScaledVector( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;

			return this;

		}

		sub( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
				return this.subVectors( v, w );

			}

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;

			return this;

		}

		subScalar( s ) {

			this.x -= s;
			this.y -= s;
			this.z -= s;

			return this;

		}

		subVectors( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;

			return this;

		}

		multiply( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
				return this.multiplyVectors( v, w );

			}

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;

			return this;

		}

		multiplyScalar( scalar ) {

			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;

			return this;

		}

		multiplyVectors( a, b ) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;

			return this;

		}

		applyEuler( euler ) {

			if ( ! ( euler && euler.isEuler ) ) {

				console.error( 'THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.' );

			}

			return this.applyQuaternion( _quaternion$2.setFromEuler( euler ) );

		}

		applyAxisAngle( axis, angle ) {

			return this.applyQuaternion( _quaternion$2.setFromAxisAngle( axis, angle ) );

		}

		applyMatrix3( m ) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
			this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
			this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

			return this;

		}

		applyNormalMatrix( m ) {

			return this.applyMatrix3( m ).normalize();

		}

		applyMatrix4( m ) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

			this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
			this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
			this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

			return this;

		}

		applyQuaternion( q ) {

			const x = this.x, y = this.y, z = this.z;
			const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

			// calculate quat * vector

			const ix = qw * x + qy * z - qz * y;
			const iy = qw * y + qz * x - qx * z;
			const iz = qw * z + qx * y - qy * x;
			const iw = - qx * x - qy * y - qz * z;

			// calculate result * inverse quat

			this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
			this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
			this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

			return this;

		}

		project( camera ) {

			return this.applyMatrix4( camera.matrixWorldInverse ).applyMatrix4( camera.projectionMatrix );

		}

		unproject( camera ) {

			return this.applyMatrix4( camera.projectionMatrixInverse ).applyMatrix4( camera.matrixWorld );

		}

		transformDirection( m ) {

			// input: THREE.Matrix4 affine matrix
			// vector interpreted as a direction

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z;
			this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z;
			this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

			return this.normalize();

		}

		divide( v ) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;

			return this;

		}

		divideScalar( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		}

		min( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );
			this.z = Math.min( this.z, v.z );

			return this;

		}

		max( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );
			this.z = Math.max( this.z, v.z );

			return this;

		}

		clamp( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );
			this.z = Math.max( min.z, Math.min( max.z, this.z ) );

			return this;

		}

		clampScalar( minVal, maxVal ) {

			this.x = Math.max( minVal, Math.min( maxVal, this.x ) );
			this.y = Math.max( minVal, Math.min( maxVal, this.y ) );
			this.z = Math.max( minVal, Math.min( maxVal, this.z ) );

			return this;

		}

		clampLength( min, max ) {

			const length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		}

		floor() {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );
			this.z = Math.floor( this.z );

			return this;

		}

		ceil() {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );
			this.z = Math.ceil( this.z );

			return this;

		}

		round() {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );
			this.z = Math.round( this.z );

			return this;

		}

		roundToZero() {

			this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
			this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
			this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

			return this;

		}

		negate() {

			this.x = - this.x;
			this.y = - this.y;
			this.z = - this.z;

			return this;

		}

		dot( v ) {

			return this.x * v.x + this.y * v.y + this.z * v.z;

		}

		// TODO lengthSquared?

		lengthSq() {

			return this.x * this.x + this.y * this.y + this.z * this.z;

		}

		length() {

			return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

		}

		manhattanLength() {

			return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

		}

		normalize() {

			return this.divideScalar( this.length() || 1 );

		}

		setLength( length ) {

			return this.normalize().multiplyScalar( length );

		}

		lerp( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;
			this.z += ( v.z - this.z ) * alpha;

			return this;

		}

		lerpVectors( v1, v2, alpha ) {

			this.x = v1.x + ( v2.x - v1.x ) * alpha;
			this.y = v1.y + ( v2.y - v1.y ) * alpha;
			this.z = v1.z + ( v2.z - v1.z ) * alpha;

			return this;

		}

		cross( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
				return this.crossVectors( v, w );

			}

			return this.crossVectors( this, v );

		}

		crossVectors( a, b ) {

			const ax = a.x, ay = a.y, az = a.z;
			const bx = b.x, by = b.y, bz = b.z;

			this.x = ay * bz - az * by;
			this.y = az * bx - ax * bz;
			this.z = ax * by - ay * bx;

			return this;

		}

		projectOnVector( v ) {

			const denominator = v.lengthSq();

			if ( denominator === 0 ) return this.set( 0, 0, 0 );

			const scalar = v.dot( this ) / denominator;

			return this.copy( v ).multiplyScalar( scalar );

		}

		projectOnPlane( planeNormal ) {

			_vector$2.copy( this ).projectOnVector( planeNormal );

			return this.sub( _vector$2 );

		}

		reflect( normal ) {

			// reflect incident vector off plane orthogonal to normal
			// normal is assumed to have unit length

			return this.sub( _vector$2.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

		}

		angleTo( v ) {

			const denominator = Math.sqrt( this.lengthSq() * v.lengthSq() );

			if ( denominator === 0 ) return Math.PI / 2;

			const theta = this.dot( v ) / denominator;

			// clamp, to handle numerical problems

			return Math.acos( clamp( theta, - 1, 1 ) );

		}

		distanceTo( v ) {

			return Math.sqrt( this.distanceToSquared( v ) );

		}

		distanceToSquared( v ) {

			const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

			return dx * dx + dy * dy + dz * dz;

		}

		manhattanDistanceTo( v ) {

			return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y ) + Math.abs( this.z - v.z );

		}

		setFromSpherical( s ) {

			return this.setFromSphericalCoords( s.radius, s.phi, s.theta );

		}

		setFromSphericalCoords( radius, phi, theta ) {

			const sinPhiRadius = Math.sin( phi ) * radius;

			this.x = sinPhiRadius * Math.sin( theta );
			this.y = Math.cos( phi ) * radius;
			this.z = sinPhiRadius * Math.cos( theta );

			return this;

		}

		setFromCylindrical( c ) {

			return this.setFromCylindricalCoords( c.radius, c.theta, c.y );

		}

		setFromCylindricalCoords( radius, theta, y ) {

			this.x = radius * Math.sin( theta );
			this.y = y;
			this.z = radius * Math.cos( theta );

			return this;

		}

		setFromMatrixPosition( m ) {

			const e = m.elements;

			this.x = e[ 12 ];
			this.y = e[ 13 ];
			this.z = e[ 14 ];

			return this;

		}

		setFromMatrixScale( m ) {

			const sx = this.setFromMatrixColumn( m, 0 ).length();
			const sy = this.setFromMatrixColumn( m, 1 ).length();
			const sz = this.setFromMatrixColumn( m, 2 ).length();

			this.x = sx;
			this.y = sy;
			this.z = sz;

			return this;

		}

		setFromMatrixColumn( m, index ) {

			return this.fromArray( m.elements, index * 4 );

		}

		setFromMatrix3Column( m, index ) {

			return this.fromArray( m.elements, index * 3 );

		}

		equals( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

		}

		fromArray( array, offset = 0 ) {

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];
			this.z = array[ offset + 2 ];

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;
			array[ offset + 2 ] = this.z;

			return array;

		}

		fromBufferAttribute( attribute, index, offset ) {

			if ( offset !== undefined ) {

				console.warn( 'THREE.Vector3: offset has been removed from .fromBufferAttribute().' );

			}

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );
			this.z = attribute.getZ( index );

			return this;

		}

		random() {

			this.x = Math.random();
			this.y = Math.random();
			this.z = Math.random();

			return this;

		}

		randomDirection() {

			// Derived from https://mathworld.wolfram.com/SpherePointPicking.html

			const u = ( Math.random() - 0.5 ) * 2;
			const t = Math.random() * Math.PI * 2;
			const f = Math.sqrt( 1 - u ** 2 );

			this.x = f * Math.cos( t );
			this.y = f * Math.sin( t );
			this.z = u;

			return this;

		}

		*[ Symbol.iterator ]() {

			yield this.x;
			yield this.y;
			yield this.z;

		}

	}

	Vector3.prototype.isVector3 = true;

	const _vector$2 = /*@__PURE__*/ new Vector3();
	const _quaternion$2 = /*@__PURE__*/ new Quaternion();

	class Matrix4 {

		constructor() {

			this.elements = [

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			];

			if ( arguments.length > 0 ) {

				console.error( 'THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.' );

			}

		}

		set( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

			const te = this.elements;

			te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
			te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
			te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
			te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

			return this;

		}

		identity() {

			this.set(

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		clone() {

			return new Matrix4().fromArray( this.elements );

		}

		copy( m ) {

			const te = this.elements;
			const me = m.elements;

			te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ]; te[ 3 ] = me[ 3 ];
			te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ]; te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ];
			te[ 8 ] = me[ 8 ]; te[ 9 ] = me[ 9 ]; te[ 10 ] = me[ 10 ]; te[ 11 ] = me[ 11 ];
			te[ 12 ] = me[ 12 ]; te[ 13 ] = me[ 13 ]; te[ 14 ] = me[ 14 ]; te[ 15 ] = me[ 15 ];

			return this;

		}

		copyPosition( m ) {

			const te = this.elements, me = m.elements;

			te[ 12 ] = me[ 12 ];
			te[ 13 ] = me[ 13 ];
			te[ 14 ] = me[ 14 ];

			return this;

		}

		setFromMatrix3( m ) {

			const me = m.elements;

			this.set(

				me[ 0 ], me[ 3 ], me[ 6 ], 0,
				me[ 1 ], me[ 4 ], me[ 7 ], 0,
				me[ 2 ], me[ 5 ], me[ 8 ], 0,
				0, 0, 0, 1

			);

			return this;

		}

		extractBasis( xAxis, yAxis, zAxis ) {

			xAxis.setFromMatrixColumn( this, 0 );
			yAxis.setFromMatrixColumn( this, 1 );
			zAxis.setFromMatrixColumn( this, 2 );

			return this;

		}

		makeBasis( xAxis, yAxis, zAxis ) {

			this.set(
				xAxis.x, yAxis.x, zAxis.x, 0,
				xAxis.y, yAxis.y, zAxis.y, 0,
				xAxis.z, yAxis.z, zAxis.z, 0,
				0, 0, 0, 1
			);

			return this;

		}

		extractRotation( m ) {

			// this method does not support reflection matrices

			const te = this.elements;
			const me = m.elements;

			const scaleX = 1 / _v1$2.setFromMatrixColumn( m, 0 ).length();
			const scaleY = 1 / _v1$2.setFromMatrixColumn( m, 1 ).length();
			const scaleZ = 1 / _v1$2.setFromMatrixColumn( m, 2 ).length();

			te[ 0 ] = me[ 0 ] * scaleX;
			te[ 1 ] = me[ 1 ] * scaleX;
			te[ 2 ] = me[ 2 ] * scaleX;
			te[ 3 ] = 0;

			te[ 4 ] = me[ 4 ] * scaleY;
			te[ 5 ] = me[ 5 ] * scaleY;
			te[ 6 ] = me[ 6 ] * scaleY;
			te[ 7 ] = 0;

			te[ 8 ] = me[ 8 ] * scaleZ;
			te[ 9 ] = me[ 9 ] * scaleZ;
			te[ 10 ] = me[ 10 ] * scaleZ;
			te[ 11 ] = 0;

			te[ 12 ] = 0;
			te[ 13 ] = 0;
			te[ 14 ] = 0;
			te[ 15 ] = 1;

			return this;

		}

		makeRotationFromEuler( euler ) {

			if ( ! ( euler && euler.isEuler ) ) {

				console.error( 'THREE.Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

			}

			const te = this.elements;

			const x = euler.x, y = euler.y, z = euler.z;
			const a = Math.cos( x ), b = Math.sin( x );
			const c = Math.cos( y ), d = Math.sin( y );
			const e = Math.cos( z ), f = Math.sin( z );

			if ( euler.order === 'XYZ' ) {

				const ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[ 0 ] = c * e;
				te[ 4 ] = - c * f;
				te[ 8 ] = d;

				te[ 1 ] = af + be * d;
				te[ 5 ] = ae - bf * d;
				te[ 9 ] = - b * c;

				te[ 2 ] = bf - ae * d;
				te[ 6 ] = be + af * d;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'YXZ' ) {

				const ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[ 0 ] = ce + df * b;
				te[ 4 ] = de * b - cf;
				te[ 8 ] = a * d;

				te[ 1 ] = a * f;
				te[ 5 ] = a * e;
				te[ 9 ] = - b;

				te[ 2 ] = cf * b - de;
				te[ 6 ] = df + ce * b;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'ZXY' ) {

				const ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[ 0 ] = ce - df * b;
				te[ 4 ] = - a * f;
				te[ 8 ] = de + cf * b;

				te[ 1 ] = cf + de * b;
				te[ 5 ] = a * e;
				te[ 9 ] = df - ce * b;

				te[ 2 ] = - a * d;
				te[ 6 ] = b;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'ZYX' ) {

				const ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[ 0 ] = c * e;
				te[ 4 ] = be * d - af;
				te[ 8 ] = ae * d + bf;

				te[ 1 ] = c * f;
				te[ 5 ] = bf * d + ae;
				te[ 9 ] = af * d - be;

				te[ 2 ] = - d;
				te[ 6 ] = b * c;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'YZX' ) {

				const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[ 0 ] = c * e;
				te[ 4 ] = bd - ac * f;
				te[ 8 ] = bc * f + ad;

				te[ 1 ] = f;
				te[ 5 ] = a * e;
				te[ 9 ] = - b * e;

				te[ 2 ] = - d * e;
				te[ 6 ] = ad * f + bc;
				te[ 10 ] = ac - bd * f;

			} else if ( euler.order === 'XZY' ) {

				const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[ 0 ] = c * e;
				te[ 4 ] = - f;
				te[ 8 ] = d * e;

				te[ 1 ] = ac * f + bd;
				te[ 5 ] = a * e;
				te[ 9 ] = ad * f - bc;

				te[ 2 ] = bc * f - ad;
				te[ 6 ] = b * e;
				te[ 10 ] = bd * f + ac;

			}

			// bottom row
			te[ 3 ] = 0;
			te[ 7 ] = 0;
			te[ 11 ] = 0;

			// last column
			te[ 12 ] = 0;
			te[ 13 ] = 0;
			te[ 14 ] = 0;
			te[ 15 ] = 1;

			return this;

		}

		makeRotationFromQuaternion( q ) {

			return this.compose( _zero, q, _one );

		}

		lookAt( eye, target, up ) {

			const te = this.elements;

			_z.subVectors( eye, target );

			if ( _z.lengthSq() === 0 ) {

				// eye and target are in the same position

				_z.z = 1;

			}

			_z.normalize();
			_x.crossVectors( up, _z );

			if ( _x.lengthSq() === 0 ) {

				// up and z are parallel

				if ( Math.abs( up.z ) === 1 ) {

					_z.x += 0.0001;

				} else {

					_z.z += 0.0001;

				}

				_z.normalize();
				_x.crossVectors( up, _z );

			}

			_x.normalize();
			_y.crossVectors( _z, _x );

			te[ 0 ] = _x.x; te[ 4 ] = _y.x; te[ 8 ] = _z.x;
			te[ 1 ] = _x.y; te[ 5 ] = _y.y; te[ 9 ] = _z.y;
			te[ 2 ] = _x.z; te[ 6 ] = _y.z; te[ 10 ] = _z.z;

			return this;

		}

		multiply( m, n ) {

			if ( n !== undefined ) {

				console.warn( 'THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
				return this.multiplyMatrices( m, n );

			}

			return this.multiplyMatrices( this, m );

		}

		premultiply( m ) {

			return this.multiplyMatrices( m, this );

		}

		multiplyMatrices( a, b ) {

			const ae = a.elements;
			const be = b.elements;
			const te = this.elements;

			const a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
			const a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
			const a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
			const a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

			const b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
			const b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
			const b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
			const b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

			te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
			te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
			te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
			te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

			te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
			te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
			te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
			te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

			te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
			te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
			te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
			te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

			te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
			te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
			te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
			te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

			return this;

		}

		multiplyScalar( s ) {

			const te = this.elements;

			te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
			te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
			te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
			te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

			return this;

		}

		determinant() {

			const te = this.elements;

			const n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
			const n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
			const n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
			const n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

			//TODO: make this more efficient
			//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

			return (
				n41 * (
					+ n14 * n23 * n32
					 - n13 * n24 * n32
					 - n14 * n22 * n33
					 + n12 * n24 * n33
					 + n13 * n22 * n34
					 - n12 * n23 * n34
				) +
				n42 * (
					+ n11 * n23 * n34
					 - n11 * n24 * n33
					 + n14 * n21 * n33
					 - n13 * n21 * n34
					 + n13 * n24 * n31
					 - n14 * n23 * n31
				) +
				n43 * (
					+ n11 * n24 * n32
					 - n11 * n22 * n34
					 - n14 * n21 * n32
					 + n12 * n21 * n34
					 + n14 * n22 * n31
					 - n12 * n24 * n31
				) +
				n44 * (
					- n13 * n22 * n31
					 - n11 * n23 * n32
					 + n11 * n22 * n33
					 + n13 * n21 * n32
					 - n12 * n21 * n33
					 + n12 * n23 * n31
				)

			);

		}

		transpose() {

			const te = this.elements;
			let tmp;

			tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
			tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
			tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

			tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
			tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
			tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

			return this;

		}

		setPosition( x, y, z ) {

			const te = this.elements;

			if ( x.isVector3 ) {

				te[ 12 ] = x.x;
				te[ 13 ] = x.y;
				te[ 14 ] = x.z;

			} else {

				te[ 12 ] = x;
				te[ 13 ] = y;
				te[ 14 ] = z;

			}

			return this;

		}

		invert() {

			// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
			const te = this.elements,

				n11 = te[ 0 ], n21 = te[ 1 ], n31 = te[ 2 ], n41 = te[ 3 ],
				n12 = te[ 4 ], n22 = te[ 5 ], n32 = te[ 6 ], n42 = te[ 7 ],
				n13 = te[ 8 ], n23 = te[ 9 ], n33 = te[ 10 ], n43 = te[ 11 ],
				n14 = te[ 12 ], n24 = te[ 13 ], n34 = te[ 14 ], n44 = te[ 15 ],

				t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
				t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
				t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
				t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

			const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

			if ( det === 0 ) return this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 );

			const detInv = 1 / det;

			te[ 0 ] = t11 * detInv;
			te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
			te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
			te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

			te[ 4 ] = t12 * detInv;
			te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
			te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
			te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

			te[ 8 ] = t13 * detInv;
			te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
			te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
			te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

			te[ 12 ] = t14 * detInv;
			te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
			te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
			te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

			return this;

		}

		scale( v ) {

			const te = this.elements;
			const x = v.x, y = v.y, z = v.z;

			te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
			te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
			te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
			te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

			return this;

		}

		getMaxScaleOnAxis() {

			const te = this.elements;

			const scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
			const scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
			const scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

			return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );

		}

		makeTranslation( x, y, z ) {

			this.set(

				1, 0, 0, x,
				0, 1, 0, y,
				0, 0, 1, z,
				0, 0, 0, 1

			);

			return this;

		}

		makeRotationX( theta ) {

			const c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				1, 0, 0, 0,
				0, c, - s, 0,
				0, s, c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeRotationY( theta ) {

			const c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				 c, 0, s, 0,
				 0, 1, 0, 0,
				- s, 0, c, 0,
				 0, 0, 0, 1

			);

			return this;

		}

		makeRotationZ( theta ) {

			const c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				c, - s, 0, 0,
				s, c, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeRotationAxis( axis, angle ) {

			// Based on http://www.gamedev.net/reference/articles/article1199.asp

			const c = Math.cos( angle );
			const s = Math.sin( angle );
			const t = 1 - c;
			const x = axis.x, y = axis.y, z = axis.z;
			const tx = t * x, ty = t * y;

			this.set(

				tx * x + c, tx * y - s * z, tx * z + s * y, 0,
				tx * y + s * z, ty * y + c, ty * z - s * x, 0,
				tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeScale( x, y, z ) {

			this.set(

				x, 0, 0, 0,
				0, y, 0, 0,
				0, 0, z, 0,
				0, 0, 0, 1

			);

			return this;

		}

		makeShear( xy, xz, yx, yz, zx, zy ) {

			this.set(

				1, yx, zx, 0,
				xy, 1, zy, 0,
				xz, yz, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		compose( position, quaternion, scale ) {

			const te = this.elements;

			const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
			const x2 = x + x,	y2 = y + y, z2 = z + z;
			const xx = x * x2, xy = x * y2, xz = x * z2;
			const yy = y * y2, yz = y * z2, zz = z * z2;
			const wx = w * x2, wy = w * y2, wz = w * z2;

			const sx = scale.x, sy = scale.y, sz = scale.z;

			te[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
			te[ 1 ] = ( xy + wz ) * sx;
			te[ 2 ] = ( xz - wy ) * sx;
			te[ 3 ] = 0;

			te[ 4 ] = ( xy - wz ) * sy;
			te[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
			te[ 6 ] = ( yz + wx ) * sy;
			te[ 7 ] = 0;

			te[ 8 ] = ( xz + wy ) * sz;
			te[ 9 ] = ( yz - wx ) * sz;
			te[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
			te[ 11 ] = 0;

			te[ 12 ] = position.x;
			te[ 13 ] = position.y;
			te[ 14 ] = position.z;
			te[ 15 ] = 1;

			return this;

		}

		decompose( position, quaternion, scale ) {

			const te = this.elements;

			let sx = _v1$2.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
			const sy = _v1$2.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
			const sz = _v1$2.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

			// if determine is negative, we need to invert one scale
			const det = this.determinant();
			if ( det < 0 ) sx = - sx;

			position.x = te[ 12 ];
			position.y = te[ 13 ];
			position.z = te[ 14 ];

			// scale the rotation part
			_m1$2.copy( this );

			const invSX = 1 / sx;
			const invSY = 1 / sy;
			const invSZ = 1 / sz;

			_m1$2.elements[ 0 ] *= invSX;
			_m1$2.elements[ 1 ] *= invSX;
			_m1$2.elements[ 2 ] *= invSX;

			_m1$2.elements[ 4 ] *= invSY;
			_m1$2.elements[ 5 ] *= invSY;
			_m1$2.elements[ 6 ] *= invSY;

			_m1$2.elements[ 8 ] *= invSZ;
			_m1$2.elements[ 9 ] *= invSZ;
			_m1$2.elements[ 10 ] *= invSZ;

			quaternion.setFromRotationMatrix( _m1$2 );

			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;

		}

		makePerspective( left, right, top, bottom, near, far ) {

			if ( far === undefined ) {

				console.warn( 'THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.' );

			}

			const te = this.elements;
			const x = 2 * near / ( right - left );
			const y = 2 * near / ( top - bottom );

			const a = ( right + left ) / ( right - left );
			const b = ( top + bottom ) / ( top - bottom );
			const c = - ( far + near ) / ( far - near );
			const d = - 2 * far * near / ( far - near );

			te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
			te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
			te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
			te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

			return this;

		}

		makeOrthographic( left, right, top, bottom, near, far ) {

			const te = this.elements;
			const w = 1.0 / ( right - left );
			const h = 1.0 / ( top - bottom );
			const p = 1.0 / ( far - near );

			const x = ( right + left ) * w;
			const y = ( top + bottom ) * h;
			const z = ( far + near ) * p;

			te[ 0 ] = 2 * w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
			te[ 1 ] = 0;	te[ 5 ] = 2 * h;	te[ 9 ] = 0;	te[ 13 ] = - y;
			te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 * p;	te[ 14 ] = - z;
			te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;

			return this;

		}

		equals( matrix ) {

			const te = this.elements;
			const me = matrix.elements;

			for ( let i = 0; i < 16; i ++ ) {

				if ( te[ i ] !== me[ i ] ) return false;

			}

			return true;

		}

		fromArray( array, offset = 0 ) {

			for ( let i = 0; i < 16; i ++ ) {

				this.elements[ i ] = array[ i + offset ];

			}

			return this;

		}

		toArray( array = [], offset = 0 ) {

			const te = this.elements;

			array[ offset ] = te[ 0 ];
			array[ offset + 1 ] = te[ 1 ];
			array[ offset + 2 ] = te[ 2 ];
			array[ offset + 3 ] = te[ 3 ];

			array[ offset + 4 ] = te[ 4 ];
			array[ offset + 5 ] = te[ 5 ];
			array[ offset + 6 ] = te[ 6 ];
			array[ offset + 7 ] = te[ 7 ];

			array[ offset + 8 ] = te[ 8 ];
			array[ offset + 9 ] = te[ 9 ];
			array[ offset + 10 ] = te[ 10 ];
			array[ offset + 11 ] = te[ 11 ];

			array[ offset + 12 ] = te[ 12 ];
			array[ offset + 13 ] = te[ 13 ];
			array[ offset + 14 ] = te[ 14 ];
			array[ offset + 15 ] = te[ 15 ];

			return array;

		}

	}

	Matrix4.prototype.isMatrix4 = true;

	const _v1$2 = /*@__PURE__*/ new Vector3();
	const _m1$2 = /*@__PURE__*/ new Matrix4();
	const _zero = /*@__PURE__*/ new Vector3( 0, 0, 0 );
	const _one = /*@__PURE__*/ new Vector3( 1, 1, 1 );
	const _x = /*@__PURE__*/ new Vector3();
	const _y = /*@__PURE__*/ new Vector3();
	const _z = /*@__PURE__*/ new Vector3();

	function WebGLAnimation() {

		let context = null;
		let isAnimating = false;
		let animationLoop = null;
		let requestId = null;

		function onAnimationFrame( time, frame ) {

			animationLoop( time, frame );

			requestId = context.requestAnimationFrame( onAnimationFrame );

		}

		return {

			start: function () {

				if ( isAnimating === true ) return;
				if ( animationLoop === null ) return;

				requestId = context.requestAnimationFrame( onAnimationFrame );

				isAnimating = true;

			},

			stop: function () {

				context.cancelAnimationFrame( requestId );

				isAnimating = false;

			},

			setAnimationLoop: function ( callback ) {

				animationLoop = callback;

			},

			setContext: function ( value ) {

				context = value;

			}

		};

	}

	function WebGLAttributes( gl, capabilities ) {

		const isWebGL2 = capabilities.isWebGL2;

		const buffers = new WeakMap();

		function createBuffer( attribute, bufferType ) {

			const array = attribute.array;
			const usage = attribute.usage;

			const buffer = gl.createBuffer();

			gl.bindBuffer( bufferType, buffer );
			gl.bufferData( bufferType, array, usage );

			attribute.onUploadCallback();

			let type = gl.FLOAT;

			if ( array instanceof Float32Array ) {

				type = gl.FLOAT;

			} else if ( array instanceof Float64Array ) {

				console.warn( 'THREE.WebGLAttributes: Unsupported data buffer format: Float64Array.' );

			} else if ( array instanceof Uint16Array ) {

				if ( attribute.isFloat16BufferAttribute ) {

					if ( isWebGL2 ) {

						type = gl.HALF_FLOAT;

					} else {

						console.warn( 'THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.' );

					}

				} else {

					type = gl.UNSIGNED_SHORT;

				}

			} else if ( array instanceof Int16Array ) {

				type = gl.SHORT;

			} else if ( array instanceof Uint32Array ) {

				type = gl.UNSIGNED_INT;

			} else if ( array instanceof Int32Array ) {

				type = gl.INT;

			} else if ( array instanceof Int8Array ) {

				type = gl.BYTE;

			} else if ( array instanceof Uint8Array ) {

				type = gl.UNSIGNED_BYTE;

			} else if ( array instanceof Uint8ClampedArray ) {

				type = gl.UNSIGNED_BYTE;

			}

			return {
				buffer: buffer,
				type: type,
				bytesPerElement: array.BYTES_PER_ELEMENT,
				version: attribute.version
			};

		}

		function updateBuffer( buffer, attribute, bufferType ) {

			const array = attribute.array;
			const updateRange = attribute.updateRange;

			gl.bindBuffer( bufferType, buffer );

			if ( updateRange.count === - 1 ) {

				// Not using update ranges

				gl.bufferSubData( bufferType, 0, array );

			} else {

				if ( isWebGL2 ) {

					gl.bufferSubData( bufferType, updateRange.offset * array.BYTES_PER_ELEMENT,
						array, updateRange.offset, updateRange.count );

				} else {

					gl.bufferSubData( bufferType, updateRange.offset * array.BYTES_PER_ELEMENT,
						array.subarray( updateRange.offset, updateRange.offset + updateRange.count ) );

				}

				updateRange.count = - 1; // reset range

			}

		}

		//

		function get( attribute ) {

			if ( attribute.isInterleavedBufferAttribute ) attribute = attribute.data;

			return buffers.get( attribute );

		}

		function remove( attribute ) {

			if ( attribute.isInterleavedBufferAttribute ) attribute = attribute.data;

			const data = buffers.get( attribute );

			if ( data ) {

				gl.deleteBuffer( data.buffer );

				buffers.delete( attribute );

			}

		}

		function update( attribute, bufferType ) {

			if ( attribute.isGLBufferAttribute ) {

				const cached = buffers.get( attribute );

				if ( ! cached || cached.version < attribute.version ) {

					buffers.set( attribute, {
						buffer: attribute.buffer,
						type: attribute.type,
						bytesPerElement: attribute.elementSize,
						version: attribute.version
					} );

				}

				return;

			}

			if ( attribute.isInterleavedBufferAttribute ) attribute = attribute.data;

			const data = buffers.get( attribute );

			if ( data === undefined ) {

				buffers.set( attribute, createBuffer( attribute, bufferType ) );

			} else if ( data.version < attribute.version ) {

				updateBuffer( data.buffer, attribute, bufferType );

				data.version = attribute.version;

			}

		}

		return {

			get: get,
			remove: remove,
			update: update

		};

	}

	function WebGLBackground( renderer, cubemaps, state, objects, alpha, premultipliedAlpha ) {

		let clearColor = [0,0,0];
		let clearAlpha = alpha === true ? 0 : 1;

		function render(renderList, scene ) {

			let forceClear = false;
			let background = scene.isScene === true ? scene.background : null;

			if ( background && background.isTexture ) {

				background = cubemaps.get( background );

			}

			if ( background === null ) {

				setClear( clearColor, clearAlpha );

			} else if ( background && background.isColor ) {

				setClear( background, 1 );
				forceClear = true;

			}

			if ( renderer.autoClear || forceClear ) {

				renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );

			}
		}

		function setClear( color, alpha ) {

			state.buffers.color.setClear( color[0], color[1], color[2], alpha, premultipliedAlpha );

		}

		return {

			getClearColor: function () {

				return clearColor;

			},
			setClearColor: function ( color, alpha = 1 ) {

				clearColor = color;
				clearAlpha = alpha;
				setClear( clearColor, clearAlpha );

			},
			getClearAlpha: function () {

				return clearAlpha;

			},
			setClearAlpha: function ( alpha ) {

				clearAlpha = alpha;
				setClear( clearColor, clearAlpha );

			},
			render: render

		};

	}

	function WebGLBindingStates( gl, extensions, attributes, capabilities ) {

		const maxVertexAttributes = gl.getParameter( gl.MAX_VERTEX_ATTRIBS );

		const extension = capabilities.isWebGL2 ? null : extensions.get( 'OES_vertex_array_object' );
		const vaoAvailable = capabilities.isWebGL2 || extension !== null;

		const bindingStates = {};

		const defaultState = createBindingState( null );
		let currentState = defaultState;

		function setup( object, material, program, geometry, index ) {

			let updateBuffers = false;

			if ( vaoAvailable ) {

				const state = getBindingState( geometry, program, material );

				if ( currentState !== state ) {

					currentState = state;
					bindVertexArrayObject( currentState.object );

				}

				updateBuffers = needsUpdate( geometry, index );

				if ( updateBuffers ) saveCache( geometry, index );

			} else {

				const wireframe = ( material.wireframe === true );

				if ( currentState.geometry !== geometry.id ||
					currentState.program !== program.id ||
					currentState.wireframe !== wireframe ) {

					currentState.geometry = geometry.id;
					currentState.program = program.id;
					currentState.wireframe = wireframe;

					updateBuffers = true;

				}

			}


			if ( index !== null ) {

				attributes.update( index, gl.ELEMENT_ARRAY_BUFFER );

			}

			if ( updateBuffers ) {

				setupVertexAttributes( object, material, program, geometry );

				if ( index !== null ) {

					gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, attributes.get( index ).buffer );

				}

			}

		}

		function createVertexArrayObject() {

			if ( capabilities.isWebGL2 ) return gl.createVertexArray();

			return extension.createVertexArrayOES();

		}

		function bindVertexArrayObject( vao ) {

			if ( capabilities.isWebGL2 ) return gl.bindVertexArray( vao );

			return extension.bindVertexArrayOES( vao );

		}

		function deleteVertexArrayObject( vao ) {

			if ( capabilities.isWebGL2 ) return gl.deleteVertexArray( vao );

			return extension.deleteVertexArrayOES( vao );

		}

		function getBindingState( geometry, program, material ) {

			const wireframe = ( material.wireframe === true );

			let programMap = bindingStates[ geometry.id ];

			if ( programMap === undefined ) {

				programMap = {};
				bindingStates[ geometry.id ] = programMap;

			}

			let stateMap = programMap[ program.id ];

			if ( stateMap === undefined ) {

				stateMap = {};
				programMap[ program.id ] = stateMap;

			}

			let state = stateMap[ wireframe ];

			if ( state === undefined ) {

				state = createBindingState( createVertexArrayObject() );
				stateMap[ wireframe ] = state;

			}

			return state;

		}

		function createBindingState( vao ) {

			const newAttributes = [];
			const enabledAttributes = [];
			const attributeDivisors = [];

			for ( let i = 0; i < maxVertexAttributes; i ++ ) {

				newAttributes[ i ] = 0;
				enabledAttributes[ i ] = 0;
				attributeDivisors[ i ] = 0;

			}

			return {

				// for backward compatibility on non-VAO support browser
				geometry: null,
				program: null,
				wireframe: false,

				newAttributes: newAttributes,
				enabledAttributes: enabledAttributes,
				attributeDivisors: attributeDivisors,
				object: vao,
				attributes: {},
				index: null

			};

		}

		function needsUpdate( geometry, index ) {

			const cachedAttributes = currentState.attributes;
			const geometryAttributes = geometry.attributes;

			let attributesNum = 0;

			for ( const key in geometryAttributes ) {

				const cachedAttribute = cachedAttributes[ key ];
				const geometryAttribute = geometryAttributes[ key ];

				if ( cachedAttribute === undefined ) return true;

				if ( cachedAttribute.attribute !== geometryAttribute ) return true;

				if ( cachedAttribute.data !== geometryAttribute.data ) return true;

				attributesNum ++;

			}

			if ( currentState.attributesNum !== attributesNum ) return true;

			if ( currentState.index !== index ) return true;

			return false;

		}

		function saveCache( geometry, index ) {

			const cache = {};
			const attributes = geometry.attributes;
			let attributesNum = 0;

			for ( const key in attributes ) {

				const attribute = attributes[ key ];

				const data = {};
				data.attribute = attribute;

				if ( attribute.data ) {

					data.data = attribute.data;

				}

				cache[ key ] = data;

				attributesNum ++;

			}

			currentState.attributes = cache;
			currentState.attributesNum = attributesNum;

			currentState.index = index;

		}

		function initAttributes() {

			const newAttributes = currentState.newAttributes;

			for ( let i = 0, il = newAttributes.length; i < il; i ++ ) {

				newAttributes[ i ] = 0;

			}

		}

		function enableAttribute( attribute ) {

			enableAttributeAndDivisor( attribute, 0 );

		}

		function enableAttributeAndDivisor( attribute, meshPerAttribute ) {

			const newAttributes = currentState.newAttributes;
			const enabledAttributes = currentState.enabledAttributes;
			const attributeDivisors = currentState.attributeDivisors;

			newAttributes[ attribute ] = 1;

			if ( enabledAttributes[ attribute ] === 0 ) {

				gl.enableVertexAttribArray( attribute );
				enabledAttributes[ attribute ] = 1;

			}

			if ( attributeDivisors[ attribute ] !== meshPerAttribute ) {

				const extension = capabilities.isWebGL2 ? gl : extensions.get( 'ANGLE_instanced_arrays' );

				extension[ capabilities.isWebGL2 ? 'vertexAttribDivisor' : 'vertexAttribDivisorANGLE' ]( attribute, meshPerAttribute );
				attributeDivisors[ attribute ] = meshPerAttribute;

			}

		}

		function disableUnusedAttributes() {

			const newAttributes = currentState.newAttributes;
			const enabledAttributes = currentState.enabledAttributes;

			for ( let i = 0, il = enabledAttributes.length; i < il; i ++ ) {

				if ( enabledAttributes[ i ] !== newAttributes[ i ] ) {

					gl.disableVertexAttribArray( i );
					enabledAttributes[ i ] = 0;

				}

			}

		}

		function vertexAttribPointer( index, size, type, normalized, stride, offset ) {

			if ( capabilities.isWebGL2 === true && ( type === gl.INT || type === gl.UNSIGNED_INT ) ) {

				gl.vertexAttribIPointer( index, size, type, stride, offset );

			} else {

				gl.vertexAttribPointer( index, size, type, normalized, stride, offset );

			}

		}

		function setupVertexAttributes( object, material, program, geometry ) {

			initAttributes();

			const geometryAttributes = geometry.attributes;

			const programAttributes = program.getAttributes();

			const materialDefaultAttributeValues = material.defaultAttributeValues;

			for ( const name in programAttributes ) {

				const programAttribute = programAttributes[ name ];

				if ( programAttribute.location >= 0 ) {

					let geometryAttribute = geometryAttributes[ name ];

					if ( geometryAttribute === undefined ) {

						if ( name === 'instanceMatrix' && object.instanceMatrix ) geometryAttribute = object.instanceMatrix;
						if ( name === 'instanceColor' && object.instanceColor ) geometryAttribute = object.instanceColor;

					}

					if ( geometryAttribute !== undefined ) {

						const normalized = geometryAttribute.normalized;
						const size = geometryAttribute.itemSize;

						const attribute = attributes.get( geometryAttribute );

						// TODO Attribute may not be available on context restore

						if ( attribute === undefined ) continue;

						const buffer = attribute.buffer;
						const type = attribute.type;
						const bytesPerElement = attribute.bytesPerElement;

						if ( geometryAttribute.isInterleavedBufferAttribute ) {

							const data = geometryAttribute.data;
							const stride = data.stride;
							const offset = geometryAttribute.offset;

							if ( data && data.isInstancedInterleavedBuffer ) {

								for ( let i = 0; i < programAttribute.locationSize; i ++ ) {

									enableAttributeAndDivisor( programAttribute.location + i, data.meshPerAttribute );

								}

							} else {

								for ( let i = 0; i < programAttribute.locationSize; i ++ ) {

									enableAttribute( programAttribute.location + i );

								}

							}

							gl.bindBuffer( gl.ARRAY_BUFFER, buffer );

							for ( let i = 0; i < programAttribute.locationSize; i ++ ) {

								vertexAttribPointer(
									programAttribute.location + i,
									size / programAttribute.locationSize,
									type,
									normalized,
									stride * bytesPerElement,
									( offset + ( size / programAttribute.locationSize ) * i ) * bytesPerElement
								);

							}

						} else {

							if ( geometryAttribute.isInstancedBufferAttribute ) {

								for ( let i = 0; i < programAttribute.locationSize; i ++ ) {

									enableAttributeAndDivisor( programAttribute.location + i, geometryAttribute.meshPerAttribute );

								}


							} else {

								for ( let i = 0; i < programAttribute.locationSize; i ++ ) {

									enableAttribute( programAttribute.location + i );

								}

							}

							gl.bindBuffer( gl.ARRAY_BUFFER, buffer );

							for ( let i = 0; i < programAttribute.locationSize; i ++ ) {

								vertexAttribPointer(
									programAttribute.location + i,
									size / programAttribute.locationSize,
									type,
									normalized,
									size * bytesPerElement,
									( size / programAttribute.locationSize ) * i * bytesPerElement
								);

							}

						}

					} else if ( materialDefaultAttributeValues !== undefined ) {

						const value = materialDefaultAttributeValues[ name ];

						if ( value !== undefined ) {

							switch ( value.length ) {

								case 2:
									gl.vertexAttrib2fv( programAttribute.location, value );
									break;

								case 3:
									gl.vertexAttrib3fv( programAttribute.location, value );
									break;

								case 4:
									gl.vertexAttrib4fv( programAttribute.location, value );
									break;

								default:
									gl.vertexAttrib1fv( programAttribute.location, value );

							}

						}

					}

				}

			}

			disableUnusedAttributes();

		}

		function dispose() {

			reset();

			for ( const geometryId in bindingStates ) {

				const programMap = bindingStates[ geometryId ];

				for ( const programId in programMap ) {

					const stateMap = programMap[ programId ];

					for ( const wireframe in stateMap ) {

						deleteVertexArrayObject( stateMap[ wireframe ].object );

						delete stateMap[ wireframe ];

					}

					delete programMap[ programId ];

				}

				delete bindingStates[ geometryId ];

			}

		}

		function releaseStatesOfGeometry( geometry ) {

			if ( bindingStates[ geometry.id ] === undefined ) return;

			const programMap = bindingStates[ geometry.id ];

			for ( const programId in programMap ) {

				const stateMap = programMap[ programId ];

				for ( const wireframe in stateMap ) {

					deleteVertexArrayObject( stateMap[ wireframe ].object );

					delete stateMap[ wireframe ];

				}

				delete programMap[ programId ];

			}

			delete bindingStates[ geometry.id ];

		}

		function releaseStatesOfProgram( program ) {

			for ( const geometryId in bindingStates ) {

				const programMap = bindingStates[ geometryId ];

				if ( programMap[ program.id ] === undefined ) continue;

				const stateMap = programMap[ program.id ];

				for ( const wireframe in stateMap ) {

					deleteVertexArrayObject( stateMap[ wireframe ].object );

					delete stateMap[ wireframe ];

				}

				delete programMap[ program.id ];

			}

		}

		function reset() {

			resetDefaultState();

			if ( currentState === defaultState ) return;

			currentState = defaultState;
			bindVertexArrayObject( currentState.object );

		}

		// for backward-compatilibity

		function resetDefaultState() {

			defaultState.geometry = null;
			defaultState.program = null;
			defaultState.wireframe = false;

		}

		return {

			setup: setup,
			reset: reset,
			resetDefaultState: resetDefaultState,
			dispose: dispose,
			releaseStatesOfGeometry: releaseStatesOfGeometry,
			releaseStatesOfProgram: releaseStatesOfProgram,

			initAttributes: initAttributes,
			enableAttribute: enableAttribute,
			disableUnusedAttributes: disableUnusedAttributes

		};

	}

	function WebGLBufferRenderer( gl, extensions, info, capabilities ) {

		const isWebGL2 = capabilities.isWebGL2;

		let mode;

		function setMode( value ) {

			mode = value;

		}

		function render( start, count ) {

			gl.drawArrays( mode, start, count );

			info.update( count, mode, 1 );

		}

		function renderInstances( start, count, primcount ) {

			if ( primcount === 0 ) return;

			let extension, methodName;

			if ( isWebGL2 ) {

				extension = gl;
				methodName = 'drawArraysInstanced';

			} else {

				extension = extensions.get( 'ANGLE_instanced_arrays' );
				methodName = 'drawArraysInstancedANGLE';

				if ( extension === null ) {

					console.error( 'THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
					return;

				}

			}

			extension[ methodName ]( mode, start, count, primcount );

			info.update( count, mode, primcount );

		}

		//

		this.setMode = setMode;
		this.render = render;
		this.renderInstances = renderInstances;

	}

	function WebGLCapabilities( gl, extensions, parameters ) {

		let maxAnisotropy;

		function getMaxAnisotropy() {

			if ( maxAnisotropy !== undefined ) return maxAnisotropy;

			if ( extensions.has( 'EXT_texture_filter_anisotropic' ) === true ) {

				const extension = extensions.get( 'EXT_texture_filter_anisotropic' );

				maxAnisotropy = gl.getParameter( extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT );

			} else {

				maxAnisotropy = 0;

			}

			return maxAnisotropy;

		}

		function getMaxPrecision( precision ) {

			if ( precision === 'highp' ) {

				if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision > 0 &&
					gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision > 0 ) {

					return 'highp';

				}

				precision = 'mediump';

			}

			if ( precision === 'mediump' ) {

				if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision > 0 &&
					gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision > 0 ) {

					return 'mediump';

				}

			}

			return 'lowp';

		}

		const isWebGL2 = ( typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext ) ||
			( typeof WebGL2ComputeRenderingContext !== 'undefined' && gl instanceof WebGL2ComputeRenderingContext );

		let precision = parameters.precision !== undefined ? parameters.precision : 'highp';
		const maxPrecision = getMaxPrecision( precision );

		if ( maxPrecision !== precision ) {

			console.warn( 'THREE.WebGLRenderer:', precision, 'not supported, using', maxPrecision, 'instead.' );
			precision = maxPrecision;

		}

		const drawBuffers = isWebGL2 || extensions.has( 'WEBGL_draw_buffers' );

		const logarithmicDepthBuffer = parameters.logarithmicDepthBuffer === true;

		const maxTextures = gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS );
		const maxVertexTextures = gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );
		const maxTextureSize = gl.getParameter( gl.MAX_TEXTURE_SIZE );
		const maxCubemapSize = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE );

		const maxAttributes = gl.getParameter( gl.MAX_VERTEX_ATTRIBS );
		const maxVertexUniforms = gl.getParameter( gl.MAX_VERTEX_UNIFORM_VECTORS );
		const maxVaryings = gl.getParameter( gl.MAX_VARYING_VECTORS );
		const maxFragmentUniforms = gl.getParameter( gl.MAX_FRAGMENT_UNIFORM_VECTORS );

		const vertexTextures = maxVertexTextures > 0;
		const floatFragmentTextures = isWebGL2 || extensions.has( 'OES_texture_float' );
		const floatVertexTextures = vertexTextures && floatFragmentTextures;

		const maxSamples = isWebGL2 ? gl.getParameter( gl.MAX_SAMPLES ) : 0;

		return {

			isWebGL2: isWebGL2,

			drawBuffers: drawBuffers,

			getMaxAnisotropy: getMaxAnisotropy,
			getMaxPrecision: getMaxPrecision,

			precision: precision,
			logarithmicDepthBuffer: logarithmicDepthBuffer,

			maxTextures: maxTextures,
			maxVertexTextures: maxVertexTextures,
			maxTextureSize: maxTextureSize,
			maxCubemapSize: maxCubemapSize,

			maxAttributes: maxAttributes,
			maxVertexUniforms: maxVertexUniforms,
			maxVaryings: maxVaryings,
			maxFragmentUniforms: maxFragmentUniforms,

			vertexTextures: vertexTextures,
			floatFragmentTextures: floatFragmentTextures,
			floatVertexTextures: floatVertexTextures,

			maxSamples: maxSamples

		};

	}

	const _vector1 = /*@__PURE__*/ new Vector3();
	const _vector2$1 = /*@__PURE__*/ new Vector3();
	const _normalMatrix = /*@__PURE__*/ new Matrix3();

	class Plane {

		constructor( normal = new Vector3( 1, 0, 0 ), constant = 0 ) {

			// normal is assumed to be normalized

			this.normal = normal;
			this.constant = constant;

		}

		set( normal, constant ) {

			this.normal.copy( normal );
			this.constant = constant;

			return this;

		}

		setComponents( x, y, z, w ) {

			this.normal.set( x, y, z );
			this.constant = w;

			return this;

		}

		setFromNormalAndCoplanarPoint( normal, point ) {

			this.normal.copy( normal );
			this.constant = - point.dot( this.normal );

			return this;

		}

		setFromCoplanarPoints( a, b, c ) {

			const normal = _vector1.subVectors( c, b ).cross( _vector2$1.subVectors( a, b ) ).normalize();

			// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

			this.setFromNormalAndCoplanarPoint( normal, a );

			return this;

		}

		copy( plane ) {

			this.normal.copy( plane.normal );
			this.constant = plane.constant;

			return this;

		}

		normalize() {

			// Note: will lead to a divide by zero if the plane is invalid.

			const inverseNormalLength = 1.0 / this.normal.length();
			this.normal.multiplyScalar( inverseNormalLength );
			this.constant *= inverseNormalLength;

			return this;

		}

		negate() {

			this.constant *= - 1;
			this.normal.negate();

			return this;

		}

		distanceToPoint( point ) {

			return this.normal.dot( point ) + this.constant;

		}

		distanceToSphere( sphere ) {

			return this.distanceToPoint( sphere.center ) - sphere.radius;

		}

		projectPoint( point, target ) {

			return target.copy( this.normal ).multiplyScalar( - this.distanceToPoint( point ) ).add( point );

		}

		intersectLine( line, target ) {

			const direction = line.delta( _vector1 );

			const denominator = this.normal.dot( direction );

			if ( denominator === 0 ) {

				// line is coplanar, return origin
				if ( this.distanceToPoint( line.start ) === 0 ) {

					return target.copy( line.start );

				}

				// Unsure if this is the correct method to handle this case.
				return null;

			}

			const t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

			if ( t < 0 || t > 1 ) {

				return null;

			}

			return target.copy( direction ).multiplyScalar( t ).add( line.start );

		}

		intersectsLine( line ) {

			// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

			const startSign = this.distanceToPoint( line.start );
			const endSign = this.distanceToPoint( line.end );

			return ( startSign < 0 && endSign > 0 ) || ( endSign < 0 && startSign > 0 );

		}

		intersectsBox( box ) {

			return box.intersectsPlane( this );

		}

		intersectsSphere( sphere ) {

			return sphere.intersectsPlane( this );

		}

		coplanarPoint( target ) {

			return target.copy( this.normal ).multiplyScalar( - this.constant );

		}

		applyMatrix4( matrix, optionalNormalMatrix ) {

			const normalMatrix = optionalNormalMatrix || _normalMatrix.getNormalMatrix( matrix );

			const referencePoint = this.coplanarPoint( _vector1 ).applyMatrix4( matrix );

			const normal = this.normal.applyMatrix3( normalMatrix ).normalize();

			this.constant = - referencePoint.dot( normal );

			return this;

		}

		translate( offset ) {

			this.constant -= offset.dot( this.normal );

			return this;

		}

		equals( plane ) {

			return plane.normal.equals( this.normal ) && ( plane.constant === this.constant );

		}

		clone() {

			return new this.constructor().copy( this );

		}

	}

	Plane.prototype.isPlane = true;

	function WebGLClipping( properties ) {

		const scope = this;

		let globalState = null,
			numGlobalPlanes = 0,
			localClippingEnabled = false,
			renderingShadows = false;

		const plane = new Plane(),
			viewNormalMatrix = new Matrix3(),

			uniform = { value: null, needsUpdate: false };

		this.uniform = uniform;
		this.numPlanes = 0;
		this.numIntersection = 0;

		this.init = function ( planes, enableLocalClipping, camera ) {

			const enabled =
				planes.length !== 0 ||
				enableLocalClipping ||
				// enable state of previous frame - the clipping code has to
				// run another frame in order to reset the state:
				numGlobalPlanes !== 0 ||
				localClippingEnabled;

			localClippingEnabled = enableLocalClipping;

			globalState = projectPlanes( planes, camera, 0 );
			numGlobalPlanes = planes.length;

			return enabled;

		};

		this.beginShadows = function () {

			renderingShadows = true;
			projectPlanes( null );

		};

		this.endShadows = function () {

			renderingShadows = false;
			resetGlobalState();

		};

		this.setState = function ( material, camera, useCache ) {

			const planes = material.clippingPlanes,
				clipIntersection = material.clipIntersection,
				clipShadows = material.clipShadows;

			const materialProperties = properties.get( material );

			if ( ! localClippingEnabled || planes === null || planes.length === 0 || renderingShadows && ! clipShadows ) {

				// there's no local clipping

				if ( renderingShadows ) {

					// there's no global clipping

					projectPlanes( null );

				} else {

					resetGlobalState();

				}

			} else {

				const nGlobal = renderingShadows ? 0 : numGlobalPlanes,
					lGlobal = nGlobal * 4;

				let dstArray = materialProperties.clippingState || null;

				uniform.value = dstArray; // ensure unique state

				dstArray = projectPlanes( planes, camera, lGlobal, useCache );

				for ( let i = 0; i !== lGlobal; ++ i ) {

					dstArray[ i ] = globalState[ i ];

				}

				materialProperties.clippingState = dstArray;
				this.numIntersection = clipIntersection ? this.numPlanes : 0;
				this.numPlanes += nGlobal;

			}


		};

		function resetGlobalState() {

			if ( uniform.value !== globalState ) {

				uniform.value = globalState;
				uniform.needsUpdate = numGlobalPlanes > 0;

			}

			scope.numPlanes = numGlobalPlanes;
			scope.numIntersection = 0;

		}

		function projectPlanes( planes, camera, dstOffset, skipTransform ) {

			const nPlanes = planes !== null ? planes.length : 0;
			let dstArray = null;

			if ( nPlanes !== 0 ) {

				dstArray = uniform.value;

				if ( skipTransform !== true || dstArray === null ) {

					const flatSize = dstOffset + nPlanes * 4,
						viewMatrix = camera.matrixWorldInverse;

					viewNormalMatrix.getNormalMatrix( viewMatrix );

					if ( dstArray === null || dstArray.length < flatSize ) {

						dstArray = new Float32Array( flatSize );

					}

					for ( let i = 0, i4 = dstOffset; i !== nPlanes; ++ i, i4 += 4 ) {

						plane.copy( planes[ i ] ).applyMatrix4( viewMatrix, viewNormalMatrix );

						plane.normal.toArray( dstArray, i4 );
						dstArray[ i4 + 3 ] = plane.constant;

					}

				}

				uniform.value = dstArray;
				uniform.needsUpdate = true;

			}

			scope.numPlanes = nPlanes;
			scope.numIntersection = 0;

			return dstArray;

		}

	}

	function WebGLExtensions( gl ) {

		const extensions = {};

		function getExtension( name ) {

			if ( extensions[ name ] !== undefined ) {

				return extensions[ name ];

			}

			let extension;

			switch ( name ) {

				case 'WEBGL_depth_texture':
					extension = gl.getExtension( 'WEBGL_depth_texture' ) || gl.getExtension( 'MOZ_WEBGL_depth_texture' ) || gl.getExtension( 'WEBKIT_WEBGL_depth_texture' );
					break;

				case 'EXT_texture_filter_anisotropic':
					extension = gl.getExtension( 'EXT_texture_filter_anisotropic' ) || gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) || gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );
					break;

				case 'WEBGL_compressed_texture_s3tc':
					extension = gl.getExtension( 'WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );
					break;

				case 'WEBGL_compressed_texture_pvrtc':
					extension = gl.getExtension( 'WEBGL_compressed_texture_pvrtc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_pvrtc' );
					break;

				default:
					extension = gl.getExtension( name );

			}

			extensions[ name ] = extension;

			return extension;

		}

		return {

			has: function ( name ) {

				return getExtension( name ) !== null;

			},

			init: function ( capabilities ) {

				if ( capabilities.isWebGL2 ) {

					getExtension( 'EXT_color_buffer_float' );

				} else {

					getExtension( 'WEBGL_depth_texture' );
					getExtension( 'OES_texture_float' );
					getExtension( 'OES_texture_half_float' );
					getExtension( 'OES_texture_half_float_linear' );
					getExtension( 'OES_standard_derivatives' );
					getExtension( 'OES_element_index_uint' );
					getExtension( 'OES_vertex_array_object' );
					getExtension( 'ANGLE_instanced_arrays' );

				}

				getExtension( 'OES_texture_float_linear' );
				getExtension( 'EXT_color_buffer_half_float' );
				getExtension( 'WEBGL_multisampled_render_to_texture' );

			},

			get: function ( name ) {

				const extension = getExtension( name );

				if ( extension === null ) {

					console.warn( 'THREE.WebGLRenderer: ' + name + ' extension not supported.' );

				}

				return extension;

			}

		};

	}

	const _vector$1 = /*@__PURE__*/ new Vector3();
	const _vector2 = /*@__PURE__*/ new Vector2();

	class BufferAttribute {

		constructor( array, itemSize, normalized ) {

			if ( Array.isArray( array ) ) {

				throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );

			}

			this.name = '';

			this.array = array;
			this.itemSize = itemSize;
			this.count = array !== undefined ? array.length / itemSize : 0;
			this.normalized = normalized === true;

			this.usage = StaticDrawUsage;
			this.updateRange = { offset: 0, count: - 1 };

			this.version = 0;

		}

		onUploadCallback() {}

		set needsUpdate( value ) {

			if ( value === true ) this.version ++;

		}

		setUsage( value ) {

			this.usage = value;

			return this;

		}

		copy( source ) {

			this.name = source.name;
			this.array = new source.array.constructor( source.array );
			this.itemSize = source.itemSize;
			this.count = source.count;
			this.normalized = source.normalized;

			this.usage = source.usage;

			return this;

		}

		copyAt( index1, attribute, index2 ) {

			index1 *= this.itemSize;
			index2 *= attribute.itemSize;

			for ( let i = 0, l = this.itemSize; i < l; i ++ ) {

				this.array[ index1 + i ] = attribute.array[ index2 + i ];

			}

			return this;

		}

		copyArray( array ) {

			this.array.set( array );

			return this;

		}
		copyVector2sArray( vectors ) {

			const array = this.array;
			let offset = 0;

			for ( let i = 0, l = vectors.length; i < l; i ++ ) {

				let vector = vectors[ i ];

				if ( vector === undefined ) {

					console.warn( 'THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i );
					vector = new Vector2();

				}

				array[ offset ++ ] = vector.x;
				array[ offset ++ ] = vector.y;

			}

			return this;

		}

		copyVector3sArray( vectors ) {

			const array = this.array;
			let offset = 0;

			for ( let i = 0, l = vectors.length; i < l; i ++ ) {

				let vector = vectors[ i ];

				if ( vector === undefined ) {

					console.warn( 'THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i );
					vector = new Vector3();

				}

				array[ offset ++ ] = vector.x;
				array[ offset ++ ] = vector.y;
				array[ offset ++ ] = vector.z;

			}

			return this;

		}

		copyVector4sArray( vectors ) {

			const array = this.array;
			let offset = 0;

			for ( let i = 0, l = vectors.length; i < l; i ++ ) {

				let vector = vectors[ i ];

				if ( vector === undefined ) {

					console.warn( 'THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i );
					vector = new Vector4();

				}

				array[ offset ++ ] = vector.x;
				array[ offset ++ ] = vector.y;
				array[ offset ++ ] = vector.z;
				array[ offset ++ ] = vector.w;

			}

			return this;

		}

		applyMatrix3( m ) {

			if ( this.itemSize === 2 ) {

				for ( let i = 0, l = this.count; i < l; i ++ ) {

					_vector2.fromBufferAttribute( this, i );
					_vector2.applyMatrix3( m );

					this.setXY( i, _vector2.x, _vector2.y );

				}

			} else if ( this.itemSize === 3 ) {

				for ( let i = 0, l = this.count; i < l; i ++ ) {

					_vector$1.fromBufferAttribute( this, i );
					_vector$1.applyMatrix3( m );

					this.setXYZ( i, _vector$1.x, _vector$1.y, _vector$1.z );

				}

			}

			return this;

		}

		applyMatrix4( m ) {

			for ( let i = 0, l = this.count; i < l; i ++ ) {

				_vector$1.x = this.getX( i );
				_vector$1.y = this.getY( i );
				_vector$1.z = this.getZ( i );

				_vector$1.applyMatrix4( m );

				this.setXYZ( i, _vector$1.x, _vector$1.y, _vector$1.z );

			}

			return this;

		}

		applyNormalMatrix( m ) {

			for ( let i = 0, l = this.count; i < l; i ++ ) {

				_vector$1.x = this.getX( i );
				_vector$1.y = this.getY( i );
				_vector$1.z = this.getZ( i );

				_vector$1.applyNormalMatrix( m );

				this.setXYZ( i, _vector$1.x, _vector$1.y, _vector$1.z );

			}

			return this;

		}

		transformDirection( m ) {

			for ( let i = 0, l = this.count; i < l; i ++ ) {

				_vector$1.x = this.getX( i );
				_vector$1.y = this.getY( i );
				_vector$1.z = this.getZ( i );

				_vector$1.transformDirection( m );

				this.setXYZ( i, _vector$1.x, _vector$1.y, _vector$1.z );

			}

			return this;

		}

		set( value, offset = 0 ) {

			this.array.set( value, offset );

			return this;

		}

		getX( index ) {

			return this.array[ index * this.itemSize ];

		}

		setX( index, x ) {

			this.array[ index * this.itemSize ] = x;

			return this;

		}

		getY( index ) {

			return this.array[ index * this.itemSize + 1 ];

		}

		setY( index, y ) {

			this.array[ index * this.itemSize + 1 ] = y;

			return this;

		}

		getZ( index ) {

			return this.array[ index * this.itemSize + 2 ];

		}

		setZ( index, z ) {

			this.array[ index * this.itemSize + 2 ] = z;

			return this;

		}

		getW( index ) {

			return this.array[ index * this.itemSize + 3 ];

		}

		setW( index, w ) {

			this.array[ index * this.itemSize + 3 ] = w;

			return this;

		}

		setXY( index, x, y ) {

			index *= this.itemSize;

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;

			return this;

		}

		setXYZ( index, x, y, z ) {

			index *= this.itemSize;

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;
			this.array[ index + 2 ] = z;

			return this;

		}

		setXYZW( index, x, y, z, w ) {

			index *= this.itemSize;

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;
			this.array[ index + 2 ] = z;
			this.array[ index + 3 ] = w;

			return this;

		}

		onUpload( callback ) {

			this.onUploadCallback = callback;

			return this;

		}
	}

	BufferAttribute.prototype.isBufferAttribute = true;

	class Uint16BufferAttribute extends BufferAttribute {

		constructor( array, itemSize, normalized ) {

			super( new Uint16Array( array ), itemSize, normalized );

		}

	}

	class Uint32BufferAttribute extends BufferAttribute {

		constructor( array, itemSize, normalized ) {

			super( new Uint32Array( array ), itemSize, normalized );

		}

	}

	class Float16BufferAttribute extends BufferAttribute {

		constructor( array, itemSize, normalized ) {

			super( new Uint16Array( array ), itemSize, normalized );

		}

	}

	Float16BufferAttribute.prototype.isFloat16BufferAttribute = true;

	class Float32BufferAttribute extends BufferAttribute {

		constructor( array, itemSize, normalized ) {

			super( new Float32Array( array ), itemSize, normalized );

		}

	}

	function arrayMax( array ) {

		if ( array.length === 0 ) return - Infinity;

		let max = array[ 0 ];

		for ( let i = 1, l = array.length; i < l; ++ i ) {

			if ( array[ i ] > max ) max = array[ i ];

		}

		return max;

	}

	function createElementNS( name ) {

		return document.createElementNS( 'http://www.w3.org/1999/xhtml', name );

	}

	function WebGLGeometries( gl, attributes, info, bindingStates ) {

		const geometries = {};
		const wireframeAttributes = new WeakMap();

		function onGeometryDispose( event ) {

			const geometry = event.target;

			if ( geometry.index !== null ) {

				attributes.remove( geometry.index );

			}

			for ( const name in geometry.attributes ) {

				attributes.remove( geometry.attributes[ name ] );

			}

			geometry.removeEventListener( 'dispose', onGeometryDispose );

			delete geometries[ geometry.id ];

			const attribute = wireframeAttributes.get( geometry );

			if ( attribute ) {

				attributes.remove( attribute );
				wireframeAttributes.delete( geometry );

			}

			bindingStates.releaseStatesOfGeometry( geometry );

			if ( geometry.isInstancedBufferGeometry === true ) {

				delete geometry._maxInstanceCount;

			}

			//

			info.memory.geometries --;

		}

		function get( object, geometry ) {

			if ( geometries[ geometry.id ] === true ) return geometry;

			geometry.addEventListener( 'dispose', onGeometryDispose );

			geometries[ geometry.id ] = true;

			info.memory.geometries ++;

			return geometry;

		}

		function update( geometry ) {

			const geometryAttributes = geometry.attributes;

			// Updating index buffer in VAO now. See WebGLBindingStates.

			for ( const name in geometryAttributes ) {

				attributes.update( geometryAttributes[ name ], gl.ARRAY_BUFFER );

			}

			// morph targets

			const morphAttributes = geometry.morphAttributes;

			for ( const name in morphAttributes ) {

				const array = morphAttributes[ name ];

				for ( let i = 0, l = array.length; i < l; i ++ ) {

					attributes.update( array[ i ], gl.ARRAY_BUFFER );

				}

			}

		}

		function updateWireframeAttribute( geometry ) {

			const indices = [];

			const geometryIndex = geometry.index;
			const geometryPosition = geometry.attributes.position;
			let version = 0;

			if ( geometryIndex !== null ) {

				const array = geometryIndex.array;
				version = geometryIndex.version;

				for ( let i = 0, l = array.length; i < l; i += 3 ) {

					const a = array[ i + 0 ];
					const b = array[ i + 1 ];
					const c = array[ i + 2 ];

					indices.push( a, b, b, c, c, a );

				}

			} else {

				const array = geometryPosition.array;
				version = geometryPosition.version;

				for ( let i = 0, l = ( array.length / 3 ) - 1; i < l; i += 3 ) {

					const a = i + 0;
					const b = i + 1;
					const c = i + 2;

					indices.push( a, b, b, c, c, a );

				}

			}

			const attribute = new ( arrayMax( indices ) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( indices, 1 );
			attribute.version = version;

			// Updating index buffer in VAO now. See WebGLBindingStates

			//

			const previousAttribute = wireframeAttributes.get( geometry );

			if ( previousAttribute ) attributes.remove( previousAttribute );

			//

			wireframeAttributes.set( geometry, attribute );

		}

		function getWireframeAttribute( geometry ) {

			const currentAttribute = wireframeAttributes.get( geometry );

			if ( currentAttribute ) {

				const geometryIndex = geometry.index;

				if ( geometryIndex !== null ) {

					// if the attribute is obsolete, create a new one

					if ( currentAttribute.version < geometryIndex.version ) {

						updateWireframeAttribute( geometry );

					}

				}

			} else {

				updateWireframeAttribute( geometry );

			}

			return wireframeAttributes.get( geometry );

		}

		return {

			get: get,
			update: update,

			getWireframeAttribute: getWireframeAttribute

		};

	}

	function WebGLIndexedBufferRenderer( gl, extensions, info, capabilities ) {

		const isWebGL2 = capabilities.isWebGL2;

		let mode;

		function setMode( value ) {

			mode = value;

		}

		let type, bytesPerElement;

		function setIndex( value ) {

			type = value.type;
			bytesPerElement = value.bytesPerElement;

		}

		function render( start, count ) {

			gl.drawElements( mode, count, type, start * bytesPerElement );

			info.update( count, mode, 1 );

		}

		function renderInstances( start, count, primcount ) {

			if ( primcount === 0 ) return;

			let extension, methodName;

			if ( isWebGL2 ) {

				extension = gl;
				methodName = 'drawElementsInstanced';

			} else {

				extension = extensions.get( 'ANGLE_instanced_arrays' );
				methodName = 'drawElementsInstancedANGLE';

				if ( extension === null ) {

					console.error( 'THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
					return;

				}

			}

			extension[ methodName ]( mode, count, type, start * bytesPerElement, primcount );

			info.update( count, mode, primcount );

		}

		//

		this.setMode = setMode;
		this.setIndex = setIndex;
		this.render = render;
		this.renderInstances = renderInstances;

	}

	function WebGLInfo( gl ) {

		const memory = {
			geometries: 0,
			textures: 0
		};

		const render = {
			frame: 0,
			calls: 0,
			triangles: 0,
			points: 0,
			lines: 0
		};

		function update( count, mode, instanceCount ) {

			render.calls ++;

			switch ( mode ) {

				case gl.TRIANGLES:
					render.triangles += instanceCount * ( count / 3 );
					break;

				case gl.LINES:
					render.lines += instanceCount * ( count / 2 );
					break;

				case gl.LINE_STRIP:
					render.lines += instanceCount * ( count - 1 );
					break;

				case gl.LINE_LOOP:
					render.lines += instanceCount * count;
					break;

				case gl.POINTS:
					render.points += instanceCount * count;
					break;

				default:
					console.error( 'THREE.WebGLInfo: Unknown draw mode:', mode );
					break;

			}

		}

		function reset() {

			render.frame ++;
			render.calls = 0;
			render.triangles = 0;
			render.points = 0;
			render.lines = 0;

		}

		return {
			memory: memory,
			render: render,
			programs: null,
			autoReset: true,
			reset: reset,
			update: update
		};

	}

	function WebGLObjects( gl, geometries, attributes, info ) {

		let updateMap = new WeakMap();

		function update( object ) {

			const frame = info.render.frame;

			const geometry = object.geometry;
			const buffergeometry = geometries.get( object, geometry );

			// Update once per frame

			if ( updateMap.get( buffergeometry ) !== frame ) {

				geometries.update( buffergeometry );

				updateMap.set( buffergeometry, frame );
			}

			return buffergeometry;

		}

		function dispose() {

			updateMap = new WeakMap();

		}


		return {

			update: update,
			dispose: dispose

		};

	}

	class Layers {

		constructor() {

			this.mask = 1 | 0;

		}

		set( channel ) {

			this.mask = ( 1 << channel | 0 ) >>> 0;

		}

		enable( channel ) {

			this.mask |= 1 << channel | 0;

		}

		enableAll() {

			this.mask = 0xffffffff | 0;

		}

		toggle( channel ) {

			this.mask ^= 1 << channel | 0;

		}

		disable( channel ) {

			this.mask &= ~ ( 1 << channel | 0 );

		}

		disableAll() {

			this.mask = 0;

		}

		test( layers ) {

			return ( this.mask & layers.mask ) !== 0;

		}

		isEnabled( channel ) {

			return ( this.mask & ( 1 << channel | 0 ) ) !== 0;

		}

	}

	/**
	 * Uniforms of a program.
	 * Those form a tree structure with a special top-level container for the root,
	 * which you get by calling 'new WebGLUniforms( gl, program )'.
	 *
	 *
	 * Properties of inner nodes including the top-level container:
	 *
	 * .seq - array of nested uniforms
	 * .map - nested uniforms by name
	 *
	 *
	 * Methods of all nodes except the top-level container:
	 *
	 * .setValue( gl, value, [textures] )
	 *
	 * 		uploads a uniform value(s)
	 *  	the 'textures' parameter is needed for sampler uniforms
	 *
	 *
	 * Static methods of the top-level container (textures factorizations):
	 *
	 * .upload( gl, seq, values, textures )
	 *
	 * 		sets uniforms in 'seq' to 'values[id].value'
	 *
	 * .seqWithValue( seq, values ) : filteredSeq
	 *
	 * 		filters 'seq' entries with corresponding entry in values
	 *
	 *
	 * Methods of the top-level container (textures factorizations):
	 *
	 * .setValue( gl, name, value, textures )
	 *
	 * 		sets uniform with  name 'name' to 'value'
	 *
	 * .setOptional( gl, obj, prop )
	 *
	 * 		like .set for an optional property of the object
	 *
	 */

	const emptyTexture = new Texture();

	// --- Utilities ---

	// Array Caches (provide typed arrays for temporary by size)

	const arrayCacheF32 = [];
	const arrayCacheI32 = [];

	// Float32Array caches used for uploading Matrix uniforms

	const mat4array = new Float32Array( 16 );
	const mat3array = new Float32Array( 9 );
	const mat2array = new Float32Array( 4 );

	// Flattening for arrays of vectors and matrices

	function flatten( array, nBlocks, blockSize ) {

		const firstElem = array[ 0 ];

		if ( firstElem <= 0 || firstElem > 0 ) return array;
		// unoptimized: ! isNaN( firstElem )
		// see http://jacksondunstan.com/articles/983

		const n = nBlocks * blockSize;
		let r = arrayCacheF32[ n ];

		if ( r === undefined ) {

			r = new Float32Array( n );
			arrayCacheF32[ n ] = r;

		}

		if ( nBlocks !== 0 ) {

			firstElem.toArray( r, 0 );

			for ( let i = 1, offset = 0; i !== nBlocks; ++ i ) {

				offset += blockSize;
				array[ i ].toArray( r, offset );

			}

		}

		return r;

	}

	function arraysEqual( a, b ) {

		if ( a.length !== b.length ) return false;

		for ( let i = 0, l = a.length; i < l; i ++ ) {

			if ( a[ i ] !== b[ i ] ) return false;

		}

		return true;

	}

	function copyArray( a, b ) {

		for ( let i = 0, l = b.length; i < l; i ++ ) {

			a[ i ] = b[ i ];

		}

	}

	// Texture unit allocation

	function allocTexUnits( textures, n ) {

		let r = arrayCacheI32[ n ];

		if ( r === undefined ) {

			r = new Int32Array( n );
			arrayCacheI32[ n ] = r;

		}

		for ( let i = 0; i !== n; ++ i ) {

			r[ i ] = textures.allocateTextureUnit();

		}

		return r;

	}

	// --- Setters ---

	// Note: Defining these methods externally, because they come in a bunch
	// and this way their names minify.

	// Single scalar

	function setValueV1f( gl, v ) {

		const cache = this.cache;

		if ( cache[ 0 ] === v ) return;

		gl.uniform1f( this.addr, v );

		cache[ 0 ] = v;

	}

	// Single float vector (from flat array or THREE.VectorN)

	function setValueV2f( gl, v ) {

		const cache = this.cache;

		if ( v.x !== undefined ) {

			if ( cache[ 0 ] !== v.x || cache[ 1 ] !== v.y ) {

				gl.uniform2f( this.addr, v.x, v.y );

				cache[ 0 ] = v.x;
				cache[ 1 ] = v.y;

			}

		} else {

			if ( arraysEqual( cache, v ) ) return;

			gl.uniform2fv( this.addr, v );

			copyArray( cache, v );

		}

	}

	function setValueV3f( gl, v ) {

		const cache = this.cache;

		if ( v.x !== undefined ) {

			if ( cache[ 0 ] !== v.x || cache[ 1 ] !== v.y || cache[ 2 ] !== v.z ) {

				gl.uniform3f( this.addr, v.x, v.y, v.z );

				cache[ 0 ] = v.x;
				cache[ 1 ] = v.y;
				cache[ 2 ] = v.z;

			}

		} else if ( v.r !== undefined ) {

			if ( cache[ 0 ] !== v.r || cache[ 1 ] !== v.g || cache[ 2 ] !== v.b ) {

				gl.uniform3f( this.addr, v.r, v.g, v.b );

				cache[ 0 ] = v.r;
				cache[ 1 ] = v.g;
				cache[ 2 ] = v.b;

			}

		} else {

			if ( arraysEqual( cache, v ) ) return;

			gl.uniform3fv( this.addr, v );

			copyArray( cache, v );

		}

	}

	function setValueV4f( gl, v ) {

		const cache = this.cache;

		if ( v.x !== undefined ) {

			if ( cache[ 0 ] !== v.x || cache[ 1 ] !== v.y || cache[ 2 ] !== v.z || cache[ 3 ] !== v.w ) {

				gl.uniform4f( this.addr, v.x, v.y, v.z, v.w );

				cache[ 0 ] = v.x;
				cache[ 1 ] = v.y;
				cache[ 2 ] = v.z;
				cache[ 3 ] = v.w;

			}

		} else {

			if ( arraysEqual( cache, v ) ) return;

			gl.uniform4fv( this.addr, v );

			copyArray( cache, v );

		}

	}

	// Single matrix (from flat array or THREE.MatrixN)

	function setValueM2( gl, v ) {

		const cache = this.cache;
		const elements = v.elements;

		if ( elements === undefined ) {

			if ( arraysEqual( cache, v ) ) return;

			gl.uniformMatrix2fv( this.addr, false, v );

			copyArray( cache, v );

		} else {

			if ( arraysEqual( cache, elements ) ) return;

			mat2array.set( elements );

			gl.uniformMatrix2fv( this.addr, false, mat2array );

			copyArray( cache, elements );

		}

	}

	function setValueM3( gl, v ) {

		const cache = this.cache;
		const elements = v.elements;

		if ( elements === undefined ) {

			if ( arraysEqual( cache, v ) ) return;

			gl.uniformMatrix3fv( this.addr, false, v );

			copyArray( cache, v );

		} else {

			if ( arraysEqual( cache, elements ) ) return;

			mat3array.set( elements );

			gl.uniformMatrix3fv( this.addr, false, mat3array );

			copyArray( cache, elements );

		}

	}

	function setValueM4( gl, v ) {

		const cache = this.cache;
		const elements = v.elements;

		if ( elements === undefined ) {

			if ( arraysEqual( cache, v ) ) return;

			gl.uniformMatrix4fv( this.addr, false, v );

			copyArray( cache, v );

		} else {

			if ( arraysEqual( cache, elements ) ) return;

			mat4array.set( elements );

			gl.uniformMatrix4fv( this.addr, false, mat4array );

			copyArray( cache, elements );

		}

	}

	// Single integer / boolean

	function setValueV1i( gl, v ) {

		const cache = this.cache;

		if ( cache[ 0 ] === v ) return;

		gl.uniform1i( this.addr, v );

		cache[ 0 ] = v;

	}

	// Single integer / boolean vector (from flat array)

	function setValueV2i( gl, v ) {

		const cache = this.cache;

		if ( arraysEqual( cache, v ) ) return;

		gl.uniform2iv( this.addr, v );

		copyArray( cache, v );

	}

	function setValueV3i( gl, v ) {

		const cache = this.cache;

		if ( arraysEqual( cache, v ) ) return;

		gl.uniform3iv( this.addr, v );

		copyArray( cache, v );

	}

	function setValueV4i( gl, v ) {

		const cache = this.cache;

		if ( arraysEqual( cache, v ) ) return;

		gl.uniform4iv( this.addr, v );

		copyArray( cache, v );

	}

	// Single unsigned integer

	function setValueV1ui( gl, v ) {

		const cache = this.cache;

		if ( cache[ 0 ] === v ) return;

		gl.uniform1ui( this.addr, v );

		cache[ 0 ] = v;

	}

	// Single unsigned integer vector (from flat array)

	function setValueV2ui( gl, v ) {

		const cache = this.cache;

		if ( arraysEqual( cache, v ) ) return;

		gl.uniform2uiv( this.addr, v );

		copyArray( cache, v );

	}

	function setValueV3ui( gl, v ) {

		const cache = this.cache;

		if ( arraysEqual( cache, v ) ) return;

		gl.uniform3uiv( this.addr, v );

		copyArray( cache, v );

	}

	function setValueV4ui( gl, v ) {

		const cache = this.cache;

		if ( arraysEqual( cache, v ) ) return;

		gl.uniform4uiv( this.addr, v );

		copyArray( cache, v );

	}


	// Single texture (2D / Cube)

	function setValueT1( gl, v, textures ) {

		const cache = this.cache;
		const unit = textures.allocateTextureUnit();

		if ( cache[ 0 ] !== unit ) {

			gl.uniform1i( this.addr, unit );
			cache[ 0 ] = unit;

		}

		textures.safeSetTexture2D( v || emptyTexture, unit );
	}

	// Helper to pick the right setter for the singular case

	function getSingularSetter( type ) {

		switch ( type ) {

			case 0x1406: return setValueV1f; // FLOAT
			case 0x8b50: return setValueV2f; // _VEC2
			case 0x8b51: return setValueV3f; // _VEC3
			case 0x8b52: return setValueV4f; // _VEC4

			case 0x8b5a: return setValueM2; // _MAT2
			case 0x8b5b: return setValueM3; // _MAT3
			case 0x8b5c: return setValueM4; // _MAT4

			case 0x1404: case 0x8b56: return setValueV1i; // INT, BOOL
			case 0x8b53: case 0x8b57: return setValueV2i; // _VEC2
			case 0x8b54: case 0x8b58: return setValueV3i; // _VEC3
			case 0x8b55: case 0x8b59: return setValueV4i; // _VEC4

			case 0x1405: return setValueV1ui; // UINT
			case 0x8dc6: return setValueV2ui; // _VEC2
			case 0x8dc7: return setValueV3ui; // _VEC3
			case 0x8dc8: return setValueV4ui; // _VEC4

			case 0x8b5e: // SAMPLER_2D
			case 0x8d66: // SAMPLER_EXTERNAL_OES
			case 0x8dca: // INT_SAMPLER_2D
			case 0x8dd2: // UNSIGNED_INT_SAMPLER_2D
			case 0x8b62: // SAMPLER_2D_SHADOW
				return setValueT1;
		}

	}


	// Array of scalars

	function setValueV1fArray( gl, v ) {

		gl.uniform1fv( this.addr, v );

	}

	// Array of vectors (from flat array or array of THREE.VectorN)

	function setValueV2fArray( gl, v ) {

		const data = flatten( v, this.size, 2 );

		gl.uniform2fv( this.addr, data );

	}

	function setValueV3fArray( gl, v ) {

		const data = flatten( v, this.size, 3 );

		gl.uniform3fv( this.addr, data );

	}

	function setValueV4fArray( gl, v ) {

		const data = flatten( v, this.size, 4 );

		gl.uniform4fv( this.addr, data );

	}

	// Array of matrices (from flat array or array of THREE.MatrixN)

	function setValueM2Array( gl, v ) {

		const data = flatten( v, this.size, 4 );

		gl.uniformMatrix2fv( this.addr, false, data );

	}

	function setValueM3Array( gl, v ) {

		const data = flatten( v, this.size, 9 );

		gl.uniformMatrix3fv( this.addr, false, data );

	}

	function setValueM4Array( gl, v ) {

		const data = flatten( v, this.size, 16 );

		gl.uniformMatrix4fv( this.addr, false, data );

	}

	// Array of integer / boolean

	function setValueV1iArray( gl, v ) {

		gl.uniform1iv( this.addr, v );

	}

	// Array of integer / boolean vectors (from flat array)

	function setValueV2iArray( gl, v ) {

		gl.uniform2iv( this.addr, v );

	}

	function setValueV3iArray( gl, v ) {

		gl.uniform3iv( this.addr, v );

	}

	function setValueV4iArray( gl, v ) {

		gl.uniform4iv( this.addr, v );

	}

	// Array of unsigned integer

	function setValueV1uiArray( gl, v ) {

		gl.uniform1uiv( this.addr, v );

	}

	// Array of unsigned integer vectors (from flat array)

	function setValueV2uiArray( gl, v ) {

		gl.uniform2uiv( this.addr, v );

	}

	function setValueV3uiArray( gl, v ) {

		gl.uniform3uiv( this.addr, v );

	}

	function setValueV4uiArray( gl, v ) {

		gl.uniform4uiv( this.addr, v );

	}


	// Array of textures (2D / 3D / Cube / 2DArray)

	function setValueT1Array( gl, v, textures ) {

		const n = v.length;

		const units = allocTexUnits( textures, n );

		gl.uniform1iv( this.addr, units );

		for ( let i = 0; i !== n; ++ i ) {

			textures.safeSetTexture2D( v[ i ] || emptyTexture, units[ i ] );

		}

	}

	function setValueT3DArray( gl, v, textures ) {

		const n = v.length;

		const units = allocTexUnits( textures, n );

		gl.uniform1iv( this.addr, units );

		for ( let i = 0; i !== n; ++ i ) {

			textures.setTexture3D( v[ i ] || emptyTexture3d, units[ i ] );

		}

	}

	function setValueT6Array( gl, v, textures ) {

		const n = v.length;

		const units = allocTexUnits( textures, n );

		gl.uniform1iv( this.addr, units );

		for ( let i = 0; i !== n; ++ i ) {

			textures.safeSetTextureCube( v[ i ] || emptyCubeTexture, units[ i ] );

		}

	}

	function setValueT2DArrayArray( gl, v, textures ) {

		const n = v.length;

		const units = allocTexUnits( textures, n );

		gl.uniform1iv( this.addr, units );

		for ( let i = 0; i !== n; ++ i ) {

			textures.setTexture2DArray( v[ i ] || emptyTexture2dArray, units[ i ] );

		}

	}


	// Helper to pick the right setter for a pure (bottom-level) array

	function getPureArraySetter( type ) {

		switch ( type ) {

			case 0x1406: return setValueV1fArray; // FLOAT
			case 0x8b50: return setValueV2fArray; // _VEC2
			case 0x8b51: return setValueV3fArray; // _VEC3
			case 0x8b52: return setValueV4fArray; // _VEC4

			case 0x8b5a: return setValueM2Array; // _MAT2
			case 0x8b5b: return setValueM3Array; // _MAT3
			case 0x8b5c: return setValueM4Array; // _MAT4

			case 0x1404: case 0x8b56: return setValueV1iArray; // INT, BOOL
			case 0x8b53: case 0x8b57: return setValueV2iArray; // _VEC2
			case 0x8b54: case 0x8b58: return setValueV3iArray; // _VEC3
			case 0x8b55: case 0x8b59: return setValueV4iArray; // _VEC4

			case 0x1405: return setValueV1uiArray; // UINT
			case 0x8dc6: return setValueV2uiArray; // _VEC2
			case 0x8dc7: return setValueV3uiArray; // _VEC3
			case 0x8dc8: return setValueV4uiArray; // _VEC4

			case 0x8b5e: // SAMPLER_2D
			case 0x8d66: // SAMPLER_EXTERNAL_OES
			case 0x8dca: // INT_SAMPLER_2D
			case 0x8dd2: // UNSIGNED_INT_SAMPLER_2D
			case 0x8b62: // SAMPLER_2D_SHADOW
				return setValueT1Array;

			case 0x8b5f: // SAMPLER_3D
			case 0x8dcb: // INT_SAMPLER_3D
			case 0x8dd3: // UNSIGNED_INT_SAMPLER_3D
				return setValueT3DArray;

			case 0x8b60: // SAMPLER_CUBE
			case 0x8dcc: // INT_SAMPLER_CUBE
			case 0x8dd4: // UNSIGNED_INT_SAMPLER_CUBE
			case 0x8dc5: // SAMPLER_CUBE_SHADOW
				return setValueT6Array;

			case 0x8dc1: // SAMPLER_2D_ARRAY
			case 0x8dcf: // INT_SAMPLER_2D_ARRAY
			case 0x8dd7: // UNSIGNED_INT_SAMPLER_2D_ARRAY
			case 0x8dc4: // SAMPLER_2D_ARRAY_SHADOW
				return setValueT2DArrayArray;

		}

	}

	// --- Uniform Classes ---

	function SingleUniform( id, activeInfo, addr ) {

		this.id = id;
		this.addr = addr;
		this.cache = [];
		this.setValue = getSingularSetter( activeInfo.type );

		// this.path = activeInfo.name; // DEBUG

	}

	function PureArrayUniform( id, activeInfo, addr ) {

		this.id = id;
		this.addr = addr;
		this.cache = [];
		this.size = activeInfo.size;
		this.setValue = getPureArraySetter( activeInfo.type );

		// this.path = activeInfo.name; // DEBUG

	}

	PureArrayUniform.prototype.updateCache = function ( data ) {

		const cache = this.cache;

		if ( data instanceof Float32Array && cache.length !== data.length ) {

			this.cache = new Float32Array( data.length );

		}

		copyArray( cache, data );

	};

	function StructuredUniform( id ) {

		this.id = id;

		this.seq = [];
		this.map = {};

	}

	StructuredUniform.prototype.setValue = function ( gl, value, textures ) {

		const seq = this.seq;

		for ( let i = 0, n = seq.length; i !== n; ++ i ) {

			const u = seq[ i ];
			u.setValue( gl, value[ u.id ], textures );

		}

	};

	// --- Top-level ---

	// Parser - builds up the property tree from the path strings

	const RePathPart = /(\w+)(\])?(\[|\.)?/g;

	// extracts
	// 	- the identifier (member name or array index)
	//  - followed by an optional right bracket (found when array index)
	//  - followed by an optional left bracket or dot (type of subscript)
	//
	// Note: These portions can be read in a non-overlapping fashion and
	// allow straightforward parsing of the hierarchy that WebGL encodes
	// in the uniform names.

	function addUniform( container, uniformObject ) {

		container.seq.push( uniformObject );
		container.map[ uniformObject.id ] = uniformObject;

	}

	function parseUniform( activeInfo, addr, container ) {

		const path = activeInfo.name,
			pathLength = path.length;

		// reset RegExp object, because of the early exit of a previous run
		RePathPart.lastIndex = 0;

		while ( true ) {

			const match = RePathPart.exec( path ),
				matchEnd = RePathPart.lastIndex;

			let id = match[ 1 ];
			const idIsIndex = match[ 2 ] === ']',
				subscript = match[ 3 ];

			if ( idIsIndex ) id = id | 0; // convert to integer

			if ( subscript === undefined || subscript === '[' && matchEnd + 2 === pathLength ) {

				// bare name or "pure" bottom-level array "[0]" suffix

				addUniform( container, subscript === undefined ?
					new SingleUniform( id, activeInfo, addr ) :
					new PureArrayUniform( id, activeInfo, addr ) );

				break;

			} else {

				// step into inner node / create it in case it doesn't exist

				const map = container.map;
				let next = map[ id ];

				if ( next === undefined ) {

					next = new StructuredUniform( id );
					addUniform( container, next );

				}

				container = next;

			}

		}

	}

	// Root Container

	function WebGLUniforms( gl, program ) {

		this.seq = [];
		this.map = {};

		const n = gl.getProgramParameter( program, gl.ACTIVE_UNIFORMS );

		for ( let i = 0; i < n; ++ i ) {

			const info = gl.getActiveUniform( program, i ),
				addr = gl.getUniformLocation( program, info.name );

			parseUniform( info, addr, this );

		}

	}

	WebGLUniforms.prototype.setValue = function ( gl, name, value, textures ) {

		const u = this.map[ name ];

		if ( u !== undefined ) u.setValue( gl, value, textures );

	};

	WebGLUniforms.prototype.setOptional = function ( gl, object, name ) {

		const v = object[ name ];

		if ( v !== undefined ) this.setValue( gl, name, v );

	};


	// Static interface

	WebGLUniforms.upload = function ( gl, seq, values, textures ) {

		for ( let i = 0, n = seq.length; i !== n; ++ i ) {

			const u = seq[ i ],
				v = values[ u.id ];

			if ( v.needsUpdate !== false ) {

				// note: always updating when .needsUpdate is undefined
				u.setValue( gl, v.value, textures );

			}

		}

	};

	WebGLUniforms.seqWithValue = function ( seq, values ) {

		const r = [];

		for ( let i = 0, n = seq.length; i !== n; ++ i ) {

			const u = seq[ i ];
			if ( u.id in values ) r.push( u );

		}

		return r;

	};

	function WebGLShader( gl, type, string ) {

		const shader = gl.createShader( type );

		gl.shaderSource( shader, string );
		gl.compileShader( shader );

		return shader;

	}

	let programIdCount = 0;

	function addLineNumbers( string ) {

		const lines = string.split( '\n' );

		for ( let i = 0; i < lines.length; i ++ ) {

			lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];

		}

		return lines.join( '\n' );

	}

	function getShaderErrors( gl, shader, type ) {

		const status = gl.getShaderParameter( shader, gl.COMPILE_STATUS );
		const errors = gl.getShaderInfoLog( shader ).trim();

		if ( status && errors === '' ) return '';

		// --enable-privileged-webgl-extension
		// console.log( '**' + type + '**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

		return type.toUpperCase() + '\n\n' + errors + '\n\n' + addLineNumbers( gl.getShaderSource( shader ) );

	}

	function generateExtensions( parameters ) {

		const chunks = [
			( parameters.extensionDerivatives || parameters.envMapCubeUV || parameters.bumpMap || parameters.tangentSpaceNormalMap || parameters.clearcoatNormalMap || parameters.flatShading || parameters.shaderID === 'physical' ) ? '#extension GL_OES_standard_derivatives : enable' : '',
			( parameters.extensionFragDepth || parameters.logarithmicDepthBuffer ) && parameters.rendererExtensionFragDepth ? '#extension GL_EXT_frag_depth : enable' : '',
			( parameters.extensionDrawBuffers && parameters.rendererExtensionDrawBuffers ) ? '#extension GL_EXT_draw_buffers : require' : '',
			( parameters.extensionShaderTextureLOD || parameters.envMap || parameters.transmission ) && parameters.rendererExtensionShaderTextureLod ? '#extension GL_EXT_shader_texture_lod : enable' : ''
		];

		return chunks.filter( filterEmptyLine ).join( '\n' );

	}

	function generateDefines( defines ) {

		const chunks = [];

		for ( const name in defines ) {

			const value = defines[ name ];

			if ( value === false ) continue;

			chunks.push( '#define ' + name + ' ' + value );

		}

		return chunks.join( '\n' );

	}

	function fetchAttributeLocations( gl, program ) {

		const attributes = {};

		const n = gl.getProgramParameter( program, gl.ACTIVE_ATTRIBUTES );

		for ( let i = 0; i < n; i ++ ) {

			const info = gl.getActiveAttrib( program, i );
			const name = info.name;

			let locationSize = 1;
			if ( info.type === gl.FLOAT_MAT2 ) locationSize = 2;
			if ( info.type === gl.FLOAT_MAT3 ) locationSize = 3;
			if ( info.type === gl.FLOAT_MAT4 ) locationSize = 4;

			// console.log( 'THREE.WebGLProgram: ACTIVE VERTEX ATTRIBUTE:', name, i );

			attributes[ name ] = {
				type: info.type,
				location: gl.getAttribLocation( program, name ),
				locationSize: locationSize
			};

		}

		return attributes;

	}

	function filterEmptyLine( string ) {

		return string !== '';

	}
	// Resolve Includes

	function WebGLProgram( renderer, cacheKey, parameters, bindingStates ) {

		// TODO Send this event to Three.js DevTools
		// console.log( 'WebGLProgram', cacheKey );

		const gl = renderer.getContext();

		const defines = parameters.defines;

		let vertexShader = parameters.vertexShader;
		let fragmentShader = parameters.fragmentShader;

		const customExtensions = parameters.isWebGL2 ? '' : generateExtensions( parameters );

		const customDefines = generateDefines( defines );

		const program = gl.createProgram();

		let prefixVertex, prefixFragment;
		let versionString = parameters.glslVersion ? '#version ' + parameters.glslVersion + '\n' : '';

		if ( parameters.isRawShaderMaterial ) {

			prefixVertex = [

				customDefines

			].filter( filterEmptyLine ).join( '\n' );

			if ( prefixVertex.length > 0 ) {

				prefixVertex += '\n';

			}

			prefixFragment = [

				customExtensions,
				customDefines

			].filter( filterEmptyLine ).join( '\n' );

			if ( prefixFragment.length > 0 ) {

				prefixFragment += '\n';

			}

		}


		const vertexGlsl = versionString + prefixVertex + vertexShader;
		const fragmentGlsl = versionString + prefixFragment + fragmentShader;

		// console.log( '*VERTEX*', vertexGlsl );
		// console.log( '*FRAGMENT*', fragmentGlsl );

		const glVertexShader = WebGLShader( gl, gl.VERTEX_SHADER, vertexGlsl );
		const glFragmentShader = WebGLShader( gl, gl.FRAGMENT_SHADER, fragmentGlsl );

		gl.attachShader( program, glVertexShader );
		gl.attachShader( program, glFragmentShader );

		// Force a particular attribute to index 0.

		if ( parameters.index0AttributeName !== undefined ) {

			gl.bindAttribLocation( program, 0, parameters.index0AttributeName );

		} else if ( parameters.morphTargets === true ) {

			// programs with morphTargets displace position out of attribute 0
			gl.bindAttribLocation( program, 0, 'position' );

		}

		gl.linkProgram( program );

		// check for link errors
		if ( renderer.debug.checkShaderErrors ) {

			const programLog = gl.getProgramInfoLog( program ).trim();
			const vertexLog = gl.getShaderInfoLog( glVertexShader ).trim();
			const fragmentLog = gl.getShaderInfoLog( glFragmentShader ).trim();

			let runnable = true;
			let haveDiagnostics = true;

			if ( gl.getProgramParameter( program, gl.LINK_STATUS ) === false ) {

				runnable = false;

				const vertexErrors = getShaderErrors( gl, glVertexShader, 'vertex' );
				const fragmentErrors = getShaderErrors( gl, glFragmentShader, 'fragment' );

				console.error(
					'THREE.WebGLProgram: Shader Error ' + gl.getError() + ' - ' +
					'VALIDATE_STATUS ' + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) + '\n\n' +
					'Program Info Log: ' + programLog + '\n' +
					vertexErrors + '\n' +
					fragmentErrors
				);

			} else if ( programLog !== '' ) {

				console.warn( 'THREE.WebGLProgram: Program Info Log:', programLog );

			} else if ( vertexLog === '' || fragmentLog === '' ) {

				haveDiagnostics = false;

			}

			if ( haveDiagnostics ) {

				this.diagnostics = {

					runnable: runnable,

					programLog: programLog,

					vertexShader: {

						log: vertexLog,
						prefix: prefixVertex

					},

					fragmentShader: {

						log: fragmentLog,
						prefix: prefixFragment

					}

				};

			}

		}

		// Clean up

		// Crashes in iOS9 and iOS10. #18402
		// gl.detachShader( program, glVertexShader );
		// gl.detachShader( program, glFragmentShader );

		gl.deleteShader( glVertexShader );
		gl.deleteShader( glFragmentShader );

		// set up caching for uniform locations

		let cachedUniforms;

		this.getUniforms = function () {

			if ( cachedUniforms === undefined ) {

				cachedUniforms = new WebGLUniforms( gl, program );

			}

			return cachedUniforms;

		};

		// set up caching for attribute locations

		let cachedAttributes;

		this.getAttributes = function () {

			if ( cachedAttributes === undefined ) {

				cachedAttributes = fetchAttributeLocations( gl, program );

			}

			return cachedAttributes;

		};

		// free resource

		this.destroy = function () {

			bindingStates.releaseStatesOfProgram( this );

			gl.deleteProgram( program );
			this.program = undefined;

		};

		//

		this.name = parameters.shaderName;
		this.id = programIdCount ++;
		this.cacheKey = cacheKey;
		this.usedTimes = 1;
		this.program = program;
		this.vertexShader = glVertexShader;
		this.fragmentShader = glFragmentShader;

		return this;

	}

	let _id$1 = 0;

	class WebGLShaderCache {

		constructor() {

			this.shaderCache = new Map();
			this.materialCache = new Map();

		}

		update( material ) {

			const vertexShader = material.vertexShader;
			const fragmentShader = material.fragmentShader;

			const vertexShaderStage = this._getShaderStage( vertexShader );
			const fragmentShaderStage = this._getShaderStage( fragmentShader );

			const materialShaders = this._getShaderCacheForMaterial( material );

			if ( materialShaders.has( vertexShaderStage ) === false ) {

				materialShaders.add( vertexShaderStage );
				vertexShaderStage.usedTimes ++;

			}

			if ( materialShaders.has( fragmentShaderStage ) === false ) {

				materialShaders.add( fragmentShaderStage );
				fragmentShaderStage.usedTimes ++;

			}

			return this;

		}

		remove( material ) {

			const materialShaders = this.materialCache.get( material );

			for ( const shaderStage of materialShaders ) {

				shaderStage.usedTimes --;

				if ( shaderStage.usedTimes === 0 ) this.shaderCache.delete( shaderStage );

			}

			this.materialCache.delete( material );

			return this;

		}

		getVertexShaderID( material ) {

			return this._getShaderStage( material.vertexShader ).id;

		}

		getFragmentShaderID( material ) {

			return this._getShaderStage( material.fragmentShader ).id;

		}

		dispose() {

			this.shaderCache.clear();
			this.materialCache.clear();

		}

		_getShaderCacheForMaterial( material ) {

			const cache = this.materialCache;

			if ( cache.has( material ) === false ) {

				cache.set( material, new Set() );

			}

			return cache.get( material );

		}

		_getShaderStage( code ) {

			const cache = this.shaderCache;

			if ( cache.has( code ) === false ) {

				const stage = new WebGLShaderStage();
				cache.set( code, stage );

			}

			return cache.get( code );

		}

	}

	class WebGLShaderStage {

		constructor() {

			this.id = _id$1 ++;

			this.usedTimes = 0;

		}

	}

	function WebGLPrograms( renderer, cubemaps, cubeuvmaps, extensions, capabilities, bindingStates, clipping ) {

		const _customShaders = new WebGLShaderCache();
		const programs = [];

		const isWebGL2 = capabilities.isWebGL2;
		capabilities.floatVertexTextures;
		capabilities.maxVertexUniforms;
		let precision = capabilities.precision;

		function getParameters( material, lights, shadows, scene, object ) {

			// heuristics to create shader parameters according to lights in the scene
			// (not to blow over maxLights budget)

			if ( material.precision !== null ) {

				precision = capabilities.getMaxPrecision( material.precision );

				if ( precision !== material.precision ) {

					console.warn( 'THREE.WebGLProgram.getParameters:', material.precision, 'not supported, using', precision, 'instead.' );

				}

			}

			let vertexShader, fragmentShader;
			let customVertexShaderID, customFragmentShaderID;

				vertexShader = material.vertexShader;
				fragmentShader = material.fragmentShader;

				_customShaders.update( material );

				customVertexShaderID = _customShaders.getVertexShaderID( material );
				customFragmentShaderID = _customShaders.getFragmentShaderID( material );

			
			const parameters = {

				isWebGL2: isWebGL2,

				shaderName: material.type,

				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
				defines: material.defines,

				customVertexShaderID: customVertexShaderID,
				customFragmentShaderID: customFragmentShaderID,

				isRawShaderMaterial: material.isRawShaderMaterial === true,
				glslVersion: material.glslVersion,

				precision: precision,

				vertexColors: material.vertexColors,

				index0AttributeName: material.index0AttributeName,

			};

			return parameters;

		}

		function getProgramCacheKey( parameters ) {

			const array = [];

			if ( parameters.shaderID ) {

				array.push( parameters.shaderID );

			} else {

				array.push( parameters.customVertexShaderID );
				array.push( parameters.customFragmentShaderID );

			}

			if ( parameters.defines !== undefined ) {

				for ( const name in parameters.defines ) {

					array.push( name );
					array.push( parameters.defines[ name ] );

				}

			}

			array.push( parameters.customProgramCacheKey );

			return array.join();

		}

		function getUniforms( material ) {
			return material.uniforms;
		}

		function acquireProgram( parameters, cacheKey ) {

			let program;

			// Check if code has been already compiled
			for ( let p = 0, pl = programs.length; p < pl; p ++ ) {

				const preexistingProgram = programs[ p ];

				if ( preexistingProgram.cacheKey === cacheKey ) {

					program = preexistingProgram;
					++ program.usedTimes;

					break;

				}

			}

			if ( program === undefined ) {

				program = new WebGLProgram( renderer, cacheKey, parameters, bindingStates );
				programs.push( program );

			}

			return program;

		}

		function releaseProgram( program ) {

			if ( -- program.usedTimes === 0 ) {

				// Remove from unordered set
				const i = programs.indexOf( program );
				programs[ i ] = programs[ programs.length - 1 ];
				programs.pop();

				// Free WebGL resources
				program.destroy();

			}

		}

		function releaseShaderCache( material ) {

			_customShaders.remove( material );

		}

		function dispose() {

			_customShaders.dispose();

		}

		return {
			getParameters: getParameters,
			getProgramCacheKey: getProgramCacheKey,
			getUniforms: getUniforms,
			acquireProgram: acquireProgram,
			releaseProgram: releaseProgram,
			releaseShaderCache: releaseShaderCache,
			// Exposed for resource monitoring & error feedback via renderer.info:
			programs: programs,
			dispose: dispose
		};

	}

	function WebGLProperties() {

		let properties = new WeakMap();

		function get( object ) {

			let map = properties.get( object );

			if ( map === undefined ) {

				map = {};
				properties.set( object, map );

			}

			return map;

		}

		function remove( object ) {

			properties.delete( object );

		}

		function update( object, key, value ) {

			properties.get( object )[ key ] = value;

		}

		function dispose() {

			properties = new WeakMap();

		}

		return {
			get: get,
			remove: remove,
			update: update,
			dispose: dispose
		};

	}

	function painterSortStable( a, b ) {

		if ( a.groupOrder !== b.groupOrder ) {

			return a.groupOrder - b.groupOrder;

		} else if ( a.renderOrder !== b.renderOrder ) {

			return a.renderOrder - b.renderOrder;

		} else if ( a.material.id !== b.material.id ) {

			return a.material.id - b.material.id;

		} else if ( a.z !== b.z ) {

			return a.z - b.z;

		} else {

			return a.id - b.id;

		}

	}

	function reversePainterSortStable( a, b ) {

		if ( a.groupOrder !== b.groupOrder ) {

			return a.groupOrder - b.groupOrder;

		} else if ( a.renderOrder !== b.renderOrder ) {

			return a.renderOrder - b.renderOrder;

		} else if ( a.z !== b.z ) {

			return b.z - a.z;

		} else {

			return a.id - b.id;

		}

	}


	function WebGLRenderList() {

		const renderItems = [];
		let renderItemsIndex = 0;

		const opaque = [];
		const transmissive = [];
		const transparent = [];

		function init() {

			renderItemsIndex = 0;

			opaque.length = 0;
			transmissive.length = 0;
			transparent.length = 0;

		}

		function getNextRenderItem( object, geometry, material, groupOrder, z, group ) {

			let renderItem = renderItems[ renderItemsIndex ];

			if ( renderItem === undefined ) {

				renderItem = {
					id: object.id,
					object: object,
					geometry: geometry,
					material: material,
					groupOrder: groupOrder,
					renderOrder: object.renderOrder,
					z: z,
					group: group
				};

				renderItems[ renderItemsIndex ] = renderItem;

			} else {

				renderItem.id = object.id;
				renderItem.object = object;
				renderItem.geometry = geometry;
				renderItem.material = material;
				renderItem.groupOrder = groupOrder;
				renderItem.renderOrder = object.renderOrder;
				renderItem.z = z;
				renderItem.group = group;

			}

			renderItemsIndex ++;

			return renderItem;

		}

		function push( object, geometry, material, groupOrder, z, group ) {

			const renderItem = getNextRenderItem( object, geometry, material, groupOrder, z, group );

			if ( material.transmission > 0.0 ) {

				transmissive.push( renderItem );

			} else if ( material.transparent === true ) {

				transparent.push( renderItem );

			} else {

				opaque.push( renderItem );

			}

		}

		function unshift( object, geometry, material, groupOrder, z, group ) {

			const renderItem = getNextRenderItem( object, geometry, material, groupOrder, z, group );

			if ( material.transmission > 0.0 ) {

				transmissive.unshift( renderItem );

			} else if ( material.transparent === true ) {

				transparent.unshift( renderItem );

			} else {

				opaque.unshift( renderItem );

			}

		}

		function sort( customOpaqueSort, customTransparentSort ) {

			if ( opaque.length > 1 ) opaque.sort( customOpaqueSort || painterSortStable );
			if ( transmissive.length > 1 ) transmissive.sort( customTransparentSort || reversePainterSortStable );
			if ( transparent.length > 1 ) transparent.sort( customTransparentSort || reversePainterSortStable );

		}

		function finish() {

			// Clear references from inactive renderItems in the list

			for ( let i = renderItemsIndex, il = renderItems.length; i < il; i ++ ) {

				const renderItem = renderItems[ i ];

				if ( renderItem.id === null ) break;

				renderItem.id = null;
				renderItem.object = null;
				renderItem.geometry = null;
				renderItem.material = null;
				renderItem.group = null;

			}

		}

		return {

			opaque: opaque,
			transmissive: transmissive,
			transparent: transparent,

			init: init,
			push: push,
			unshift: unshift,
			finish: finish,

			sort: sort
		};

	}

	function WebGLRenderLists() {

		let lists = new WeakMap();

		function get( scene, renderCallDepth ) {

			let list;

			if ( lists.has( scene ) === false ) {

				list = new WebGLRenderList();
				lists.set( scene, [ list ] );

			} else {

				if ( renderCallDepth >= lists.get( scene ).length ) {

					list = new WebGLRenderList();
					lists.get( scene ).push( list );

				} else {

					list = lists.get( scene )[ renderCallDepth ];

				}

			}

			return list;

		}

		function dispose() {

			lists = new WeakMap();

		}

		return {
			get: get,
			dispose: dispose
		};

	}

	function WebGLLights( extensions, capabilities ) {
		const state = {
			ambient: [ 0, 0, 0 ],
			probe: [],
			directional: [],
			directionalShadow: [],
			directionalShadowMap: [],
			directionalShadowMatrix: [],
			spot: [],
			spotShadow: [],
			spotShadowMap: [],
			spotShadowMatrix: [],
			rectArea: [],
			point: [],
			pointShadow: [],
			pointShadowMap: [],
			pointShadowMatrix: [],
			hemi: []
		};

		for ( let i = 0; i < 9; i ++ ) state.probe.push( new Vector3() );

		function setup( lights, physicallyCorrectLights ) {
		}

		function setupView( lights, camera ) {
		}

		return {
			setup: setup,
			setupView: setupView,
			state: state
		};

	}

	function WebGLRenderState( extensions, capabilities ) {

		const lights = new WebGLLights( extensions, capabilities );

		const lightsArray = [];
		const shadowsArray = [];

		function init() {

			lightsArray.length = 0;
			shadowsArray.length = 0;

		}

		function pushLight( light ) {

			lightsArray.push( light );

		}

		function pushShadow( shadowLight ) {

			shadowsArray.push( shadowLight );

		}

		function setupLights( physicallyCorrectLights ) {

			lights.setup( lightsArray, physicallyCorrectLights );

		}

		function setupLightsView( camera ) {

			lights.setupView( lightsArray, camera );

		}

		const state = {
			lightsArray: lightsArray,
			shadowsArray: shadowsArray,

			lights: lights
		};

		return {
			init: init,
			state: state,
			setupLights: setupLights,
			setupLightsView: setupLightsView,

			pushLight: pushLight,
			pushShadow: pushShadow
		};

	}

	function WebGLRenderStates( extensions, capabilities ) {

		let renderStates = new WeakMap();

		function get( scene, renderCallDepth = 0 ) {

			let renderState;

			if ( renderStates.has( scene ) === false ) {

				renderState = new WebGLRenderState( extensions, capabilities );
				renderStates.set( scene, [ renderState ] );

			} else {

				if ( renderCallDepth >= renderStates.get( scene ).length ) {

					renderState = new WebGLRenderState( extensions, capabilities );
					renderStates.get( scene ).push( renderState );

				} else {

					renderState = renderStates.get( scene )[ renderCallDepth ];

				}

			}

			return renderState;

		}

		function dispose() {

			renderStates = new WeakMap();

		}

		return {
			get: get,
			dispose: dispose
		};

	}

	function WebGLState( gl, extensions, capabilities ) {

		const isWebGL2 = capabilities.isWebGL2;

		function ColorBuffer() {

			let locked = false;

			const color = new Vector4();
			let currentColorMask = null;
			const currentColorClear = new Vector4( 0, 0, 0, 0 );

			return {

				setMask: function ( colorMask ) {

					if ( currentColorMask !== colorMask && ! locked ) {

						gl.colorMask( colorMask, colorMask, colorMask, colorMask );
						currentColorMask = colorMask;

					}

				},

				setLocked: function ( lock ) {

					locked = lock;

				},

				setClear: function ( r, g, b, a, premultipliedAlpha ) {

					if ( premultipliedAlpha === true ) {

						r *= a; g *= a; b *= a;

					}

					color.set( r, g, b, a );

					if ( currentColorClear.equals( color ) === false ) {

						gl.clearColor( r, g, b, a );
						currentColorClear.copy( color );

					}

				},

				reset: function () {

					locked = false;

					currentColorMask = null;
					currentColorClear.set( - 1, 0, 0, 0 ); // set to invalid state

				}

			};

		}

		function DepthBuffer() {

			let locked = false;

			let currentDepthMask = null;
			let currentDepthFunc = null;
			let currentDepthClear = null;

			return {

				setTest: function ( depthTest ) {

					if ( depthTest ) {

						enable( gl.DEPTH_TEST );

					} else {

						disable( gl.DEPTH_TEST );

					}

				},

				setMask: function ( depthMask ) {

					if ( currentDepthMask !== depthMask && ! locked ) {

						gl.depthMask( depthMask );
						currentDepthMask = depthMask;

					}

				},

				setFunc: function ( depthFunc ) {

					if ( currentDepthFunc !== depthFunc ) {

						if ( depthFunc ) {

							switch ( depthFunc ) {

								case NeverDepth:

									gl.depthFunc( gl.NEVER );
									break;

								case AlwaysDepth:

									gl.depthFunc( gl.ALWAYS );
									break;

								case LessDepth:

									gl.depthFunc( gl.LESS );
									break;

								case LessEqualDepth:

									gl.depthFunc( gl.LEQUAL );
									break;

								case EqualDepth:

									gl.depthFunc( gl.EQUAL );
									break;

								case GreaterEqualDepth:

									gl.depthFunc( gl.GEQUAL );
									break;

								case GreaterDepth:

									gl.depthFunc( gl.GREATER );
									break;

								case NotEqualDepth:

									gl.depthFunc( gl.NOTEQUAL );
									break;

								default:

									gl.depthFunc( gl.LEQUAL );

							}

						} else {

							gl.depthFunc( gl.LEQUAL );

						}

						currentDepthFunc = depthFunc;

					}

				},

				setLocked: function ( lock ) {

					locked = lock;

				},

				setClear: function ( depth ) {

					if ( currentDepthClear !== depth ) {

						gl.clearDepth( depth );
						currentDepthClear = depth;

					}

				},

				reset: function () {

					locked = false;

					currentDepthMask = null;
					currentDepthFunc = null;
					currentDepthClear = null;

				}

			};

		}

		const colorBuffer = new ColorBuffer();
		const depthBuffer = new DepthBuffer();

		let enabledCapabilities = {};

		let currentBoundFramebuffers = {};
		let currentDrawbuffers = new WeakMap();
		let defaultDrawbuffers = [];

		let currentProgram = null;

		let currentBlendingEnabled = false;
		let currentBlending = null;
		let currentBlendEquation = null;
		let currentBlendSrc = null;
		let currentBlendDst = null;
		let currentBlendEquationAlpha = null;
		let currentBlendSrcAlpha = null;
		let currentBlendDstAlpha = null;
		let currentPremultipledAlpha = false;

		let currentFlipSided = null;
		let currentCullFace = null;

		let currentLineWidth = null;

		let currentPolygonOffsetFactor = null;
		let currentPolygonOffsetUnits = null;

		const maxTextures = gl.getParameter( gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS );

		let lineWidthAvailable = false;
		let version = 0;
		const glVersion = gl.getParameter( gl.VERSION );

		if ( glVersion.indexOf( 'WebGL' ) !== - 1 ) {

			version = parseFloat( /^WebGL (\d)/.exec( glVersion )[ 1 ] );
			lineWidthAvailable = ( version >= 1.0 );

		} else if ( glVersion.indexOf( 'OpenGL ES' ) !== - 1 ) {

			version = parseFloat( /^OpenGL ES (\d)/.exec( glVersion )[ 1 ] );
			lineWidthAvailable = ( version >= 2.0 );

		}

		let currentTextureSlot = null;
		let currentBoundTextures = {};

		const scissorParam = gl.getParameter( gl.SCISSOR_BOX );
		const viewportParam = gl.getParameter( gl.VIEWPORT );

		const currentScissor = new Vector4().fromArray( scissorParam );
		const currentViewport = new Vector4().fromArray( viewportParam );

		function createTexture( type, target, count ) {

			const data = new Uint8Array( 4 ); // 4 is required to match default unpack alignment of 4.
			const texture = gl.createTexture();

			gl.bindTexture( type, texture );
			gl.texParameteri( type, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
			gl.texParameteri( type, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

			for ( let i = 0; i < count; i ++ ) {

				gl.texImage2D( target + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data );

			}

			return texture;

		}

		const emptyTextures = {};
		emptyTextures[ gl.TEXTURE_2D ] = createTexture( gl.TEXTURE_2D, gl.TEXTURE_2D, 1 );
		emptyTextures[ gl.TEXTURE_CUBE_MAP ] = createTexture( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6 );

		// init

		colorBuffer.setClear( 0, 0, 0, 1 );
		depthBuffer.setClear( 1 );

		enable( gl.DEPTH_TEST );
		depthBuffer.setFunc( LessEqualDepth );

		setFlipSided( false );
		setCullFace( CullFaceBack );
		enable( gl.CULL_FACE );

		setBlending( NoBlending );

		//

		function enable( id ) {

			if ( enabledCapabilities[ id ] !== true ) {

				gl.enable( id );
				enabledCapabilities[ id ] = true;

			}

		}

		function disable( id ) {

			if ( enabledCapabilities[ id ] !== false ) {

				gl.disable( id );
				enabledCapabilities[ id ] = false;

			}

		}

		function bindFramebuffer( target, framebuffer ) {

			if ( currentBoundFramebuffers[ target ] !== framebuffer ) {

				gl.bindFramebuffer( target, framebuffer );

				currentBoundFramebuffers[ target ] = framebuffer;

				if ( isWebGL2 ) {

					// gl.DRAW_FRAMEBUFFER is equivalent to gl.FRAMEBUFFER

					if ( target === gl.DRAW_FRAMEBUFFER ) {

						currentBoundFramebuffers[ gl.FRAMEBUFFER ] = framebuffer;

					}

					if ( target === gl.FRAMEBUFFER ) {

						currentBoundFramebuffers[ gl.DRAW_FRAMEBUFFER ] = framebuffer;

					}

				}

				return true;

			}

			return false;

		}

		function drawBuffers( renderTarget, framebuffer ) {

			let drawBuffers = defaultDrawbuffers;

			let needsUpdate = false;

			if ( renderTarget ) {

				drawBuffers = currentDrawbuffers.get( framebuffer );

				if ( drawBuffers === undefined ) {

					drawBuffers = [];
					currentDrawbuffers.set( framebuffer, drawBuffers );

				}

				if ( renderTarget.isWebGLMultipleRenderTargets ) {

					const textures = renderTarget.texture;

					if ( drawBuffers.length !== textures.length || drawBuffers[ 0 ] !== gl.COLOR_ATTACHMENT0 ) {

						for ( let i = 0, il = textures.length; i < il; i ++ ) {

							drawBuffers[ i ] = gl.COLOR_ATTACHMENT0 + i;

						}

						drawBuffers.length = textures.length;

						needsUpdate = true;

					}

				} else {

					if ( drawBuffers[ 0 ] !== gl.COLOR_ATTACHMENT0 ) {

						drawBuffers[ 0 ] = gl.COLOR_ATTACHMENT0;

						needsUpdate = true;

					}

				}

			} else {

				if ( drawBuffers[ 0 ] !== gl.BACK ) {

					drawBuffers[ 0 ] = gl.BACK;

					needsUpdate = true;

				}

			}

			if ( needsUpdate ) {

				if ( capabilities.isWebGL2 ) {

					gl.drawBuffers( drawBuffers );

				} else {

					extensions.get( 'WEBGL_draw_buffers' ).drawBuffersWEBGL( drawBuffers );

				}

			}


		}

		function useProgram( program ) {

			if ( currentProgram !== program ) {

				gl.useProgram( program );

				currentProgram = program;

				return true;

			}

			return false;

		}

		const equationToGL = {
			[ AddEquation ]: gl.FUNC_ADD,
			[ SubtractEquation ]: gl.FUNC_SUBTRACT,
			[ ReverseSubtractEquation ]: gl.FUNC_REVERSE_SUBTRACT
		};

		if ( isWebGL2 ) {

			equationToGL[ MinEquation ] = gl.MIN;
			equationToGL[ MaxEquation ] = gl.MAX;

		} else {

			const extension = extensions.get( 'EXT_blend_minmax' );

			if ( extension !== null ) {

				equationToGL[ MinEquation ] = extension.MIN_EXT;
				equationToGL[ MaxEquation ] = extension.MAX_EXT;

			}

		}

		const factorToGL = {
			[ ZeroFactor ]: gl.ZERO,
			[ OneFactor ]: gl.ONE,
			[ SrcColorFactor ]: gl.SRC_COLOR,
			[ SrcAlphaFactor ]: gl.SRC_ALPHA,
			[ SrcAlphaSaturateFactor ]: gl.SRC_ALPHA_SATURATE,
			[ DstColorFactor ]: gl.DST_COLOR,
			[ DstAlphaFactor ]: gl.DST_ALPHA,
			[ OneMinusSrcColorFactor ]: gl.ONE_MINUS_SRC_COLOR,
			[ OneMinusSrcAlphaFactor ]: gl.ONE_MINUS_SRC_ALPHA,
			[ OneMinusDstColorFactor ]: gl.ONE_MINUS_DST_COLOR,
			[ OneMinusDstAlphaFactor ]: gl.ONE_MINUS_DST_ALPHA
		};

		function setBlending( blending, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha ) {

			if ( blending === NoBlending ) {

				if ( currentBlendingEnabled === true ) {

					disable( gl.BLEND );
					currentBlendingEnabled = false;

				}

				return;

			}

			if ( currentBlendingEnabled === false ) {

				enable( gl.BLEND );
				currentBlendingEnabled = true;

			}

			if ( blending !== CustomBlending ) {

				if ( blending !== currentBlending || premultipliedAlpha !== currentPremultipledAlpha ) {

					if ( currentBlendEquation !== AddEquation || currentBlendEquationAlpha !== AddEquation ) {

						gl.blendEquation( gl.FUNC_ADD );

						currentBlendEquation = AddEquation;
						currentBlendEquationAlpha = AddEquation;

					}

					if ( premultipliedAlpha ) {

						switch ( blending ) {

							case NormalBlending:
								gl.blendFuncSeparate( gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
								break;

							// case AdditiveBlending:
							// 	gl.blendFunc( gl.ONE, gl.ONE );
							// 	break;

							// case SubtractiveBlending:
							// 	gl.blendFuncSeparate( gl.ZERO, gl.ONE_MINUS_SRC_COLOR, gl.ZERO, gl.ONE );
							// 	break;

							// case MultiplyBlending:
							// 	gl.blendFuncSeparate( gl.ZERO, gl.SRC_COLOR, gl.ZERO, gl.SRC_ALPHA );
							// 	break;

							default:
								console.error( 'THREE.WebGLState: Invalid blending: ', blending );
								break;

						}

					} else {

						switch ( blending ) {

							case NormalBlending:
								gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
								break;

							// case AdditiveBlending:
							// 	gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
							// 	break;

							// case SubtractiveBlending:
							// 	gl.blendFuncSeparate( gl.ZERO, gl.ONE_MINUS_SRC_COLOR, gl.ZERO, gl.ONE );
							// 	break;

							// case MultiplyBlending:
							// 	gl.blendFunc( gl.ZERO, gl.SRC_COLOR );
							// 	break;

							default:
								console.error( 'THREE.WebGLState: Invalid blending: ', blending );
								break;

						}

					}

					currentBlendSrc = null;
					currentBlendDst = null;
					currentBlendSrcAlpha = null;
					currentBlendDstAlpha = null;

					currentBlending = blending;
					currentPremultipledAlpha = premultipliedAlpha;

				}

				return;

			}

			// custom blending

			blendEquationAlpha = blendEquationAlpha || blendEquation;
			blendSrcAlpha = blendSrcAlpha || blendSrc;
			blendDstAlpha = blendDstAlpha || blendDst;

			if ( blendEquation !== currentBlendEquation || blendEquationAlpha !== currentBlendEquationAlpha ) {

				gl.blendEquationSeparate( equationToGL[ blendEquation ], equationToGL[ blendEquationAlpha ] );

				currentBlendEquation = blendEquation;
				currentBlendEquationAlpha = blendEquationAlpha;

			}

			if ( blendSrc !== currentBlendSrc || blendDst !== currentBlendDst || blendSrcAlpha !== currentBlendSrcAlpha || blendDstAlpha !== currentBlendDstAlpha ) {

				gl.blendFuncSeparate( factorToGL[ blendSrc ], factorToGL[ blendDst ], factorToGL[ blendSrcAlpha ], factorToGL[ blendDstAlpha ] );

				currentBlendSrc = blendSrc;
				currentBlendDst = blendDst;
				currentBlendSrcAlpha = blendSrcAlpha;
				currentBlendDstAlpha = blendDstAlpha;

			}

			currentBlending = blending;
			currentPremultipledAlpha = null;

		}

		function setMaterial( material, frontFaceCW ) {

			material.side === DoubleSide
				? disable( gl.CULL_FACE )
				: enable( gl.CULL_FACE );

			let flipSided = ( material.side === BackSide );
			if ( frontFaceCW ) flipSided = ! flipSided;

			setFlipSided( flipSided );

			( material.blending === NormalBlending && material.transparent === false )
				? setBlending( NoBlending )
				: setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha );

			depthBuffer.setFunc( material.depthFunc );
			depthBuffer.setTest( material.depthTest );
			depthBuffer.setMask( material.depthWrite );
			colorBuffer.setMask( material.colorWrite );

			setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

			material.alphaToCoverage === true
				? enable( gl.SAMPLE_ALPHA_TO_COVERAGE )
				: disable( gl.SAMPLE_ALPHA_TO_COVERAGE );

		}

		//

		function setFlipSided( flipSided ) {

			if ( currentFlipSided !== flipSided ) {

				if ( flipSided ) {

					gl.frontFace( gl.CW );

				} else {

					gl.frontFace( gl.CCW );

				}

				currentFlipSided = flipSided;

			}

		}

		function setCullFace( cullFace ) {

			if ( cullFace !== CullFaceNone ) {

				enable( gl.CULL_FACE );

				if ( cullFace !== currentCullFace ) {

					if ( cullFace === CullFaceBack ) {

						gl.cullFace( gl.BACK );

					} else if ( cullFace === CullFaceFront ) {

						gl.cullFace( gl.FRONT );

					} else {

						gl.cullFace( gl.FRONT_AND_BACK );

					}

				}

			} else {

				disable( gl.CULL_FACE );

			}

			currentCullFace = cullFace;

		}

		function setLineWidth( width ) {

			if ( width !== currentLineWidth ) {

				if ( lineWidthAvailable ) gl.lineWidth( width );

				currentLineWidth = width;

			}

		}

		function setPolygonOffset( polygonOffset, factor, units ) {

			if ( polygonOffset ) {

				enable( gl.POLYGON_OFFSET_FILL );

				if ( currentPolygonOffsetFactor !== factor || currentPolygonOffsetUnits !== units ) {

					gl.polygonOffset( factor, units );

					currentPolygonOffsetFactor = factor;
					currentPolygonOffsetUnits = units;

				}

			} else {

				disable( gl.POLYGON_OFFSET_FILL );

			}

		}

		function setScissorTest( scissorTest ) {

			if ( scissorTest ) {

				enable( gl.SCISSOR_TEST );

			} else {

				disable( gl.SCISSOR_TEST );

			}

		}

		// texture

		function activeTexture( webglSlot ) {

			if ( webglSlot === undefined ) webglSlot = gl.TEXTURE0 + maxTextures - 1;

			if ( currentTextureSlot !== webglSlot ) {

				gl.activeTexture( webglSlot );
				currentTextureSlot = webglSlot;

			}

		}

		function bindTexture( webglType, webglTexture ) {

			if ( currentTextureSlot === null ) {

				activeTexture();

			}

			let boundTexture = currentBoundTextures[ currentTextureSlot ];

			if ( boundTexture === undefined ) {

				boundTexture = { type: undefined, texture: undefined };
				currentBoundTextures[ currentTextureSlot ] = boundTexture;

			}

			if ( boundTexture.type !== webglType || boundTexture.texture !== webglTexture ) {

				gl.bindTexture( webglType, webglTexture || emptyTextures[ webglType ] );

				boundTexture.type = webglType;
				boundTexture.texture = webglTexture;

			}

		}

		function unbindTexture() {

			const boundTexture = currentBoundTextures[ currentTextureSlot ];

			if ( boundTexture !== undefined && boundTexture.type !== undefined ) {

				gl.bindTexture( boundTexture.type, null );

				boundTexture.type = undefined;
				boundTexture.texture = undefined;

			}

		}

		function compressedTexImage2D() {

			try {

				gl.compressedTexImage2D.apply( gl, arguments );

			} catch ( error ) {

				console.error( 'THREE.WebGLState:', error );

			}

		}

		function texSubImage2D() {

			try {

				gl.texSubImage2D.apply( gl, arguments );

			} catch ( error ) {

				console.error( 'THREE.WebGLState:', error );

			}

		}

		function texSubImage3D() {

			try {

				gl.texSubImage3D.apply( gl, arguments );

			} catch ( error ) {

				console.error( 'THREE.WebGLState:', error );

			}

		}

		function compressedTexSubImage2D() {

			try {

				gl.compressedTexSubImage2D.apply( gl, arguments );

			} catch ( error ) {

				console.error( 'THREE.WebGLState:', error );

			}

		}

		function texStorage2D() {

			try {

				gl.texStorage2D.apply( gl, arguments );

			} catch ( error ) {

				console.error( 'THREE.WebGLState:', error );

			}

		}

		function texStorage3D() {

			try {

				gl.texStorage3D.apply( gl, arguments );

			} catch ( error ) {

				console.error( 'THREE.WebGLState:', error );

			}

		}

		function texImage2D() {

			try {

				gl.texImage2D.apply( gl, arguments );

			} catch ( error ) {

				console.error( 'THREE.WebGLState:', error );

			}

		}

		function texImage3D() {

			try {

				gl.texImage3D.apply( gl, arguments );

			} catch ( error ) {

				console.error( 'THREE.WebGLState:', error );

			}

		}

		//

		function scissor( scissor ) {

			if ( currentScissor.equals( scissor ) === false ) {

				gl.scissor( scissor.x, scissor.y, scissor.z, scissor.w );
				currentScissor.copy( scissor );

			}

		}

		function viewport( viewport ) {

			if ( currentViewport.equals( viewport ) === false ) {

				gl.viewport( viewport.x, viewport.y, viewport.z, viewport.w );
				currentViewport.copy( viewport );

			}

		}

		//

		function reset() {

			// reset state

			gl.disable( gl.BLEND );
			gl.disable( gl.CULL_FACE );
			gl.disable( gl.DEPTH_TEST );
			gl.disable( gl.POLYGON_OFFSET_FILL );
			gl.disable( gl.SCISSOR_TEST );
			gl.disable( gl.STENCIL_TEST );
			gl.disable( gl.SAMPLE_ALPHA_TO_COVERAGE );

			gl.blendEquation( gl.FUNC_ADD );
			gl.blendFunc( gl.ONE, gl.ZERO );
			gl.blendFuncSeparate( gl.ONE, gl.ZERO, gl.ONE, gl.ZERO );

			gl.colorMask( true, true, true, true );
			gl.clearColor( 0, 0, 0, 0 );

			gl.depthMask( true );
			gl.depthFunc( gl.LESS );
			gl.clearDepth( 1 );

			gl.stencilMask( 0xffffffff );
			gl.stencilFunc( gl.ALWAYS, 0, 0xffffffff );
			gl.stencilOp( gl.KEEP, gl.KEEP, gl.KEEP );
			gl.clearStencil( 0 );

			gl.cullFace( gl.BACK );
			gl.frontFace( gl.CCW );

			gl.polygonOffset( 0, 0 );

			gl.activeTexture( gl.TEXTURE0 );

			gl.bindFramebuffer( gl.FRAMEBUFFER, null );

			if ( isWebGL2 === true ) {

				gl.bindFramebuffer( gl.DRAW_FRAMEBUFFER, null );
				gl.bindFramebuffer( gl.READ_FRAMEBUFFER, null );

			}

			gl.useProgram( null );

			gl.lineWidth( 1 );

			gl.scissor( 0, 0, gl.canvas.width, gl.canvas.height );
			gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );

			// reset internals

			enabledCapabilities = {};

			currentTextureSlot = null;
			currentBoundTextures = {};

			currentBoundFramebuffers = {};
			currentDrawbuffers = new WeakMap();
			defaultDrawbuffers = [];

			currentProgram = null;

			currentBlendingEnabled = false;
			currentBlending = null;
			currentBlendEquation = null;
			currentBlendSrc = null;
			currentBlendDst = null;
			currentBlendEquationAlpha = null;
			currentBlendSrcAlpha = null;
			currentBlendDstAlpha = null;
			currentPremultipledAlpha = false;

			currentFlipSided = null;
			currentCullFace = null;

			currentLineWidth = null;

			currentPolygonOffsetFactor = null;
			currentPolygonOffsetUnits = null;

			currentScissor.set( 0, 0, gl.canvas.width, gl.canvas.height );
			currentViewport.set( 0, 0, gl.canvas.width, gl.canvas.height );

			colorBuffer.reset();
			depthBuffer.reset();
		}

		return {

			buffers: {
				color: colorBuffer,
				depth: depthBuffer,
			},

			enable: enable,
			disable: disable,

			bindFramebuffer: bindFramebuffer,
			drawBuffers: drawBuffers,

			useProgram: useProgram,

			setBlending: setBlending,
			setMaterial: setMaterial,

			setFlipSided: setFlipSided,
			setCullFace: setCullFace,

			setLineWidth: setLineWidth,
			setPolygonOffset: setPolygonOffset,

			setScissorTest: setScissorTest,

			activeTexture: activeTexture,
			bindTexture: bindTexture,
			unbindTexture: unbindTexture,
			compressedTexImage2D: compressedTexImage2D,
			texImage2D: texImage2D,
			texImage3D: texImage3D,

			texStorage2D: texStorage2D,
			texStorage3D: texStorage3D,
			texSubImage2D: texSubImage2D,
			texSubImage3D: texSubImage3D,
			compressedTexSubImage2D: compressedTexSubImage2D,

			scissor: scissor,
			viewport: viewport,

			reset: reset

		};

	}

	function createCanvasElement() {

		const canvas = createElementNS( 'canvas' );
		canvas.style.display = 'block';
		return canvas;

	}

	function WebGLRenderer( parameters = {} ) {

		const _canvas = parameters.canvas !== undefined ? parameters.canvas : createCanvasElement(),
			_context = parameters.context !== undefined ? parameters.context : null,

			_alpha = parameters.alpha !== undefined ? parameters.alpha : false,
			_depth = parameters.depth !== undefined ? parameters.depth : true,
			_stencil = parameters.stencil !== undefined ? parameters.stencil : true,
			_antialias = parameters.antialias !== undefined ? parameters.antialias : false,
			_premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
			_preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false,
			_powerPreference = parameters.powerPreference !== undefined ? parameters.powerPreference : 'default',
			_failIfMajorPerformanceCaveat = parameters.failIfMajorPerformanceCaveat !== undefined ? parameters.failIfMajorPerformanceCaveat : false;

		let currentRenderList = null;
		let currentRenderState = null;

		// render() can be called from within a callback triggered by another render.
		// We track this so that the nested render call gets its list and state isolated from the parent render call.

		const renderListStack = [];
		const renderStateStack = [];

		// public properties

		this.domElement = _canvas;

		// Debug configuration container
		this.debug = {

			/**
			 * Enables error checking and reporting when shader programs are being compiled
			 * @type {boolean}
			 */
			checkShaderErrors: true
		};

		// clearing

		this.autoClear = true;
		this.autoClearColor = true;
		this.autoClearDepth = true;
		this.autoClearStencil = true;

		// scene graph

		this.sortObjects = true;

		// user-defined clipping

		this.clippingPlanes = [];
		this.localClippingEnabled = false;

		// physically based shading

		this.outputEncoding = LinearEncoding;

		// physical lights

		this.physicallyCorrectLights = false;

		// tone mapping

		this.toneMapping = NoToneMapping;
		this.toneMappingExposure = 1.0;

		// internal properties

		const _this = this;

		let _isContextLost = false;

		// internal state cache

		let _currentActiveCubeFace = 0;
		let _currentActiveMipmapLevel = 0;
		let _currentRenderTarget = null;
		let _currentMaterialId = - 1;

		let _currentCamera = null;

		const _currentViewport = new Vector4();
		const _currentScissor = new Vector4();

		//

		let _width = _canvas.width;
		let _height = _canvas.height;

		let _pixelRatio = 1;
		let _opaqueSort = null;
		let _transparentSort = null;

		const _viewport = new Vector4( 0, 0, _width, _height );
		const _scissor = new Vector4( 0, 0, _width, _height );
		let _scissorTest = false;

		// frustum


		// clipping

		let _clippingEnabled = false;
		let _localClippingEnabled = false;

		// transmission

		let _transmissionRenderTarget = null;

		// camera matrices cache

		const _projScreenMatrix = new Matrix4();

		const _vector3 = new Vector3();

		const _emptyScene = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: true };

		function getTargetPixelRatio() {

			return _currentRenderTarget === null ? _pixelRatio : 1;

		}

		// initialize

		let _gl = _context;

		function getContext( contextNames, contextAttributes ) {

			for ( let i = 0; i < contextNames.length; i ++ ) {

				const contextName = contextNames[ i ];
				const context = _canvas.getContext( contextName, contextAttributes );
				if ( context !== null ) return context;

			}

			return null;

		}

		try {

			const contextAttributes = {
				alpha: true,
				depth: _depth,
				stencil: _stencil,
				antialias: _antialias,
				premultipliedAlpha: _premultipliedAlpha,
				preserveDrawingBuffer: _preserveDrawingBuffer,
				powerPreference: _powerPreference,
				failIfMajorPerformanceCaveat: _failIfMajorPerformanceCaveat
			};

			// OffscreenCanvas does not have setAttribute, see #22811
			if ( 'setAttribute' in _canvas ) _canvas.setAttribute( 'data-engine', `three.js r${REVISION}` );

			// event listeners must be registered before WebGL context is created, see #12753
			_canvas.addEventListener( 'webglcontextlost', onContextLost, false );
			_canvas.addEventListener( 'webglcontextrestored', onContextRestore, false );

			if ( _gl === null ) {

				const contextNames = [ 'webgl2', 'webgl', 'experimental-webgl' ];

				if ( _this.isWebGL1Renderer === true ) {

					contextNames.shift();

				}

				_gl = getContext( contextNames, contextAttributes );

				if ( _gl === null ) {

					if ( getContext( contextNames ) ) {

						throw new Error( '' );

					} else {

						throw new Error( '' );

					}

				}

			}

			// Some experimental-webgl implementations do not have getShaderPrecisionFormat

			if ( _gl.getShaderPrecisionFormat === undefined ) {

				_gl.getShaderPrecisionFormat = function () {

					return { 'rangeMin': 1, 'rangeMax': 1, 'precision': 1 };

				};

			}

		} catch ( error ) {

			console.error( 'THREE.WebGLRenderer: ' + error.message );
			throw error;

		}

		let extensions, capabilities, state, info;
		let properties, cubemaps, cubeuvmaps, attributes, geometries, objects;
		let programCache, renderLists, renderStates, clipping;

		let background, bufferRenderer, indexedBufferRenderer;

		let utils, bindingStates;

		function initGLContext() {

			extensions = new WebGLExtensions( _gl );

			capabilities = new WebGLCapabilities( _gl, extensions, parameters );

			extensions.init( capabilities );

			// utils = new WebGLUtils( _gl, extensions, capabilities );

			state = new WebGLState( _gl, extensions, capabilities );

			info = new WebGLInfo( _gl );
			properties = new WebGLProperties();
			cubemaps = {get:function(){}};//new WebGLCubeMaps( _this );
			cubeuvmaps = undefined;//new WebGLCubeUVMaps( _this );
			attributes = new WebGLAttributes( _gl, capabilities );
			bindingStates = new WebGLBindingStates( _gl, extensions, attributes, capabilities );
			geometries = new WebGLGeometries( _gl, attributes, info, bindingStates );
			objects = new WebGLObjects( _gl, geometries, attributes, info );
			clipping = new WebGLClipping( properties );
			programCache = new WebGLPrograms( _this, cubemaps, cubeuvmaps, extensions, capabilities, bindingStates, clipping );
			renderLists = new WebGLRenderLists();
			renderStates = new WebGLRenderStates( extensions, capabilities );
			background = new WebGLBackground( _this, cubemaps, state, objects, _alpha, _premultipliedAlpha );

			bufferRenderer = new WebGLBufferRenderer( _gl, extensions, info, capabilities );
			indexedBufferRenderer = new WebGLIndexedBufferRenderer( _gl, extensions, info, capabilities );

			info.programs = programCache.programs;

			_this.capabilities = capabilities;
			_this.extensions = extensions;
			_this.properties = properties;
			_this.renderLists = renderLists;
			_this.state = state;
			_this.info = info;

		}

		initGLContext();

		// API

		this.getContext = function () {

			return _gl;

		};

		this.getContextAttributes = function () {

			return _gl.getContextAttributes();

		};

		this.forceContextLoss = function () {

			const extension = extensions.get( 'WEBGL_lose_context' );
			if ( extension ) extension.loseContext();

		};

		this.forceContextRestore = function () {

			const extension = extensions.get( 'WEBGL_lose_context' );
			if ( extension ) extension.restoreContext();

		};

		this.getPixelRatio = function () {

			return _pixelRatio;

		};

		this.setPixelRatio = function ( value ) {

			if ( value === undefined ) return;

			_pixelRatio = value;

			this.setSize( _width, _height, false );

		};

		this.getSize = function ( target ) {

			return target.set( _width, _height );

		};

		this.setSize = function ( width, height, updateStyle ) {

			_width = width;
			_height = height;

			_canvas.width = Math.floor( width * _pixelRatio );
			_canvas.height = Math.floor( height * _pixelRatio );

			if ( updateStyle !== false ) {

				_canvas.style.width = width + 'px';
				_canvas.style.height = height + 'px';

			}

			this.setViewport( 0, 0, width, height );

		};

		this.getDrawingBufferSize = function ( target ) {

			return target.set( _width * _pixelRatio, _height * _pixelRatio ).floor();

		};

		this.setDrawingBufferSize = function ( width, height, pixelRatio ) {

			_width = width;
			_height = height;

			_pixelRatio = pixelRatio;

			_canvas.width = Math.floor( width * pixelRatio );
			_canvas.height = Math.floor( height * pixelRatio );

			this.setViewport( 0, 0, width, height );

		};

		this.getCurrentViewport = function ( target ) {

			return target.copy( _currentViewport );

		};

		this.getViewport = function ( target ) {

			return target.copy( _viewport );

		};

		this.setViewport = function ( x, y, width, height ) {

			if ( x.isVector4 ) {

				_viewport.set( x.x, x.y, x.z, x.w );

			} else {

				_viewport.set( x, y, width, height );

			}

			state.viewport( _currentViewport.copy( _viewport ).multiplyScalar( _pixelRatio ).floor() );

		};

		this.getScissor = function ( target ) {

			return target.copy( _scissor );

		};

		this.setScissor = function ( x, y, width, height ) {

			if ( x.isVector4 ) {

				_scissor.set( x.x, x.y, x.z, x.w );

			} else {

				_scissor.set( x, y, width, height );

			}

			state.scissor( _currentScissor.copy( _scissor ).multiplyScalar( _pixelRatio ).floor() );

		};

		this.getScissorTest = function () {

			return _scissorTest;

		};

		this.setScissorTest = function ( boolean ) {

			state.setScissorTest( _scissorTest = boolean );

		};

		this.setOpaqueSort = function ( method ) {

			_opaqueSort = method;

		};

		this.setTransparentSort = function ( method ) {

			_transparentSort = method;

		};

		// Clearing

		this.getClearColor = function ( target ) {

			return target.copy( background.getClearColor() );

		};

		this.setClearColor = function () {

			background.setClearColor.apply( background, arguments );

		};

		this.getClearAlpha = function () {

			return background.getClearAlpha();

		};

		this.setClearAlpha = function () {

			background.setClearAlpha.apply( background, arguments );

		};

		this.clear = function ( color, depth, stencil ) {

			let bits = 0;

			if ( color === undefined || color ) bits |= _gl.COLOR_BUFFER_BIT;
			if ( depth === undefined || depth ) bits |= _gl.DEPTH_BUFFER_BIT;
			if ( stencil === undefined || stencil ) bits |= _gl.STENCIL_BUFFER_BIT;

			_gl.clear( bits );

		};

		this.clearColor = function () {

			this.clear( true, false, false );

		};

		this.clearDepth = function () {

			this.clear( false, true, false );

		};

		this.clearStencil = function () {

			this.clear( false, false, true );

		};

		//

		this.dispose = function () {

			_canvas.removeEventListener( 'webglcontextlost', onContextLost, false );
			_canvas.removeEventListener( 'webglcontextrestored', onContextRestore, false );

			renderLists.dispose();
			renderStates.dispose();
			properties.dispose();
			cubemaps.dispose();
			cubeuvmaps.dispose();
			objects.dispose();
			bindingStates.dispose();
			programCache.dispose();

			if ( _transmissionRenderTarget ) {

				_transmissionRenderTarget.dispose();
				_transmissionRenderTarget = null;

			}

			animation.stop();

		};

		// Events

		function onContextLost( event ) {

			event.preventDefault();

			console.log( 'THREE.WebGLRenderer: Context Lost.' );

			_isContextLost = true;

		}

		function onContextRestore( /* event */ ) {

			console.log( 'THREE.WebGLRenderer: Context Restored.' );

			_isContextLost = false;

			const infoAutoReset = info.autoReset;

			initGLContext();

			info.autoReset = infoAutoReset;
		}

		function onMaterialDispose( event ) {

			const material = event.target;

			material.removeEventListener( 'dispose', onMaterialDispose );

			deallocateMaterial( material );

		}

		// Buffer deallocation

		function deallocateMaterial( material ) {

			releaseMaterialProgramReferences( material );

			properties.remove( material );

		}


		function releaseMaterialProgramReferences( material ) {

			const programs = properties.get( material ).programs;

			if ( programs !== undefined ) {

				programs.forEach( function ( program ) {

					programCache.releaseProgram( program );

				} );

				if ( material.isShaderMaterial ) {

					programCache.releaseShaderCache( material );

				}

			}

		}

		// Buffer rendering

		this.renderBufferDirect = function ( camera, scene, geometry, material, object, group ) {

			if ( scene === null ) scene = _emptyScene; // renderBufferDirect second parameter used to be fog (could be null)

			const frontFaceCW = ( object.isMesh && object.matrixWorld.determinant() < 0 );

			const program = setProgram( camera, scene, geometry, material, object );

			state.setMaterial( material, frontFaceCW );

			//

			let index = geometry.index;
			const position = geometry.attributes.position;

			//

			if ( index === null ) {

				if ( position === undefined || position.count === 0 ) return;

			} else if ( index.count === 0 ) {

				return;

			}

			//

			let rangeFactor = 1;

			if ( material.wireframe === true ) {

				index = geometries.getWireframeAttribute( geometry );
				rangeFactor = 2;

			}

			bindingStates.setup( object, material, program, geometry, index );

			let attribute;
			let renderer = bufferRenderer;

			if ( index !== null ) {

				attribute = attributes.get( index );

				renderer = indexedBufferRenderer;
				renderer.setIndex( attribute );

			}

			//

			const dataCount = ( index !== null ) ? index.count : position.count;

			const rangeStart = geometry.drawRange.start * rangeFactor;
			const rangeCount = geometry.drawRange.count * rangeFactor;

			const groupStart = group !== null ? group.start * rangeFactor : 0;
			const groupCount = group !== null ? group.count * rangeFactor : Infinity;

			const drawStart = Math.max( rangeStart, groupStart );
			const drawEnd = Math.min( dataCount, rangeStart + rangeCount, groupStart + groupCount ) - 1;

			const drawCount = Math.max( 0, drawEnd - drawStart + 1 );

			if ( drawCount === 0 ) return;

			//

			if ( object.isMesh ) {

				if ( material.wireframe === true ) {

					state.setLineWidth( material.wireframeLinewidth * getTargetPixelRatio() );
					renderer.setMode( _gl.LINES );

				} else {

					renderer.setMode( _gl.TRIANGLES );

				}

			} else if ( object.isLine ) {

				let lineWidth = material.linewidth;

				if ( lineWidth === undefined ) lineWidth = 1; // Not using Line*Material

				state.setLineWidth( lineWidth * getTargetPixelRatio() );

				if ( object.isLineSegments ) {

					renderer.setMode( _gl.LINES );

				} else if ( object.isLineLoop ) {

					renderer.setMode( _gl.LINE_LOOP );

				} else {

					renderer.setMode( _gl.LINE_STRIP );

				}

			} else if ( object.isPoints ) {

				renderer.setMode( _gl.POINTS );

			} else if ( object.isSprite ) {

				renderer.setMode( _gl.TRIANGLES );

			}

			if ( geometry.isInstancedBufferGeometry ) {

				const instanceCount = Math.min( geometry.instanceCount, geometry._maxInstanceCount );

				renderer.renderInstances( drawStart, drawCount, instanceCount );

			} else {

				renderer.render( drawStart, drawCount );

			}

		};

		// Compile

		this.compile = function ( scene, camera ) {

			currentRenderState = renderStates.get( scene );
			currentRenderState.init();

			renderStateStack.push( currentRenderState );

			scene.traverseVisible( function ( object ) {

				if ( object.isLight && object.layers.test( camera.layers ) ) {

					currentRenderState.pushLight( object );

					if ( object.castShadow ) {

						currentRenderState.pushShadow( object );

					}

				}

			} );

			currentRenderState.setupLights( _this.physicallyCorrectLights );

			scene.traverse( function ( object ) {

				const material = object.material;

				if ( material ) {

					if ( Array.isArray( material ) ) {

						for ( let i = 0; i < material.length; i ++ ) {

							const material2 = material[ i ];

							getProgram( material2, scene, object );

						}

					} else {

						getProgram( material, scene, object );

					}

				}

			} );

			renderStateStack.pop();
			currentRenderState = null;

		};

		// Animation Loop

		let onAnimationFrameCallback = null;

		function onAnimationFrame( time ) {

			if ( onAnimationFrameCallback ) onAnimationFrameCallback( time );

		}

		const animation = new WebGLAnimation();
		animation.setAnimationLoop( onAnimationFrame );

		if ( typeof window !== 'undefined' ) animation.setContext( window );

		this.setAnimationLoop = function ( callback ) {

			onAnimationFrameCallback = callback;

			( callback === null ) ? animation.stop() : animation.start();

		};


		// Rendering

		this.render = function ( scene, camera ) {

			if ( camera !== undefined && camera.isCamera !== true ) {

				console.error( 'THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.' );
				return;

			}

			if ( _isContextLost === true ) return;

			// update scene graph

			if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

			// update camera matrices and frustum

			if ( camera.parent === null ) camera.updateMatrixWorld();


			//
			if ( scene.isScene === true ) scene.onBeforeRender( _this, scene, camera, _currentRenderTarget );

			currentRenderState = renderStates.get( scene, renderStateStack.length );
			currentRenderState.init();

			renderStateStack.push( currentRenderState );
			_projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );

			_localClippingEnabled = this.localClippingEnabled;
			_clippingEnabled = clipping.init( this.clippingPlanes, _localClippingEnabled, camera );

			currentRenderList = renderLists.get( scene, renderListStack.length );
			currentRenderList.init();

			renderListStack.push( currentRenderList );

			projectObject( scene, camera, 0, _this.sortObjects );

			currentRenderList.finish();

			if ( _this.sortObjects === true ) {

				currentRenderList.sort( _opaqueSort, _transparentSort );

			}

			//

			if ( _clippingEnabled === true ) clipping.beginShadows();

			currentRenderState.state.shadowsArray;

			if ( _clippingEnabled === true ) clipping.endShadows();

			//

			if ( this.info.autoReset === true ) this.info.reset();

			//

			background.render( currentRenderList, scene );

			// render scene

			currentRenderState.setupLights( _this.physicallyCorrectLights );

			if ( camera.isArrayCamera ) {

				const cameras = camera.cameras;

				for ( let i = 0, l = cameras.length; i < l; i ++ ) {

					const camera2 = cameras[ i ];

					renderScene( currentRenderList, scene, camera2, camera2.viewport );

				}

			} else {

				renderScene( currentRenderList, scene, camera );

			}

			if ( scene.isScene === true ) scene.onAfterRender( _this, scene, camera );

			// Ensure depth buffer writing is enabled so it can be cleared on next render

			state.buffers.depth.setTest( true );
			state.buffers.depth.setMask( true );
			state.buffers.color.setMask( true );

			state.setPolygonOffset( false );

			// _gl.finish();

			bindingStates.resetDefaultState();
			_currentMaterialId = - 1;
			_currentCamera = null;

			renderStateStack.pop();

			if ( renderStateStack.length > 0 ) {

				currentRenderState = renderStateStack[ renderStateStack.length - 1 ];

			} else {

				currentRenderState = null;

			}

			renderListStack.pop();

			if ( renderListStack.length > 0 ) {

				currentRenderList = renderListStack[ renderListStack.length - 1 ];

			} else {

				currentRenderList = null;

			}

		};

		function projectObject( object, camera, groupOrder, sortObjects ) {

			if ( object.visible === false ) return;

			const visible = object.layers.test( camera.layers );

			if ( visible ) {

				if ( object.isGroup ) {

					groupOrder = object.renderOrder;

				} else if ( object.isLOD ) {

					if ( object.autoUpdate === true ) object.update( camera );

				} else if ( object.isLight ) {

					currentRenderState.pushLight( object );

					if ( object.castShadow ) {

						currentRenderState.pushShadow( object );

					}

				} else if ( object.isSprite ) {

					if ( ! object.frustumCulled || _frustum.intersectsSprite( object ) ) {

						if ( sortObjects ) {

							_vector3.setFromMatrixPosition( object.matrixWorld )
								.applyMatrix4( _projScreenMatrix );

						}

						const geometry = objects.update( object );
						const material = object.material;

						if ( material.visible ) {

							currentRenderList.push( object, geometry, material, groupOrder, _vector3.z, null );

						}

					}

				} else if ( object.isMesh || object.isLine || object.isPoints ) {

						if ( sortObjects ) {

							_vector3.setFromMatrixPosition( object.matrixWorld )
								.applyMatrix4( _projScreenMatrix );

						}

						const geometry = objects.update( object );
						const material = object.material;

						if ( Array.isArray( material ) ) {

							const groups = geometry.groups;

							for ( let i = 0, l = groups.length; i < l; i ++ ) {

								const group = groups[ i ];
								const groupMaterial = material[ group.materialIndex ];

								if ( groupMaterial && groupMaterial.visible ) {

									currentRenderList.push( object, geometry, groupMaterial, groupOrder, _vector3.z, group );

								}

							}

						} else if ( material.visible ) {

							currentRenderList.push( object, geometry, material, groupOrder, _vector3.z, null );

						}

					}

				

			}

			const children = object.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				projectObject( children[ i ], camera, groupOrder, sortObjects );

			}

		}

		function renderScene( currentRenderList, scene, camera, viewport ) {

			const opaqueObjects = currentRenderList.opaque;
			const transmissiveObjects = currentRenderList.transmissive;
			const transparentObjects = currentRenderList.transparent;

			currentRenderState.setupLightsView( camera );

			if ( transmissiveObjects.length > 0 ) renderTransmissionPass( opaqueObjects, scene, camera );

			if ( viewport ) state.viewport( _currentViewport.copy( viewport ) );

			if ( opaqueObjects.length > 0 ) renderObjects( opaqueObjects, scene, camera );
			if ( transmissiveObjects.length > 0 ) renderObjects( transmissiveObjects, scene, camera );
			if ( transparentObjects.length > 0 ) renderObjects( transparentObjects, scene, camera );

		}

		function renderTransmissionPass( opaqueObjects, scene, camera ) {

			if ( _transmissionRenderTarget === null ) {

				const needsAntialias = _antialias === true && capabilities.isWebGL2 === true;
				const renderTargetType = needsAntialias ? WebGLMultisampleRenderTarget : WebGLRenderTarget;

				_transmissionRenderTarget = new renderTargetType( 1024, 1024, {
					generateMipmaps: true,
					type: utils.convert( HalfFloatType ) !== null ? HalfFloatType : UnsignedByteType,
					minFilter: LinearMipmapLinearFilter,
					magFilter: NearestFilter,
					wrapS: ClampToEdgeWrapping,
					wrapT: ClampToEdgeWrapping,
					useRenderToTexture: extensions.has( 'WEBGL_multisampled_render_to_texture' )
				} );

			}

			const currentRenderTarget = _this.getRenderTarget();
			_this.setRenderTarget( _transmissionRenderTarget );
			_this.clear();

			// Turn off the features which can affect the frag color for opaque objects pass.
			// Otherwise they are applied twice in opaque objects pass and transmission objects pass.
			const currentToneMapping = _this.toneMapping;
			_this.toneMapping = NoToneMapping;

			renderObjects( opaqueObjects, scene, camera );

			_this.toneMapping = currentToneMapping;

			_this.setRenderTarget( currentRenderTarget );

		}

		function renderObjects( renderList, scene, camera ) {

			const overrideMaterial = scene.isScene === true ? scene.overrideMaterial : null;

			for ( let i = 0, l = renderList.length; i < l; i ++ ) {

				const renderItem = renderList[ i ];

				const object = renderItem.object;
				const geometry = renderItem.geometry;
				const material = overrideMaterial === null ? renderItem.material : overrideMaterial;
				const group = renderItem.group;

				if ( object.layers.test( camera.layers ) ) {

					renderObject( object, scene, camera, geometry, material, group );

				}

			}

		}

		function renderObject( object, scene, camera, geometry, material, group ) {

			object.onBeforeRender( _this, scene, camera, geometry, material, group );

			object.modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld );
			object.normalMatrix.getNormalMatrix( object.modelViewMatrix );

			material.onBeforeRender( _this, scene, camera, geometry, object, group );

			if ( material.transparent === true && material.side === DoubleSide ) {

				material.side = BackSide;
				material.needsUpdate = true;
				_this.renderBufferDirect( camera, scene, geometry, material, object, group );

				material.side = FrontSide;
				material.needsUpdate = true;
				_this.renderBufferDirect( camera, scene, geometry, material, object, group );

				material.side = DoubleSide;

			} else {

				_this.renderBufferDirect( camera, scene, geometry, material, object, group );

			}

			object.onAfterRender( _this, scene, camera, geometry, material, group );

		}

		function getProgram( material, scene, object ) {

			if ( scene.isScene !== true ) scene = _emptyScene; // scene could be a Mesh, Line, Points, ...

			const materialProperties = properties.get( material );

			const lights = currentRenderState.state.lights;
			const shadowsArray = currentRenderState.state.shadowsArray;

			const lightsStateVersion = lights.state.version;

			const parameters = programCache.getParameters( material, lights.state, shadowsArray, scene, object );
			const programCacheKey = programCache.getProgramCacheKey( parameters );

			let programs = materialProperties.programs;

			// always update environment and fog - changing these trigger an getProgram call, but it's possible that the program doesn't change

			materialProperties.environment = material.isMeshStandardMaterial ? scene.environment : null;
			materialProperties.envMap = ( material.isMeshStandardMaterial ? cubeuvmaps : cubemaps ).get( material.envMap || materialProperties.environment );

			if ( programs === undefined ) {

				// new material

				material.addEventListener( 'dispose', onMaterialDispose );

				programs = new Map();
				materialProperties.programs = programs;

			}

			let program = programs.get( programCacheKey );

			if ( program !== undefined ) {

				// early out if program and light state is identical

				if ( materialProperties.currentProgram === program && materialProperties.lightsStateVersion === lightsStateVersion ) {

					updateCommonMaterialProperties( material, parameters );

					return program;

				}

			} else {

				parameters.uniforms = programCache.getUniforms( material );

				material.onBuild( object, parameters, _this );

				material.onBeforeCompile( parameters, _this );

				program = programCache.acquireProgram( parameters, programCacheKey );
				programs.set( programCacheKey, program );

				materialProperties.uniforms = parameters.uniforms;

			}

			const uniforms = materialProperties.uniforms;

			if ( ( ! material.isShaderMaterial && ! material.isRawShaderMaterial ) || material.clipping === true ) {

				uniforms.clippingPlanes = clipping.uniform;

			}

			updateCommonMaterialProperties( material, parameters );

			// store the light setup it was created for

			materialProperties.needsLights = materialNeedsLights();
			materialProperties.lightsStateVersion = lightsStateVersion;

			if ( materialProperties.needsLights ) {

				// wire up the material to this renderer's lighting state

				uniforms.ambientLightColor.value = lights.state.ambient;
				uniforms.lightProbe.value = lights.state.probe;
				uniforms.directionalLights.value = lights.state.directional;
				uniforms.directionalLightShadows.value = lights.state.directionalShadow;
				uniforms.spotLights.value = lights.state.spot;
				uniforms.spotLightShadows.value = lights.state.spotShadow;
				uniforms.rectAreaLights.value = lights.state.rectArea;
				uniforms.ltc_1.value = lights.state.rectAreaLTC1;
				uniforms.ltc_2.value = lights.state.rectAreaLTC2;
				uniforms.pointLights.value = lights.state.point;
				uniforms.pointLightShadows.value = lights.state.pointShadow;
				uniforms.hemisphereLights.value = lights.state.hemi;

				uniforms.directionalShadowMap.value = lights.state.directionalShadowMap;
				uniforms.directionalShadowMatrix.value = lights.state.directionalShadowMatrix;
				uniforms.spotShadowMap.value = lights.state.spotShadowMap;
				uniforms.spotShadowMatrix.value = lights.state.spotShadowMatrix;
				uniforms.pointShadowMap.value = lights.state.pointShadowMap;
				uniforms.pointShadowMatrix.value = lights.state.pointShadowMatrix;
				// TODO (abelnation): add area lights shadow info to uniforms

			}

			const progUniforms = program.getUniforms();
			const uniformsList = WebGLUniforms.seqWithValue( progUniforms.seq, uniforms );

			materialProperties.currentProgram = program;
			materialProperties.uniformsList = uniformsList;

			return program;

		}

		function updateCommonMaterialProperties( material, parameters ) {

			const materialProperties = properties.get( material );

			materialProperties.outputEncoding = parameters.outputEncoding;
			materialProperties.instancing = parameters.instancing;
			materialProperties.numClippingPlanes = parameters.numClippingPlanes;
			materialProperties.numIntersection = parameters.numClipIntersection;
			materialProperties.vertexAlphas = parameters.vertexAlphas;
			materialProperties.vertexTangents = parameters.vertexTangents;
			materialProperties.toneMapping = parameters.toneMapping;

		}

		function setProgram( camera, scene, geometry, material, object ) {

			if ( scene.isScene !== true ) scene = _emptyScene; // scene could be a Mesh, Line, Points, ...
			const environment = material.isMeshStandardMaterial ? scene.environment : null;
			const encoding = ( _currentRenderTarget === null ) ? _this.outputEncoding : ( _currentRenderTarget.isXRRenderTarget === true ? _currentRenderTarget.texture.encoding : LinearEncoding );
			const envMap = ( material.isMeshStandardMaterial ? cubeuvmaps : cubemaps ).get( material.envMap || environment );
			const vertexAlphas = material.vertexColors === true && !! geometry.attributes.color && geometry.attributes.color.itemSize === 4;
			const vertexTangents = !! material.normalMap && !! geometry.attributes.tangent;
			const morphTargets = !! geometry.morphAttributes.position;
			const morphNormals = !! geometry.morphAttributes.normal;
			const morphTargetsCount = !! geometry.morphAttributes.position ? geometry.morphAttributes.position.length : 0;
			const toneMapping = material.toneMapped ? _this.toneMapping : NoToneMapping;

			const materialProperties = properties.get( material );
			const lights = currentRenderState.state.lights;

			if ( _clippingEnabled === true ) {

				if ( _localClippingEnabled === true || camera !== _currentCamera ) {

					const useCache =
						camera === _currentCamera &&
						material.id === _currentMaterialId;

					// we might want to call this function with some ClippingGroup
					// object instead of the material, once it becomes feasible
					// (#8465, #8379)
					clipping.setState( material, camera, useCache );

				}

			}

			//

			let needsProgramChange = false;

			if ( material.version === materialProperties.__version ) {

				if ( materialProperties.needsLights && ( materialProperties.lightsStateVersion !== lights.state.version ) ) {

					needsProgramChange = true;

				} else if ( materialProperties.outputEncoding !== encoding ) {

					needsProgramChange = true;

				} else if ( materialProperties.envMap !== envMap ) {

					needsProgramChange = true;

				} else if ( materialProperties.numClippingPlanes !== undefined &&
					( materialProperties.numClippingPlanes !== clipping.numPlanes ||
					materialProperties.numIntersection !== clipping.numIntersection ) ) {

					needsProgramChange = true;

				} else if ( materialProperties.vertexAlphas !== vertexAlphas ) {

					needsProgramChange = true;

				} else if ( materialProperties.vertexTangents !== vertexTangents ) {

					needsProgramChange = true;

				} else if ( materialProperties.morphTargets !== morphTargets ) {

					needsProgramChange = true;

				} else if ( materialProperties.morphNormals !== morphNormals ) {

					needsProgramChange = true;

				} else if ( materialProperties.toneMapping !== toneMapping ) {

					needsProgramChange = true;

				} else if ( capabilities.isWebGL2 === true && materialProperties.morphTargetsCount !== morphTargetsCount ) {

					needsProgramChange = true;

				}

			} else {

				needsProgramChange = true;
				materialProperties.__version = material.version;

			}

			//

			let program = materialProperties.currentProgram;

			if ( needsProgramChange === true ) {

				program = getProgram( material, scene, object );

			}

			let refreshProgram = false;

			const p_uniforms = program.getUniforms();
				materialProperties.uniforms;

			if ( state.useProgram( program.program ) ) {

				refreshProgram = true;

			}

			if ( material.id !== _currentMaterialId ) {

				_currentMaterialId = material.id;

			}

			if ( refreshProgram || _currentCamera !== camera ) {

				p_uniforms.setValue( _gl, 'projectionMatrix', camera.projectionMatrix );

				if ( capabilities.logarithmicDepthBuffer ) {

					p_uniforms.setValue( _gl, 'logDepthBufFC',
						2.0 / ( Math.log( camera.far + 1.0 ) / Math.LN2 ) );

				}

				if ( _currentCamera !== camera ) {

					_currentCamera = camera;

				}

				// load material specific uniforms
				// (shader material also gets them for the sake of genericity)

				if ( material.isShaderMaterial ||
					material.isMeshPhongMaterial ||
					material.isMeshToonMaterial ||
					material.isMeshStandardMaterial ||
					material.envMap ) {

					const uCamPos = p_uniforms.map.cameraPosition;

					if ( uCamPos !== undefined ) {

						uCamPos.setValue( _gl,
							_vector3.setFromMatrixPosition( camera.matrixWorld ) );

					}

				}

				if ( material.isMeshPhongMaterial ||
					material.isMeshToonMaterial ||
					material.isMeshLambertMaterial ||
					material.isMeshBasicMaterial ||
					material.isMeshStandardMaterial ||
					material.isShaderMaterial ||
					material.isShadowMaterial ||
					object.isSkinnedMesh ) {

					p_uniforms.setValue( _gl, 'viewMatrix', camera.matrixWorldInverse );

				}

			}


			// common matrices

			p_uniforms.setValue( _gl, 'modelViewMatrix', object.modelViewMatrix );
			p_uniforms.setValue( _gl, 'normalMatrix', object.normalMatrix );
			p_uniforms.setValue( _gl, 'modelMatrix', object.matrixWorld );

			return program;

		}

		function materialNeedsLights( material ) {
			return false;
		}

		this.getActiveCubeFace = function () {

			return _currentActiveCubeFace;

		};

		this.getActiveMipmapLevel = function () {

			return _currentActiveMipmapLevel;

		};

		this.getRenderTarget = function () {

			return _currentRenderTarget;

		};

		this.initTexture = function ( texture ) {

			state.unbindTexture();

		};

		this.resetState = function () {

			_currentActiveCubeFace = 0;
			_currentActiveMipmapLevel = 0;
			_currentRenderTarget = null;

			state.reset();
			bindingStates.reset();

		};

		if ( typeof __THREE_DEVTOOLS__ !== 'undefined' ) {

			__THREE_DEVTOOLS__.dispatchEvent( new CustomEvent( 'observe', { detail: this } ) );

		}

	}

	WebGLRenderer.prototype.isWebGLRenderer = true;

	class WebGL1Renderer extends WebGLRenderer {}

	WebGL1Renderer.prototype.isWebGL1Renderer = true;

	const _matrix = /*@__PURE__*/ new Matrix4();
	const _quaternion$1 = /*@__PURE__*/ new Quaternion();

	class Euler {

		constructor( x = 0, y = 0, z = 0, order = Euler.DefaultOrder ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._order = order;

		}

		get x() {

			return this._x;

		}

		set x( value ) {

			this._x = value;
			this._onChangeCallback();

		}

		get y() {

			return this._y;

		}

		set y( value ) {

			this._y = value;
			this._onChangeCallback();

		}

		get z() {

			return this._z;

		}

		set z( value ) {

			this._z = value;
			this._onChangeCallback();

		}

		get order() {

			return this._order;

		}

		set order( value ) {

			this._order = value;
			this._onChangeCallback();

		}

		set( x, y, z, order = this._order ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._order = order;

			this._onChangeCallback();

			return this;

		}

		clone() {

			return new this.constructor( this._x, this._y, this._z, this._order );

		}

		copy( euler ) {

			this._x = euler._x;
			this._y = euler._y;
			this._z = euler._z;
			this._order = euler._order;

			this._onChangeCallback();

			return this;

		}

		setFromRotationMatrix( m, order = this._order, update = true ) {

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			const te = m.elements;
			const m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
			const m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
			const m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

			switch ( order ) {

				case 'XYZ':

					this._y = Math.asin( clamp( m13, - 1, 1 ) );

					if ( Math.abs( m13 ) < 0.9999999 ) {

						this._x = Math.atan2( - m23, m33 );
						this._z = Math.atan2( - m12, m11 );

					} else {

						this._x = Math.atan2( m32, m22 );
						this._z = 0;

					}

					break;

				case 'YXZ':

					this._x = Math.asin( - clamp( m23, - 1, 1 ) );

					if ( Math.abs( m23 ) < 0.9999999 ) {

						this._y = Math.atan2( m13, m33 );
						this._z = Math.atan2( m21, m22 );

					} else {

						this._y = Math.atan2( - m31, m11 );
						this._z = 0;

					}

					break;

				case 'ZXY':

					this._x = Math.asin( clamp( m32, - 1, 1 ) );

					if ( Math.abs( m32 ) < 0.9999999 ) {

						this._y = Math.atan2( - m31, m33 );
						this._z = Math.atan2( - m12, m22 );

					} else {

						this._y = 0;
						this._z = Math.atan2( m21, m11 );

					}

					break;

				case 'ZYX':

					this._y = Math.asin( - clamp( m31, - 1, 1 ) );

					if ( Math.abs( m31 ) < 0.9999999 ) {

						this._x = Math.atan2( m32, m33 );
						this._z = Math.atan2( m21, m11 );

					} else {

						this._x = 0;
						this._z = Math.atan2( - m12, m22 );

					}

					break;

				case 'YZX':

					this._z = Math.asin( clamp( m21, - 1, 1 ) );

					if ( Math.abs( m21 ) < 0.9999999 ) {

						this._x = Math.atan2( - m23, m22 );
						this._y = Math.atan2( - m31, m11 );

					} else {

						this._x = 0;
						this._y = Math.atan2( m13, m33 );

					}

					break;

				case 'XZY':

					this._z = Math.asin( - clamp( m12, - 1, 1 ) );

					if ( Math.abs( m12 ) < 0.9999999 ) {

						this._x = Math.atan2( m32, m22 );
						this._y = Math.atan2( m13, m11 );

					} else {

						this._x = Math.atan2( - m23, m33 );
						this._y = 0;

					}

					break;

				default:

					console.warn( 'THREE.Euler: .setFromRotationMatrix() encountered an unknown order: ' + order );

			}

			this._order = order;

			if ( update === true ) this._onChangeCallback();

			return this;

		}

		setFromQuaternion( q, order, update ) {

			_matrix.makeRotationFromQuaternion( q );

			return this.setFromRotationMatrix( _matrix, order, update );

		}

		setFromVector3( v, order = this._order ) {

			return this.set( v.x, v.y, v.z, order );

		}

		reorder( newOrder ) {

			// WARNING: this discards revolution information -bhouston

			_quaternion$1.setFromEuler( this );

			return this.setFromQuaternion( _quaternion$1, newOrder );

		}

		equals( euler ) {

			return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

		}

		fromArray( array ) {

			this._x = array[ 0 ];
			this._y = array[ 1 ];
			this._z = array[ 2 ];
			if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

			this._onChangeCallback();

			return this;

		}

		toArray( array = [], offset = 0 ) {

			array[ offset ] = this._x;
			array[ offset + 1 ] = this._y;
			array[ offset + 2 ] = this._z;
			array[ offset + 3 ] = this._order;

			return array;

		}

		toVector3( optionalResult ) {

			if ( optionalResult ) {

				return optionalResult.set( this._x, this._y, this._z );

			} else {

				return new Vector3( this._x, this._y, this._z );

			}

		}

		_onChange( callback ) {

			this._onChangeCallback = callback;

			return this;

		}

		_onChangeCallback() {}

	}

	Euler.prototype.isEuler = true;

	Euler.DefaultOrder = 'XYZ';
	Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

	let _object3DId = 0;

	const _v1$1 = /*@__PURE__*/ new Vector3();
	const _q1 = /*@__PURE__*/ new Quaternion();
	const _m1$1 = /*@__PURE__*/ new Matrix4();
	const _target = /*@__PURE__*/ new Vector3();

	const _position = /*@__PURE__*/ new Vector3();
	const _scale = /*@__PURE__*/ new Vector3();
	const _quaternion = /*@__PURE__*/ new Quaternion();

	const _xAxis = /*@__PURE__*/ new Vector3( 1, 0, 0 );
	const _yAxis = /*@__PURE__*/ new Vector3( 0, 1, 0 );
	const _zAxis = /*@__PURE__*/ new Vector3( 0, 0, 1 );

	const _addedEvent = { type: 'added' };
	const _removedEvent = { type: 'removed' };

	class Object3D extends EventDispatcher {

		constructor() {

			super();

			Object.defineProperty( this, 'id', { value: _object3DId ++ } );

			this.uuid = generateUUID();

			this.name = '';
			this.type = 'Object3D';

			this.parent = null;
			this.children = [];

			this.up = Object3D.DefaultUp.clone();

			const position = new Vector3();
			const rotation = new Euler();
			const quaternion = new Quaternion();
			const scale = new Vector3( 1, 1, 1 );

			function onRotationChange() {

				quaternion.setFromEuler( rotation, false );

			}

			function onQuaternionChange() {

				rotation.setFromQuaternion( quaternion, undefined, false );

			}

			rotation._onChange( onRotationChange );
			quaternion._onChange( onQuaternionChange );

			Object.defineProperties( this, {
				position: {
					configurable: true,
					enumerable: true,
					value: position
				},
				rotation: {
					configurable: true,
					enumerable: true,
					value: rotation
				},
				quaternion: {
					configurable: true,
					enumerable: true,
					value: quaternion
				},
				scale: {
					configurable: true,
					enumerable: true,
					value: scale
				},
				modelViewMatrix: {
					value: new Matrix4()
				},
				normalMatrix: {
					value: new Matrix3()
				}
			} );

			this.matrix = new Matrix4();
			this.matrixWorld = new Matrix4();

			this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
			this.matrixWorldNeedsUpdate = false;

			this.layers = new Layers();
			this.visible = true;

			this.castShadow = false;
			this.receiveShadow = false;

			this.frustumCulled = true;
			this.renderOrder = 0;

			this.animations = [];

			this.userData = {};

		}

		onBeforeRender( /* renderer, scene, camera, geometry, material, group */ ) {}

		onAfterRender( /* renderer, scene, camera, geometry, material, group */ ) {}

		applyMatrix4( matrix ) {

			if ( this.matrixAutoUpdate ) this.updateMatrix();

			this.matrix.premultiply( matrix );

			this.matrix.decompose( this.position, this.quaternion, this.scale );

		}

		applyQuaternion( q ) {

			this.quaternion.premultiply( q );

			return this;

		}

		setRotationFromAxisAngle( axis, angle ) {

			// assumes axis is normalized

			this.quaternion.setFromAxisAngle( axis, angle );

		}

		setRotationFromEuler( euler ) {

			this.quaternion.setFromEuler( euler, true );

		}

		setRotationFromMatrix( m ) {

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			this.quaternion.setFromRotationMatrix( m );

		}

		setRotationFromQuaternion( q ) {

			// assumes q is normalized

			this.quaternion.copy( q );

		}

		rotateOnAxis( axis, angle ) {

			// rotate object on axis in object space
			// axis is assumed to be normalized

			_q1.setFromAxisAngle( axis, angle );

			this.quaternion.multiply( _q1 );

			return this;

		}

		rotateOnWorldAxis( axis, angle ) {

			// rotate object on axis in world space
			// axis is assumed to be normalized
			// method assumes no rotated parent

			_q1.setFromAxisAngle( axis, angle );

			this.quaternion.premultiply( _q1 );

			return this;

		}

		rotateX( angle ) {

			return this.rotateOnAxis( _xAxis, angle );

		}

		rotateY( angle ) {

			return this.rotateOnAxis( _yAxis, angle );

		}

		rotateZ( angle ) {

			return this.rotateOnAxis( _zAxis, angle );

		}

		translateOnAxis( axis, distance ) {

			// translate object by distance along axis in object space
			// axis is assumed to be normalized

			_v1$1.copy( axis ).applyQuaternion( this.quaternion );

			this.position.add( _v1$1.multiplyScalar( distance ) );

			return this;

		}

		translateX( distance ) {

			return this.translateOnAxis( _xAxis, distance );

		}

		translateY( distance ) {

			return this.translateOnAxis( _yAxis, distance );

		}

		translateZ( distance ) {

			return this.translateOnAxis( _zAxis, distance );

		}

		localToWorld( vector ) {

			return vector.applyMatrix4( this.matrixWorld );

		}

		worldToLocal( vector ) {

			return vector.applyMatrix4( _m1$1.copy( this.matrixWorld ).invert() );

		}

		lookAt( x, y, z ) {

			// This method does not support objects having non-uniformly-scaled parent(s)

			if ( x.isVector3 ) {

				_target.copy( x );

			} else {

				_target.set( x, y, z );

			}

			const parent = this.parent;

			this.updateWorldMatrix( true, false );

			_position.setFromMatrixPosition( this.matrixWorld );

			if ( this.isCamera || this.isLight ) {

				_m1$1.lookAt( _position, _target, this.up );

			} else {

				_m1$1.lookAt( _target, _position, this.up );

			}

			this.quaternion.setFromRotationMatrix( _m1$1 );

			if ( parent ) {

				_m1$1.extractRotation( parent.matrixWorld );
				_q1.setFromRotationMatrix( _m1$1 );
				this.quaternion.premultiply( _q1.invert() );

			}

		}

		add( object ) {

			if ( arguments.length > 1 ) {

				for ( let i = 0; i < arguments.length; i ++ ) {

					this.add( arguments[ i ] );

				}

				return this;

			}

			if ( object === this ) {

				console.error( 'THREE.Object3D.add: object can\'t be added as a child of itself.', object );
				return this;

			}

			if ( object && object.isObject3D ) {

				if ( object.parent !== null ) {

					object.parent.remove( object );

				}

				object.parent = this;
				this.children.push( object );

				object.dispatchEvent( _addedEvent );

			} else {

				console.error( 'THREE.Object3D.add: object not an instance of THREE.Object3D.', object );

			}

			return this;

		}

		remove( object ) {

			if ( arguments.length > 1 ) {

				for ( let i = 0; i < arguments.length; i ++ ) {

					this.remove( arguments[ i ] );

				}

				return this;

			}

			const index = this.children.indexOf( object );

			if ( index !== - 1 ) {

				object.parent = null;
				this.children.splice( index, 1 );

				object.dispatchEvent( _removedEvent );

			}

			return this;

		}

		removeFromParent() {

			const parent = this.parent;

			if ( parent !== null ) {

				parent.remove( this );

			}

			return this;

		}

		clear() {

			for ( let i = 0; i < this.children.length; i ++ ) {

				const object = this.children[ i ];

				object.parent = null;

				object.dispatchEvent( _removedEvent );

			}

			this.children.length = 0;

			return this;


		}

		attach( object ) {

			// adds object as a child of this, while maintaining the object's world transform

			// Note: This method does not support scene graphs having non-uniformly-scaled nodes(s)

			this.updateWorldMatrix( true, false );

			_m1$1.copy( this.matrixWorld ).invert();

			if ( object.parent !== null ) {

				object.parent.updateWorldMatrix( true, false );

				_m1$1.multiply( object.parent.matrixWorld );

			}

			object.applyMatrix4( _m1$1 );

			this.add( object );

			object.updateWorldMatrix( false, true );

			return this;

		}

		getObjectById( id ) {

			return this.getObjectByProperty( 'id', id );

		}

		getObjectByName( name ) {

			return this.getObjectByProperty( 'name', name );

		}

		getObjectByProperty( name, value ) {

			if ( this[ name ] === value ) return this;

			for ( let i = 0, l = this.children.length; i < l; i ++ ) {

				const child = this.children[ i ];
				const object = child.getObjectByProperty( name, value );

				if ( object !== undefined ) {

					return object;

				}

			}

			return undefined;

		}

		getWorldPosition( target ) {

			this.updateWorldMatrix( true, false );

			return target.setFromMatrixPosition( this.matrixWorld );

		}

		getWorldQuaternion( target ) {

			this.updateWorldMatrix( true, false );

			this.matrixWorld.decompose( _position, target, _scale );

			return target;

		}

		getWorldScale( target ) {

			this.updateWorldMatrix( true, false );

			this.matrixWorld.decompose( _position, _quaternion, target );

			return target;

		}

		getWorldDirection( target ) {

			this.updateWorldMatrix( true, false );

			const e = this.matrixWorld.elements;

			return target.set( e[ 8 ], e[ 9 ], e[ 10 ] ).normalize();

		}

		raycast( /* raycaster, intersects */ ) {}

		traverse( callback ) {

			callback( this );

			const children = this.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].traverse( callback );

			}

		}

		traverseVisible( callback ) {

			if ( this.visible === false ) return;

			callback( this );

			const children = this.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].traverseVisible( callback );

			}

		}

		traverseAncestors( callback ) {

			const parent = this.parent;

			if ( parent !== null ) {

				callback( parent );

				parent.traverseAncestors( callback );

			}

		}

		updateMatrix() {

			this.matrix.compose( this.position, this.quaternion, this.scale );

			this.matrixWorldNeedsUpdate = true;

		}

		updateMatrixWorld( force ) {

			if ( this.matrixAutoUpdate ) this.updateMatrix();

			if ( this.matrixWorldNeedsUpdate || force ) {

				if ( this.parent === null ) {

					this.matrixWorld.copy( this.matrix );

				} else {

					this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

				}

				this.matrixWorldNeedsUpdate = false;

				force = true;

			}

			// update children

			const children = this.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].updateMatrixWorld( force );

			}

		}

		updateWorldMatrix( updateParents, updateChildren ) {

			const parent = this.parent;

			if ( updateParents === true && parent !== null ) {

				parent.updateWorldMatrix( true, false );

			}

			if ( this.matrixAutoUpdate ) this.updateMatrix();

			if ( this.parent === null ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			// update children

			if ( updateChildren === true ) {

				const children = this.children;

				for ( let i = 0, l = children.length; i < l; i ++ ) {

					children[ i ].updateWorldMatrix( false, true );

				}

			}

		}
	}

	Object3D.DefaultUp = new Vector3( 0, 1, 0 );
	Object3D.DefaultMatrixAutoUpdate = true;

	Object3D.prototype.isObject3D = true;

	class Scene extends Object3D {

		constructor() {

			super();

			this.type = 'Scene';

			this.background = null;
			this.environment = null;
			this.fog = null;

			this.overrideMaterial = null;

			this.autoUpdate = true; // checked by the renderer

			if ( typeof __THREE_DEVTOOLS__ !== 'undefined' ) {

				__THREE_DEVTOOLS__.dispatchEvent( new CustomEvent( 'observe', { detail: this } ) );

			}

		}
	}

	Scene.prototype.isScene = true;

	const _v0 = /*@__PURE__*/ new Vector3();
	const _v1 = /*@__PURE__*/ new Vector3();
	const _v2 = /*@__PURE__*/ new Vector3();
	const _v3 = /*@__PURE__*/ new Vector3();

	const _vab = /*@__PURE__*/ new Vector3();
	const _vac = /*@__PURE__*/ new Vector3();
	const _vbc = /*@__PURE__*/ new Vector3();
	const _vap = /*@__PURE__*/ new Vector3();
	const _vbp = /*@__PURE__*/ new Vector3();
	const _vcp = /*@__PURE__*/ new Vector3();

	class Triangle {

		constructor( a = new Vector3(), b = new Vector3(), c = new Vector3() ) {

			this.a = a;
			this.b = b;
			this.c = c;

		}

		static getNormal( a, b, c, target ) {

			target.subVectors( c, b );
			_v0.subVectors( a, b );
			target.cross( _v0 );

			const targetLengthSq = target.lengthSq();
			if ( targetLengthSq > 0 ) {

				return target.multiplyScalar( 1 / Math.sqrt( targetLengthSq ) );

			}

			return target.set( 0, 0, 0 );

		}

		// static/instance method to calculate barycentric coordinates
		// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
		static getBarycoord( point, a, b, c, target ) {

			_v0.subVectors( c, a );
			_v1.subVectors( b, a );
			_v2.subVectors( point, a );

			const dot00 = _v0.dot( _v0 );
			const dot01 = _v0.dot( _v1 );
			const dot02 = _v0.dot( _v2 );
			const dot11 = _v1.dot( _v1 );
			const dot12 = _v1.dot( _v2 );

			const denom = ( dot00 * dot11 - dot01 * dot01 );

			// collinear or singular triangle
			if ( denom === 0 ) {

				// arbitrary location outside of triangle?
				// not sure if this is the best idea, maybe should be returning undefined
				return target.set( - 2, - 1, - 1 );

			}

			const invDenom = 1 / denom;
			const u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
			const v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

			// barycentric coordinates must always sum to 1
			return target.set( 1 - u - v, v, u );

		}

		static containsPoint( point, a, b, c ) {

			this.getBarycoord( point, a, b, c, _v3 );

			return ( _v3.x >= 0 ) && ( _v3.y >= 0 ) && ( ( _v3.x + _v3.y ) <= 1 );

		}

		static getUV( point, p1, p2, p3, uv1, uv2, uv3, target ) {

			this.getBarycoord( point, p1, p2, p3, _v3 );

			target.set( 0, 0 );
			target.addScaledVector( uv1, _v3.x );
			target.addScaledVector( uv2, _v3.y );
			target.addScaledVector( uv3, _v3.z );

			return target;

		}

		static isFrontFacing( a, b, c, direction ) {

			_v0.subVectors( c, b );
			_v1.subVectors( a, b );

			// strictly front facing
			return ( _v0.cross( _v1 ).dot( direction ) < 0 ) ? true : false;

		}

		set( a, b, c ) {

			this.a.copy( a );
			this.b.copy( b );
			this.c.copy( c );

			return this;

		}

		setFromPointsAndIndices( points, i0, i1, i2 ) {

			this.a.copy( points[ i0 ] );
			this.b.copy( points[ i1 ] );
			this.c.copy( points[ i2 ] );

			return this;

		}

		setFromAttributeAndIndices( attribute, i0, i1, i2 ) {

			this.a.fromBufferAttribute( attribute, i0 );
			this.b.fromBufferAttribute( attribute, i1 );
			this.c.fromBufferAttribute( attribute, i2 );

			return this;

		}

		clone() {

			return new this.constructor().copy( this );

		}

		copy( triangle ) {

			this.a.copy( triangle.a );
			this.b.copy( triangle.b );
			this.c.copy( triangle.c );

			return this;

		}

		getArea() {

			_v0.subVectors( this.c, this.b );
			_v1.subVectors( this.a, this.b );

			return _v0.cross( _v1 ).length() * 0.5;

		}

		getMidpoint( target ) {

			return target.addVectors( this.a, this.b ).add( this.c ).multiplyScalar( 1 / 3 );

		}

		getNormal( target ) {

			return Triangle.getNormal( this.a, this.b, this.c, target );

		}

		getPlane( target ) {

			return target.setFromCoplanarPoints( this.a, this.b, this.c );

		}

		getBarycoord( point, target ) {

			return Triangle.getBarycoord( point, this.a, this.b, this.c, target );

		}

		getUV( point, uv1, uv2, uv3, target ) {

			return Triangle.getUV( point, this.a, this.b, this.c, uv1, uv2, uv3, target );

		}

		containsPoint( point ) {

			return Triangle.containsPoint( point, this.a, this.b, this.c );

		}

		isFrontFacing( direction ) {

			return Triangle.isFrontFacing( this.a, this.b, this.c, direction );

		}

		intersectsBox( box ) {

			return box.intersectsTriangle( this );

		}

		closestPointToPoint( p, target ) {

			const a = this.a, b = this.b, c = this.c;
			let v, w;

			// algorithm thanks to Real-Time Collision Detection by Christer Ericson,
			// published by Morgan Kaufmann Publishers, (c) 2005 Elsevier Inc.,
			// under the accompanying license; see chapter 5.1.5 for detailed explanation.
			// basically, we're distinguishing which of the voronoi regions of the triangle
			// the point lies in with the minimum amount of redundant computation.

			_vab.subVectors( b, a );
			_vac.subVectors( c, a );
			_vap.subVectors( p, a );
			const d1 = _vab.dot( _vap );
			const d2 = _vac.dot( _vap );
			if ( d1 <= 0 && d2 <= 0 ) {

				// vertex region of A; barycentric coords (1, 0, 0)
				return target.copy( a );

			}

			_vbp.subVectors( p, b );
			const d3 = _vab.dot( _vbp );
			const d4 = _vac.dot( _vbp );
			if ( d3 >= 0 && d4 <= d3 ) {

				// vertex region of B; barycentric coords (0, 1, 0)
				return target.copy( b );

			}

			const vc = d1 * d4 - d3 * d2;
			if ( vc <= 0 && d1 >= 0 && d3 <= 0 ) {

				v = d1 / ( d1 - d3 );
				// edge region of AB; barycentric coords (1-v, v, 0)
				return target.copy( a ).addScaledVector( _vab, v );

			}

			_vcp.subVectors( p, c );
			const d5 = _vab.dot( _vcp );
			const d6 = _vac.dot( _vcp );
			if ( d6 >= 0 && d5 <= d6 ) {

				// vertex region of C; barycentric coords (0, 0, 1)
				return target.copy( c );

			}

			const vb = d5 * d2 - d1 * d6;
			if ( vb <= 0 && d2 >= 0 && d6 <= 0 ) {

				w = d2 / ( d2 - d6 );
				// edge region of AC; barycentric coords (1-w, 0, w)
				return target.copy( a ).addScaledVector( _vac, w );

			}

			const va = d3 * d6 - d5 * d4;
			if ( va <= 0 && ( d4 - d3 ) >= 0 && ( d5 - d6 ) >= 0 ) {

				_vbc.subVectors( c, b );
				w = ( d4 - d3 ) / ( ( d4 - d3 ) + ( d5 - d6 ) );
				// edge region of BC; barycentric coords (0, 1-w, w)
				return target.copy( b ).addScaledVector( _vbc, w ); // edge region of BC

			}

			// face region
			const denom = 1 / ( va + vb + vc );
			// u = va * denom
			v = vb * denom;
			w = vc * denom;

			return target.copy( a ).addScaledVector( _vab, v ).addScaledVector( _vac, w );

		}

		equals( triangle ) {

			return triangle.a.equals( this.a ) && triangle.b.equals( this.b ) && triangle.c.equals( this.c );

		}

	}

	let _id = 0;

	const _m1 = /*@__PURE__*/ new Matrix4();
	const _obj = /*@__PURE__*/ new Object3D();
	const _offset = /*@__PURE__*/ new Vector3();
	const _vector = /*@__PURE__*/ new Vector3();

	class BufferGeometry extends EventDispatcher {

		constructor() {

			super();

			Object.defineProperty( this, 'id', { value: _id ++ } );

			this.uuid = generateUUID();

			this.name = '';
			this.type = 'BufferGeometry';

			this.index = null;
			this.attributes = {};

			this.morphAttributes = {};
			this.morphTargetsRelative = false;

			this.groups = [];

			this.boundingBox = null;
			this.boundingSphere = null;

			this.drawRange = { start: 0, count: Infinity };

			this.userData = {};

		}

		getIndex() {

			return this.index;

		}

		setIndex( index ) {

			if ( Array.isArray( index ) ) {

				this.index = new ( arrayMax( index ) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( index, 1 );

			} else {

				this.index = index;

			}

			return this;

		}

		getAttribute( name ) {

			return this.attributes[ name ];

		}

		setAttribute( name, attribute ) {

			this.attributes[ name ] = attribute;

			return this;

		}

		deleteAttribute( name ) {

			delete this.attributes[ name ];

			return this;

		}

		hasAttribute( name ) {

			return this.attributes[ name ] !== undefined;

		}

		addGroup( start, count, materialIndex = 0 ) {

			this.groups.push( {

				start: start,
				count: count,
				materialIndex: materialIndex

			} );

		}

		clearGroups() {

			this.groups = [];

		}

		setDrawRange( start, count ) {

			this.drawRange.start = start;
			this.drawRange.count = count;

		}

		applyMatrix4( matrix ) {

			const position = this.attributes.position;

			if ( position !== undefined ) {

				position.applyMatrix4( matrix );

				position.needsUpdate = true;

			}

			const normal = this.attributes.normal;

			if ( normal !== undefined ) {

				const normalMatrix = new Matrix3().getNormalMatrix( matrix );

				normal.applyNormalMatrix( normalMatrix );

				normal.needsUpdate = true;

			}

			const tangent = this.attributes.tangent;

			if ( tangent !== undefined ) {

				tangent.transformDirection( matrix );

				tangent.needsUpdate = true;

			}

			return this;

		}

		applyQuaternion( q ) {

			_m1.makeRotationFromQuaternion( q );

			this.applyMatrix4( _m1 );

			return this;

		}

		rotateX( angle ) {

			// rotate geometry around world x-axis

			_m1.makeRotationX( angle );

			this.applyMatrix4( _m1 );

			return this;

		}

		rotateY( angle ) {

			// rotate geometry around world y-axis

			_m1.makeRotationY( angle );

			this.applyMatrix4( _m1 );

			return this;

		}

		rotateZ( angle ) {

			// rotate geometry around world z-axis

			_m1.makeRotationZ( angle );

			this.applyMatrix4( _m1 );

			return this;

		}

		translate( x, y, z ) {

			// translate geometry

			_m1.makeTranslation( x, y, z );

			this.applyMatrix4( _m1 );

			return this;

		}

		scale( x, y, z ) {

			// scale geometry

			_m1.makeScale( x, y, z );

			this.applyMatrix4( _m1 );

			return this;

		}

		lookAt( vector ) {

			_obj.lookAt( vector );

			_obj.updateMatrix();

			this.applyMatrix4( _obj.matrix );

			return this;

		}

		center() {

			this.computeBoundingBox();

			this.boundingBox.getCenter( _offset ).negate();

			this.translate( _offset.x, _offset.y, _offset.z );

			return this;

		}

		setFromPoints( points ) {

			const position = [];

			for ( let i = 0, l = points.length; i < l; i ++ ) {

				const point = points[ i ];
				position.push( point.x, point.y, point.z || 0 );

			}

			this.setAttribute( 'position', new Float32BufferAttribute( position, 3 ) );

			return this;

		}

		computeTangents() {

			const index = this.index;
			const attributes = this.attributes;

			// based on http://www.terathon.com/code/tangent.html
			// (per vertex tangents)

			if ( index === null ||
				 attributes.position === undefined ||
				 attributes.normal === undefined ||
				 attributes.uv === undefined ) {

				console.error( 'THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)' );
				return;

			}

			const indices = index.array;
			const positions = attributes.position.array;
			const normals = attributes.normal.array;
			const uvs = attributes.uv.array;

			const nVertices = positions.length / 3;

			if ( attributes.tangent === undefined ) {

				this.setAttribute( 'tangent', new BufferAttribute( new Float32Array( 4 * nVertices ), 4 ) );

			}

			const tangents = attributes.tangent.array;

			const tan1 = [], tan2 = [];

			for ( let i = 0; i < nVertices; i ++ ) {

				tan1[ i ] = new Vector3();
				tan2[ i ] = new Vector3();

			}

			const vA = new Vector3(),
				vB = new Vector3(),
				vC = new Vector3(),

				uvA = new Vector2(),
				uvB = new Vector2(),
				uvC = new Vector2(),

				sdir = new Vector3(),
				tdir = new Vector3();

			function handleTriangle( a, b, c ) {

				vA.fromArray( positions, a * 3 );
				vB.fromArray( positions, b * 3 );
				vC.fromArray( positions, c * 3 );

				uvA.fromArray( uvs, a * 2 );
				uvB.fromArray( uvs, b * 2 );
				uvC.fromArray( uvs, c * 2 );

				vB.sub( vA );
				vC.sub( vA );

				uvB.sub( uvA );
				uvC.sub( uvA );

				const r = 1.0 / ( uvB.x * uvC.y - uvC.x * uvB.y );

				// silently ignore degenerate uv triangles having coincident or colinear vertices

				if ( ! isFinite( r ) ) return;

				sdir.copy( vB ).multiplyScalar( uvC.y ).addScaledVector( vC, - uvB.y ).multiplyScalar( r );
				tdir.copy( vC ).multiplyScalar( uvB.x ).addScaledVector( vB, - uvC.x ).multiplyScalar( r );

				tan1[ a ].add( sdir );
				tan1[ b ].add( sdir );
				tan1[ c ].add( sdir );

				tan2[ a ].add( tdir );
				tan2[ b ].add( tdir );
				tan2[ c ].add( tdir );

			}

			let groups = this.groups;

			if ( groups.length === 0 ) {

				groups = [ {
					start: 0,
					count: indices.length
				} ];

			}

			for ( let i = 0, il = groups.length; i < il; ++ i ) {

				const group = groups[ i ];

				const start = group.start;
				const count = group.count;

				for ( let j = start, jl = start + count; j < jl; j += 3 ) {

					handleTriangle(
						indices[ j + 0 ],
						indices[ j + 1 ],
						indices[ j + 2 ]
					);

				}

			}

			const tmp = new Vector3(), tmp2 = new Vector3();
			const n = new Vector3(), n2 = new Vector3();

			function handleVertex( v ) {

				n.fromArray( normals, v * 3 );
				n2.copy( n );

				const t = tan1[ v ];

				// Gram-Schmidt orthogonalize

				tmp.copy( t );
				tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

				// Calculate handedness

				tmp2.crossVectors( n2, t );
				const test = tmp2.dot( tan2[ v ] );
				const w = ( test < 0.0 ) ? - 1.0 : 1.0;

				tangents[ v * 4 ] = tmp.x;
				tangents[ v * 4 + 1 ] = tmp.y;
				tangents[ v * 4 + 2 ] = tmp.z;
				tangents[ v * 4 + 3 ] = w;

			}

			for ( let i = 0, il = groups.length; i < il; ++ i ) {

				const group = groups[ i ];

				const start = group.start;
				const count = group.count;

				for ( let j = start, jl = start + count; j < jl; j += 3 ) {

					handleVertex( indices[ j + 0 ] );
					handleVertex( indices[ j + 1 ] );
					handleVertex( indices[ j + 2 ] );

				}

			}

		}

		computeVertexNormals() {

			const index = this.index;
			const positionAttribute = this.getAttribute( 'position' );

			if ( positionAttribute !== undefined ) {

				let normalAttribute = this.getAttribute( 'normal' );

				if ( normalAttribute === undefined ) {

					normalAttribute = new BufferAttribute( new Float32Array( positionAttribute.count * 3 ), 3 );
					this.setAttribute( 'normal', normalAttribute );

				} else {

					// reset existing normals to zero

					for ( let i = 0, il = normalAttribute.count; i < il; i ++ ) {

						normalAttribute.setXYZ( i, 0, 0, 0 );

					}

				}

				const pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
				const nA = new Vector3(), nB = new Vector3(), nC = new Vector3();
				const cb = new Vector3(), ab = new Vector3();

				// indexed elements

				if ( index ) {

					for ( let i = 0, il = index.count; i < il; i += 3 ) {

						const vA = index.getX( i + 0 );
						const vB = index.getX( i + 1 );
						const vC = index.getX( i + 2 );

						pA.fromBufferAttribute( positionAttribute, vA );
						pB.fromBufferAttribute( positionAttribute, vB );
						pC.fromBufferAttribute( positionAttribute, vC );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						nA.fromBufferAttribute( normalAttribute, vA );
						nB.fromBufferAttribute( normalAttribute, vB );
						nC.fromBufferAttribute( normalAttribute, vC );

						nA.add( cb );
						nB.add( cb );
						nC.add( cb );

						normalAttribute.setXYZ( vA, nA.x, nA.y, nA.z );
						normalAttribute.setXYZ( vB, nB.x, nB.y, nB.z );
						normalAttribute.setXYZ( vC, nC.x, nC.y, nC.z );

					}

				} else {

					// non-indexed elements (unconnected triangle soup)

					for ( let i = 0, il = positionAttribute.count; i < il; i += 3 ) {

						pA.fromBufferAttribute( positionAttribute, i + 0 );
						pB.fromBufferAttribute( positionAttribute, i + 1 );
						pC.fromBufferAttribute( positionAttribute, i + 2 );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						normalAttribute.setXYZ( i + 0, cb.x, cb.y, cb.z );
						normalAttribute.setXYZ( i + 1, cb.x, cb.y, cb.z );
						normalAttribute.setXYZ( i + 2, cb.x, cb.y, cb.z );

					}

				}

				this.normalizeNormals();

				normalAttribute.needsUpdate = true;

			}

		}


		normalizeNormals() {

			const normals = this.attributes.normal;

			for ( let i = 0, il = normals.count; i < il; i ++ ) {

				_vector.fromBufferAttribute( normals, i );

				_vector.normalize();

				normals.setXYZ( i, _vector.x, _vector.y, _vector.z );

			}

		}

		toNonIndexed() {

			function convertBufferAttribute( attribute, indices ) {

				const array = attribute.array;
				const itemSize = attribute.itemSize;
				const normalized = attribute.normalized;

				const array2 = new array.constructor( indices.length * itemSize );

				let index = 0, index2 = 0;

				for ( let i = 0, l = indices.length; i < l; i ++ ) {

					if ( attribute.isInterleavedBufferAttribute ) {

						index = indices[ i ] * attribute.data.stride + attribute.offset;

					} else {

						index = indices[ i ] * itemSize;

					}

					for ( let j = 0; j < itemSize; j ++ ) {

						array2[ index2 ++ ] = array[ index ++ ];

					}

				}

				return new BufferAttribute( array2, itemSize, normalized );

			}

			//

			if ( this.index === null ) {

				console.warn( 'THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.' );
				return this;

			}

			const geometry2 = new BufferGeometry();

			const indices = this.index.array;
			const attributes = this.attributes;

			// attributes

			for ( const name in attributes ) {

				const attribute = attributes[ name ];

				const newAttribute = convertBufferAttribute( attribute, indices );

				geometry2.setAttribute( name, newAttribute );

			}

			// morph attributes

			const morphAttributes = this.morphAttributes;

			for ( const name in morphAttributes ) {

				const morphArray = [];
				const morphAttribute = morphAttributes[ name ]; // morphAttribute: array of Float32BufferAttributes

				for ( let i = 0, il = morphAttribute.length; i < il; i ++ ) {

					const attribute = morphAttribute[ i ];

					const newAttribute = convertBufferAttribute( attribute, indices );

					morphArray.push( newAttribute );

				}

				geometry2.morphAttributes[ name ] = morphArray;

			}

			geometry2.morphTargetsRelative = this.morphTargetsRelative;

			// groups

			const groups = this.groups;

			for ( let i = 0, l = groups.length; i < l; i ++ ) {

				const group = groups[ i ];
				geometry2.addGroup( group.start, group.count, group.materialIndex );

			}

			return geometry2;

		}

		dispose() {

			this.dispatchEvent( { type: 'dispose' } );

		}

	}

	BufferGeometry.prototype.isBufferGeometry = true;

	class Mesh extends Object3D {

		constructor( geometry = new BufferGeometry(), material ) {

			super();

			this.type = 'Mesh';

			this.geometry = geometry;
			this.material = material;

			this.updateMorphTargets();

		}

		copy( source ) {

			super.copy( source );

			if ( source.morphTargetInfluences !== undefined ) {

				this.morphTargetInfluences = source.morphTargetInfluences.slice();

			}

			if ( source.morphTargetDictionary !== undefined ) {

				this.morphTargetDictionary = Object.assign( {}, source.morphTargetDictionary );

			}

			this.material = source.material;
			this.geometry = source.geometry;

			return this;

		}

		updateMorphTargets() {

		}

	}

	Mesh.prototype.isMesh = true;

	class Group extends Object3D {

		constructor() {

			super();

			this.type = 'Group';

		}

	}

	Group.prototype.isGroup = true;

	class BoxGeometry extends BufferGeometry {

		constructor( width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1 ) {

			super();

			this.type = 'BoxGeometry';

			this.parameters = {
				width: width,
				height: height,
				depth: depth,
				widthSegments: widthSegments,
				heightSegments: heightSegments,
				depthSegments: depthSegments
			};

			const scope = this;

			// segments

			widthSegments = Math.floor( widthSegments );
			heightSegments = Math.floor( heightSegments );
			depthSegments = Math.floor( depthSegments );

			// buffers

			const indices = [];
			const vertices = [];
			const normals = [];
			const uvs = [];

			// helper variables

			let numberOfVertices = 0;
			let groupStart = 0;

			// build each side of the box geometry

			buildPlane( 'z', 'y', 'x', - 1, - 1, depth, height, width, depthSegments, heightSegments, 0 ); // px
			buildPlane( 'z', 'y', 'x', 1, - 1, depth, height, - width, depthSegments, heightSegments, 1 ); // nx
			buildPlane( 'x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2 ); // py
			buildPlane( 'x', 'z', 'y', 1, - 1, width, depth, - height, widthSegments, depthSegments, 3 ); // ny
			buildPlane( 'x', 'y', 'z', 1, - 1, width, height, depth, widthSegments, heightSegments, 4 ); // pz
			buildPlane( 'x', 'y', 'z', - 1, - 1, width, height, - depth, widthSegments, heightSegments, 5 ); // nz

			// build geometry

			this.setIndex( indices );
			this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
			this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
			this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

			function buildPlane( u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex ) {

				const segmentWidth = width / gridX;
				const segmentHeight = height / gridY;

				const widthHalf = width / 2;
				const heightHalf = height / 2;
				const depthHalf = depth / 2;

				const gridX1 = gridX + 1;
				const gridY1 = gridY + 1;

				let vertexCounter = 0;
				let groupCount = 0;

				const vector = new Vector3();

				// generate vertices, normals and uvs

				for ( let iy = 0; iy < gridY1; iy ++ ) {

					const y = iy * segmentHeight - heightHalf;

					for ( let ix = 0; ix < gridX1; ix ++ ) {

						const x = ix * segmentWidth - widthHalf;

						// set values to correct vector component

						vector[ u ] = x * udir;
						vector[ v ] = y * vdir;
						vector[ w ] = depthHalf;

						// now apply vector to vertex buffer

						vertices.push( vector.x, vector.y, vector.z );

						// set values to correct vector component

						vector[ u ] = 0;
						vector[ v ] = 0;
						vector[ w ] = depth > 0 ? 1 : - 1;

						// now apply vector to normal buffer

						normals.push( vector.x, vector.y, vector.z );

						// uvs

						uvs.push( ix / gridX );
						uvs.push( 1 - ( iy / gridY ) );

						// counters

						vertexCounter += 1;

					}

				}

				// indices

				// 1. you need three indices to draw a single face
				// 2. a single segment consists of two faces
				// 3. so we need to generate six (2*3) indices per segment

				for ( let iy = 0; iy < gridY; iy ++ ) {

					for ( let ix = 0; ix < gridX; ix ++ ) {

						const a = numberOfVertices + ix + gridX1 * iy;
						const b = numberOfVertices + ix + gridX1 * ( iy + 1 );
						const c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
						const d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;

						// faces

						indices.push( a, b, d );
						indices.push( b, c, d );

						// increase counter

						groupCount += 6;

					}

				}

				// add a group to the geometry. this will ensure multi material support

				scope.addGroup( groupStart, groupCount, materialIndex );

				// calculate new start value for groups

				groupStart += groupCount;

				// update total number of vertices

				numberOfVertices += vertexCounter;

			}

		}

		static fromJSON( data ) {

			return new BoxGeometry( data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments );

		}

	}

	new Vector3();
	new Vector3();
	new Vector3();
	new Triangle();

	let materialId = 0;

	class Material extends EventDispatcher {

		constructor() {

			super();

			Object.defineProperty( this, 'id', { value: materialId ++ } );

			this.uuid = generateUUID();

			this.name = '';
			this.type = 'Material';

			this.fog = true;

			this.blending = NormalBlending;
			this.side = FrontSide;
			this.vertexColors = false;

			this.opacity = 1;
			this.transparent = false;

			this.blendSrc = SrcAlphaFactor;
			this.blendDst = OneMinusSrcAlphaFactor;
			this.blendEquation = AddEquation;
			this.blendSrcAlpha = null;
			this.blendDstAlpha = null;
			this.blendEquationAlpha = null;

			this.depthFunc = LessEqualDepth;
			this.depthTest = true;
			this.depthWrite = true;

			this.stencilWriteMask = 0xff;
			this.stencilFunc = AlwaysStencilFunc;
			this.stencilRef = 0;
			this.stencilFuncMask = 0xff;
			this.stencilFail = KeepStencilOp;
			this.stencilZFail = KeepStencilOp;
			this.stencilZPass = KeepStencilOp;
			this.stencilWrite = false;

			this.clippingPlanes = null;
			this.clipIntersection = false;
			this.clipShadows = false;

			this.shadowSide = null;

			this.colorWrite = true;
			this.alphaWrite = true;

			this.precision = null; // override the renderer's default precision for this material

			this.polygonOffset = false;
			this.polygonOffsetFactor = 0;
			this.polygonOffsetUnits = 0;

			this.dithering = false;

			this.alphaToCoverage = false;
			this.premultipliedAlpha = false;

			this.visible = true;

			this.toneMapped = true;

			this.userData = {};

			this.version = 0;

			this._alphaTest = 0;

		}

		get alphaTest() {

			return this._alphaTest;

		}

		set alphaTest( value ) {

			if ( this._alphaTest > 0 !== value > 0 ) {

				this.version ++;

			}

			this._alphaTest = value;

		}

		onBuild( /* shaderobject, renderer */ ) {}

		onBeforeRender( /* renderer, scene, camera, geometry, object, group */ ) {}

		onBeforeCompile( /* shaderobject, renderer */ ) {}

		customProgramCacheKey() {

			return this.onBeforeCompile.toString();

		}

		setValues( values ) {

			if ( values === undefined ) return;

			for ( const key in values ) {

				const newValue = values[ key ];

				if ( newValue === undefined ) {

					console.warn( 'THREE.Material: \'' + key + '\' parameter is undefined.' );
					continue;

				}

				// for backward compatability if shading is set in the constructor
				if ( key === 'shading' ) {

					console.warn( 'THREE.' + this.type + ': .shading has been removed. Use the boolean .flatShading instead.' );
					this.flatShading = ( newValue === FlatShading ) ? true : false;
					continue;

				}

				const currentValue = this[ key ];

				if ( currentValue === undefined ) {

					console.warn( 'THREE.' + this.type + ': \'' + key + '\' is not a property of this material.' );
					continue;

				}

				if ( currentValue && currentValue.isColor ) {

					currentValue.set( newValue );

				} else if ( ( currentValue && currentValue.isVector3 ) && ( newValue && newValue.isVector3 ) ) {

					currentValue.copy( newValue );

				} else {

					this[ key ] = newValue;

				}

			}

		}

		dispose() {

			this.dispatchEvent( { type: 'dispose' } );

		}

		set needsUpdate( value ) {

			if ( value === true ) this.version ++;

		}

	}

	Material.prototype.isMaterial = true;

	var default_vertex = /* glsl */`void main() {gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);`;

	var default_fragment = `void main(){gl_FragColor=vec4(1.,0.,0.,1.);}`;

	/**
	 * parameters = {
	 *  defines: { "label" : "value" },
	 *  uniforms: { "parameter1": { value: 1.0 }, "parameter2": { value2: 2 } },
	 *
	 *  fragmentShader: <string>,
	 *  vertexShader: <string>,
	 *
	 *  wireframe: <boolean>,
	 *  wireframeLinewidth: <float>,
	 *
	 *  lights: <bool>
	 * }
	 */

	class ShaderMaterial extends Material {

		constructor( parameters ) {

			super();

			this.type = 'ShaderMaterial';

			this.defines = {};
			this.uniforms = {};

			this.vertexShader = default_vertex;
			this.fragmentShader = default_fragment;

			this.linewidth = 1;

			this.wireframe = false;
			this.wireframeLinewidth = 1;

			this.fog = false; // set to use scene fog
			this.lights = false; // set to use scene lights
			this.clipping = false; // set to use user-defined clipping planes

			this.extensions = {
				derivatives: false, // set to use derivatives
				fragDepth: false, // set to use fragment depth values
				drawBuffers: false, // set to use draw buffers
				shaderTextureLOD: false // set to use shader texture LOD
			};

			// When rendered geometry doesn't include these attributes but the material does,
			// use these default values in WebGL. This avoids errors when buffer data is missing.
			this.defaultAttributeValues = {
				'color': [ 1, 1, 1 ],
				'uv': [ 0, 0 ],
				'uv2': [ 0, 0 ]
			};

			this.index0AttributeName = undefined;
			this.uniformsNeedUpdate = false;

			this.glslVersion = null;

			if ( parameters !== undefined ) {

				if ( parameters.attributes !== undefined ) {

					console.error( 'THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead.' );

				}

				this.setValues( parameters );

			}

		}

	}

	ShaderMaterial.prototype.isShaderMaterial = true;

	class RawShaderMaterial extends ShaderMaterial {

		constructor( parameters ) {

			super( parameters );

			this.type = 'RawShaderMaterial';

		}

	}

	RawShaderMaterial.prototype.isRawShaderMaterial = true;

	class Camera extends Object3D {

		constructor() {

			super();

			this.type = 'Camera';

			this.matrixWorldInverse = new Matrix4();

			this.projectionMatrix = new Matrix4();
			this.projectionMatrixInverse = new Matrix4();

		}

		copy( source, recursive ) {

			super.copy( source, recursive );

			this.matrixWorldInverse.copy( source.matrixWorldInverse );

			this.projectionMatrix.copy( source.projectionMatrix );
			this.projectionMatrixInverse.copy( source.projectionMatrixInverse );

			return this;

		}

		getWorldDirection( target ) {

			this.updateWorldMatrix( true, false );

			const e = this.matrixWorld.elements;

			return target.set( - e[ 8 ], - e[ 9 ], - e[ 10 ] ).normalize();

		}

		updateMatrixWorld( force ) {

			super.updateMatrixWorld( force );

			this.matrixWorldInverse.copy( this.matrixWorld ).invert();

		}

		updateWorldMatrix( updateParents, updateChildren ) {

			super.updateWorldMatrix( updateParents, updateChildren );

			this.matrixWorldInverse.copy( this.matrixWorld ).invert();

		}

	}

	Camera.prototype.isCamera = true;

	class PerspectiveCamera extends Camera {

		constructor( fov = 50, aspect = 1, near = 0.1, far = 2000 ) {

			super();

			this.type = 'PerspectiveCamera';

			this.fov = fov;
			this.zoom = 1;

			this.near = near;
			this.far = far;
			this.focus = 10;

			this.aspect = aspect;
			this.view = null;

			this.filmGauge = 35;	// width of the film (default in millimeters)
			this.filmOffset = 0;	// horizontal film offset (same unit as gauge)

			this.updateProjectionMatrix();

		}

		/**
		 * Sets the FOV by focal length in respect to the current .filmGauge.
		 *
		 * The default film gauge is 35, so that the focal length can be specified for
		 * a 35mm (full frame) camera.
		 *
		 * Values for focal length and film gauge must have the same unit.
		 */
		setFocalLength( focalLength ) {

			/** see {@link http://www.bobatkins.com/photography/technical/field_of_view.html} */
			const vExtentSlope = 0.5 * this.getFilmHeight() / focalLength;

			this.fov = RAD2DEG * 2 * Math.atan( vExtentSlope );
			this.updateProjectionMatrix();

		}

		/**
		 * Calculates the focal length from the current .fov and .filmGauge.
		 */
		getFocalLength() {

			const vExtentSlope = Math.tan( DEG2RAD * 0.5 * this.fov );

			return 0.5 * this.getFilmHeight() / vExtentSlope;

		}

		getEffectiveFOV() {

			return RAD2DEG * 2 * Math.atan(
				Math.tan( DEG2RAD * 0.5 * this.fov ) / this.zoom );

		}

		getFilmWidth() {

			// film not completely covered in portrait format (aspect < 1)
			return this.filmGauge * Math.min( this.aspect, 1 );

		}

		getFilmHeight() {

			// film not completely covered in landscape format (aspect > 1)
			return this.filmGauge / Math.max( this.aspect, 1 );

		}

		/**
		 * Sets an offset in a larger frustum. This is useful for multi-window or
		 * multi-monitor/multi-machine setups.
		 *
		 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
		 * the monitors are in grid like this
		 *
		 *   +---+---+---+
		 *   | A | B | C |
		 *   +---+---+---+
		 *   | D | E | F |
		 *   +---+---+---+
		 *
		 * then for each monitor you would call it like this
		 *
		 *   const w = 1920;
		 *   const h = 1080;
		 *   const fullWidth = w * 3;
		 *   const fullHeight = h * 2;
		 *
		 *   --A--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
		 *   --B--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
		 *   --C--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
		 *   --D--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
		 *   --E--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
		 *   --F--
		 *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
		 *
		 *   Note there is no reason monitors have to be the same size or in a grid.
		 */
		setViewOffset( fullWidth, fullHeight, x, y, width, height ) {

			this.aspect = fullWidth / fullHeight;

			if ( this.view === null ) {

				this.view = {
					enabled: true,
					fullWidth: 1,
					fullHeight: 1,
					offsetX: 0,
					offsetY: 0,
					width: 1,
					height: 1
				};

			}

			this.view.enabled = true;
			this.view.fullWidth = fullWidth;
			this.view.fullHeight = fullHeight;
			this.view.offsetX = x;
			this.view.offsetY = y;
			this.view.width = width;
			this.view.height = height;

			this.updateProjectionMatrix();

		}

		clearViewOffset() {

			if ( this.view !== null ) {

				this.view.enabled = false;

			}

			this.updateProjectionMatrix();

		}

		updateProjectionMatrix() {

			const near = this.near;
			let top = near * Math.tan( DEG2RAD * 0.5 * this.fov ) / this.zoom;
			let height = 2 * top;
			let width = this.aspect * height;
			let left = - 0.5 * width;
			const view = this.view;

			if ( this.view !== null && this.view.enabled ) {

				const fullWidth = view.fullWidth,
					fullHeight = view.fullHeight;

				left += view.offsetX * width / fullWidth;
				top -= view.offsetY * height / fullHeight;
				width *= view.width / fullWidth;
				height *= view.height / fullHeight;

			}

			const skew = this.filmOffset;
			if ( skew !== 0 ) left += near * skew / this.getFilmWidth();

			this.projectionMatrix.makePerspective( left, left + width, top, top - height, near, this.far );

			this.projectionMatrixInverse.copy( this.projectionMatrix ).invert();

		}

	}

	PerspectiveCamera.prototype.isPerspectiveCamera = true;

	class InstancedBufferGeometry extends BufferGeometry {

		constructor() {

			super();

			this.type = 'InstancedBufferGeometry';
			this.instanceCount = Infinity;

		}
		
	}

	InstancedBufferGeometry.prototype.isInstancedBufferGeometry = true;

	class InstancedBufferAttribute extends BufferAttribute {

		constructor( array, itemSize, normalized, meshPerAttribute = 1 ) {

			if ( typeof normalized === 'number' ) {

				meshPerAttribute = normalized;

				normalized = false;

				console.error( 'THREE.InstancedBufferAttribute: The constructor now expects normalized as the third argument.' );

			}

			super( array, itemSize, normalized );

			this.meshPerAttribute = meshPerAttribute;

		}
		
	}

	InstancedBufferAttribute.prototype.isInstancedBufferAttribute = true;

	if ( typeof __THREE_DEVTOOLS__ !== 'undefined' ) {

		__THREE_DEVTOOLS__.dispatchEvent( new CustomEvent( 'register', { detail: {
			revision: REVISION,
		} } ) );

	}

	if ( typeof window !== 'undefined' ) {

		if ( window.__THREE__ ) {

			console.warn( 'WARNING: Multiple instances of Three.js being imported.' );

		} else {

			window.__THREE__ = REVISION;

		}

	}

	const COLOR = {
	  YELLOW : [255, 255, 100],
	  ORANGE : [255, 200, 100],
	  BLACK : [50, 50, 50],
	  BLUE : [100, 200, 255]
	};

	const VertexMat = new RawShaderMaterial( {
	    transparent : false,
	    uniforms : {
	    },
	    vertexShader: `
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      attribute vec3 position;
      attribute vec3 color;
      varying lowp vec3 vColor;
      varying float vHeight;
      varying float vDepth;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        vColor = color;
        vHeight = gl_Position.y;
        vDepth = gl_Position.z;
      }`,
	    fragmentShader : `
    precision highp float;
    varying lowp vec3 vColor;
    varying float vHeight;
    varying float vDepth;
    vec3 waterColor = vec3(0.48, 0.78, 1.);
    vec3 fogColor = vec3(240./255., 128./255., 1.);
    float getFogFactor(float d)
    {
      const float FogMax = 75.0;
      const float FogMin = 10.0;

      if (d>=FogMax) return 1.;
      if (d<=FogMin) return 0.;

      return 1. - (FogMax - d) / (FogMax - FogMin);
    } 

    void main(void) {

      vec3 color;
      
      if (vHeight < -6.75) {
        color = mix(vColor.rgb, waterColor, 0.65);
      } else {
        color = vec3(vColor.rgb);
      }

      float fog_alpha = min(0.4, getFogFactor(vDepth));
      color = mix(color, fogColor, fog_alpha);
      
      
      gl_FragColor= vec4(color, 1.0);
    }`
	  });

	/**
	 * @param {*} object 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} z 
	 */
	function setPosition(object, x = 1, y = 1, z = 1) {
	  object.position.x = x;
	  object.position.y = y;
	  object.position.z = z;
	}


	/**
	 * @param {*} object 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} z 
	 */
	 function setScale(object, x = 1, y = 1, z = 1) {
	  object.scale.x = x;
	  object.scale.y = y,
	  object.scale.z = z;
	}

	function getMesh(color) {
	  const geo = new BoxGeometry();
	  const vertices = 24;
	  const colors = [];
	  for (let i = 0; i < vertices; i ++) {
	    for (let j = 0; j < color.length; j ++) {
	      colors.push(color[j] / 255.0);
	    }
	  }
	  geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
	  const mesh = new Mesh(geo, VertexMat);
	  return mesh;
	} 


	function Duck() {

	  this.max_wander = Math.random() * 50 + 10;
	  this.cohesion_distance = Math.random() * 5 + 1.5;
	  this.align_distance = this.cohesion_distance + 2 + Math.random() * 4;

	  this.position = new Vector2(0,0);
	  this.velocity = new Vector2(Math.random() - 0.5, Math.random() * 0.5);

	  this.angle = 0;

	  this.root = new Object3D();
	  this.model_root = new Object3D();

	  this.root.add(this.model_root);
	  this.model_root.rotateY(-Math.PI / 2);

	  const bones = {};
	  const meshes = {};

	  bones.head = new Object3D();
	  bones.bill = new Object3D();
	  bones.feet = new Object3D();
	  meshes.body = getMesh(COLOR.YELLOW);
	  meshes.head = getMesh(COLOR.YELLOW);
	  meshes.left_eye = getMesh(COLOR.BLACK);
	  meshes.right_eye = getMesh(COLOR.BLACK);
	  meshes.bill = getMesh(COLOR.ORANGE);
	  meshes.left_foot = getMesh(COLOR.ORANGE);
	  meshes.right_foot = getMesh(COLOR.ORANGE);
	  
	  setPosition(bones.head, 1, 1, 0);
	  this.model_root.add(bones.head);
	  setPosition(bones.bill, 0.6, -0.1, 0);
	  bones.head.add(bones.bill);
	  setScale(meshes.body, 1.75, 1.35, 1.25);
	  this.model_root.add(meshes.body);
	  setScale(meshes.head, 1, 1, 1);
	  bones.head.add(meshes.head);
	  setScale(meshes.left_eye, 0.15, 0.15, 0.15);
	  setPosition(meshes.left_eye, 0.5, 0.3, -0.2);
	  bones.head.add(meshes.left_eye);
	  setScale(meshes.right_eye, 0.15, 0.15, 0.15);
	  setPosition(meshes.right_eye, 0.5, 0.3, 0.2);
	  bones.head.add(meshes.right_eye);
	  setScale(meshes.bill, 0.6, 0.4, 0.8);
	  bones.bill.add(meshes.bill);

	  setPosition(bones.feet, -0.2, -0.7, 0);
	  this.model_root.add(bones.feet);
	  setPosition(meshes.left_foot, 0, 0, 0.2);
	  setScale(meshes.left_foot, 0.2, 1, 0.6);
	  bones.feet.add(meshes.left_foot);
	  setPosition(meshes.right_foot, 0, 0, -0.2);
	  setScale(meshes.right_foot, 1, 0.2, 0.6);
	  bones.feet.add(meshes.right_foot);


	  this.root.rotateY( Math.PI * Math.random());
	  /**
	   * @param {number} x 
	   * @param {number} y 
	   * @param {number} z 
	   */
	  this.setPosition = function(x, y, z) {
	    /** @type {*} */ this.root;
	    this.root.position.x = x;
	    this.root.position.y = y;
	    this.root.position.z = z;
	  };

	  const offset = Math.random() * 5000;
	  this.update = () => {
	    const now = Date.now() + offset;
	    bones.head.rotateX(Math.sin(now / 200) / 125);
	    bones.feet.rotateZ( Math.PI / -25 );

	    // this.velocity.multiplyScalar(0.995);

	    const MAX_SPEED = 0.45;

	    if (this.velocity.length() > MAX_SPEED) {
	      this.velocity.setLength(MAX_SPEED);
	    }

	    const scale = 0.2;

	    this.root.position.x += this.velocity.x * scale;
	    this.root.position.z += this.velocity.y * scale;

	    this.root.lookAt(
	      this.root.position.x + this.velocity.x,
	      this.root.position.y,
	      this.root.position.z + this.velocity.y
	    );

	    this.root.rotateZ( Math.sin(now / 200) / 400);
	  };
	}

	function Game() {
	  const scene = new Scene();
	  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	  const canvas = document.getElementById('game_canvas');
	  const renderer = new WebGLRenderer( { antialias:true, canvas, alpha: true } );
	  renderer.setClearColor([0.48, 0.78, 1.0], 0);

	  const WindowResize = () => {
	    const width = window.innerWidth;
	    const height = window.innerHeight;

	    camera.aspect = width/height;
	    camera.updateProjectionMatrix();

	    renderer.setSize(width, height);
	  };
	  WindowResize();
	  window.addEventListener('resize', WindowResize);

	  /** @type {Duck[]} */
	  const ducks = [];

	  for (let i = 0; i < 10; i ++) {
	    const duck = new Duck();

	    duck.setPosition( (Math.random()-0.5) * 30, 0, (Math.random()-0.5) * 30);

	    scene.add(duck.root);

	    ducks.push(duck);
	  }

	  setPosition(camera, 0, 5, 24);

	  function update() {
	    requestAnimationFrame(update);

	    for (const duck of ducks) {
	      
	      seperate(duck);
	      cohesion(duck);
	      align(duck);


	      stayClose(duck);

	      duck.update();
	      
	    }
	    {
	      canvas.style.opacity = 1;//Math.min(1, Math.pow(opacity ++ / max_opacity, 2));
	    }

	    renderer.render(scene, camera);
	  }

	  /**
	   * 
	   * @param {Duck} duck 
	   */
	  function stayClose(duck) {
	    const distance = duck.root.position.length();
	    const intensity = 0.005;

	    const max = duck.max_wander;

	    if (distance > max) {

	      const steer = new Vector2(duck.root.position.x, duck.root.position.z);

	      steer.normalize();
	      steer.multiplyScalar(distance - max);
	      steer.multiplyScalar(intensity);

	      duck.velocity.sub(steer);


	    }

	  }

	  /**
	   * 
	   * @param {Duck} duck 
	   */
	  function seperate(duck) {
	    const intensity = 0.0125;

	    const desired = 2;
	    const desired_squared = Math.pow(desired, 2);

	    const delta = new Vector2(0,0);

	    const steer = new Vector2(0,0);
	    let count = 0;

	    for (let i = 0; i < ducks.length; i ++) {
	      const other = ducks[i];
	      if (other === duck) {
	        continue;
	      }
	      const dSquared = distanceSquared(duck, other);

	      if (dSquared < desired_squared) {
	        // const d = desired_squared - dSquared;
	        const d = Math.sqrt(dSquared);
	        
	        delta.x = duck.root.position.x - other.root.position.x;
	        delta.y = duck.root.position.z - other.root.position.z;
	        
	        delta.setLength(desired - d);
	        steer.add(delta);
	        count ++;
	      }
	    }

	    if (count > 0) {
	      steer.divideScalar(count);
	      // steer.normalize();
	      steer.multiplyScalar(intensity);

	      duck.velocity.add(steer);
	    }
	  }

	  /**
	   * @param {Duck} duck 
	   */
	  function cohesion(duck) {
	    const intensity = 0.0015;

	    const max_dist = duck.cohesion_distance;
	    const max_squared = Math.pow(max_dist, 2);

	    const sum_pos = new Vector2(0,0);
	    let count = 0;

	    for (let i = 0; i < ducks.length; i ++) {
	      const other = ducks[i];
	      if (other === duck) {
	        continue;
	      }
	      const dSquared = distanceSquared(duck, ducks[i]);
	      if (dSquared < max_squared) {
	        sum_pos.x += other.root.position.x;
	        sum_pos.y += other.root.position.z;
	        count ++;
	      }
	    }

	    if (count > 0) {
	      sum_pos.divideScalar(count);

	      const direction = new Vector2(
	        duck.root.position.x - sum_pos.x,
	        duck.root.position.z - sum_pos.y
	      );

	      direction.normalize();
	      direction.multiplyScalar(intensity);
	      

	      duck.velocity.sub(direction);
	    }

	  }

	  function align(duck) {
	    const intensity = 0.125;

	    const max_dist = duck.align_distance;
	    const max_squared = Math.pow(max_dist, 2);

	    const direction = new Vector2(0,0);
	    let count = 0;

	    for (let i = 0; i < ducks.length; i ++) {
	      const other = ducks[i];
	      if (other === duck) {
	        continue;
	      }
	      const dSquared = distanceSquared(duck, ducks[i]);
	      if (dSquared < max_squared) {
	        direction.add(other.velocity);
	        count ++;
	      }
	    }

	    if (count > 0) {
	      direction.divideScalar(count);
	      direction.normalize();

	      direction.multiplyScalar(intensity);

	      duck.velocity.add(direction);
	    }

	  }

	    
	    


	  update();
	}
	/**
	 * 
	 * @param {Duck} duck 
	 * @param {Duck} other 
	 */
	function distanceSquared(duck, other) {
	  /** @type {Vector3} */
	  const p1 = duck.root.position;
	  /** @type {Vector3} */
	  const p2 = other.root.position;

	  return p1.distanceToSquared(p2);
	}



	Game();

})();
