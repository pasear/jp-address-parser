/*
   Download data from HeartRails Geo API http://geoapi.heartrails.com/api.html
   Many thanks to the provisioning!
*/

const axios = require('axios');
const path = require('path');
const jsonfile = require('jsonfile');
const fs = require('fs');
const assert = require('assert').strict;

let _town_map;
let map_fpath = path.join(__dirname, './data/town_map.json');
let axios_config = {};

function set_load({ data_path: fpath, axios_config: opt }) {
    if (fpath) map_fpath = fpath;
    if (opt) axios_config = opt;
}

async function get_town_map () {
    if (!_town_map) {
        if (fs.existsSync(map_fpath)) _town_map = await jsonfile.readFile(map_fpath, { encoding: 'utf8' });
        else {
            _town_map = {};
            (await jsonfile.readFile(path.join(__dirname, './data/prefectures.json'), { encoding: 'utf8' })).forEach((pref) => {
                _town_map[pref] = null;
            });
        }
    }
    return _town_map;
}


const numbers = { '０': 0, '１': 1, '２': 2, '３': 3, '４': 4, '５': 5, '６': 6, '７': 7, '８': 8, '９': 9,
    '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '百': 100 };
const digit_regex = `[0123456789${Object.keys(numbers).join('')}]`;
const chome_regex = RegExp(`^(.*?)${digit_regex}+丁目$`);

/**
 * load_data(prefecture, null, { recursive: true }): load all city, town info in the prefecture, only when the data is not existing;
 * load_data(prefecture): load city info in the prefecture;
 * load_data(prefecture, city): load the town info in the (prefecture, city)
 */
async function load_data(prefecture, city, { skip_existing = true, recursive = false, verbose = false } = {}) {
    const town_map = await get_town_map();
    let updated = false;
    assert.strictEqual(prefecture in town_map, true);
    if (!town_map[prefecture]) {
        town_map[prefecture] = {};
        const url = `http://geoapi.heartrails.com/api/json?method=getCities&prefecture=${prefecture}`;
        if (verbose) console.log(`[load_data] ${url}`);
        const { location } = (await axios(encodeURI(url, axios_config))).data.response;
        location.forEach((loc) => {
            town_map[prefecture][loc.city] = null;
        });
        updated = true;
    }
    let cities = [];
    if (city) cities.push(city);
    else if (recursive) {
        cities = Object.keys(town_map[prefecture]);
    }
    for (const cname of cities) {
        if (!town_map[prefecture][cname] || !skip_existing) {
            const url = `http://geoapi.heartrails.com/api/json?method=getTowns&prefecture=${prefecture}&city=${cname}`;
            if (verbose) console.log(`[load_data] ${url}`);
            const { location } = (await axios(encodeURI(url)))
                .data.response;
            town_map[prefecture][cname] = {};
            location.forEach((obj) => {
                const { town } = obj;
                const m = chome_regex.exec(town);
                if (m) town_map[prefecture][cname][m[1]] = 1;
                else town_map[prefecture][cname][town] = 2;
            });
            updated = true;
        }
    }
    if (updated) await jsonfile.writeFile(map_fpath, town_map);
    return town_map;
}

async function get_prefectures() {
    const town_map = await get_town_map();
    return Object.keys(town_map);
}

async function get_cities(prefecture) {
    const town_map = await load_data(prefecture);
    return Object.keys(town_map[prefecture]);
}

async function get_towns(prefecture, city) {
    const town_map = await load_data(prefecture, city);
    return Object.keys(town_map[prefecture][city]);
}

module.exports = {
    load_data,
    set_load,
    get_town_map,
    get_prefectures,
    get_cities,
    get_towns
};
