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
            var flags = xelib.GetUIntValue(triangle, `Flags`);
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
            }
        };

        this.RemoveEdgeLinks = function(handle, form) {
            var currentForm = xelib.GetFormID(handle);
            service.withElements(handle, 'NVNM\\Edge Links', function(edgeLinks) {
                for (let i = edgeLinks.length - 1; i >= 0; i--) {
                    if (form && xelib.GetUIntValue(edgeLinks[i], 'Mesh') != form) continue;
                    service.withLinksTo(edgeLinks[i], 'Mesh', function(mesh) {
                        let triangle = xelib.GetIntValue(edgeLinks[i], 'Triangle');
                        service.withElement(mesh, `NVNM\\Triangles\\[${triangle}]`, function(meshTriangle) {
                            service.RemoveEdgeLinkFlags(meshTriangle);
                        });
                        if (!form) service.RemoveEdgeLinks(mesh, currentForm);
                    });
                    xelib.RemoveElement(edgeLinks[i]);
                }
            });
        };

        this.UpdateMinMaxZ = function(handle) {
            var minZ = xelib.GetFloatValue(handle, 'NVNM\\Min Z');
            xelib.SetFloatValue(handle, 'NVNM\\Min Z', minZ - 30000.0);
            var maxZ = xelib.GetFloatValue(handle, 'NVNM\\Max Z');
            xelib.SetFloatValue(handle, 'NVNM\\Max Z', maxZ - 30000.0);
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
