import express from 'express';
import bodyParser from 'body-parser';
import tweetModel from '../models/tweet';
import moment from 'moment';

const tweetsRouter = express.Router();

const parseUrlEncoded = bodyParser.urlencoded({extended:true});

tweetsRouter.route('/')
    .get((request, response) => {
        console.log("GET /tweets")
        var query = tweetModel.find(
            {
                '$or': [
                    {'$and': [
                        {'$or': [{'classification.naive_bayes.result': 'issue'}, {'classification.naive_bayes.result': 'complaint'}]},
                        {'user.id': {'$ne': 182764833}},
                        {'text': {$regex: '^[^RT ](.*)$'}}
                    ]},
                    {'$and': [
                        {'user.id': 182764833},
                        {'text': {$regex: 'Circulac(.*)|Servicio(.*)|Incidencia(.*)|Continúa interr(.*)|Servicio norm(.*)|El tramo interr(.*)|Los trenes no efect(.*)|Interrumpida la cir(.*)|Continúa interrum(.*)|Servicio restablecido(.*)'}}
                    ]}
                ],
            },
            {
                'text': 1,
                'extended_tweet.full_text':1,
                'timestamp_ms':1,
                'user.id': 1,
                'user.name': 1,
                'user.screen_name': 1,
                'user.profile_image_url_https': 1,
                'id_str': 1,
                'classification.naive_bayes.result': 1
            },
            {
                sort: {'timestamp_ms': -1}
            }).limit(2000);
        query.exec((err, tweets) => {
            console.log("received ... " + tweets.length)
            if(tweets !== undefined) {
                response.json(tweets);
            } else {
                response.json('{error: "no tweets"}');
            }
        })
    });


tweetsRouter.route("/:timestamp/:page/:days").get((request, response) => {
        console.log("GET /tweets")
        var timestamp = request.params.timestamp,
            page = request.params.page,
            days = request.params.days,
            firstDay = moment.unix(timestamp),
            lastDay = firstDay.startOf("day").subtract(days, "days");

        var query = tweetModel.find(
            {
                '$or': [
                    {'$and': [
                        {'$or': [{'classification.naive_bayes.result': 'issue'}, {'classification.naive_bayes.result': 'complaint'}]},
                        {'user.id': {'$ne': 182764833}},
                        {'text': {$regex: '^[^RT ](.*)$'}}
                    ]},
                    {'$and': [
                        {'user.id': 182764833},
                        {'text': {$regex: 'Circulac(.*)|Servicio(.*)|Incidencia(.*)|Continúa interr(.*)|Servicio norm(.*)|El tramo interr(.*)|Los trenes no efect(.*)|Interrumpida la cir(.*)|Continúa interrum(.*)|Servicio restablecido(.*)'}}
                    ]}
                ]
            },
            {
                'text': 1,
                'extended_tweet.full_text':1,
                'timestamp_ms':1,
                'user.id': 1,
                'user.name': 1,
                'user.screen_name': 1,
                'user.profile_image_url_https': 1,
                'id_str': 1,
                'classification.naive_bayes.result': 1
            },
            {
                sort: {'_id': -1}
            });
        query
            .limit(2000)
            .exec((err, tweets) => {
            console.log("received ... " + tweets.length)
            if(tweets !== undefined) {
                response.json(tweets);
            } else {
                response.json('{error: "no tweets"}');
            }
        })
    });

module.exports = tweetsRouter;
