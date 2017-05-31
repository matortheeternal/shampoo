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
    'InitXEdit': [Void, []],
    'CloseXEdit': [Void, []],
    'GetMessagesLength': [Void, [PInteger]],
    'GetMessages': [WordBool, [PWChar, Integer]],
    'ClearMessages': [Void, []],
    'GetResultString': [WordBool, [PWChar, Integer]],
    'GetResultArray': [WordBool, [PCardinal, Integer]],
    'GetExceptionMessageLength': [Void, [PInteger]],
    'GetExceptionMessage': [WordBool, [PWChar, Integer]],
    'GetGlobal': [WordBool, [PWChar, PInteger]],
    'GetGlobals': [WordBool, [PInteger]],
    'Release': [WordBool, [Cardinal]],
    'ResetStore': [WordBool, []],
    // SETUP FUNCTIONS
    'SetGameMode': [WordBool, [Integer]],
    'GetLoadOrder': [WordBool, [PInteger]],
    'LoadPlugins': [WordBool, [PWChar]],
    'GetLoaderDone': [WordBool, []],
    'GetGamePath': [WordBool, [Integer, PInteger]],
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
    'GetFileName': [WordBool, [Cardinal, PInteger]],
    'GetAuthor': [WordBool, [Cardinal, PInteger]],
    'SetAuthor': [WordBool, [Cardinal, PWChar]],
    'GetDescription': [WordBool, [Cardinal, PInteger]],
    'SetDescription': [WordBool, [Cardinal, PWChar]],
    'OverrideRecordCount': [WordBool, [Cardinal, PInteger]],
    'GetIsESM': [WordBool, [Cardinal, PWordBool]],
    'SetIsESM': [WordBool, [Cardinal, WordBool]],
    // ELEMENT HANDLING METHODS
    'GetElement': [WordBool, [Cardinal, PWChar, PCardinal]],
    'GetElements': [WordBool, [Cardinal, PInteger]],
    'GetElementFile': [WordBool, [Cardinal, PCardinal]],
    'GetContainer': [WordBool, [Cardinal, PCardinal]],
    'AddElement': [WordBool, [Cardinal, PWChar, PCardinal]],
    'RemoveElement': [WordBool, [Cardinal, PWChar]],
    'RemoveElementOrParent': [WordBool, [Cardinal]],
    'GetLinksTo': [WordBool, [Cardinal, PWChar, PCardinal]],
    'ElementExists': [WordBool, [Cardinal, PWChar, PWordBool]],
    'ElementCount': [WordBool, [Cardinal, PInteger]],
    'ElementEquals': [WordBool, [Cardinal, Cardinal, PWordBool]],
    'CopyElement': [WordBool, [Cardinal, Cardinal, WordBool, WordBool, PCardinal]],
    // ERROR CHECKING METHODS
    'CheckForErrors': [WordBool, [Cardinal]],
    'GetErrorThreadDone': [WordBool, []],
    'GetErrors': [WordBool, [PInteger]],
    'GetErrorString': [WordBool, [Cardinal, PInteger]],
    // SERIALIZATION METHODS
    'ElementToJson': [WordBool, [Cardinal, PInteger]],
    // ELEMENT VALUE METHODS
    'Name': [WordBool, [Cardinal, PInteger]],
    'Path': [WordBool, [Cardinal, PInteger]],
    'EditorID': [WordBool, [Cardinal, PInteger]],
    'Signature': [WordBool, [Cardinal, PInteger]],
    'FullName': [WordBool, [Cardinal, PInteger]],
    'SortKey': [WordBool, [Cardinal, PInteger]],
    'ElementType': [WordBool, [Cardinal, PInteger]],
    'DefType': [WordBool, [Cardinal, PInteger]],
    'GetValue': [WordBool, [Cardinal, PWChar, PInteger]],
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
    'GetEnabledFlags': [WordBool, [Cardinal, PWChar, PInteger]],
    // GROUP HANDLING METHODS
    'HasGroup': [WordBool, [Cardinal, PWChar, PWordBool]],
    'AddGroup': [WordBool, [Cardinal, PWChar, PCardinal]],
    'GetGroupSignatures': [WordBool, [Cardinal, PInteger]],
    'GetChildGroup': [WordBool, [Cardinal, PCardinal]],
    'GroupSignatureFromName': [WordBool, [PWChar, PInteger]],
    'GroupNameFromSignature': [WordBool, [PWChar, PInteger]],
    'GetGroupSignatureNameMap': [WordBool, [PInteger]],
    // RECORD HANDLING METHODS
    'AddRecord': [WordBool, [Cardinal, PWChar, PCardinal]],
    'GetRecords': [WordBool, [Cardinal, PInteger]],
    'RecordsBySignature': [WordBool, [Cardinal, PWChar, PInteger]],
    'RecordByFormID': [WordBool, [Cardinal, Cardinal, PCardinal]],
    'RecordByEditorID': [WordBool, [Cardinal, PWChar, PCardinal]],
    'RecordByName': [WordBool, [Cardinal, PWChar, PCardinal]],
    'GetOverrides': [WordBool, [Cardinal, PInteger]],
    'GetFormID': [WordBool, [Cardinal, PCardinal]],
    'SetFormID': [WordBool, [Cardinal, Cardinal]],
    'ExchangeReferences': [WordBool, [Cardinal, Cardinal, Cardinal]],
    'GetReferences': [WordBool, [Cardinal, PInteger]],
    'IsMaster': [WordBool, [Cardinal, PWordBool]],
    'IsInjected': [WordBool, [Cardinal, PWordBool]],
    'IsOverride': [WordBool, [Cardinal, PWordBool]],
    'IsWinningOverride': [WordBool, [Cardinal, PWordBool]]
});

