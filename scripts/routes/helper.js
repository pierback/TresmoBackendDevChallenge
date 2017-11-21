

const config = require('../../config');

const WineObj = (res) => {
    let tempObj = {};
    Object.assign(tempObj, res);
    for (let key of Object.keys(tempObj)) {
        if (!isNaN(parseInt(tempObj[key]))) {
            tempObj[key] = parseInt(tempObj[key]);
        }
    }
    return tempObj;
};

const ExtWineObj = (res) => {
    let tempObj = WineObj(res);
    if (!tempObj.hasOwnProperty('description')) {
        tempObj.description = '';
    } else { tempObj.description = res.description; }
    return tempObj;
};

const validString = (val, type) => type === typeof val && isNaN(parseInt(val));
const valType = (key, type, query) => {
    if (key === 'type') return config.res_attr.type.includes(query[key]);
    if (key === 'year') return !isNaN(parseInt(query[key]));
    if (typeof query[key] === 'string') return validString(query[key], type);
};
const WineAttr = () => {
    let tmp = config.res_attr;
    delete tmp.id;
    delete tmp.description;
    return tmp;
};

const Validate = (query) => {
    const wineAttr = WineAttr();
    let message = { data: query, err: false };

    for (const key of Object.keys(wineAttr)) {
        let val = wineAttr[key];
        if (!query[key]) {
            message.err = true;
            message.data[key] = 'MISSING';
        }
        else if (!valType(key, val, query)) {
            message.err = true;
            message.data[key] = 'INVALID';
        } else {
            delete message.data[key];
        }
    }
    return message;
};

exports.WineObj = WineObj;
exports.ExtWineObj = ExtWineObj;
exports.Validate = Validate;