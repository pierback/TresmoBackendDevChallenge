exports.NextID = (dbDump) => {
    let maxId = 0;
    for (const key of dbDump) {
        if (key['id'] > maxId) {
            maxId = key['id'];
        }
    }
    return maxId + 1;
};