const numbers = { '０': 0, '１': 1, '２': 2, '３': 3, '４': 4, '５': 5, '６': 6, '７': 7, '８': 8, '９': 9,
    '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 };

const delimit = '-|－|の|ノ';
const digit_regex = `[0123456789${Object.keys(numbers).join('')}]`;

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

function parse(address_text, options = {}) {
    let { prefecture, municipality } = options;
    let location;
    let chome;
    let ban;
    let go;

    let text = address_text.replace(/\s|　/, '').trim();
    {
        const m = RegExp(`^([^都道府県]+?(都|道|府|県))(.*)$`).exec(text);
        if (m) {
            prefecture = m[1];
            text = m[3].trim();
        }
    }
    {
        const m = RegExp(`^([^区市郡]+(区|市|郡))(.*)$`).exec(text);
        if (m) {
            municipality = m[1];
            text = m[3].trim();
        }
    }
    {
        const m = RegExp(`(.+?)((${digit_regex}+)(丁目|${delimit})?)(.*)$`).exec(text);
        if (m) {
            location = m[1];
            chome = parseNumber(m[3].trim());
            text = m[5].trim();
            {
                const m = RegExp(`^((${digit_regex}+)(番地?|${delimit})?)\s*((${digit_regex}+)(号)?)?(.*)$`).exec(text);
                if (m) {
                    ban = parseNumber(m[2].trim());
                    go = m[5] ? parseNumber(m[5].trim()) : undefined;
                    text = m[7].trim();
                }
            }
        }
    }
    
    const result = {
        prefecture, municipality, location, chome, ban, go, left: text
    };
    return result;
}

module.exports = {
    parse,
    parseNumber
};
