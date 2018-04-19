const axios = require('axios');
const fs = require('fs');
const path = require('path');

const DEBUG = true;

if(DEBUG){
    baseUrl = "http://localhost:8080";
}else{
    baseUrl = "http://ckage.pw";
}
module.exports.parseList = (flags) => {
    // load the ckage.json package list
    let list = require(path.resolve('ckage.json'));
    for(let i in list.packages){
        // download every package in the current ckage.json file
        this.getPackage(list.packages[i], flags);
    }
};

/*request the package*/
module.exports.getPackage = (pkg, flags) => {
    console.log(`Downloading ${pkg}...`);
    // perform get request on the package
    axios({
        method: 'get',
        url: baseUrl + '/pkg/' + pkg,
        responseType: 'stream'
    }).then((res) => {
        // download the file response into the dir where the script was run from
        // if the dir flag is unset then use the default: 'ckages'.
        res.data.pipe(fs.createWriteStream(path.resolve(process.cwd(),
                                                        (flags.dir || 'ckages'), pkg)));
    });
};
