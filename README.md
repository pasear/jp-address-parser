# jp-address-parser

A simple parser for Japanese address.
This module works by matching prebuilt city data against the input address.
The Japan city data is downloaded from [HeartRails Geo API](http://geoapi.heartrails.com/api.html) on the fly.

## Install

```bash
npm i jp-address-parser
```

## Usage

### Basic Usage

```javascript
const { parse } = require('jp-address-parser');

parse('東京都北区東十条6丁目二 十八番七〇')
.then(console.log);
/*
{ prefecture: '東京都',
  city: '北区',
  town: '東十条',
  chome: 6,
  ban: 28,
  go: 70,
  left: '' }
*/
```

In this example, the list of cities in 東京都, and the list of towns in 北区 are downloaded.
By default, the data is stored at `./data/town_map.json` and can be changed.

See [test](test/test.js) for a list of supported address syntax.

### Configuration

```javascript
const { parse } = require('jp-address-parser')(data_path, axios_config);
```

- `data_path`: the place to store the downloaded data.
- `axios_config`: additional config to pass to axios

### API

#### parse

```javascript
parse (address_text, options)
```

- `address_text`: the address to parse
- `options`: optional
  - `prefecture`: assumption of the `address_text`
  - `city`: assumption of the `address_text`
  - `town`: assumption of the `address_text`

#### load_data

```javascript
load_data(prefecture, city, { skip_existing = true, recursive = false } = {})
```

Download the city data to `data_path`.

- `load_data(prefecture, { recursive: true })`: download all city, town info in the prefecture, only when the data is not existing;
- `load_data(prefecture)`: download city info in the prefecture;
- `load_data(prefecture, city)`: download the town info in the (prefecture, city)


