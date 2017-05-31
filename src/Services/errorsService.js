export default function(ngapp, xelib) {
    ngapp.service('errorsService', function () {
        var service = this;

        this.errorAcronyms = [
            "ITM",
            "ITPO",
            "UDR",
            "UES",
            "URR",
            "UER",
            "OE"
        ];

        this.errorGroups = function () {
            return [
                {
                    group: 0,
                    name: "Identical to Master Records",
                    acronym: "ITM",
                    caption: "ITMs are dirty edits where a record has been overridden in a plugin file, but hasn't been changed.",
                    benign: true,
                    errors: []
                },
                {
                    group: 1,
                    name: "Identical to Previous Override Records",
                    acronym: "ITPO",
                    caption: "ITPOs are dirty edits where a record has been overridden in a plugin file, but hasn't been changed relative to the previous override.",
                    benign: true,
                    errors: []
                },
                {
                    group: 2,
                    name: "Deleted References",
                    acronym: "UDR",
                    caption: "UDRs are dirty edits where an object reference has been deleted instead of being disabled.",
                    errors: []
                },
                {
                    group: 3,
                    name: "Unexpected Subrecords",
                    acronym: "UES",
                    caption: "UESs are errors where the data structure of a record is abnormal.",
                    errors: []
                },
                {
                    group: 4,
                    name: "Unresolved References",
                    acronym: "URR",
                    caption: "URRs are errors where a record references another record that doesn't exist.",
                    benign: true,
                    errors: []
                },
                {
                    group: 5,
                    name: "Unexpected References",
                    acronym: "UER",
                    caption: "UERs are errors where a record references another record in an abnormal fashion.",
                    benign: true,
                    errors: []
                },
                {
                    group: 6,
                    name: "Other Errors",
                    acronym: "OE",
                    caption: "Errors that don't fall into the other groups are placed in this group.",
                    benign: true,
                    errors: []
                }
            ];
        };

        this.messageFormats = {
            ITM: function(error) {
                return error.name;
            },
            ITPO: function(error) {
                return error.name;
            },
            UDR: function(error) {
                return `${error.name}\n\r - Record marked as deleted but contains: ${error.data}`
            },
            UES: function(error) {
                var dataParts = error.data.split(",");
                return `${error.name}\n\r - Error: Record (${dataParts[0]}) contains unexpected (or out of ordeR) subrecord ${dataParts[1]}`;
            },
            URR: function(error) {
                return `${error.name}\n\r - ${error.path}: [${error.data}] < Error: Could not be resolved >`;
            },
            UER: function(error) {
                var dataParts = error.data.split(",");
                return `${error.name}\n\r - ${error.path}: Found a (${dataParts[0]}) reference, expected: ${dataParts[1]}`;
            },
            OE: function(error) {
                return error.data;
            }
        };

        var removeRecordResolution = {
            label: "Delete",
            class: "red",
            execute: function(handle) {
                xelib.RemoveElement(handle);
            }
        };
        var tweakEdidResolution = {
            label: "Tweak EDID",
            class: "green",
            available: function(handle) {
                return xelib.ElementExists(handle, "EDID");
            },
            execute: function(handle, error, tweak) {
                if (!tweak) tweak = "-Intended";
                var oldEdid = xelib.GetValue(handle, 'EDID');
                xelib.SetValue(handle, 'EDID', oldEdid + tweak);
            }
        };
        var tweakPositionResolution = {
            label: "Tweak Position",
            class: "green",
            available: function(handle) {
                return xelib.ElementExists(handle, "DATA\\Position");
            },
            execute: function(handle, error, tweak) {
                if (!tweak) tweak = {
                    X: -0.000005,
                    Y:  0.000002,
                    Z: -0.000001
                };
                xelib.Translate(handle, tweak);
            }
        };
        var nullifyResolution = {
            label: "Nullify",
            class: "green",
            available: function(handle, error) {
                return error.data.indexOf("NULL") > -1;
            },
            execute: function(handle, error) {
                try {
                    var element = xelib.GetElement(handle, error.path);
                    xelib.SetUIntValue(element, 0);
                } catch (e) {
                    console.log(error);
                    console.log('Failed to nullify element, ' + e);
                }
            }
        };
        var removeResolution = {
            label: "Remove",
            class: "red",
            execute: function(handle, error) {
                try {
                    var element = xelib.GetElement(handle, error.path);
                    xelib.RemoveElementOrParent(element);
                } catch (e) {
                    console.log(error);
                    console.log('Failed to remove element, ' + e);
                }
            }
        };
        var ignoreResolution = {
            label: "Ignore",
            class: "yellow"
        };
        var identicalResolutions = [
            removeRecordResolution,
            tweakEdidResolution,
            tweakPositionResolution,
            ignoreResolution
        ];

        this.errorResolutions = {
            ITM: identicalResolutions,
            ITPO: identicalResolutions,
            UDR: [
                {
                    label: "Undelete and Disable",
                    class: "green",
                    execute: function(handle) {
                        xelib.SetRecordFlag(handle, "Deleted", false);
                        xelib.SetRecordFlag(handle, "Initially Disabled", true);
                    }
                },
                {
                    label: "Restore",
                    class: "red",
                    execute: function(handle) {
                        xelib.SetRecordFlag(handle, "Deleted", false);
                    }
                },
                ignoreResolution
            ],
            UES: [
                removeRecordResolution,
                // TODO: Repair
                ignoreResolution
            ],
            URR: [
                nullifyResolution,
                removeResolution,
                ignoreResolution
            ],
            UER: [
                nullifyResolution,
                removeResolution,
                ignoreResolution
            ],
            OE: [
                // TODO: fix reporting/classify with fixes
                ignoreResolution
            ]
        };

        this.getErrorResolutions = function(error) {
            var acronym = service.errorAcronyms[error.group];
            return service.errorResolutions[acronym];
        };

        this.getErrorMessage = function(error) {
            var acronym = service.errorAcronyms[error.group];
            return service.messageFormats[acronym](error);
        };

        this.getErrorMessages = function(errors) {
            errors.forEach(function(error) {
                error.message = service.getErrorMessage(error);
            });
        };
    });
}
