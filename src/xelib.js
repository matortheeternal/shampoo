var ref = require('ref');
var wchar_t = require('ref-wchar');
var ffi = require('ffi');

var Void = 'void';
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

// function binding
var lib = ffi.Library('XEditLib', {
    // META FUNCTIONS
    'Initialize': [Void, []],
    'Finalize': [Void, []],
    'GetBuffer': [Void, [PWChar, Integer]],
    'FlushBuffer': [Void, []],
    'GetExceptionMessage': [WordBool, [PWChar, Integer]],
    'GetGlobal': [WordBool, [PWChar, PWChar, Integer]],
    'Release': [WordBool, [Cardinal]],
    'ResetStore': [WordBool, []],
    // SETUP FUNCTIONS
    'SetGameMode': [WordBool, [Integer]],
    'GetLoadOrder': [WordBool, [PWChar, Integer]],
    'LoadPlugins': [WordBool, [PWChar]],
    'GetLoaderDone': [WordBool, []],
    'GetGamePath': [WordBool, [Integer, PWChar, Integer]],
    // FILE HANDLING METHODS
    'AddFile': [WordBool, [PWChar, PCardinal]],
    'FileByIndex': [WordBool, [Integer, PCardinal]],
    'FileByLoadOrder': [WordBool, [Integer, PCardinal]],
    'FileByName': [WordBool, [PWChar, PCardinal]],
    'FileByAuthor': [WordBool, [PWChar, PCardinal]],
    'SaveFile': [WordBool, [Cardinal]],
    // MASTER HANDLING METHODS
    'CleanMasters': [WordBool, [Cardinal]],
    'SortMasters': [WordBool, [Cardinal]],
    'AddMaster': [WordBool, [Cardinal, PWChar]],
    'GetMaster': [WordBool, [Cardinal, Integer, PCardinal]],
    'GetMasters': [WordBool, [Cardinal, PCardinal, Integer]],
    // FILE VALUE METHODS
    'GetFileHeader': [WordBool, [Cardinal, PCardinal]],
    'GetNextObjectId': [WordBool, [Cardinal, PCardinal]],
    'SetNextObjectID': [WordBool, [Cardinal, Cardinal]],
    'GetFileName': [WordBool, [Cardinal, PWChar, Integer]],
    'GetAuthor': [WordBool, [Cardinal, PWChar, Integer]],
    'SetAuthor': [WordBool, [Cardinal, PWChar]],
    'GetDescription': [WordBool, [Cardinal, PWChar, Integer]],
    'SetDescription': [WordBool, [Cardinal, PWChar]],
    'OverrideRecordCount': [WordBool, [Cardinal, PInteger]],
    'GetIsESM': [WordBool, [Cardinal, PWordBool]],
    'SetIsESM': [WordBool, [Cardinal, WordBool]],
    // ELEMENT HANDLING METHODS
    'GetElement': [WordBool, [Cardinal, PWChar, PCardinal]],
    'GetElements': [WordBool, [Cardinal, PCardinal, Integer]],
    'GetElementFile': [WordBool, [Cardinal, PCardinal]],
    'GetContainer': [WordBool, [Cardinal, PCardinal]],
    'AddElement': [WordBool, [Cardinal, PWChar, PCardinal]],
    'RemoveElement': [WordBool, [Cardinal, PWChar]],
    'GetLinksTo': [WordBool, [Cardinal, PWChar, PCardinal]],
    'ElementExists': [WordBool, [Cardinal, PWChar]],
    'ElementCount': [WordBool, [Cardinal, PInteger]],
    'ElementEquals': [WordBool, [Cardinal, Cardinal]],
    'CopyElement': [WordBool, [Cardinal, Cardinal, WordBool, WordBool, PCardinal]],
    'IsMaster': [WordBool, [Cardinal]],
    'IsInjected': [WordBool, [Cardinal]],
    'IsOverride': [WordBool, [Cardinal]],
    'IsWinningOverride': [WordBool, [Cardinal]],
    // ERROR CHECKING METHODS
    'CheckForErrors': [WordBool, [Cardinal]],
    'GetErrorThreadDone': [WordBool, []],
    'GetErrors': [WordBool, [PWChar, Integer]],
    'GetErrorString': [WordBool, [Cardinal, PWChar, Integer]],
    // SERIALIZATION METHODS
    'ElementToJson': [WordBool, [Cardinal, PWChar, Integer]],
    // ELEMENT VALUE METHODS
    'Name': [WordBool, [Cardinal, PWChar, Integer]],
    'Path': [WordBool, [Cardinal, PWChar, Integer]],
    'EditorID': [WordBool, [Cardinal, PWChar, Integer]],
    'Signature': [WordBool, [Cardinal, PWChar, Integer]],
    'FullName': [WordBool, [Cardinal, PWChar, Integer]],
    'SortKey': [WordBool, [Cardinal, PWChar, Integer]],
    'ElementType': [WordBool, [Cardinal, PWChar, Integer]],
    'DefType': [WordBool, [Cardinal, PWChar, Integer]],
    'GetValue': [WordBool, [Cardinal, PWChar, PWChar, Integer]],
    'SetValue': [WordBool, [Cardinal, PWChar, PWChar]],
    'GetIntValue': [WordBool, [Cardinal, PWChar, PInteger]],
    'SetIntValue': [WordBool, [Cardinal, PWChar, Integer]],
    'GetUIntValue': [WordBool, [Cardinal, PWChar, PCardinal]],
    'SetUIntValue': [WordBool, [Cardinal, PWChar, Cardinal]],
    'GetFloatValue': [WordBool, [Cardinal, PWChar, PDouble]],
    'SetFloatValue': [WordBool, [Cardinal, PWChar, Double]],
    'GetFlag': [WordBool, [Cardinal, PWChar, PWChar, PWordBool]],
    'SetFlag': [WordBool, [Cardinal, PWChar, PWChar, WordBool]],
    'ToggleFlag': [WordBool, [Cardinal, PWChar, PWChar]],
    'GetEnabledFlags': [WordBool, [Cardinal, PWChar, PWChar, Integer]],
    // GROUP HANDLING METHODS
    'HasGroup': [WordBool, [Cardinal, PWChar, PWordBool]],
    'AddGroup': [WordBool, [Cardinal, PWChar, PCardinal]],
    'GetGroupSignatures': [WordBool, [Cardinal, PWChar, Integer]],
    'GetChildGroup': [WordBool, [Cardinal, PCardinal]],
    'GroupSignatureFromName': [WordBool, [PWChar, PWChar]],
    'GroupNameFromSignature': [WordBool, [PWChar, PWChar]],
    'GetGroupSignatureNameMap': [WordBool, [PWChar, Integer]],
    // RECORD HANDLING METHODS
    'AddRecord': [WordBool, [Cardinal, PWChar, PCardinal]],
    'GetRecords': [WordBool, [Cardinal, PCardinal, Integer]],
    'RecordsBySignature': [WordBool, [Cardinal, PWChar, PCardinal, Integer]],
    'RecordByIndex': [WordBool, [Cardinal, Integer, PCardinal]],
    'RecordByFormID': [WordBool, [Cardinal, Cardinal, PCardinal]],
    'RecordByEditorID': [WordBool, [Cardinal, PWChar, PCardinal]],
    'RecordByName': [WordBool, [Cardinal, PWChar, PCardinal]],
    'OverrideCount': [WordBool, [Cardinal, PInteger]],
    'OverrideByIndex': [WordBool, [Cardinal, Integer, PCardinal]],
    'GetFormID': [WordBool, [Cardinal, PCardinal]],
    'SetFormID': [WordBool, [Cardinal, Cardinal]],
    'ExchangeReferences': [WordBool, [Cardinal, Cardinal, Cardinal]],
    'GetReferences': [WordBool, [Cardinal, PCardinal, Integer]]
});

