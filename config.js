module.exports = {
    server: {
        port: process.env.PORT || process.env.SERVER_PORT
    },
    db: {
        uri: 'mongodb+srv://' + process.env.MONGO_USER_TWEETS + ':' + process.env.MONGO_PASS_TWEETS + '@' + process.env.MONGO_SERVER_TWEETS + '/'
    }
}
