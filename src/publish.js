const fs = require('fs');
const path = require('path');
const request = require('request');
const archiver = require('archiver');
const log = require('./log');
// load ~/.ckage.json config file.
const config = require(path.resolve(require('os').homedir(), '.ckage.json'));
// load local manifest file
const manifest = require(process.cwd() + '/ckage.json');

const DEBUG = true;

if(DEBUG){
    baseUrl = "http://localhost:8080/upload";
}else{
    baseUrl = "http://ckage.pw/upload";
}

module.exports = () => {
    isDirectoryPackage(() => {
        makeArchive(() => {
            publishPackage();
        });
    });
};

const publishPackage = () => {
    isDirectoryPackage(() => { // only called if cwd is a valid package
        // create an HTTP post request
        let req = request.post(baseUrl, (err, res, body) => {
            if(err) log.error(err);
            else log(body);
        });
        let form = req.form();
        
        // add the zip file and the auth token into the POST body.
        form.append('pkg', fs.createReadStream(
            path.resolve(manifest.packageTitle + '.zip')));
        form.append('token', config.token);
    });
};


// check if the current directory is a valid package. 
const isDirectoryPackage = (callback) => {
    fs.readdir(process.cwd(), (err, items) => {
        if(items.includes('ckage.json')){ // if there's a manifest file in cwd.
            callback('pkg');
        } else {
            log.error('This is not a Ckage project directory...');
        }
    });
};

const makeArchive = (callback) => {
    // setup archiver lip and create zip file.
    let output = fs.createWriteStream(manifest.packageTitle + '.zip');
    let archive = archiver('zip');
    let numDirs = manifest.sourceDirs.length; // get number of directories
    let dirsZipped = 0; // the number of directories in the zip
    let doneZippingFiles = false;

    // listen for archive creation event
    output.on('close', () => {
        log(`Archive created (${archive.pointer() / 1024}KB)`);
        callback();
    });

    archive.on('error', (err) => {
        log.error(err);
    });

    archive.pipe(output);
    
    // loop through every directory and add the files to the archive.
    // this operation could possibly take up a big chunk of memory if a dir is large
    // TODO: cleanup.
    manifest.sourceDirs.forEach((dir) => {
        let dirIsDone = false; // current dir is finished being zipped?
        fs.readdir(process.cwd() + '/' + dir, (err, items) => {
            if(err) log.error(err);
            //maintain state throughout async and check when done.
            let numItems = items.length;
            let itemsZipped = 0;

            items.forEach((item) => {
                // make sure the file is not ignored.
                // TODO: allow regex.
                if(!manifest.fileIgnores.includes(item)){
                    // append the file
                    archive.append(fs.createReadStream(
                        process.cwd() + '/' + dir + '/' + item), {name: item});
                    itemsZipped++;
                    if(itemsZipped == numItems){
                        dirIsDone = true;
                    }
                } else { // remove ignored file from counter
                    numItems--;
                }
            });
            if(dirIsDone){
                dirsZipped++;
                if(dirsZipped == numDirs){
                    archive.finalize();
                }
            }
        });
    });
    
};
