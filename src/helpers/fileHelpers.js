export default function(remote, jetpack) {
    let fh = {};

    fh.jetpack = jetpack;
    fh.appPath = remote.app.getAppPath();
    fh.appDir = jetpack.cwd(fh.appPath);

    // helper function for loading json file
    fh.loadJsonFile = function (filename, defaultValue) {
        if (fh.appDir.exists(filename) === 'file') {
            return fh.appDir.read(filename, 'json');
        } else {
            return defaultValue || [];
        }
    };

    // helper function for saving json files
    fh.saveJsonFile = function(filename, value, minify = false) {
        fh.appDir.write(filename, minify ? JSON.stringify(value) : value);
    };

    fh.getDateModified = function(filename) {
        return fh.appDir.inspect(filename, {times: true}).modifyTime;
    };

    // helper function for selecting a directory
    fh.selectDirectory = function(title, defaultPath) {
        let selection = remote.dialog.showOpenDialog({
            title: title,
            defaultPath: defaultPath,
            properties: ['openDirectory']
        });
        if (!selection) return defaultPath;
        return selection[0];
    };

    return fh;
}
