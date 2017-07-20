export default function(ngapp, xelib) {
    ngapp.service('errorsService', function (xelibService) {
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
                return [error.name];
            },
            ITPO: function(error) {
                return [error.name];
            },
            UDR: function(error) {
                return [error.name, `Record marked as deleted but contains: ${error.data}`];
            },
            UES: function(error) {
                return [error.name, `Error: Record contains unexpected (or out of order) subrecord ${error.data}`];
            },
            URR: function(error) {
                return [error.name, `${error.path}: [${error.data}] < Error: Could not be resolved >`];
            },
            UER: function(error) {
                var dataParts = error.data.split(/,(.+)?/, 2);
                return [error.name, `${error.path}: Found a (${dataParts[0]}) reference, expected: ${dataParts[1]}`];
            },
            OE: function(error) {
                return [error.name, `${error.data}`];
            }
        };

        var withErrorElement = function(error, callback, onException) {
            var element = xelib.GetElement(error.handle, error.path);
            try {
                try {
                    callback(element);
                } catch(exception) {
                    onException(error, exception);
                }
            } finally {
                xelib.Release(element);
            }
        };

        var removeRecordResolution = {
            label: "Delete",
            class: "red",
            execute: function(error) {
                xelib.RemoveElement(error.handle);
            }
        };
        var tweakEdidResolution = {
            label: "Tweak EDID",
            class: "green",
            available: function(error) {
                return xelib.HasElement(error.handle, "EDID");
            },
            execute: function(error, tweak) {
                if (!tweak) tweak = "-Intended";
                var oldEdid = xelib.GetValue(error.handle, 'EDID');
                xelib.SetValue(error.handle, 'EDID', oldEdid + tweak);
            }
        };
        var tweakPositionResolution = {
            label: "Tweak Position",
            class: "green",
            available: function(error) {
                return xelib.HasElement(error.handle, "DATA\\Position");
            },
            execute: function(error, tweak) {
                if (!tweak) tweak = {
                    X: -0.000005,
                    Y:  0.000002,
                    Z: -0.000001
                };
                xelib.Translate(error.handle, tweak);
            }
        };
        var nullifyResolution = {
            label: "Nullify",
            class: "green",
            available: function(error) {
                var allowed;
                if (error.group == 5) {
                    // if error is UER, get expected signatures from error data
                    var expectedSignatures = error.data.split(/,(.+)?/, 2)[1];
                    allowed = expectedSignatures.indexOf('NULL') > -1;
                } else {
                    withErrorElement(error, function(element) {
                        allowed = xelib.GetSignatureAllowed(element, 'NULL');
                    });
                }
                return allowed;
            },
            execute: function(error) {
                withErrorElement(error, function(element) {
                    xelib.SetUIntValue(element, 0);
                    xelib.Release(element);
                }, function(error, exception) {
                    console.log(error);
                    console.log(exception);
                });
            }
        };
        var removeResolution = {
            label: "Remove",
            class: "red",
            execute: function(error) {
                withErrorElement(error, function(element) {
                    xelib.RemoveElementOrParent(element);
                    xelib.Release(element);
                }, function(error, exception) {
                    console.log(error);
                    console.log(exception);
                });
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
        var deletedResolutions = [
            {
                label: "Undelete and Disable",
                class: "green",
                available: function(error) {
                    return error.signature !== 'NAVM';
                },
                execute: function(error) {
                    xelib.SetRecordFlag(error.handle, "Deleted", false);
                    xelib.SetRecordFlag(error.handle, "Initially Disabled", true);
                }
            },
            {
                label: "Replace Navmesh",
                class: "green",
                available: function(error) {
                    if (error.signature === 'NAVM') {
                        return !!xelibService.GetReplacementNavmesh(error.handle);
                    }
                },
                execute: function(error) {
                    let r = xelibService.GetReplacementNavmesh(error.handle);
                    let formID = xelib.GetFormID(error.handle);
                    xelib.RemoveElement(error.handle);
                    xelib.SetFormID(r, formID);
                }
            },
            {
                label: "Bury Navmesh",
                class: "green",
                available: function(error) {
                    return error.signature === 'NAVM';
                },
                execute: function(error) {
                    xelibService.MoveVerticesUnderground(error.handle);
                    xelibService.RemoveEdgeLinks(error.handle);
                    xelibService.UpdateMinMaxZ(error.handle);
                }
            },
            {
                label: "Restore",
                class: "red",
                execute: function(error) {
                    xelib.SetRecordFlag(error.handle, "Deleted", false);
                }
            },
            ignoreResolution
        ];

        this.errorResolutions = {
            ITM: identicalResolutions,
            ITPO: identicalResolutions,
            UDR: deletedResolutions,
            UES: [
                {
                    label: "Repair",
                    class: "green",
                    execute: function(error) {
                        xelibService.withElement(xelib.GetElementFile(error.handle), function(file) {
                            var copy = xelib.CopyElement(error.handle, file, true);
                            var formID = xelib.GetFormID(error.handle);
                            xelib.RemoveElement(error.handle);
                            xelib.SetFormID(copy, formID);
                            xelib.Switch(error.handle, copy);
                        });
                    }
                },
                removeRecordResolution,
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
            return service.errorResolutions[acronym].filter(function(resolution) {
                if (!resolution.hasOwnProperty('available')) return true;
                return resolution.available(error);
            });
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

        this.getGroupResolution = function(errorGroup) {
            if (errorGroup.resolution === 'auto') {
                return service.errorResolutions[errorGroup.acronym][0];
            } else {
                return ignoreResolution;
            }
        };

        this.setGroupResolutions = function(errorGroup) {
            var resolution = service.getGroupResolution(errorGroup);
            if (resolution.hasOwnProperty('available')) {
                var resolutions = service.errorResolutions[errorGroup.acronym];
                errorGroup.errors.forEach(function(error) {
                    error.resolution = resolutions.find(function(resolution) {
                        if (!resolution.hasOwnProperty('available')) return true;
                        try {
                            return resolution.available(error);
                        } catch (x) {
                            return false;
                        }
                    });
                });
            } else {
                errorGroup.errors.forEach(function(error) {
                    error.resolution = resolution;
                });
            }
        };
    });
}
