const { parse } = require('./parse');

// the largest one we found is 本町二十二丁目
// note: 301 => 三百一, and not 三百零一
function jp_num (num) {
    const digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const positions = ['', '十', '百'];
    const s = String(num).split('');
    const n = s.length;
    if (num === 0) return digits[0];
    return s.reduce((acc, curr, i) => {
        const x = parseInt(curr);
        if (x === 0) return acc;
        if (x === 1 && i === 0 & n > 1) return acc + positions[n - i - 1];
        return acc + digits[x] + positions[n - i - 1];
    }, '');
}

function full_width_num(num) {
    const digits = ['０', '１', '２', '３', '４', '５', '６', '７', '８', '９'];
    return String(num).split('').reduce((acc, curr) => acc + digits[parseInt(curr)], '');
}

async function normalize(address_text, options) {
    const { prefecture, city, town, chome, ban, go } = await parse(address_text, options);
    const items = [prefecture, city, town]
    if (Number.isInteger(chome)) items.push(`${jp_num(chome)}丁目`);
    if (Number.isInteger(ban)) items.push(`${full_width_num(ban)}番`);
    if (Number.isInteger(go)) items.push(`${full_width_num(go)}号`);
    return items.filter((t) => !!t).join('');
}

module.exports = {
    normalize,
};