// helper functions
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

var readCardinalArray = function(buf) {
    var a = [];
    for (var i = 0; i < buf.length; i+=4) {
      var c = buf.readUInt32LE(i);
      if (c == 0) break;
      a.push(c);
    }
    return a;
};

var writePWCharBuffer = function(value) {
    if (!value) value = '';
    var buf = new Buffer((value.length + 1) * 2);
    buf.write(value, 0, 'ucs2');
    buf.type = PWChar;
    return buf;
};

var elementContext = function(_id, path) {
    return _id + ", \"" + path + "\"";
};

var flagContext = function(_id, path, name) {
    return _id + ", \"" + path + "\\" + name + "\"";
};

var Fail = function(message) {
    try {
        var libMessage = GetExceptionMessage();
        if (libMessage) console.log(libMessage);
    } catch (e) {
        console.log('Unknown critical exception!');
    }
    throw message;
};

var GetStringValue = function(_id, maxSize, method) {
    var str = createTypedBuffer(maxSize, PWChar);
    if (!lib[method](_id, str, maxSize))
        Fail(method + " failed on " + _id);
    return readPWCharString(str);
};

var GetNativeValue = function(_id, path, method, refType) {
    var buff = createTypedBuffer(4, refType);
    if (!lib[method](_id, path, buff))
        Fail("Failed to " + method + " at: " + _id + ", " + path);
    return buff;
};