// helper functions
var createTypedBuffer = function(size, type) {
    var buf = new Buffer(size);
    buf.type = type;
    return buf;
};

var readPWCharString = function(buf) {
    return wchar_t.toString(buf);
};

var readCardinalArray = function(buf, len) {
    var a = [];
    for (var i = 0; i < 4 * len; i+=4)
      a.push(buf.readUInt32LE(i));
    return a;
};

var wcb = function(value) {
    var buf = new Buffer((value.length + 1) * 2);
    buf.write(value, 0, 'ucs2');
    buf.type = PWChar;
    return buf;
};

var elementContext = function(_id, path) {
    return `${_id}, "${path}"`;
};

var flagContext = function(_id, path, name) {
    return `${_id}, "${path}\\${name}"`;
};

var Fail = function(message) {
    try {
        var libMessage = xelib.GetExceptionMessage();
        if (libMessage) console.log(libMessage);
    } catch (e) {
        console.log('Unknown critical exception!');
    }
    throw message;
};

var GetString = function(_len, method = 'GetResultString') {
    var len = _len.readInt32LE();
    if (len == 0) return '';
    var str = createTypedBuffer(2 * len, PWChar);
    if (!lib[method](str, len))
        Fail(`Failed to ${method}`);
    return readPWCharString(str);
};

var GetArray = function(_len) {
    var len = _len.readInt32LE();
    if (len == 0) return [];
    var a = createTypedBuffer(4 * len, PCardinal);
    if (!lib.GetResultArray(a, len))
        Fail('Failed to GetResultArray');
    return readCardinalArray(a, len);
};

var GetDictionary = function(_len) {
    var str = GetString(_len);
    var pairs = str.split('\n').slice(0, -1);
    var dictionary = {};
    pairs.forEach(function(pair) {
        var n = pair.indexOf('=');
        dictionary[pair.substr(0, n)] = pair.substr(n + 1, pair.length);
    });
    return dictionary;
};

var GetBoolValue = function(_id, method) {
    var _bool = createTypedBuffer(2, PWordBool);
    if (!lib[method](_id, _bool))
        Fail(`Failed to call ${method} on ${_id}`);
    return _bool.readInt16LE() > 0;
};

var GetStringValue = function(_id, method) {
    var _len = createTypedBuffer(4, PInteger);
    if (!lib[method](_id, _len))
        Fail(`${method} failed on ${_id}`);
    return GetString(_len);
};

var GetNativeValue = function(_id, path, method, refType) {
    var buff = createTypedBuffer(4, refType);
    if (!lib[method](_id, wcb(path), buff))
        Fail(`Failed to ${method} at: ${_id}, ${path}`);
    return buff;
};

var SetNativeValue = function(_id, path, method, value) {
    if (value === undefined) {
        value = path;
        path = '';
    }
    if (!lib[method](_id, wcb(path), value))
        Fail(`Failed to ${method} to ${value} at: ${_id}, ${path}`);
};

