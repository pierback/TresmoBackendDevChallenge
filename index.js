//@ts-check
const config = require('./config');
const restify = require('restify');
const mongodb = require('mongodb');
const Wines = require('./scripts/database/index');
const restifyPlugins = restify.plugins;

const server = restify.createServer({
    name: config.name,
    version: config.version,
});

server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
//server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
//server.use(restifyPlugins.fullResponse());


server.listen(config.port, () => {
    mongodb.MongoClient.connect(config.db.uri)
        .then((db) => {
            const wines = new Wines(db);
            require('./scripts/routes/index')(server, wines);
            console.log(`Server is listening on port ${config.port}`);
            if (config.env === 'test') {
                console.log('start testing');
                db.dropDatabase();
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = server;