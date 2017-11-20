//@ts-check
/* const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp'); */
module.exports = function (db) {
    const wines = db.createCollection('wines',
        {
            validator: {
                $or:
                    [
                        { id: { $type: 'int' } },
                        { name: { $type: 'string' } },
                        { year: { $type: 'date' } },
                        { country: { $type: 'string' } },
                        { type: { $type: 'string', $in: ['red', 'white', 'rose'] } },
                        { description: { $type: 'string' } }
                    ]
            },
            validationAction: 'warn'
        }
    );
    db.collection('wines').insertOne({ name: 2, description: 'Updated' }).then(function (result) {
        var ret = result.ops[0];
        delete ret._id;

        console.log(ret);
    });
    //return db;
};