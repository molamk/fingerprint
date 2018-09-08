const express = require('express');
const bodyParser = require('body-parser');
const userAgent = require('express-useragent');
const cors = require('cors');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const Fingerprint = require('./database');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("port", 3000);
app.set("trust proxy", true);
app.use(userAgent.express());
app.use(express.static('.'))
app.use(cors());

app.post('/fp', (req, res) => {
    fetch('https://extreme-ip-lookup.com/json/')
        .then(res => res.json())
        .then((fromIp) => {
            const fingerprint = {
                fromBrowser: {
                    hash: req.body.hash,
                    ...req.body.fingerprint.reduce((prev, curr) => {
                        prev[curr.key] = curr.value;
                        return prev;
                    }, {})
                },
                fromIp,
                fromUserAgent: req.useragent
            };
            fingerprint.hash = require('crypto').createHash('sha1').update(JSON.stringify(fingerprint)).digest('base64');
            new Fingerprint(fingerprint).save().then(() => {
                console.log(`Saved a new fingerprint ${fingerprint.hash}`);
            }).catch(() => {
                console.log(`Fingeprint ${fingerprint.hash} detected on this domain: ${req.protocol}://${req.hostname}`);
            });
        });

    res.status(200);
});

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true }).then(() => {
    app.listen(app.get('port'));
});