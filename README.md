# jp-address-parser

A simple parser for Japanese street address.

This module works by matching prebuilt city data against the input address.
The Japan city data is downloaded from [HeartRails Geo API](http://geoapi.heartrails.com/api.html) on the fly.

## Install

```bash
npm i jp-address-parser
```

## Usage

### Basic Usage

```javascript
const japa = require('jp-address-parser');

console.log(await japa.parse('東京北区東十条6丁目二 十八番七〇'))
/*
{ prefecture: '東京都',
  city: '北区',
  town: '東十条',
  chome: 6,
  ban: 28,
  go: 70,
  left: '' }
*/
console.log(await japa.normalize('京都府京都市東山区本町22-489-1'))
// 京都府京都市東山区本町二十二丁目４８９番１号
```

In this example, the list of cities in 東京都, and the list of towns in 北区 are downloaded.
By default, the data is stored at `./data/town_map.json` and can be changed.

See [test](test/test.js) for a list of supported address syntax.

### Configuration

```javascript
const japa = require('jp-address-parser')(data_path, axios_config);
```

- `data_path`: the place to store the downloaded data.
- `axios_config`: additional config to pass to axios

### API

#### parse

```javascript
async function parse (address_text, options)
```

- `address_text`: the address to parse
- `options`: object, optional
  - `prefecture`: assumption of the `address_text`
  - `city`: assumption of the `address_text`
  - `town`: assumption of the `address_text`

Parsed result is an object containing the following properties.
- prefecture: one of the 47 prefectures
- city: such as 千代田区 or 塩谷郡高根沢町. The data obtained from HeartRails Geo API supports only three layers segementation.
- town: such as 東十条
- chome, ban, go: the 丁目-番-号 part of address. Note that the parsed numbers can be different from what it actually means. Also, 番 and 番地 are not distinguished here for simplicity.
- left

#### normalize

```javascript
async function normalize(address_text, options)
```

- options: passed to `parse` function

#### load_data

```javascript
async function load_data(prefecture, city, { skip_existing = true, recursive = false, verbose = false } = {})
```

This function allows downloading the city data to `data_path` before parsing.

- `load_data(prefecture)`: download city list in the prefecture
- `load_data(prefecture, city)`: download the town list in the (prefecture, city)
- `load_data(prefecture, null, { recursive: true })`: download all city, town lists in the prefecture
- `load_data(prefecture, city, { skip_existing: false })`: force updating data (otherwise, skip downloaded cities, towns)
- `load_data(prefecture, city, { verbose: true })`: show download process in STDOUT
