var ref = require('ref');
var ArrayType = require('ref-array');
var wchar_t = require('ref-wchar');
var ffi = require('ffi');

var WString = wchar_t.string;
var Cardinal = ref.types.uint32;
var Integer = ref.types.int32;
var WordBool = ref.types.bool;
var Double = ref.types.double;
var PWChar = ref.refType(WString);
var PCardinal = ref.refType(Cardinal);
var PInteger = ref.refType(Integer);
var PWordBool = ref.refType(WordBool);
var PDouble = ref.refType(Double);
var PCardinalArray = ArrayType(Cardinal);

// function binding
var lib = ffi.Library('XEditLib', {
	// META FUNCTIONS
	'Initialize': [ 'void', [] ],
	'Finalize': [ 'void', [] ],
	'GetBuffer': [ 'void', [ PWChar, 'int'] ],
	'FlushBuffer': [ 'void', [] ],
	'GetExceptionMessage': ['bool', [ PWChar, 'int'] ],
	'GetGlobal': [ 'bool', [PWChar, PWChar, 'int'] ],
	'Release': [ 'bool', [ref.types.uint32] ],
	'ResetStore': [ 'bool', [] ],
	// SETUP FUNCTIONS
	'SetGameMode': [ 'void', ['int'] ],
	'GetLoadOrder': [ 'bool', [PWChar, 'int'] ],
	'LoadPlugins': [ 'bool', [PWChar] ],
	'GetLoaderDone': [ 'bool', [] ],
	'GetGamePath': [ 'bool', ['int', PWChar, 'int'] ]
});

// help functions
var trimNull = function(str) {
	return str.substring(0, str.indexOf('\0'));
};

var createTypedBuffer = function(size, type) {
	var buf = new Buffer(size);
	buf.type = type;
	return buf;
};

var readPWCharString = function(buf) {
	return trimNull(wchar_t.toString(buf));
};

var writePWCharBuffer = function(value) {
  var buf = new Buffer((value.length + 1) * 2);
	buf.write(value, 0, 'ucs2');
	buf.type = PWChar;
	return buf;
};

// wrapper functions
var xelib = {
	'Initialize': function() {
		lib.Initialize();
	},
	'Finalize': function() {
		lib.Finalize();
	},
	'GetBuffer': function() {
		var str = createTypedBuffer(4096, PWChar);
		lib.GetBuffer(str, 4096);
		return readPWCharString(str);
	},
	'GetExceptionMessage': function() {
		var str = newPWCharBuffer(4096);
		lib.GetExceptionMessage(str, 4096);
		return readPWCharString(str);
	},
	'GetGlobal': function(keyValue) {
		var str = createTypedBuffer(512, PWChar);
		var key = writePWCharBuffer(keyValue);
		var success = lib.GetGlobal(key, str, 512);
		if (!success) throw "xedit-lib: GetGlobal failed.";
		return readPWCharString(str);
	},
	'GetLoaderDone': function() {
		return lib.GetLoaderDone();
	},
	'GetGamePath': function(mode) {
		var str = createTypedBuffer(512, PWChar);
		var success = lib.GetGamePath(mode, str, 512);
		if (!success) return null;
		return readPWCharString(str);
	}
};

export default xelib;
