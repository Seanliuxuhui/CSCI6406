const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const dir = __dirname;
const journalType = ['TKDE', 'TVCG', 'TOG'];
const journalYearsMap = {
    'TKDE': ['2014', '2015', '2016', '2017', '2018'],
    'TOG': ['2014', '2015', '2016', '2017', '2018'],
    'TVCG': ['2014', '2015', '2016', '2017', '2018']
};
const promises = [];
journalType.forEach(function (type) {
    journalYearsMap[type].forEach(function (year) {
        router.get(`/${type}/${year}`, function (req, res) {
            fs.readdir(path.join(__dirname, type, year, 'cathy'), function (err, files) {
                files.forEach(function (file) {
                    if (file.includes('cathy')) {
                        promises.push(new Promise(function (resolve, reject) {
                            fs.readFile(path.join(dir, type, year, 'cathy', file), 'utf8', function (err, data) {
                                if (err) reject(err);
                                resolve(data);
                            });
                        }))
                    }
                });

                Promise.all(promises).then(function (data) {
                    const responses = [];
                    const added = new Set();
                    data.forEach(function (content) {
                        if (content && !added.has(content)) {
                            responses.push(content.split('\n'));
                            added.add(content);
                        }
                    });
                    res.send(responses);
                }).catch(function (err) {
                    res.send('no content');
                })
            })
        })
    })
});


module.exports = router;
