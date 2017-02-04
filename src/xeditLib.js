var ref = require('ref');
var wchar_t = require('ref-wchar');
var ffi = require('ffi');

var PWChar = ref.refType(wchar_t.string);

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

var trimNull = function(str) {
	return str.substring(0, str.indexOf('\0'));
}

var xelib = {
	'Initialize': function() {
		lib.Initialize();
	},
	'Finalize': function() {
		lib.Finalize();
	},
	'GetBuffer': function() {
		var str = new Buffer(4096);
		str.type = PWChar;
		lib.GetBuffer(str, 4096);
		return trimNull(wchar_t.toString(str));
	},
	'GetExceptionMessage': function() {
		var str = new Buffer(4096);
		str.type = PWChar;
		lib.GetExceptionMessage(str, 4096);
		return trimNull(wchar_t.toString(str));
	},
	'GetGlobal': function(keyValue) {
		var str = new Buffer(512);
		str.type = PWChar;
		var key = new Buffer(keyValue.length + 1);
		key.writeCString(keyValue);
		key.type = PWChar;
		console.log("key: " + wchar_t.toString(key));
		var success = lib.GetGlobal(key, str, 512);
		if (!success) throw "xedit-lib: GetGlobal failed.";
		return trimNull(wchar_t.toString(str));
	},
	'GetLoaderDone': function() {
		return lib.GetLoaderDone();
	},
	'GetGamePath': function(mode) {
		var str = new Buffer(512);
		str.type = PWChar;
		var success = lib.GetGamePath(mode, str, 512);
		if (!success) return null;
		return trimNull(wchar_t.toString(str));
	}
}

export default xelib;
