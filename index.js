#!/usr/bin/env node

const commander = require('commander');
const fs = require('fs');
const manifest = require('./ckage.json');

// built-in modules
const getPkg = require('./src/get-package');
const publish = require('./src/publish');
const log = require('./src/log');

// parse command line options
commander
    .version('1.0.0')
    .option('-s, --save', 'Save into the ckage file along with install')
    .option('-d, --dir <directory>', 'Specify a custom package out directory')
    .option('p, publish', 'Publish to the repository')
    .option('i, install [pkg]',
            'Install a package; specify no package to install from ckage.json')
    .parse(process.argv);

// if publish is set
if(commander.publish){
    publish();
}

// if the option exists
if(commander.install){
    // check if ckages dir exists
    fs.stat('ckages/', (err, stat) => {
        if(err == null){ // dir exists
            installPkg(commander);
        } else if(err.code == 'ENOENT'){ // dir does not exist
            fs.mkdir('ckages/', (err) => { // create ckages dir
                if(err) log.error(err);
                installPkg(commander);
            });
        } else { // *other* error
            console.log(err);
        }
    });
}


// handle the install parameter
const installPkg = (flags) => {
    if(flags.install != true){ 
        getPkg.getPackage(flags.install, flags);
    } else {
        getPkg.parseList(flags); // download all of the packages.
    }
};

// compare with the list of tests
// temporarily is just a testing operation for checking functions.
// TODO: read tests from manifest
const ckageTest = (t) => {
    log("TODO: implement testing.");
};
        
