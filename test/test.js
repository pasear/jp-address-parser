const jp_address_parser = require('../');
const assert = require('assert').strict;

describe('Address Parsing', function () {
    const tests = [
        {
            text: '東京都調布市入間町2-29番21号',
            result: {
                prefecture: '東京都',
                municipality: '調布市',
                location: '入間町',
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
                municipality: '調布市',
                location: '入間町',
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
                municipality: '調布市',
                location: '入間町',
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
                municipality: '杉並区',
                location: '成田東',
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
                municipality: '板橋区',
                location: '小茂根',
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
                municipality: '板橋区',
                location: '徳丸',
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
                municipality: '調布市',
                location: '深大寺東町',
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
                municipality: '芳賀郡',
                location: '芳賀町芳賀台',
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
                municipality: '塩谷郡',
                location: '高根沢町上高根沢',
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
                municipality: '西東京市',
                location: '芝久保町',
                chome: 3,
                ban: 2022,
                go: 14,
                left: '他(要相談）'
            }
        },
    ];
    tests.forEach((t) => it(t.text, function () {
        const result = jp_address_parser.parse(t.text);
        assert.deepEqual(result, t.result);
    }));
});
