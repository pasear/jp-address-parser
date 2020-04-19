const { load_data, set_load } = require('./load_data');
const { parse } = require('./parse');

module.exports = function init({ data_path, axios_config } = {}) {
    set_load({ data_path, axios_config });
};

module.exports.load_data = load_data;
module.exports.parse = parse;
