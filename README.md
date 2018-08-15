# JavaScript Password Generator

This is based on [Project Nayuki - Random password generator (JavaScript)](https://www.nayuki.io/page/random-password-generator-javascript).

I just separate out the logic from HTML

## Usage

Include this JavaScript file to to your header

```html
<script src="password-generator.js"></script>
```

Then in your JavaScript section

```js
var passGen = new PasswordGenerator({
  number: true,
  lowercase: true,
  uppercase: true,
  symbol: true,
  lengthType: 'entropy',
  length: 128,
});
var randomPassword = passGen.generate();
```

You can see the example [index.html](index.html)

## Options

| Options      |   Default  | Description                                                                            |
|--------------|:----------:|----------------------------------------------------------------------------------------|
| `number`     |   `true`   | Include number [0-9]                                                                   |
| `lowercase`  |   `true`   | Include lower case alphabet [a-z]                                                      |
| `uppercase`  |   `true`   | Include uppercase alphabet [A-Z]                                                       |
| `symbol`     |   `false`  | Include these symbols (``!"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~``)                          |
| `space`      |   `false`  | Include <space>                                                                        |
| `custom`     |   `false`  | If you want to add some other characters other than above, specify here. E.g. `'你好'` |
| `lengthType` | `'length'` | Accept 'length' _(number of characters)_ & 'entropy' _(in bit)_                        |
| `length`     |    `12`    | Depends on `lengthType`, either in length or bit. Accept integer only                  |
