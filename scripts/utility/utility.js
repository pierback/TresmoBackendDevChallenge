//@ts-check
const config = require('../../config');
const IsEmpty = (val, query) => val ? true : false;
const IsNull = (val) => val == null ? true : false;
const isError = (val) => IsEmpty(val);


exports.IsError = isError;
exports.PromiseCheck = (err, val) => {
    isError(err) ? Promise.reject(err) : Promise.resolve(val);
};

exports.ReturnPromise = (err, val, Promise) => {
    new Promise((resolve, reject) => {
        err == true ? reject(err) : resolve(val);
    });
};