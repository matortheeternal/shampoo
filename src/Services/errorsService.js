export default function(ngapp, xelib) {
    ngapp.service('errorsService', function (xelibService) {
        var service = this;

        this.errorAcronyms = [
            "ITM",
            "ITPO",
            "DR",
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
                    caption: "ITMs are records that have been overridden in a plugin file but haven't been change relative to their master record.",
                    benign: true,
                    errors: []
                },
                {
                    group: 1,
                    name: "Identical to Previous Override Records",
                    acronym: "ITPO",
                    caption: "ITPOs are records that have been overridden in a plugin file that haven't been changed relative to their previous override.",
                    benign: true,
                    errors: []
                },
                {
                    group: 2,
                    name: "Deleted Records",
                    acronym: "DR",
                    caption: "DRs are records which have been marked as deleted with either their subrecords still present or the chance to cause CTDs when referenced.",
                    errors: []
                },
                {
                    group: 3,
                    name: "Unexpected Subrecords",
                    acronym: "UES",
                    caption: "UESs are errors where the data structure of a record is abnormal.",
                    benign: true,
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
            DR: function(error) {
                if (isNavmeshError(error)) return [error.name, `Navmesh marked as deleted.`];
                if (isUDR(error)) return [error.name, `Reference marked as deleted.`];
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

        var referenceSignatures = ['REFR', 'PGRE', 'PMIS', 'ACHR', 'PARW', 'PBAR', 'PBEA', 'PCON', 'PFLA', 'PHZD'];

        var isUDR = function(error) {
            return referenceSignatures.indexOf(error.signature) > -1;
        };

        var isNavmeshError = function(error) {
            return error.signature === 'NAVM';
        };

        var logErrorException = function(error, exception) {
            console.log(error);
            console.log(exception);
        };

        var withErrorElement = function(error, callback, onException = logErrorException) {
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
            color: "red",
            description: "This resolution will remove the record from the plugin.",
            execute: function(error) {
                xelib.RemoveElement(error.handle);
            }
        };
        var tweakEdidResolution = {
            label: "Tweak EDID",
            color: "green",
            description: "This resolution will adjusted the EditorID of the record so it is no longer an ITM.",
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
            color: "green",
            description: "This resolution will slightly adjust the position of the reference so it is no longer an ITM.",
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
            color: "green",
            description: "This resolution will set the reference to a NULL [00000000] reference.",
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
                });
            }
        };
        var removeResolution = {
            label: "Remove",
            color: "red",
            description: "This resolution will remove the error element from the record.",
            execute: function(error) {
                withErrorElement(error, function(element) {
                    xelib.RemoveElementOrParent(element);
                    xelib.Release(element);
                });
            }
        };
        var repairResolution = {
            label: "Repair",
            color: "green",
            description: "This resolution will fix the order of subrecords in the record and trim invalid ones.",
            execute: function(error) {
                xelibService.withElementFile(error.handle, function(file) {
                    var copy = xelib.CopyElement(error.handle, file, true);
                    var formID = xelib.GetFormID(error.handle);
                    xelib.RemoveElement(error.handle);
                    xelib.SetFormID(copy, formID);
                    xelib.Switch(error.handle, copy);
                });
            }
        };
        var ignoreResolution = {
            label: "Ignore",
            color: "yellow",
            description: "This resolution will leave the error in the plugin."
        };
        var identicalResolutions = [
            removeRecordResolution,
            tweakEdidResolution,
            tweakPositionResolution,
            ignoreResolution
        ];
        var deletedResolutions = [
            {
                label: "Replace Navmesh",
                color: "green",
                description: "This resolution will replace the deleted navmesh with the new navmesh introduced by the plugin.",
                available: function(error) {
                    return isNavmeshError(error) && xelibService.hasReplacementNavmesh(error.handle);
                },
                execute: function(error) {
                    xelibService.withReplacementNavmesh(error.handle, function(navmesh) {
                        let plugin = xelib.GetElementFile(navmesh);
                        let oldFormID = xelib.GetFormID(navmesh);
                        let newFormID = xelib.GetFormID(error.handle);
                        console.log(`Removing [NAVM:${oldFormID}] and replacing it with [NAVM:${newFormID}]`);
                        xelib.RemoveElement(error.handle);
                        xelib.SetFormID(navmesh, newFormID, false, false);
                        xelibService.withRecords(plugin, 'NAVM,NAVI', true, function(records) {
                            records.forEach(function(record) {
                                xelib.ExchangeReferences(record, oldFormID, newFormID);
                            });
                        });
                    });
                }
            },
            {
                label: "Bury Navmesh",
                color: "green",
                description: "This resolution will lower the navmesh's verticies below the ground and remove its edge links.",
                available: isNavmeshError,
                execute: function(error) {
                    console.log(`Burying [NAVM:${xelib.GetFormID(error.handle)}]`);
                    xelib.SetRecordFlag(error.handle, "Deleted", false);
                    xelibService.MoveVerticesUnderground(error.handle);
                    xelibService.RemoveEdgeLinks(error.handle);
                    xelibService.UpdateMinMaxZ(error.handle);
                }
            },
            {
                label: "Undelete and Disable",
                color: "green",
                description: "This resolution will undelete the reference and mark it as disabled.",
                available: isUDR,
                execute: function(error) {
                    xelib.SetRecordFlag(error.handle, "Deleted", false);
                    xelib.SetRecordFlag(error.handle, "Initially Disabled", true);
                }
            },
            {
                label: "Clear Subrecords",
                color: "green",
                description: "This resolution will clear the record's subrecords.",
                available: function(error) {
                    return !isUDR(error) && !isNavmeshError(error);
                },
                execute: function(error) {
                    xelib.SetRecordFlag(error.handle, "Deleted", false);
                    xelib.SetRecordFlag(error.handle, "Deleted", true);
                }
            },
            {
                label: "Restore",
                color: "red",
                description: "This resolution will restore the record.  You should not use this resolution unless you know exactly what you're doing!",
                execute: function(error) {
                    xelib.SetRecordFlag(error.handle, "Deleted", false);
                }
            },
            ignoreResolution
        ];

        this.errorResolutions = {
            ITM: identicalResolutions,
            ITPO: identicalResolutions,
            DR: deletedResolutions,
            UES: [
                repairResolution,
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
                ignoreResolution
            ]
        };

        this.getErrorResolutions = function(error) {
            let acronym = service.errorAcronyms[error.group];
            return service.errorResolutions[acronym].filter(function(resolution) {
                if (!resolution.hasOwnProperty('available')) return true;
                return resolution.available(error);
            });
        };

        this.getErrorMessage = function(error) {
            let acronym = service.errorAcronyms[error.group];
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
