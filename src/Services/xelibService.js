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
    });
}
