'use strict';

/*
 * Password generator
 * Based on https://www.nayuki.io/page/random-password-generator-javascript
 * I just separate out the logic & HTML
 *
 * Usage:
 *   var passGen = new PasswordGenerator({
 *     number: true,
 *     lowercase: true,
 *     uppercase: true,
 *     symbol: true,
 *     space: true,
 *     custom: '你好', // you can put any other characters here
 *     lengthType: 'length', // or 'entropy'
 *     length: 10,
 *   });
 *
 *   var randomPassword = passGen.generate();
 */
class PasswordGenerator {

  constructor(options) {
    this.initCrypto();

    this.constants = {
      TYPE_LENGTH: 'length',
      TYPE_ENTROPY: 'entropy',
      CHARACTER_SETS: {
        number: '0123456789',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        symbol: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
        space: ' ',
      },
    };

    this.options = {
      number: true,
      lowercase: true,
      uppercase: true,
      symbol: false,
      space: false,
      custom: false,
      lengthType: this.constants.TYPE_LENGTH,
      length: 12,
    };
    if (options) {
      Object.keys(this.options).forEach(key => {
        if (key in options) {
          this.options[key] = options[key];
        }
      });
    }
  }

  // The one and only function called from the HTML code
  generate() {
    // Gather the character set
    var charsetStr = '';
    for (var k in this.constants.CHARACTER_SETS) {
      if (this.options[k]) charsetStr += this.constants.CHARACTER_SETS[k];
    }
    if (this.options.custom)
      charsetStr += this.options.custom;
    charsetStr = charsetStr.replace(/ /, '\u00A0');  // Replace space with non-breaking space
    
    // Convert to array and remove duplicate characters
    var charset = [];
    for (var i = 0; i < charsetStr.length; i++) {
      var c = charsetStr.charCodeAt(i);
      var s = null;
      if (c < 0xD800 || c >= 0xE000)  // Regular UTF-16 character
        s = charsetStr.charAt(i);
      else if (0xD800 <= c && c < 0xDC00) {  // High surrogate
        if (i + 1 < charsetStr.length) {
          var d = charsetStr.charCodeAt(i + 1);
          if (0xDC00 <= d && d < 0xE000) {
            // Valid character in supplementary plane
            s = charsetStr.substr(i, 2);
            i++;
          }
          // Else discard unpaired surrogate
        }
      } else if (0xDC00 <= d && d < 0xE000)  // Low surrogate
        i++;  // Discard unpaired surrogate
      else
        throw 'Assertion error';
      if (s != null && charset.indexOf(s) == -1)
        charset.push(s);
    }
    
    var password = '';
    if (charset.length == 0)
      throw 'Character set is empty';
    else if (this.options.lengthType == this.constants.TYPE_ENTROPY && charset.length == 1)
      throw 'Need at least 2 distinct characters in set';
    else {
      var length;
      if (this.options.lengthType == this.constants.TYPE_LENGTH)
        length = parseInt(this.options.length, 10);
      else if (this.options.lengthType == this.constants.TYPE_ENTROPY)
        length = Math.ceil(parseFloat(this.options.length) * Math.log(2) / Math.log(charset.length));
      else
        throw 'Assertion error';
      
      if (length < 0)
        throw 'Negative password length';
      else if (length > 10000)
        throw 'Password length too large';
      else {
        for (var i = 0; i < length; i++)
          password += charset[this.randomInt(charset.length)];
        
        var entropy = Math.log(charset.length) * length / Math.log(2);
        var entropystr;
        if (entropy < 70)
          entropystr = entropy.toFixed(2);
        else if (entropy < 200)
          entropystr = entropy.toFixed(1);
        else
          entropystr = entropy.toFixed(0);
      }
    }
    // available vars: length, charset.length, entropystr
    return password;
  }

  // Returns a random integer in the range [0, n) using a variety of methods
  randomInt(n) {
    var x = this.randomIntMathRandom(n);
    x = (x + this.randomIntBrowserCrypto(n)) % n;
    return x;
  }


  // Not secure or high quality, but always available
  randomIntMathRandom(n) {
    var x = Math.floor(Math.random() * n);
    if (x < 0 || x >= n)
      throw 'Arithmetic exception';
    return x;
  }

  // Uses a secure, unpredictable random number generator if available; otherwise returns 0
  randomIntBrowserCrypto(n) {
    if (this.cryptoObject == null)
      return 0;
    // Generate an unbiased sample
    var x = new Uint32Array(1);
    do this.cryptoObject.getRandomValues(x);
    while (x[0] - x[0] % n > 4294967296 - n);
    return x[0] % n;
  }

  initCrypto() {
    if ('crypto' in window)
      this.cryptoObject = crypto;
    else if ('msCrypto' in window)
      this.cryptoObject = msCrypto;
    else
      return;
    
    if (!('getRandomValues' in this.cryptoObject && 'Uint32Array' in window && typeof Uint32Array == 'function'))
      this.cryptoObject = null;
  }
}
