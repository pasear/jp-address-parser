const japa = require('../');
const assert = require('assert').strict;

describe('Parsing', function () {
    const tests = [
        {
            text: '東京都調布市入間町2-29番21号',
            result: {
                prefecture: '東京都',
                city: '調布市',
                town: '入間町',
                chome: 2,
                ban: 29,
                go: 21,
                left: ''
            }
        },
        {
            text: '東京都調布市入間町三丁目１番地７',
            result: {
                prefecture: '東京都',
                city: '調布市',
                town: '入間町',
                chome: 3,
                ban: 1,
                go: 7,
                left: ''
            }
        },
        {
            text: '東京都調布市入間町十 三丁目二十八番七〇',
            result: {
                prefecture: '東京都',
                city: '調布市',
                town: '入間町',
                chome: 13,
                ban: 28,
                go: 70,
                left: ''
            }
        },
        {
            text: '東京都杉並区成田東1 丁目',
            result: {
                prefecture: '東京都',
                city: '杉並区',
                town: '成田東',
                chome: 1,
                ban: undefined,
                go: undefined,
                left: ''
            }
        },
        {
            text: '東京都板橋区小茂根5678　丁目',
            result: {
                prefecture: '東京都',
                city: '板橋区',
                town: '小茂根',
                chome: 5678,
                ban: undefined,
                go: undefined,
                left: ''
            }
        },
        {
            text: '東京都板橋区徳丸4丁目',
            result: {
                prefecture: '東京都',
                city: '板橋区',
                town: '徳丸',
                chome: 4,
                ban: undefined,
                go: undefined,
                left: ''
            }
        },
        {
            text: '東京都調布市深大寺東町4',
            result: {
                prefecture: '東京都',
                city: '調布市',
                town: '深大寺東町',
                chome: 4,
                ban: undefined,
                go: undefined,
                left: ''
            }
        },
        {
            text: '栃木県芳賀郡芳賀町芳賀台52-1',
            result: {
                prefecture: '栃木県',
                city: '芳賀郡芳賀町',
                town: '芳賀台',
                chome: 52,
                ban: 1,
                go: undefined,
                left: ''
            }
        },
        {
            text: '栃木県塩谷郡高根沢町上高根沢2900',
            result: {
                prefecture: '栃木県',
                city: '塩谷郡高根沢町',
                town: '上高根沢',
                chome: 2900,
                ban: undefined,
                go: undefined,
                left: ''
            }
        },
        {
            text: '東京都西東京市芝久保町3-2022-14他(要相談）',
            result: {
                prefecture: '東京都',
                city: '西東京市',
                town: '芝久保町',
                chome: 3,
                ban: 2022,
                go: 14,
                left: '他(要相談）'
            }
        },
        {
            text: '東京都板橋区大谷口北町',
            result: {
                prefecture: '東京都',
                city: '板橋区',
                town: '大谷口北町',
                chome: undefined,
                ban: undefined,
                go: undefined,
                left: ''
            }
        },
        {
            text: '板橋区大谷口北町',
            result: {
                prefecture: '東京都',
                city: '板橋区',
                town: '大谷口北町',
                chome: undefined,
                ban: undefined,
                go: undefined,
                left: ''
            },
            options: {
                prefecture: '東京都'
            }
        },
        {
            text: '板橋区',
            result: {
                prefecture: '東京都',
                city: '板橋区',
                town: undefined,
                chome: undefined,
                ban: undefined,
                go: undefined,
                left: ''
            },
            options: {
                prefecture: '東京都'
            }
        },
        {
            text: '大阪府',
            result: {
                prefecture: '大阪府',
                city: undefined,
                town: undefined,
                chome: undefined,
                ban: undefined,
                go: undefined,
                left: ''
            },
            options: {
                prefecture: '東京都'
            }
        },
        {
            text: '東京都北区東十条6丁目',
            result: {
                prefecture: '東京都',
                city: '北区',
                town: '東十条',
                chome: 6,
                ban: undefined,
                go: undefined,
                left: ''
            }
        },
        {
            text: '東京北区東十条6丁目',
            result: {
                prefecture: '東京都',
                city: '北区',
                town: '東十条',
                chome: 6,
                ban: undefined,
                go: undefined,
                left: ''
            }
        },
        {
            text: '東京北区東十条6丁目二 十八番七〇',
            result: {
                prefecture: '東京都',
                city: '北区',
                town: '東十条',
                chome: 6,
                ban: 28,
                go: 70,
                left: ''
            }
        },
    ];
    tests.forEach((t) => it(t.text, async function () {
        const result = await japa.parse(t.text, t.options);
        assert.deepEqual(result, t.result);
    }));
});

describe('Normalization', function () {
    const tests = [
        {
            text: '東京北区東十条6丁目',
            result: '東京都北区東十条六丁目'
        },
        {
            text: '東京都調布市入間町2丁目-29番21号',
            result: '東京都調布市入間町二丁目２９番２１号'
        },
        {
            text: '東京都調布市入間町十 三丁目二十八番七〇',
            result: '東京都調布市入間町十三丁目２８番７０号'
        },
        {
            text: '東京都調布市入間町十 三丁目二十八番七〇',
            result: '東京都調布市入間町13-28-70',
            options: { number_scheme: 'numeric' }
        },
        {
            text: '京都府京都市東山区本町22-489-1',
            result: '京都府京都市東山区本町二十二丁目４８９番１号'
        }
    ];
    tests.forEach((t) => it(t.text, async function () {
        const result = await japa.normalize(t.text, t.options);
        assert.strictEqual(result, t.result);
    }));
});
