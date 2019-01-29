import express from 'express';
import tweets from './routes/tweets';
import config from './config'

var app = express()

app.listen(config.server.port, () => {
    console.log("Listening on port " + config.server.port);
});

app.use(express.static('public'));

app.use('/tweets', tweets);