// wrapper functions
var xelib = {
    // META FUNCTIONS
    'Initialize': function() {
        lib.InitXEdit();
    },
    'Finalize': function() {
        lib.CloseXEdit();
    },
    'GetMessages': function() {
        var _len = createTypedBuffer(4, PInteger);
        lib.GetMessagesLength(_len);
        return GetString(_len, 'GetMessages');
    },
    'ClearMessages': function() {
        lib.ClearMessages();
    },
    'GetExceptionMessage': function() {
        var _len = createTypedBuffer(4, PInteger);
        lib.GetExceptionMessageLength(_len);
        return GetString(_len, 'GetExceptionMessage');
    },
    'GetGlobal': function(key) {
        var _len = createTypedBuffer(4, PInteger);
        if (!lib.GetGlobal(wcb(key), _len))
            Fail('GetGlobal failed.');
        return GetString(_len);
    },
    'GetGlobals': function() {
        var _len = createTypedBuffer(4, PInteger);
        if (!lib.GetGlobals( _len))
            Fail('GetGlobals failed.');
        return GetDictionary(_len);
    },
    'Release': function(_id) {
        if (!lib.Release(_id))
            Fail(`Failed to release interface #${_id}`);
    },
    'ResetStore': function() {
        if (!lib.ResetStore())
            Fail('Failed to reset interface store');
    },

    // SETUP FUNCTIONS
    'SetGameMode': function(gameMode) {
        if (!lib.SetGameMode(gameMode))
            Fail(`Failed to set game mode to ${gameMode}`);
    },
    'GetLoadOrder': function() {
        var _len = createTypedBuffer(4, PInteger);
        if (!lib.GetLoadOrder(_len))
            return null;
        return GetString(_len);
    },
    'LoadPlugins': function(loadOrder) {
        if (!lib.LoadPlugins(wcb(loadOrder)))
            Fail('Failed to load plugins.');
    },
    'GetLoaderDone': function() {
        return lib.GetLoaderDone();
    },
    'GetGamePath': function(gameMode) {
        var _len = createTypedBuffer(4, PInteger);
        if (!lib.GetGamePath(gameMode, _len))
            return null;
        return GetString(_len);
    },

    // FILE HANDLING METHODS
    'AddFile': function(filename) {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.AddFile(wcb(filename), _res))
            Fail(`Failed to add new file: ${filename}`);
        return _res.readUInt32LE(0);
    },
    'FileByIndex': function(index) {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.FileByIndex(index, _res))
            Fail(`Failed to find file at index: ${index}`);
        return _res.readUInt32LE(0);
    },
    'FileByLoadOrder': function(loadOrder) {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.FileByLoadOrder(loadOrder, _res))
            Fail(`Failed to find file at load order: ${loadOrder}`);
        return _res.readUInt32LE(0);
    },
    'FileByName': function(filename) {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.FileByName(wcb(filename), _res))
            Fail(`Failed to find file: ${filename}`);
        return _res.readUInt32LE(0);
    },
    'FileByAuthor': function(author) {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.FileByAuthor(wcb(author), _res))
            Fail(`Failed to find file with author: ${author}`);
        return _res.readUInt32LE(0);
    },
    'SaveFile': function(_id) {
        if (!lib.SaveFile(_id))
            Fail(`Failed to save file: ${_id}`);
    },

    // MASTER HANDLING METHODS
    'CleanMasters': function(_id) {
        if (!lib.CleanMasters(_id))
            Fail(`Failed to clean masters in: ${_id}`);
    },
    'SortMasters': function(_id) {
        if (!lib.SortMasters(_id))
            Fail(`Failed to sort masters in: ${_id}`);
    },
    'AddMaster': function(_id, filename) {
        if (!lib.AddMaster(_id, wcb(filename)))
            Fail(`Failed to add master "${filename}" to file: ${_id}`);
    },
    'GetMaster': function(_id, index) {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.GetMaster(_id, index))
            Fail(`'Failed to get master at index ${index} in file: ${_id}`);
        return _res.readUInt32LE(0);
    },
    'GetMasters': function(_id) {
        var _len = createTypedBuffer(4, PInteger);
        if (!lib.GetMasters(_id, _len))
            Fail(`Failed to get child elements of ${_id}`);
        return GetArray(_len);
    },

    // ELEMENT HANDLING METHODS
    'GetElement': function(_id, path = '') {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.GetElement(_id, wcb(path), _res))
            Fail(`Failed to get element at: ${elementContext(_id, path)}`);
        return _res.readUInt32LE(0);
    },
    'GetElements': function(_id) {
        var _len = createTypedBuffer(4, PInteger);
        if (!lib.GetElements(_id,  _len))
            Fail(`Failed to get child elements for: ${_id}`);
        return GetArray(_len);
    },
    'GetElementFile': function(_id) {
        var _res = createTypedBuffer(4, PInteger);
        if (!lib.GetElementFile(_id, _res))
            Fail(`Failed to get element file for: ${_id}`);
        return _res.readUInt32LE(0);
    },
    'GetContainer': function(_id) {
        var _res = createTypedBuffer(4, PInteger);
        if (!lib.GetContainer(_id, _res))
            Fail(`Failed to get container for: ${_id}`);
        return _res.readUInt32LE(0);
    },
    'AddElement': function(_id, path = '') {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.AddElement(_id, wcb(path), _res))
            Fail(`Failed to create new element at: ${elementContext(_id, path)}`);
        return _res.readUInt32LE(0);
    },
    'RemoveElement': function(_id, path = '') {
        if (!lib.RemoveElement(_id, wcb(path)))
            Fail(`Failed to remove element at: ${elementContext(_id, path)}`);
    },
    'RemoveElementOrParent': function(_id) {
        if (!lib.RemoveElementOrParent(_id))
            Fail(`Failed to remove element ${_id}`);
    },
    'ElementExists': function(_id, path = '') {
        var _bool = createTypedBuffer(2, PWordBool);
        if (!lib.ElementExists(_id, wcb(path), _bool))
            Fail(`Failed to check if element exists at: ${elementContext(_id, path)}`);
        return _bool.readInt16LE > 0;
    },
    'ElementCount': function(_id) {
        var _res = createTypedBuffer(4, PInteger);
        if (!lib.ElementCount(_id, _res))
            Fail(`Failed to get element count for ${_id}`);
        return _res.readInt32LE(0);
    },
    'ElementEquals': function(_id, _id2) {
        var _bool = createTypedBuffer(2, PWordBool);
        if (!lib.ElementEquals(_id, _id2, _bool))
            Fail(`Failed to check element equality for ${_id} and ${_id2}`);
        return _bool.readInt16LE > 0;
    },
    'CopyElement': function(_id, _id2, asNew = false, deepCopy = true) {
        var _res = createTypedBuffer(4, PCardinal);
        if (!lib.CopyElement(_id, _id2, asNew, deepCopy, _res))
            Fail(`Failed to copy element from ${_id} to ${_id2}`);
        return _res.readUInt32LE();
    },
    'IsMaster': function(_id) {
        return GetBoolValue(_id, "IsMaster");
    },
    'IsInjected': function(_id) {
        return GetBoolValue(_id, "IsInjected");
    },
    'IsOverride': function(_id) {
        return GetBoolValue(_id, "IsOverride");
    },
    'IsWinningOverride': function(_id) {
        return GetBoolValue(_id, "IsWinningOverride");
    },

    // ERROR CHECKING METHODS
    'CheckForErrors': function(_id) {
        if (!lib.CheckForErrors(_id))
            Fail(`Failed to check ${_id} for errors.`);
    },
    'GetErrorThreadDone': function() {
        return lib.GetErrorThreadDone();
    },
    'GetErrors': function() {
        var _len = createTypedBuffer(4, PInteger);
        if (!lib.GetErrors(_len))
            Fail('Failed to get errors');
        return JSON.parse(GetString(_len)).errors;
    },
    'GetErrorString': function(_id) {
        return GetStringValue(_id, 'GetErrorString');
    },

    // SERIALIZATION METHODS
    'ElementToJSON': function(_id) {
        var _len = createTypedBuffer(4, PInteger);
        if (!lib.ElementToJson(_id, _len))
            Fail(`Failed to serialize element to JSON: ${_id}`);
        return JSON.parse(GetString(_len));
    },

    // ELEMENT VALUE METHODS
    'Name': function(_id) {
        return GetStringValue(_id, 'Name');
    },
    'Path': function(_id) {
        return GetStringValue(_id, 'Path');
    },
    'EditorID': function(_id) {
        return GetStringValue(_id, 'EditorID');
    },
    'Signature': function(_id) {
        return GetStringValue(_id, 'Signature');
    },
    'FullName': function(_id) {
        return GetStringValue(_id, 'FullName');
    },
    'SortKey': function(_id) {
        return GetStringValue(_id, 'SortKey');
    },
    'ElementType': function(_id) {
        return GetStringValue(_id, 'ElementType');
    },
    'DefType': function(_id) {
        return GetStringValue(_id, 'DefType');
    },
    'GetValue': function(_id, path) {
        var _len = createTypedBuffer(4, PInteger);
        if (!lib.GetValue(_id, wcb(_path), _len))
            Fail(`Failed to get element value at: ${elementContext(_id, path)}`);
        return GetString(_len);
    },
    'SetValue': function(_id, path, value) {
        if (value === undefined) {
            value = path;
            path = '';
        }
        if (!lib.SetValue(_id, wcb(path), wcb(value)))
            Fail(`Failed to set element value at: ${elementContext(_id, path)}`);
    },
    'GetIntValue': function(_id, path) {
        return GetNativeValue(_id, path, 'GetIntValue', PInteger).readInt32LE();
    },
    'SetIntValue': function(_id, path, value) {
        SetNativeValue(_id, path, 'SetIntValue', value);
    },
    'GetUIntValue': function(_id, path) {
        return GetNativeValue(_id, path, 'GetUIntValue', PCardinal).readUInt32LE();
    },
    'SetUIntValue': function(_id, path, value) {
        SetNativeValue(_id, path, 'SetUIntValue', value);
    },
    'GetFloatValue': function(_id, path) {
        return GetNativeValue(_id, path, 'GetFloatValue', PDouble).readDoubleLE();
    },
    'SetFloatValue': function(_id, path, value) {
        SetNativeValue(_id, path, 'SetFloatValue', value);
    },
    'SetFlag': function(_id, path, name, enabled) {
        if (!lib.SetFlag(_id, wcb(path), wcb(name), enabled))
            Fail(`Failed to set flag value at: ${flagContext(_id, path, name)} to ${enabled}`);
    },
    'GetFlag': function(_id, path, name) {
        var _enabled = createTypedBuffer(1, PWordBool);
        if (!lib.GetFlag(_id, wcb(path), wcb(name), _enabled))
            Fail(`Failed to get flag value at: ${flagContext(_id, path, name)}`);
        return _enabled.readInt16LE() > 0;
    },
    'ToggleFlag': function(_id, path, name) {
        if (!lib.ToggleFlag(_id, wcb(path), wcb(name)))
            Fail(`Failed to toggle flag at: ${flagContext(_id, path, name)}`);
    },
    'GetEnabledFlags': function(_id, path) {
        var _len = createTypedBuffer(4, PInteger);
        if (!lib.GetEnabledFlags(_id, wcb(path), _len))
            Fail(`Failed to get enabled flags at: ${elementContext(_id, path)}`);
        return GetString(_len).split(',');
    },

    /*** WRAPPER METHODS ***/

    // RECORD METHODS
    'Translate': function(_id, vector) {
        var xelib = this;
        var position = xelib.GetElement(_id, 'DATA\\Position');
        ['X', 'Y', 'Z'].forEach(function(coord) {
            if (vector.hasOwnProperty(coord)) {
                var newValue = xelib.GetFloatValue(position, coord) + vector[coord];
                this.SetFloatValue(position, coord, newValue);
            }
        });
    },
    'Rotate': function(_id, vector) {
        var xelib = this;
        var rotation = xelib.GetElement(_id, 'DATA\\Rotation');
        ['X', 'Y', 'Z'].forEach(function(coord) {
            if (vector.hasOwnProperty(coord)) {
                var newValue = xelib.GetFloatValue(rotation, coord) + vector[coord];
                this.SetFloatValue(rotation, coord, newValue);
            }
        });
    },
    'GetRecordFlag': function(_id, name) {
        return this.GetFlag(_id, 'Record Header\\Record Flags', name);
    },
    'SetRecordFlag': function(_id, name, enabled) {
        this.SetFlag(_id, 'Record Header\\Record Flags', name, enabled);
    }
};

export default xelib;
