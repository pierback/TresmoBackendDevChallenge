//@ts-check
const { Logger, NextSequence, PromiseCheck, CreateWineObject, IsError } = require('./utility');
let wines;

module.exports = class Wines {
    constructor(db) {
        wines = db.collection('wines');
    }
    update(id, data) {
        console.log('update ', id, data);
        return new Promise((resolve, reject) => {
            wines.findOneAndUpdate(
                { id: id },
                { $set: data },
                { returnOriginal: false },
                (err, res) => {
                    console.log('update res', res);
                    IsError(err) ? reject(err) : resolve(res);
                });
        });
    }

    list(query) {
        return new Promise((resolve, reject) => {
            wines.find(query).toArray((err, res) => {
                IsError(err) ? reject(err) : resolve(res);
            });
        });
    }

    delete(id) {
        Logger('delete', id);
        return new Promise((resolve, reject) => {
            wines.removeOne({ id: id }, (err, res) => {
                IsError(err) ? reject(err) : resolve(res);
            });
        });
    }

    insert(query) {
        let wine = CreateWineObject(query);
        return new Promise((resolve, reject) => {
            wines.insertOne(wine)
                .then((res) => {
                    let msg = res.ops[0];
                    delete msg._id;
                    resolve(msg);
                });
        });
        /* 
                NextSequence('wine_id', function (seq) {
                    return new Promise((resolve, reject) => {
                        if (seq < 0) reject({ error: 'INTERNAL_SERVER_ERROR' });
        
                        let wine = CreateWineObject(query);
                        wine.description = query.description === undefined ? '' : query.description;
                        console.log('insert ', query);
                        wines.insertOne(wine)
                            .then((res) => {
                                console.log('res ', res);
                                var ret = res.ops[0];
                                delete ret._id;
                                resolve(ret);
                            })
                            .catch((err) => reject(err));
                    }); 
        
                });*/


    }
    getById(query) {
        return new Promise((resolve, reject) => {
            wines.findOne(query)
                .then((res) => {
                    delete res._id;
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
};
