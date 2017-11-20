//@ts-check
const errors = require('restify-errors');
const { Validate, WineObj, ExtWineObj } = require('./helper');



module.exports = function (server, wineDB) {

	/**
	 * POST
	 */
    server.post('/wines', (req, res, next) => {
        res.charSet('utf-8');
        const wine = WineObj(req.body);
        const validation = Validate(req.body);

        if (validation.err) {
            res.status(400);
            res.send({
                error: 'VALIDATION_ERROR',
                validation: validation.data
            });
        }
        else {
            req.body.year = parseInt(req.body.year);
            wineDB.insert(wine)
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
        res.charSet('utf-8');
        const query = WineObj(req.query);
        wineDB.list(query)
            .then((docs) => {
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
        const wine = ExtWineObj(req.params);
        const validation = Validate(req.params);
        res.charSet('utf-8');
        if (validation.err) {
            res.status(400);
            res.send({
                error: 'VALIDATION_ERROR',
                validation: validation.data
            });
        }
        else {
            const id = parseInt(req.params.id);
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
                    res.status(400);
                    res.send({
                        error: 'UNKNOWN_OBJECT'
                    });
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