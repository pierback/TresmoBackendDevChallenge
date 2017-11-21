//@ts-check
const config = require('./config');
const restify = require('restify');
const mongodb = require('mongodb');
const WineDB = require('./scripts/database/index');
const restifyPlugins = restify.plugins;

const server = restify.createServer({
    name: config.name,
    version: config.version,
});

server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.queryParser({ mapParams: true }));

server.listen(config.port, () => {
    mongodb.MongoClient.connect(config.db.uri)
        .then((db) => {
            const wines = new WineDB(db);
            require('./scripts/routes/index')(server, wines);
            if (config.env === 'test') {
                db.dropDatabase();
            } else {
                console.log(`Server is listening on port ${config.port}`, config.env);
            }
        })
        .catch((err) => {
            console.log(err);
        });
});