//@ts-check
const config = require('../config');
const IsEmpty = (val, query) => val ? true : false;
const IsNull = (val) => val == null ? true : false;
const StringValidation = (val) => IsEmpty(val);
const NoNumber = (val) => { if (isNaN(val)) 'INVALID'; };
const YearValidator = (val) => IsEmpty(val) || NoNumber(val);
const isError = (val) => IsEmpty(val);
const logger = (...str) => console.log(JSON.parse(JSON.stringify(str)));

//@ts-ignore
const valType = (key, val, query) => key === 'type' ? config.res_attr.type.includes(query[key]) : val === typeof query[key];

exports.Validate = (query) => {
    let message = { data: query, err: false };
    for (const key of Object.keys(config.res_attr)) {
        let val = config.res_attr[key];
        if (!query[key]) {
            message.err = true;
            message.key = 'MISSING';
        }
        if (!valType(key, val, query)) {
            message.err = true;
            message.key = 'INVALID';
        }
    }
    return message;
};

exports.IsError = isError;
exports.Logger = logger;
exports.PromiseCheck = (err, val) => {
    isError(err) ? Promise.reject(err) : Promise.resolve(val);
};
exports.NextSequence = function (name, db, callback) {
    var counters = db.collection('counters');
    logger('counters', counters);
    counters.findAndModify(
        { _id: name },
        [],
        { $inc: { seq: 1 } },
        { new: true },
        function (err, result) {
            if (!err)
                callback(result.value.seq);
            else
                callback(-1);
        }
    );
};

exports.CreateWineObject = (res) => {
    let tempObj = {};
    Object.assign(tempObj, res);

    for (let key of Object.keys(tempObj)) {
        if (typeof tempObj[key] === 'number') {
            tempObj[key] = parseInt(tempObj[key]);
        }
    }
    return tempObj;
};

exports.ReturnPromise = (err, val, Promise) => {
    new Promise((resolve, reject) => {
        err == true ? reject(err) : resolve(val);
    });
};