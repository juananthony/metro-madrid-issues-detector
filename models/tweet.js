import mongoose from '../db.js';
import uuid from 'node-uuid';

const TweetSchema = mongoose.Schema({
    id: Number,
    id_str: String,
    text: String,
    classification: {
        naive_bayes: {
            result: String,
            classifier: String
        }
    },
    user: {
        id: Number,
        name: String,
        url: String,
        location: String,
        description: String
    },
    created_at: Date,
    timestamp_ms: Number
});

TweetSchema.set('collection', 'tweets');

module.exports = mongoose.model('tweet', TweetSchema);
