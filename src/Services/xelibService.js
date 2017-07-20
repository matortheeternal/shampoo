export default function(ngapp, xelib) {
    ngapp.service('xelibService', function() {
        var service = this;

        this.getExceptionInformation = function() {
            try {
                console.log(xelib.GetMessages());
                console.log(xelib.GetExceptionMessage());
            } catch (e) {
                console.log("Failed to get exception information: " + e);
            }
        };

        this.printGlobals = function() {
            try {
                console.log(xelib.GetGlobals());
            } catch (e) {
                console.log(e);
                service.getExceptionInformation();
            }
        };

        this.logXELibMessages = function() {
            console.log(xelib.GetMessages());
        };

        this.buildObjectView = function(obj) {
            var children = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var child = { key: obj.Constructor === Array ? '[' + key + ']' : key };
                    if (typeof(obj[key]) === 'object') {
                        if (Object.keys(obj).length == 0) {
                            child.value = '';
                        } else {
                            child.children = service.buildObjectView(obj[key]);
                        }
                    } else {
                        child.value = obj[key];
                    }
                    children.push(child);
                }
            }
            return children;
        };

        this.getRecordView = function(handle) {
            try {
                var obj = xelib.ElementToObject(handle);
                return service.buildObjectView(obj);
            } catch (e) {
                console.log(e);
                return [];
            }
        };

        this.highlightField = function(view, path) {
            try {
                var parts = path.split('\\');
                var fields = view;
                parts.forEach(function(part) {
                    if (part.startsWith('[') && part.endsWith(']')) {
                        part = part.slice(1, -1);
                    }
                    var nextField = fields.find(function(field) {
                        return (field.key === part);
                    });
                    if (!nextField) {
                        throw "Could not find field " + part;
                    } else if (nextField.hasOwnProperty('children')) {
                        nextField.showChildren = true;
                        fields = nextField.children;
                    } else {
                        nextField.highlight = true;
                    }
                });
            } catch (e) {
                console.log(e);
            }
        };

        this.withElement = function(handle, path, callback) {
            var element = xelib.GetElement(handle, path);
            try {
                callback(element);
            } finally {
                xelib.Release(element);
            }
        };

        this.withElements = function(handle, path, callback) {
            var elements = xelib.GetElements(handle, path);
            try {
                callback(elements);
            } finally {
                elements.forEach(xelib.Release);
            }
        };

        this.withLinksTo = function(handle, path, callback) {
            var element = xelib.GetLinksTo(handle, path);
            try {
                callback(element);
            } finally {
                xelib.Release(element);
            }
        };

        this.MoveVerticesUnderground = function(handle) {
            service.withElement(handle, 'NVNM\\Vertices', function(vertices) {
                for (var i = 0; i < xelib.ElementCount(vertices); i++) {
                    let z = xelib.GetFloatValue(vertices, `[${i}]`);
                    xelib.SetFloatValue(vertices, `[${i}]`, z - 30000.0);
                }
            });
        };

        this.RemoveEdgeLinkFlags = function(triangle) {
            let flags = xelib.GetUIntValue(triangle, `Flags`);
            if (flags & 2048) {
                xelib.SetIntValue(triangle, `Edge 0-1`, -1);
            }
            if (flags & 1024) {
                xelib.SetIntValue(triangle, `Edge 1-2`, -1);
            }
            if (flags & 512) {
                xelib.SetIntValue(triangle, `Edge 2-0`, -1);
            }
            if (flags >= 512) {
                xelib.SetUIntValue(triangle, `Flags`, flags % 512);
                return true;
            }
        };

        this.withOverride = function(record, file, callback) {
            let form = xelib.GetFormID(record);
            let override = xelib.AddElement(file, `${service.intToHex(form, 8)}`);
            if (!callback(override)) {
                xelib.RemoveElement(override);
            }
        };

        this.RemoveLinkedEdgeLinks = function(currentFile, currentForm, form, edgeLink) {
            service.withLinksTo(edgeLink, 'Mesh', function(mesh) {
                service.withOverride(mesh, currentFile, function(override) {
                    let triangle = xelib.GetIntValue(edgeLink, 'Triangle');
                    let changed = false;
                    service.withElement(override, `NVNM\\Triangles\\[${triangle}]`, function(meshTriangle) {
                        changed = changed || service.RemoveEdgeLinkFlags(meshTriangle);
                    });
                    if (!form) {
                        changed = changed || service.RemoveEdgeLinks(override, currentForm);
                    }
                    return changed;
                });
            });
        };

        this.RemoveEdgeLinks = function(handle, form) {
            let currentFile = xelib.GetElementFile(handle);
            let currentForm = xelib.GetFormID(handle);
            let changed = false;
            service.withElements(handle, 'NVNM\\Edge Links', function(edgeLinks) {
                for (let i = edgeLinks.length - 1; i >= 0; i--) {
                    if (form && xelib.GetUIntValue(edgeLinks[i], 'Mesh') !== form) continue;
                    service.RemoveLinkedEdgeLinks(currentFile, currentForm, form, edgeLinks[i]);
                    xelib.RemoveElement(edgeLinks[i]);
                    changed = true;
                }
            });
            return changed;
        };

        this.UpdateMinMaxZ = function(handle) {
            var minZ = xelib.GetFloatValue(handle, 'NVNM\\Min Z');
            xelib.SetFloatValue(handle, 'NVNM\\Min Z', minZ - 30000.0);
            var maxZ = xelib.GetFloatValue(handle, 'NVNM\\Max Z');
            xelib.SetFloatValue(handle, 'NVNM\\Max Z', maxZ - 30000.0);
        };

        this.GetReplacementNavmesh = function(handle) {
            let container = xelib.GetContainer(handle);
            let navmeshes = xelib.GetRecords(container, 'NAVM', false);
            return navmeshes[0];
        };

        this.intToHex = function(n, padding) {
            var str = Number(n).toString(16).toUpperCase();
            while (str.length < padding) {
                str = '0' + str;
            }
            return str;
        };
    });
}
