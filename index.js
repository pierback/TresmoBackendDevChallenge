//@ts-check
const config = require('./config');
const { Logger } = require('./scripts/utility');
const restify = require('restify');
const mongodb = require('mongodb');
const Wines = require('./scripts/wines');
const restifyPlugins = restify.plugins;

const server = restify.createServer({
    name: config.name,
    version: config.version,
});

server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

server.listen(config.port, () => {
    mongodb.MongoClient.connect(config.db.uri)
        .then((db) => {
            const wines = new Wines(db);
            require('./scripts/routes')(server, wines);
            Logger(`Server is listening on port ${config.port}`);
        })
        .catch((err) => {
            Logger(err);
        });
});
