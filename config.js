//@ts-check
module.exports = {
    name: 'API',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://heroku_cv53rgbl:vkbpfkcrt40c5qut8kv5jodvt5@ds111066.mlab.com:11066/heroku_cv53rgbl',
    },
    res_attr: {
        id: 'number',
        name: 'string',
        year: 'number',
        country: 'string',
        type: ['red', 'white', 'rose'],
        description: 'string'
    }
};