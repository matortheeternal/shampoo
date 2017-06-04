export default function(remote, jetpack) {
    var fh = {};

    fh.jetpack = jetpack;
    fh.appDir = jetpack.cwd(remote.app.getAppPath());

    // helper function for loading json file
    fh.loadJsonFile = function (filename, defaultValue) {
        if (fh.appDir.exists(filename) === 'file') {
            return fh.appDir.read(filename, 'json');
        } else {
            return defaultValue || [];
        }
    };

    // helper function for saving json files
    fh.saveJsonFile = function(filename, value) {
        fh.appDir.write(filename, value);
    };

    return fh;
}
