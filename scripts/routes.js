//@ts-check
const errors = require('restify-errors');
const { Logger, NextSequence, PromiseCheck, Validate, CreateWineObject } = require('./utility');
module.exports = function (server, wineDB) {

	/**
	 * POST
	 */
    server.post('/wines', (req, res, next) => {
        res.charSet('utf-8');

        console.log('insert ', req.params);
        const validation = Validate(req.params);

        if (validation.err) {
            res.status(400);
            res.send({
                error: 'VALIDATION_ERROR',
                validation: validation
            });
        }
        else {
            req.params.year = parseInt(req.params.year);
            wineDB.insert(req.params)
                .then((result) => {
                    if (result.error !== undefined)
                        res.status(500);
                    else {
                        res.status(200);
                        res.send(result);
                    }
                })
                .catch(err => {

                });
        }

        next();
    });

	/**
	 * LIST
	 */
    server.get('/wines', (req, res, next) => {

        const query = CreateWineObject(req.query);
        res.charSet('utf-8');

        wineDB.list(query)
            .then((docs) => {
                console.log('docs', docs);
                docs.forEach(function (x) {
                    delete x._id;
                });
                res.send(docs);
                next();
            })
            .catch(err => {

            });
    });

	/**
	 * GET
	 */
    server.get('/wines/:id', (req, res, next) => {
        res.charSet('utf-8');
        wineDB.getById({ id: parseInt(req.params.id) })
            .then((result) => {
                if (result) {
                    res.status(200);
                    res.send(result);
                } else {
                    res.status(400);
                    res.send({
                        error: 'UNKNOWN_OBJECT'
                    });
                }
            })
            .catch((err) => {
                res.status(400);
                res.send({
                    error: 'UNKNOWN_OBJECT'
                });
            });
        next();
    });

    /**
     * UPDATE
     */
    server.put('/wines/:id', (req, res, next) => {
        const validation = Validate(req.params);
        res.charSet('utf-8');

        if (validation.err) {
            res.status(400);
            res.send({
                error: 'VALIDATION_ERROR',
                validation: validation
            });
        }
        else {
            const id = parseInt(req.params.id);
            let wine = CreateWineObject(req.params);
            wine.description = req.params.description === undefined ? '' : req.params.description;

            wineDB.update(id, wine)
                .then((result) => {
                    if (!result) {
                        res.status(400);
                        res.send({
                            error: 'UNKNOWN_OBJECT'
                        });
                    }
                    else {
                        const ret = result;
                        delete ret._id;
                        res.status(200);
                        res.send(ret);
                    }
                })
                .catch(err => {
                    if (err) {
                        res.status(500);
                        res.send({ error: 'INTERNAL_SERVER_ERROR' });
                    }
                });
        }
        next();
    });

    /**
     * DELETE
     */
    server.del('/wines/:id', (req, res, next) => {
        const id = parseInt(req.params.id);
        res.charSet('utf-8');
        wineDB.delete(id)
            .then((result) => {
                console.log('delete', result);
                if (result.deletedCount === 1) {
                    res.status(200);
                    res.send({ success: true });
                }
                else {
                    res.status(400);
                    res.send({ error: 'UNKNOWN_OBJECT' });
                }
            })
            .catch(err => {
                if (err) {
                    res.status(500);
                    res.send({
                        error: 'INTERNAL_SERVER_ERROR'
                    });
                }
            });

        next();
    });
};    