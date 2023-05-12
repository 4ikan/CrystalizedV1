let startTime = Date.now();
let endTime;

const getUptime = () => {
    endTime = Date.now();
    return endTime - startTime;
}

module.exports = {
    getUptime: getUptime
};