var SetNativeValue = function(_id, path, method, value) {
    if (!lib[method](_id, path, value))
        Fail("Failed to " + method + " to " + value + " at: " + _id + ", " + path);
};

// wrapper functions
var xelib = {
    // META FUNCTIONS
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
    'FlushBuffer': function() {
        lib.FlushBuffer();
    },
    'GetExceptionMessage': function() {
        var str = createTypedBuffer(2048, PWChar);
        lib.GetExceptionMessage(str, 2048);
        return readPWCharString(str);
    },
    'GetGlobal': function(key) {
        var _key = writePWCharBuffer(key);
        var _value = createTypedBuffer(512, PWChar);
        if (!lib.GetGlobal(_key, _value, 512))
            Fail("GetGlobal failed.");
        return readPWCharString(_value);
    },
    'Release': function(_id) {
        if (!lib.Release(_id))
            Fail("Failed to release interface #" + _id);
    },
    'ResetStore': function() {
        if (!lib.ResetStore())
            Fail("Failed to reset interface store");
    },

    // SETUP FUNCTIONS
    'SetGameMode': function(gameMode) {
        if (!lib.SetGameMode(gameMode))
            Fail("Failed to set game mode to " + gameMode);
    },
    'GetLoadOrder': function() {
        var str = createTypedBuffer(8192, PWChar);
        if (lib.GetLoadOrder(str, 8192))
            return readPWCharString(str).trim();
        return null;
    },
    'LoadPlugins': function(loadOrder) {
        var _loadOrder = writePWCharBuffer(loadOrder);
        if (!lib.LoadPlugins(_loadOrder))
            Fail("Failed to load plugins.");
    },
    'GetLoaderDone': function() {
        return lib.GetLoaderDone();
    },
    'GetGamePath': function(gameMode) {
        var str = createTypedBuffer(512, PWChar);
        if (lib.GetGamePath(gameMode, str, 512))
            return readPWCharString(str);
        return null;
    },

    // FILE HANDLING METHODS
    'AddFile': function(filename) {
        var _filename = writePWCharBuffer(filename);
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.AddFile(_filename, _res))
            Fail("Failed to add new file: " + filename);
        return _res.readUInt32LE(0);
    },
    'FileByIndex': function(index) {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.FileByIndex(index, _res))
            Fail("Failed to find file at index: " + index);
        return _res.readUInt32LE(0);
    },
    'FileByLoadOrder': function(loadOrder) {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.FileByLoadOrder(loadOrder, _res))
            Fail("Failed to find file at load order: " + index);
        return _res.readUInt32LE(0);
    },
    'FileByName': function(filename) {
        var _filename = writePWCharBuffer(filename);
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.FileByName(_filename, _res))
            Fail("Failed to find file: " + filename);
        return _res.readUInt32LE(0);
    },
    'FileByAuthor': function(author) {
        var _author = writePWCharBuffer(author);
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.FileByAuthor(_author, _res))
            Fail("Failed to find file with author: " + author);
        return _res.readUInt32LE(0);
    },
    'SaveFile': function(_id) {
        if (!lib.SaveFile(_id))
            Fail("Failed to save file: " + _id);
    },

    // MASTER HANDLING METHODS
    'CleanMasters': function(_id) {
        if (!lib.CleanMasters(_id))
            Fail("Failed to clean masters in: " + _id);
    },
    'SortMasters': function(_id) {
        if (!lib.SortMasters(_id))
            Fail("Failed to sort masters in: " + _id);
    },
    'AddMaster': function(_id, filename) {
        var _filename = writePWCharBuffer(filename);
        if (!lib.AddMaster(_id, _filename))
            Fail("Failed to add master \"" + filename + "\" to file: " + _id);
    },
    'GetMaster': function(_id, index) {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.GetMaster(_id, index))
            Fail("Failed to get master at " + index + " in file: " + _id);
        return _res.readUInt32LE(0);
    },
    'GetMasters': function(_id) {
        var _res = createTypedBuffer(1024, PCardinal);
        if (!lib.GetMasters(_id, _res, 256))
          Fail("Failed to get child elements of " + _id);
        return readCardinalArray(_res);
    },

    // ELEMENT HANDLING METHODS
    'GetElement': function(_id, path) {
        var _path = writePWCharBuffer(path);
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.GetElement(_id, _path, _res))
            Fail("Failed to get element at: " + elementContext(_id, path));
        return _res.readUInt32LE(0);
    },
    'GetElements': function(_id) {
        var size = _id == 0 ? 256 : this.ElementCount(_id);
        var _res = createTypedBuffer(size * 4, PCardinal);
        if (!lib.GetElements(_id, _res, size))
            Fail("Failed to get child elements for: " + _id);
        return readCardinalArray(_res);
    },
    'GetElementFile': function(_id) {
        var _res = createTypedBuffer(4, PInteger);
        if (!lib.GetElementFile(_id, _res))
            Fail("Failed to get element file for: " + _id);
        return _res.readUInt32LE(0);
    },
    'GetContainer': function(_id) {
        var _res = createTypedBuffer(4, PInteger);
        if (!lib.GetContainer(_id, _res))
            Fail("Failed to get container for: " + _id);
        return _res.readUInt32LE(0);
    },
    'AddElement': function(_id, path) {
        var _path = writePWCharBuffer(path);
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.AddElement(_id, _path, _res))
            Fail("Failed to create new element at: " + elementContext(_id, path));
        return _res.readUInt32LE(0);
    },
    'RemoveElement': function(_id, path) {
        var _path = writePWCharBuffer(path);
        if (!lib.RemoveElement(_id, _path))
            Fail("Failed to remove element at: " + elementContext(_id, path));
    },
    'ElementExists': function(_id, path) {
        var _path = writePWCharBuffer(path);
        if (!lib.ElementExists(_id, _path))
            Fail("Failed to check if element exists at: " + elementContext(_id, path));
    },
    'ElementCount': function(_id) {
        var _res = createTypedBuffer(4, PInteger);
        if (!lib.ElementCount(_id, _res))
          Fail("Failed to get element count for " + _id);
        return _res.readInt32LE(0);
    },

    // ERROR CHECKING METHODS
    'CheckForErrors': function(_id) {
        if (!lib.CheckForErrors(_id))
            Fail("Failed to check " + _id + " for errors.");
    },
    'GetErrorThreadDone': function() {
        return lib.GetErrorThreadDone();
    },
    'GetErrors': function() {
        var str = createTypedBuffer(1048576, PWChar);
        if (!lib.GetErrors(str, 1048576))
            Fail("Failed to get errors");
        return JSON.parse(readPWCharString(str)).errors;
    },
    'GetErrorString': function(_id) {
        return GetStringValue(_id, 2048, "GetErrorString");
    },

    // ELEMENT VALUE METHODS
    'Name': function(_id) {
        return GetStringValue(_id, 1024, "Name");
    },
    'Path': function(_id) {
        return GetStringValue(_id, 1024, "Path");
    },
    'EditorID': function(_id) {
        return GetStringValue(_id, 1024, "EditorID");
    },
    'Signature': function(_id) {
        return GetStringValue(_id, 1024, "Signature");
    },
    'FullName': function(_id) {
        return GetStringValue(_id, 1024, "FullName");
    },
    'SortKey': function(_id) {
        return GetStringValue(_id, 1024, "SortKey");
    },
    'ElementType': function(_id) {
        return GetStringValue(_id, 1024, "ElementType");
    },
    'DefType': function(_id) {
        return GetStringValue(_id, 1024, "DefType");
    },
    'GetValue': function(_id, path) {
        var _path = writePWCharBuffer(path);
        var _value = createTypedBuffer(4096, PWChar);
        if (!lib.GetValue(_id, _path, _value, 4096))
            Fail("Failed to get element value at: " + elementContext(_id, path));
        return readPWCharString(_value);
    },
    'SetValue': function(_id, path, value) {
        var _path = writePWCharBuffer(path);
        var _value = writePWCharBuffer(value);
        if (!lib.SetValue(_id, _path, _value))
            Fail("Failed to set element value at: " + elementContext(_id, path));
    },
    'GetIntValue': function(_id, path) {
        return GetNativeValue(_id, path, "GetIntValue", PInteger).readInt32LE();
    },
    'SetIntValue': function(_id, path, value) {
        SetNativeValue(_id, path, "SetIntValue", value);
    },
    'GetUIntValue': function(_id, path) {
        return GetNativeValue(_id, path, "GetUIntValue", PCardinal).readUInt32LE();
    },
    'SetUIntValue': function(_id, path, value) {
        SetNativeValue(_id, path, "SetUIntValue", value);
    },
    'GetFloatValue': function(_id, path) {
        return GetNativeValue(_id, path, "GetFloatValue", PDouble).readDoubleLE();
    },
    'SetFloatValue': function(_id, path, value) {
        SetNativeValue(_id, path, "SetFloatValue", value);
    },
    'SetFlag': function(_id, path, name, enabled) {
        var _path = writePWCharBuffer(path);
        var _name = writePWCharBuffer(name);
        if (!lib.SetFlag(_id, _path, _name, enabled))
            Fail("Failed to set flag at: " + flagContext(_id, path, name) + " to " + enabled);
    },
    'GetFlag': function(_id, path, name) {
        var _path = writePWCharBuffer(path);
        var _name = writePWCharBuffer(name);
        var _enabled = createTypedBuffer(1, PWordBool);
        if (!lib.GetFlag(_id, _path, _name, _enabled))
            Fail("Failed to get flag at: " + flagContext(_id, path, name));
        return _enabled.readInt16LE() > 0;
    },
    'ToggleFlag': function(_id, path, name) {
        var _path = writePWCharBuffer(path);
        var _name = writePWCharBuffer(name);
        if (!lib.ToggleFlag(_id, _path, _name))
            Fail("Failed to toggle flag at: " + flagContext(_id, path, name));
    },
    'GetEnabledFlags': function(_id, path) {
        var _path = writePWCharBuffer(path);
        var _flags = createTypedBuffer(4096, PWChar);
        if (!lib.GetEnabledFlags(_id, _path, _flags))
            Fail("Failed to get enabled flags at: " + elementContext(_id, path));
        return readPWCharString(_flags).split(',');
    }
};

export default xelib;
