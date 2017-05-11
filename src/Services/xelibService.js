export default function(ngapp, xelib) {
    ngapp.service('xelibService', function() {
        var service = this;

        this.getExceptionInformation = function () {
            try {
                console.log(xelib.GetBuffer());
                console.log(xelib.GetExceptionMessage());
            } catch (e) {
                console.log("Failed to get exception information: " + e);
            }
        };

        this.testGetGlobal = function () {
            try {
                console.log(xelib.GetGlobal('ProgramPath'));
            } catch (e) {
                console.log(e);
                service.getExceptionInformation();
            }
        };

        this.logXELibBuffer = function () {
            console.log(xelib.GetBuffer());
        };

        this.getAndFlushBuffer = function () {
            var log = xelib.GetBuffer();
            if (log) {
                xelib.FlushBuffer();
                return log + "\n";
            }
            return "";
        };
    });
}
