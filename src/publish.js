const fs = require('fs');
const path = require('path');
const request = require('request');
// load ~/.ckage.json config file.
const config = require(path.resolve(require('os').homedir(), '.ckage.json'));

const DEBUG = true;

if(DEBUG){
    baseUrl = "http://localhost:8080/upload";
}else{
    baseUrl = "http://ckage.pw/upload";
}


module.exports.publishPackage = (pkg) => {
    isDirectoryPackage(() => { // only called if cwd is a valid package
        let req = request.post(baseUrl, (err, res, body) => {
            if(err) console.log(err);
            else console.log(body);
        });
        let form = req.form();
        form.append('pkg', fs.createReadStream(path.resolve('pkg')));
        form.append('token', config.token);
    });
};


// check if the current directory is a valid package. 
const isDirectoryPackage = (callback) => {
    fs.readdir(process.cwd(), (err, items) => {
        if(items.includes('ckage.json')){ // if there's a manifest file in cwd.
            callback('pkg');
        }
    });
};
