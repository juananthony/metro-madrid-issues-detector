import express from 'express';

var app = express()

app.listen(config.server.port, () => {
    console.log("Listening on port " + config.server.port);
});

app.use(express.static('public'));
