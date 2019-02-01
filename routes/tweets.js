import express from 'express';
import bodyParser from 'body-parser';
import tweetModel from '../models/tweet';

const tweetsRouter = express.Router();

const parseUrlEncoded = bodyParser.urlencoded({extended:true});

tweetsRouter.route('/issues')
    .get((request, response) => {
        console.log("GET /tweets/issues")
        var query = tweetModel.find(
            {
                'classification.naive_bayes.result': 'issue',
                'user.id': {'$ne': 182764833}
            },
            {
                'created_at': 1,
                'text': 1,
                'extended_tweet':1,
                'timestamp_ms':1,
                'user': 1,
                'id': 1,
                'id_str': 1
            },
            {
                sort: {'timestamp_ms': -1}
            });
        query.exec((err, tweets) => {
            console.log("received ... " + tweets.length)
            if(tweets !== undefined) {
                response.json(tweets);
            } else {
                response.json('{error: "no tweets"}');
            }
        })
    });

tweetsRouter.route('/complaints')
    .get((request, response) => {
        console.log("GET /tweets/complaints")
        var query = tweetModel.find(
            {
                'classification.naive_bayes.result': 'complaint',
                'user.id': {'$ne': 182764833}
            },
            {
                'created_at': 1,
                'text': 1,
                'extended_tweet':1,
                'timestamp_ms':1,
                'user': 1,
                'id': 1,
                'id_str': 1
            });
        query.exec((err, tweets) => {
            console.log("received ... " + tweets.length)
            if(tweets !== undefined) {
                response.json(tweets);
            } else {
                response.json('{error: "no tweets"}');
            }
        })
    });

tweetsRouter.route('/nothings')
    .get((request, response) => {
        console.log("GET /tweets/nothings")
        var query = tweetModel.find(
            {
                'classification.naive_bayes.result': 'nothing',
                'user.id': {'$ne': 182764833}
            },
            {
                'created_at': 1,
                'text': 1,
                'extended_tweet':1,
                'timestamp_ms':1,
                'user': 1,
                'id': 1,
                'id_str': 1
            });
        query.exec((err, tweets) => {
            console.log("received ... " + tweets.length)
            if(tweets !== undefined) {
                response.json(tweets);
            } else {
                response.json('{error: "no tweets"}');
            }
        })
    });

module.exports = tweetsRouter;