//@ts-check
const { NextID } = require('./helper');
let wines;

module.exports = class WineDB {
    constructor(db) {
        wines = db.collection('wines');
    }
    update(id, data) {
        delete data.id;
        return new Promise((resolve, reject) => {
            try {
                wines.findOneAndUpdate(
                    { id: id },
                    { $set: data },
                    { returnOriginal: false },
                    (err, res) => {
                        delete res.value._id;
                        resolve(res.value);
                    });
            } catch (e) {
                resolve({ error: 'UNKNOWN_OBJECT' });
            }
        });
    }

    list(query) {
        return new Promise((resolve, reject) => {
            wines.find(query).toArray((err, res) => {
                err ? reject(err) : resolve(res);
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            wines.removeOne({ id: id })
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }

    insert(request) {
        return new Promise((resolve, reject) => {
            this.list().then((db) => {
                const rq = Object.assign({ id: NextID(db) }, request);
                wines.insertOne(rq)
                    .then((res) => {
                        let msg = res.ops[0];
                        delete msg._id;
                        resolve(msg);
                    })
                    .catch((err) => reject(err));
            });

        });
    }

    getById(query) {
        return new Promise((resolve, reject) => {
            wines.findOne(query)
                .then((res) => {
                    delete res._id;
                    resolve(res);
                })
                .catch((err) => reject(err));
        });
    }
};
