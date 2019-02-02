import express from 'express';
import bodyParser from 'body-parser';
import tweetModel from '../models/tweet';

const tweetsRouter = express.Router();

const parseUrlEncoded = bodyParser.urlencoded({extended:true});

tweetsRouter.route('/userTweets')
    .get((request, response) => {
        console.log("GET /tweets/userTweets")
        var query = tweetModel.find(
            {
                '$or': [{'classification.naive_bayes.result': 'issue'}, {'classification.naive_bayes.result': 'complaint'}],
                'user.id': {'$ne': 182764833},
                'text': {$regex: '^[^RT ](.*)$'}
            },
            {
                'created_at': 1,
                'text': 1,
                'extended_tweet':1,
                'timestamp_ms':1,
                'user': 1,
                'id': 1,
                'id_str': 1,
                'classification': 1
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

tweetsRouter.route('/issues')
    .get((request, response) => {
        console.log("GET /tweets/issues")
        var query = tweetModel.find(
            {
                'classification.naive_bayes.result': 'issue',
                'user.id': {'$ne': 182764833},
                'text': {$regex: '^[^RT ](.*)$'}
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
                'user.id': {'$ne': 182764833},
                'text': {$regex: '^[^RT ](.*)$'}
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
                'user.id': {'$ne': 182764833},
                'text': {$regex: '^[^RT ](.*)$'}
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

tweetsRouter.route('/official')
    .get((request, response) => {
        console.log("GET /tweets/official")
        var query = tweetModel.find(
            {
                '$or': [{'classification.naive_bayes.result': 'issue'}, {'classification.naive_bayes.result': 'complaint'}],
                'user.id': 182764833,
                'text': {$regex: '^[^RT ](.*)$'},
                'in_reply_to_status_id': null
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