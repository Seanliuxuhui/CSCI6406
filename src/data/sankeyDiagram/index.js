const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const dir = __dirname;

fs.readdir(dir, function (err, files) {
    if (err) console.error(err);
    files.forEach(function (file) {
        router.get('/' + file, function (req, res) {
            fs.readFile(path.join(dir, file), 'utf8', function (err, data) {
                if (err) throw err;
                res.json(JSON.stringify(data.split('\n')));
            });
        });
    });
});

module.exports = router;