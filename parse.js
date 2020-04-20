const { get_prefectures, get_cities, get_towns } = require('./load_data');

const numbers = { '０': 0, '１': 1, '２': 2, '３': 3, '４': 4, '５': 5, '６': 6, '７': 7, '８': 8, '９': 9,
    '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 };

const delimit = '-|－|の|ノ';
const digit_regex = `[0123456789${Object.keys(numbers).join('')}]`;
const regex_cache = { pref: null, city: {}, town: {} };

// assume integer
function parseNumber (text) {
    if (typeof text !== 'string') return NaN;
    const digits = text.split('');
    let num = 0;
    digits.forEach((d, i) => {
        if (d) {
            if (/^\d$/.test(d)) num = num * 10 + parseInt(d);
            else if (d in numbers) {
                if (d === '十') {
                    if (num === 0) num = 1;
                    if (i === digits.length - 1) num = num * 10;
                } else num = num * 10 + numbers[d];
            }
        }
    });
    return num;
}

function get_regex (list) {
    const ors = list.sort((a, b) => b.length - a.length).map((c) => `(${c})`).join('|');
    return `(${ors})`;
}

async function _parse_node(text, cache, key, get_list) {
    if (!cache[key]) {
        cache[key] = get_regex(await get_list());
    }
    const regex = cache[key];
    const m = RegExp(`^${regex}(.*)$`).exec(text);
    if (m) {
        return [m[1], m[m.length - 1]];
    }
    return [, text];
}

async function parse(address_text, options = {}) {
    let { prefecture, city, town } = options;
    let chome;
    let ban;
    let go;
    let tmp;

    let text = address_text.replace(/\s|　/, '');
    if (text.length > 0) {
        [tmp, text] = await _parse_node(text, regex_cache, 'pref', async () => get_prefectures());
        if (!tmp) {
            const p1 = async () => (await get_prefectures()).map((p) => p.substring(0, p.length - 1));
            [tmp, text] = await _parse_node(text, regex_cache, 'pref1', p1);
            if (tmp) tmp = (await get_prefectures()).filter((p) => p.substring(0, p.length - 1) === tmp)[0];
        }
        if (tmp) prefecture = tmp;
    }
    if (text && text.length > 0) {
        [tmp, text] = await _parse_node(text, regex_cache.city, prefecture, async () => get_cities(prefecture));
        if (tmp) city = tmp;
    }
    if (text && text.length > 0) {
        const key = `${prefecture}/${city}`;
        [tmp, text] = await _parse_node(text, regex_cache.town, key, async () => get_towns(prefecture, city));
        if (tmp) town = tmp;
    }
    if (text && text.length > 0) {
        const m = RegExp(`^(${digit_regex}+)(丁目|${delimit})?(.*)$`).exec(text);
        if (m) {
            chome = parseNumber(m[1]);
            text = m[m.length - 1];
            if (text && text.length > 0) {
                const m = RegExp(`^(${delimit})?(${digit_regex}+)(番地?|${delimit})?((${digit_regex}+)(号)?)?(.*)$`).exec(text);
                if (m) {
                    ban = parseNumber(m[2]);
                    go = m[5] ? parseNumber(m[5]) : undefined;
                    text = m[m.length - 1];
                }
            }
        }
    }

    const result = {
        prefecture, city, town, chome, ban, go, left: text
    };
    return result;
}

module.exports = {
    parse,
};
