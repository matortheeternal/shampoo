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

// function binding
var lib = ffi.Library('XEditLib', {
    // META FUNCTIONS
    'Initialize': ['void', []],
    'Finalize': ['void', []],
    'GetBuffer': ['void', [PWChar, Integer]],
    'FlushBuffer': ['void', []],
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
    'NewFile': [WordBool, [PWChar, PCardinal]],
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
    'NewElement': [WordBool, [Cardinal, PWChar, PCardinal]],
    'RemoveElement': [WordBool, [Cardinal, PWChar]],
    'LinksTo': [WordBool, [Cardinal, PCardinal]],
    'ElementExists': [WordBool, [Cardinal, PWChar]],
    'ElementCount': [WordBool, [Cardinal, PInteger]],
    'ElementAssigned': [WordBool, [Cardinal]],
    'Equals': [WordBool, [Cardinal, Cardinal]],
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
    'GetLinksTo': [WordBool, [Cardinal, PWChar, PCardinal]],
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
var trimNull = function (str) {
    return str.substring(0, str.indexOf('\0'));
};

var createTypedBuffer = function (size, type) {
    var buf = new Buffer(size);
    buf.type = type;
    return buf;
};

var readPWCharString = function (buf) {
    return trimNull(wchar_t.toString(buf));
};

var readCardinalArray = function (buf) {
    var a = [];
    for (var i = 0; i < buf.length; i+=4) {
      var c = buf.readUInt32LE(i);
      if (c == 0) break;
      a.push(c);
    }
    return a;
};

var writePWCharBuffer = function (value) {
    var buf = new Buffer((value.length + 1) * 2);
    buf.write(value, 0, 'ucs2');
    buf.type = PWChar;
    return buf;
};

var Fail = function (message) {
    try {
        var libMessage = GetExceptionMessage();
        if (libMessage) console.log(libMessage);
    } catch (e) {
        console.log('Unknown critical exception!');
    }
    throw message;
};

// wrapper functions
var xelib = {
    // META FUNCTIONS
    'Initialize': function () {
        lib.Initialize();
    },
    'Finalize': function () {
        lib.Finalize();
    },
    'GetBuffer': function () {
        var str = createTypedBuffer(4096, PWChar);
        lib.GetBuffer(str, 4096);
        return readPWCharString(str);
    },
    'FlushBuffer': function () {
        lib.FlushBuffer();
    },
    'GetExceptionMessage': function () {
        var str = createTypedBuffer(2048, PWChar);
        lib.GetExceptionMessage(str, 2048);
        return readPWCharString(str);
    },
    'GetGlobal': function (keyValue) {
        var str = createTypedBuffer(512, PWChar);
        var key = writePWCharBuffer(keyValue);
        if (!lib.GetGlobal(key, str, 512))
            Fail("GetGlobal failed.");
        return readPWCharString(str);
    },
    'Release': function (_id) {
        if (!lib.Release(_id))
            Fail("Failed to release interface #" + _id);
    },
    'ResetStore': function () {
        if (!lib.ResetStore())
            Fail("Failed to reset interface store");
    },

    // SETUP FUNCTIONS
    'SetGameMode': function (gameMode) {
        if (!lib.SetGameMode(gameMode))
            Fail("Failed to set game mode to " + gameMode);
    },
    'GetLoadOrder': function () {
        var str = createTypedBuffer(8192, PWChar);
        if (lib.GetLoadOrder(str, 8192))
            return readPWCharString(str).trim();
        return null;
    },
    'LoadPlugins': function (loadOrder) {
        var buff = writePWCharBuffer(loadOrder);
        if (!lib.LoadPlugins(buff))
            Fail("Failed to load plugins.");
    },
    'GetLoaderDone': function () {
        return lib.GetLoaderDone();
    },
    'GetGamePath': function (gameMode) {
        var str = createTypedBuffer(512, PWChar);
        if (lib.GetGamePath(gameMode, str, 512))
            return readPWCharString(str);
        return null;
    },

    // FILE HANDLING METHODS
    'NewFile': function (filename) {
        var fName = writePWCharBuffer(filename);
        var _id = createTypedBuffer(4, PCardinal);
        if (!lib.NewFile(fName, _id))
            Fail("Failed to create new file: " + filename);
        return _id.readUInt32LE(0);
    },
    'FileByIndex': function (index) {
        var _id = createTypedBuffer(4, PCardinal);
        if (!lib.FileByIndex(index, _id))
            Fail("Failed to find file at index: " + index);
        return _id.readUInt32LE(0);
    },
    'FileByLoadOrder': function (loadOrder) {
        var _id = createTypedBuffer(4, PCardinal);
        if (!lib.FileByLoadOrder(loadOrder, _id))
            Fail("Failed to find file at load order: " + index);
        return _id.readUInt32LE(0);
    },
    'FileByName': function (filename) {
        var fName = writePWCharBuffer(filename);
        var _id = createTypedBuffer(4, PCardinal);
        if (!lib.FileByName(fName, _id))
            Fail("Failed to find file: " + filename);
        return _id.readUInt32LE(0);
    },
    'FileByAuthor': function (author) {
        var fAuthor = writePWCharBuffer(author);
        var _id = createTypedBuffer(4, PCardinal);
        if (!lib.FileByAuthor(fAuthor, _id))
            Fail("Failed to find file with author: " + author);
        return _id.readUInt32LE(0);
    },
    'SaveFile': function (_id) {
        if (!lib.SaveFile(_id))
            Fail("Failed to save file: " + _id);
    },

    // MASTER HANDLING METHODS
    'CleanMasters': function (_id) {
        if (!lib.CleanMasters(_id))
            Fail("Failed to clean masters in: " + _id);
    },
    'SortMasters': function (_id) {
        if (!lib.SortMasters(_id))
            Fail("Failed to sort masters in: " + _id);
    },
    'AddMaster': function (_id, filename) {
        var masterName = writePWCharBuffer(filename);
        if (!lib.AddMaster(_id, masterName))
            Fail("Failed to add master " + filename + " to file: " + _id);
    },
    'GetMaster': function (_id, index) {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.GetMaster(_id, index))
            Fail("Failed to get master at " + index + " in file: " + _id);
        return _res.readUInt32LE(0);
    },
    'GetMasters': function (_id) {
        var _res = createTypedBuffer(1024, PCardinal);
        if (!lib.GetMasters(_id, _res, 256))
          Fail("Failed to get child elements of " + _id);
        return readCardinalArray(_res);
    },

    // ELEMENT HANDLING METHODS
    'GetElements': function (_id) {
        var size = _id == 0 ? 256 : this.ElementCount(_id);
        var _res = createTypedBuffer(size * 4, PCardinal);
        if (!lib.GetElements(_id, _res, size))
            Fail("Failed to get child elements of " + _id);
        return readCardinalArray(_res);
    },
    'ElementCount': function(_id) {
        var _res = createTypedBuffer(4, PInteger);
        if (!lib.ElementCount(_id, _res))
          Fail("Failed to get element count for " + _id);
        return _res.readInt32LE(0);
    },

    // ERROR CHECKING METHODS
    'CheckForErrors': function (_id) {
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
        var str = createTypedBuffer(2048, PWChar);
        if (!lib.GetErrorString(_id, str, 1024))
            Fail("Failed to get error string for " + _id);
        return readPWCharString(str);
    },

    // ELEMENT VALUE METHODS
    'Name': function (_id) {
        var str = createTypedBuffer(1024, PWChar);
        if (!lib.Name(_id, str, 1024))
            Fail("Failed to get name of " + _id);
        return readPWCharString(str);
    }
};

export default xelib;
