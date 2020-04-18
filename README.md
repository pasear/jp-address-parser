# jp-address-parser

A simple parser for Japanese address.

## Install

```bash
npm i jp-address-parser
```

## Usage

```javascript
const jp_address_parser = require('jp-address-parser');

jp_address_parser.parse('東京都調布市入間町十 三丁目二十八番七〇');
/*
    {
        prefecture: '東京都',
        municipality: '調布市',
        location: '入間町',
        chome: 13,
        ban: 28,
        go: 70,
        left: ''
    }
*/
```

See [test](test/test.js) for a list of supported address syntax.

## Note

The module is kept as simple as possible.
If exact, accurate result is desirable, formal language parsing and comparing against a postal address database is suggested.
However, storing the address database could be too heavy for this module.
