const axios = require('axios');
const fs = require('fs');
const path = require('path');
const log = require('./log');
const chalk = require('chalk');
// load the ~/ckage.json file.
const config = require(path.resolve(require('os').homedir(), '.ckage.json'));


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
    log(chalk.blue(`Downloading ${pkg}...`));
    // perform get request on the package
    let getUrl = config.url + '/pkg' + '?pkg=' + pkg;
    axios({
        method: 'get',
        url: getUrl,
        responseType: 'stream'
    }).then((res) => {
        // download the file response into the dir where the script was run from
        // if the dir flag is unset then use the default: 'ckages'.
        res.data.pipe(fs.createWriteStream(path.resolve(process.cwd(),
                                                        (flags.dir || 'ckages'), pkg)));
    }).catch((err) => {
        log.error(err);
    });
};

