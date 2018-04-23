const path = require('path');
const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
const sanitize = require('sanitize-filename');
const fileType = require('file-type');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.CKAGEPORT;

// in-memory database for the testing phase.
const db = { "tokens": [] };
db.tokens.push("TOKEN"); // debug token

// configure express to use express-fileupload module.
app.use(fileUpload());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/upload', (req, res) => {
    if(!req.files){
        return res.status(400).send('Did not send a package.');
    }

    // user sent a (valid) token and a file.
    if(req.body.token && db.tokens.includes(req.body.token) && req.files.pkg){
        // get the file
        let pkg = req.files.pkg;
        // only operate if the file is a valid zip.
        if(fileType(pkg.data).mime === 'application/zip'){ 
            // sanitize the name to stop cheeky attacks
            // all package as stored in the `pkg/` directory.
            pkg.mv('./pkg/' + sanitize(pkg.name), (err) => {
                if(err) res.status(500).send('Unable to upload file');
                res.send('Successfully uploaded package');
            });
        } else {
            res.status(400).send('Package sent was in incorrect format');
        }
    } else { // token is unauthorized.
        res.status(401).send('Incorrect token.');
    }
});


app.get('/pkg', (req, res) => {
    // sanitize the pkg name to stop somebody from just saying:
    // 'give me an arbitrary file from the file system'
    let sanitizedPkg = sanitize(req.query.pkg);
    let pkgPath = path.resolve('pkg/', sanitizedPkg);

    // does the package exist?
    fs.stat(pkgPath, (err, stat) => {
        if(err == null){ // package exists
            res.sendFile(pkgPath);
        } else if(err.code == 'ENOENT'){ // package does not exist
            res.status(404).send('File does not exist');
        } else { // unknown error
            res.status(502).send('Internal server error');
            console.log(err);
        }
    });
});

app.listen(8080, () => {
    console.log('listening on port 8080');
});
