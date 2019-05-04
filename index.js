const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
const cors = require('cors');
const application = require('./app')

const app = express();

// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

app.use(cors());

app.get('/', function (req, res) {
    res.send('hello world')
})

app.post('/pdf', (req, res) => {
    const project = JSON.parse(req.body.project)
    const entries = JSON.parse(req.body.entriesJson)
    application.createPdfBinary(project, entries, function(binary) {
        res.setHeader('Content-Type', 'application/pdf');
        res.send(binary);
    }, function(error) {
        res.send('ERROR:' + error);
    });
});

var server = http.createServer(app);
var port = process.env.PORT || 8080;
server.listen(port);

console.log('http server listening on %d', port);
