/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function (u, p) {
    var d = {}, l = d.lib = {}, s = function () {
      }, t = l.Base = {
        extend: function (a) {
          s.prototype = this;
          var c = new s();
          a && c.mixIn(a);
          c.hasOwnProperty('init') || (c.init = function () {
            c.$super.init.apply(this, arguments);
          });
          c.init.prototype = c;
          c.$super = this;
          return c;
        },
        create: function () {
          var a = this.extend();
          a.init.apply(a, arguments);
          return a;
        },
        init: function () {
        },
        mixIn: function (a) {
          for (var c in a)
            a.hasOwnProperty(c) && (this[c] = a[c]);
          a.hasOwnProperty('toString') && (this.toString = a.toString);
        },
        clone: function () {
          return this.init.prototype.extend(this);
        }
      }, r = l.WordArray = t.extend({
        init: function (a, c) {
          a = this.words = a || [];
          this.sigBytes = c != p ? c : 4 * a.length;
        },
        toString: function (a) {
          return (a || v).stringify(this);
        },
        concat: function (a) {
          var c = this.words, e = a.words, j = this.sigBytes;
          a = a.sigBytes;
          this.clamp();
          if (j % 4)
            for (var k = 0; k < a; k++)
              c[j + k >>> 2] |= (e[k >>> 2] >>> 24 - 8 * (k % 4) & 255) << 24 - 8 * ((j + k) % 4);
          else if (65535 < e.length)
            for (k = 0; k < a; k += 4)
              c[j + k >>> 2] = e[k >>> 2];
          else
            c.push.apply(c, e);
          this.sigBytes += a;
          return this;
        },
        clamp: function () {
          var a = this.words, c = this.sigBytes;
          a[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4);
          a.length = u.ceil(c / 4);
        },
        clone: function () {
          var a = t.clone.call(this);
          a.words = this.words.slice(0);
          return a;
        },
        random: function (a) {
          for (var c = [], e = 0; e < a; e += 4)
            c.push(4294967296 * u.random() | 0);
          return new r.init(c, a);
        }
      }), w = d.enc = {}, v = w.Hex = {
        stringify: function (a) {
          var c = a.words;
          a = a.sigBytes;
          for (var e = [], j = 0; j < a; j++) {
            var k = c[j >>> 2] >>> 24 - 8 * (j % 4) & 255;
            e.push((k >>> 4).toString(16));
            e.push((k & 15).toString(16));
          }
          return e.join('');
        },
        parse: function (a) {
          for (var c = a.length, e = [], j = 0; j < c; j += 2)
            e[j >>> 3] |= parseInt(a.substr(j, 2), 16) << 24 - 4 * (j % 8);
          return new r.init(e, c / 2);
        }
      }, b = w.Latin1 = {
        stringify: function (a) {
          var c = a.words;
          a = a.sigBytes;
          for (var e = [], j = 0; j < a; j++)
            e.push(String.fromCharCode(c[j >>> 2] >>> 24 - 8 * (j % 4) & 255));
          return e.join('');
        },
        parse: function (a) {
          for (var c = a.length, e = [], j = 0; j < c; j++)
            e[j >>> 2] |= (a.charCodeAt(j) & 255) << 24 - 8 * (j % 4);
          return new r.init(e, c);
        }
      }, x = w.Utf8 = {
        stringify: function (a) {
          try {
            return decodeURIComponent(escape(b.stringify(a)));
          } catch (c) {
            throw Error('Malformed UTF-8 data');
          }
        },
        parse: function (a) {
          return b.parse(unescape(encodeURIComponent(a)));
        }
      }, q = l.BufferedBlockAlgorithm = t.extend({
        reset: function () {
          this._data = new r.init();
          this._nDataBytes = 0;
        },
        _append: function (a) {
          'string' == typeof a && (a = x.parse(a));
          this._data.concat(a);
          this._nDataBytes += a.sigBytes;
        },
        _process: function (a) {
          var c = this._data, e = c.words, j = c.sigBytes, k = this.blockSize, b = j / (4 * k), b = a ? u.ceil(b) : u.max((b | 0) - this._minBufferSize, 0);
          a = b * k;
          j = u.min(4 * a, j);
          if (a) {
            for (var q = 0; q < a; q += k)
              this._doProcessBlock(e, q);
            q = e.splice(0, a);
            c.sigBytes -= j;
          }
          return new r.init(q, j);
        },
        clone: function () {
          var a = t.clone.call(this);
          a._data = this._data.clone();
          return a;
        },
        _minBufferSize: 0
      });
    l.Hasher = q.extend({
      cfg: t.extend(),
      init: function (a) {
        this.cfg = this.cfg.extend(a);
        this.reset();
      },
      reset: function () {
        q.reset.call(this);
        this._doReset();
      },
      update: function (a) {
        this._append(a);
        this._process();
        return this;
      },
      finalize: function (a) {
        a && this._append(a);
        return this._doFinalize();
      },
      blockSize: 16,
      _createHelper: function (a) {
        return function (b, e) {
          return new a.init(e).finalize(b);
        };
      },
      _createHmacHelper: function (a) {
        return function (b, e) {
          return new n.HMAC.init(a, e).finalize(b);
        };
      }
    });
    var n = d.algo = {};
    return d;
  }(Math);
(function () {
  var u = CryptoJS, p = u.lib.WordArray;
  u.enc.Base64 = {
    stringify: function (d) {
      var l = d.words, p = d.sigBytes, t = this._map;
      d.clamp();
      d = [];
      for (var r = 0; r < p; r += 3)
        for (var w = (l[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 16 | (l[r + 1 >>> 2] >>> 24 - 8 * ((r + 1) % 4) & 255) << 8 | l[r + 2 >>> 2] >>> 24 - 8 * ((r + 2) % 4) & 255, v = 0; 4 > v && r + 0.75 * v < p; v++)
          d.push(t.charAt(w >>> 6 * (3 - v) & 63));
      if (l = t.charAt(64))
        for (; d.length % 4;)
          d.push(l);
      return d.join('');
    },
    parse: function (d) {
      var l = d.length, s = this._map, t = s.charAt(64);
      t && (t = d.indexOf(t), -1 != t && (l = t));
      for (var t = [], r = 0, w = 0; w < l; w++)
        if (w % 4) {
          var v = s.indexOf(d.charAt(w - 1)) << 2 * (w % 4), b = s.indexOf(d.charAt(w)) >>> 6 - 2 * (w % 4);
          t[r >>> 2] |= (v | b) << 24 - 8 * (r % 4);
          r++;
        }
      return p.create(t, r);
    },
    _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  };
}());
(function (u) {
  function p(b, n, a, c, e, j, k) {
    b = b + (n & a | ~n & c) + e + k;
    return (b << j | b >>> 32 - j) + n;
  }
  function d(b, n, a, c, e, j, k) {
    b = b + (n & c | a & ~c) + e + k;
    return (b << j | b >>> 32 - j) + n;
  }
  function l(b, n, a, c, e, j, k) {
    b = b + (n ^ a ^ c) + e + k;
    return (b << j | b >>> 32 - j) + n;
  }
  function s(b, n, a, c, e, j, k) {
    b = b + (a ^ (n | ~c)) + e + k;
    return (b << j | b >>> 32 - j) + n;
  }
  for (var t = CryptoJS, r = t.lib, w = r.WordArray, v = r.Hasher, r = t.algo, b = [], x = 0; 64 > x; x++)
    b[x] = 4294967296 * u.abs(u.sin(x + 1)) | 0;
  r = r.MD5 = v.extend({
    _doReset: function () {
      this._hash = new w.init([
        1732584193,
        4023233417,
        2562383102,
        271733878
      ]);
    },
    _doProcessBlock: function (q, n) {
      for (var a = 0; 16 > a; a++) {
        var c = n + a, e = q[c];
        q[c] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360;
      }
      var a = this._hash.words, c = q[n + 0], e = q[n + 1], j = q[n + 2], k = q[n + 3], z = q[n + 4], r = q[n + 5], t = q[n + 6], w = q[n + 7], v = q[n + 8], A = q[n + 9], B = q[n + 10], C = q[n + 11], u = q[n + 12], D = q[n + 13], E = q[n + 14], x = q[n + 15], f = a[0], m = a[1], g = a[2], h = a[3], f = p(f, m, g, h, c, 7, b[0]), h = p(h, f, m, g, e, 12, b[1]), g = p(g, h, f, m, j, 17, b[2]), m = p(m, g, h, f, k, 22, b[3]), f = p(f, m, g, h, z, 7, b[4]), h = p(h, f, m, g, r, 12, b[5]), g = p(g, h, f, m, t, 17, b[6]), m = p(m, g, h, f, w, 22, b[7]), f = p(f, m, g, h, v, 7, b[8]), h = p(h, f, m, g, A, 12, b[9]), g = p(g, h, f, m, B, 17, b[10]), m = p(m, g, h, f, C, 22, b[11]), f = p(f, m, g, h, u, 7, b[12]), h = p(h, f, m, g, D, 12, b[13]), g = p(g, h, f, m, E, 17, b[14]), m = p(m, g, h, f, x, 22, b[15]), f = d(f, m, g, h, e, 5, b[16]), h = d(h, f, m, g, t, 9, b[17]), g = d(g, h, f, m, C, 14, b[18]), m = d(m, g, h, f, c, 20, b[19]), f = d(f, m, g, h, r, 5, b[20]), h = d(h, f, m, g, B, 9, b[21]), g = d(g, h, f, m, x, 14, b[22]), m = d(m, g, h, f, z, 20, b[23]), f = d(f, m, g, h, A, 5, b[24]), h = d(h, f, m, g, E, 9, b[25]), g = d(g, h, f, m, k, 14, b[26]), m = d(m, g, h, f, v, 20, b[27]), f = d(f, m, g, h, D, 5, b[28]), h = d(h, f, m, g, j, 9, b[29]), g = d(g, h, f, m, w, 14, b[30]), m = d(m, g, h, f, u, 20, b[31]), f = l(f, m, g, h, r, 4, b[32]), h = l(h, f, m, g, v, 11, b[33]), g = l(g, h, f, m, C, 16, b[34]), m = l(m, g, h, f, E, 23, b[35]), f = l(f, m, g, h, e, 4, b[36]), h = l(h, f, m, g, z, 11, b[37]), g = l(g, h, f, m, w, 16, b[38]), m = l(m, g, h, f, B, 23, b[39]), f = l(f, m, g, h, D, 4, b[40]), h = l(h, f, m, g, c, 11, b[41]), g = l(g, h, f, m, k, 16, b[42]), m = l(m, g, h, f, t, 23, b[43]), f = l(f, m, g, h, A, 4, b[44]), h = l(h, f, m, g, u, 11, b[45]), g = l(g, h, f, m, x, 16, b[46]), m = l(m, g, h, f, j, 23, b[47]), f = s(f, m, g, h, c, 6, b[48]), h = s(h, f, m, g, w, 10, b[49]), g = s(g, h, f, m, E, 15, b[50]), m = s(m, g, h, f, r, 21, b[51]), f = s(f, m, g, h, u, 6, b[52]), h = s(h, f, m, g, k, 10, b[53]), g = s(g, h, f, m, B, 15, b[54]), m = s(m, g, h, f, e, 21, b[55]), f = s(f, m, g, h, v, 6, b[56]), h = s(h, f, m, g, x, 10, b[57]), g = s(g, h, f, m, t, 15, b[58]), m = s(m, g, h, f, D, 21, b[59]), f = s(f, m, g, h, z, 6, b[60]), h = s(h, f, m, g, C, 10, b[61]), g = s(g, h, f, m, j, 15, b[62]), m = s(m, g, h, f, A, 21, b[63]);
      a[0] = a[0] + f | 0;
      a[1] = a[1] + m | 0;
      a[2] = a[2] + g | 0;
      a[3] = a[3] + h | 0;
    },
    _doFinalize: function () {
      var b = this._data, n = b.words, a = 8 * this._nDataBytes, c = 8 * b.sigBytes;
      n[c >>> 5] |= 128 << 24 - c % 32;
      var e = u.floor(a / 4294967296);
      n[(c + 64 >>> 9 << 4) + 15] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360;
      n[(c + 64 >>> 9 << 4) + 14] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360;
      b.sigBytes = 4 * (n.length + 1);
      this._process();
      b = this._hash;
      n = b.words;
      for (a = 0; 4 > a; a++)
        c = n[a], n[a] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360;
      return b;
    },
    clone: function () {
      var b = v.clone.call(this);
      b._hash = this._hash.clone();
      return b;
    }
  });
  t.MD5 = v._createHelper(r);
  t.HmacMD5 = v._createHmacHelper(r);
}(Math));
(function () {
  var u = CryptoJS, p = u.lib, d = p.Base, l = p.WordArray, p = u.algo, s = p.EvpKDF = d.extend({
      cfg: d.extend({
        keySize: 4,
        hasher: p.MD5,
        iterations: 1
      }),
      init: function (d) {
        this.cfg = this.cfg.extend(d);
      },
      compute: function (d, r) {
        for (var p = this.cfg, s = p.hasher.create(), b = l.create(), u = b.words, q = p.keySize, p = p.iterations; u.length < q;) {
          n && s.update(n);
          var n = s.update(d).finalize(r);
          s.reset();
          for (var a = 1; a < p; a++)
            n = s.finalize(n), s.reset();
          b.concat(n);
        }
        b.sigBytes = 4 * q;
        return b;
      }
    });
  u.EvpKDF = function (d, l, p) {
    return s.create(p).compute(d, l);
  };
}());
CryptoJS.lib.Cipher || function (u) {
  var p = CryptoJS, d = p.lib, l = d.Base, s = d.WordArray, t = d.BufferedBlockAlgorithm, r = p.enc.Base64, w = p.algo.EvpKDF, v = d.Cipher = t.extend({
      cfg: l.extend(),
      createEncryptor: function (e, a) {
        return this.create(this._ENC_XFORM_MODE, e, a);
      },
      createDecryptor: function (e, a) {
        return this.create(this._DEC_XFORM_MODE, e, a);
      },
      init: function (e, a, b) {
        this.cfg = this.cfg.extend(b);
        this._xformMode = e;
        this._key = a;
        this.reset();
      },
      reset: function () {
        t.reset.call(this);
        this._doReset();
      },
      process: function (e) {
        this._append(e);
        return this._process();
      },
      finalize: function (e) {
        e && this._append(e);
        return this._doFinalize();
      },
      keySize: 4,
      ivSize: 4,
      _ENC_XFORM_MODE: 1,
      _DEC_XFORM_MODE: 2,
      _createHelper: function (e) {
        return {
          encrypt: function (b, k, d) {
            return ('string' == typeof k ? c : a).encrypt(e, b, k, d);
          },
          decrypt: function (b, k, d) {
            return ('string' == typeof k ? c : a).decrypt(e, b, k, d);
          }
        };
      }
    });
  d.StreamCipher = v.extend({
    _doFinalize: function () {
      return this._process(!0);
    },
    blockSize: 1
  });
  var b = p.mode = {}, x = function (e, a, b) {
      var c = this._iv;
      c ? this._iv = u : c = this._prevBlock;
      for (var d = 0; d < b; d++)
        e[a + d] ^= c[d];
    }, q = (d.BlockCipherMode = l.extend({
      createEncryptor: function (e, a) {
        return this.Encryptor.create(e, a);
      },
      createDecryptor: function (e, a) {
        return this.Decryptor.create(e, a);
      },
      init: function (e, a) {
        this._cipher = e;
        this._iv = a;
      }
    })).extend();
  q.Encryptor = q.extend({
    processBlock: function (e, a) {
      var b = this._cipher, c = b.blockSize;
      x.call(this, e, a, c);
      b.encryptBlock(e, a);
      this._prevBlock = e.slice(a, a + c);
    }
  });
  q.Decryptor = q.extend({
    processBlock: function (e, a) {
      var b = this._cipher, c = b.blockSize, d = e.slice(a, a + c);
      b.decryptBlock(e, a);
      x.call(this, e, a, c);
      this._prevBlock = d;
    }
  });
  b = b.CBC = q;
  q = (p.pad = {}).Pkcs7 = {
    pad: function (a, b) {
      for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, l = [], n = 0; n < c; n += 4)
        l.push(d);
      c = s.create(l, c);
      a.concat(c);
    },
    unpad: function (a) {
      a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255;
    }
  };
  d.BlockCipher = v.extend({
    cfg: v.cfg.extend({
      mode: b,
      padding: q
    }),
    reset: function () {
      v.reset.call(this);
      var a = this.cfg, b = a.iv, a = a.mode;
      if (this._xformMode == this._ENC_XFORM_MODE)
        var c = a.createEncryptor;
      else
        c = a.createDecryptor, this._minBufferSize = 1;
      this._mode = c.call(a, this, b && b.words);
    },
    _doProcessBlock: function (a, b) {
      this._mode.processBlock(a, b);
    },
    _doFinalize: function () {
      var a = this.cfg.padding;
      if (this._xformMode == this._ENC_XFORM_MODE) {
        a.pad(this._data, this.blockSize);
        var b = this._process(!0);
      } else
        b = this._process(!0), a.unpad(b);
      return b;
    },
    blockSize: 4
  });
  var n = d.CipherParams = l.extend({
      init: function (a) {
        this.mixIn(a);
      },
      toString: function (a) {
        return (a || this.formatter).stringify(this);
      }
    }), b = (p.format = {}).OpenSSL = {
      stringify: function (a) {
        var b = a.ciphertext;
        a = a.salt;
        return (a ? s.create([
          1398893684,
          1701076831
        ]).concat(a).concat(b) : b).toString(r);
      },
      parse: function (a) {
        a = r.parse(a);
        var b = a.words;
        if (1398893684 == b[0] && 1701076831 == b[1]) {
          var c = s.create(b.slice(2, 4));
          b.splice(0, 4);
          a.sigBytes -= 16;
        }
        return n.create({
          ciphertext: a,
          salt: c
        });
      }
    }, a = d.SerializableCipher = l.extend({
      cfg: l.extend({ format: b }),
      encrypt: function (a, b, c, d) {
        d = this.cfg.extend(d);
        var l = a.createEncryptor(c, d);
        b = l.finalize(b);
        l = l.cfg;
        return n.create({
          ciphertext: b,
          key: c,
          iv: l.iv,
          algorithm: a,
          mode: l.mode,
          padding: l.padding,
          blockSize: a.blockSize,
          formatter: d.format
        });
      },
      decrypt: function (a, b, c, d) {
        d = this.cfg.extend(d);
        b = this._parse(b, d.format);
        return a.createDecryptor(c, d).finalize(b.ciphertext);
      },
      _parse: function (a, b) {
        return 'string' == typeof a ? b.parse(a, this) : a;
      }
    }), p = (p.kdf = {}).OpenSSL = {
      execute: function (a, b, c, d) {
        d || (d = s.random(8));
        a = w.create({ keySize: b + c }).compute(a, d);
        c = s.create(a.words.slice(b), 4 * c);
        a.sigBytes = 4 * b;
        return n.create({
          key: a,
          iv: c,
          salt: d
        });
      }
    }, c = d.PasswordBasedCipher = a.extend({
      cfg: a.cfg.extend({ kdf: p }),
      encrypt: function (b, c, d, l) {
        l = this.cfg.extend(l);
        d = l.kdf.execute(d, b.keySize, b.ivSize);
        l.iv = d.iv;
        b = a.encrypt.call(this, b, c, d.key, l);
        b.mixIn(d);
        return b;
      },
      decrypt: function (b, c, d, l) {
        l = this.cfg.extend(l);
        c = this._parse(c, l.format);
        d = l.kdf.execute(d, b.keySize, b.ivSize, c.salt);
        l.iv = d.iv;
        return a.decrypt.call(this, b, c, d.key, l);
      }
    });
}();
(function () {
  for (var u = CryptoJS, p = u.lib.BlockCipher, d = u.algo, l = [], s = [], t = [], r = [], w = [], v = [], b = [], x = [], q = [], n = [], a = [], c = 0; 256 > c; c++)
    a[c] = 128 > c ? c << 1 : c << 1 ^ 283;
  for (var e = 0, j = 0, c = 0; 256 > c; c++) {
    var k = j ^ j << 1 ^ j << 2 ^ j << 3 ^ j << 4, k = k >>> 8 ^ k & 255 ^ 99;
    l[e] = k;
    s[k] = e;
    var z = a[e], F = a[z], G = a[F], y = 257 * a[k] ^ 16843008 * k;
    t[e] = y << 24 | y >>> 8;
    r[e] = y << 16 | y >>> 16;
    w[e] = y << 8 | y >>> 24;
    v[e] = y;
    y = 16843009 * G ^ 65537 * F ^ 257 * z ^ 16843008 * e;
    b[k] = y << 24 | y >>> 8;
    x[k] = y << 16 | y >>> 16;
    q[k] = y << 8 | y >>> 24;
    n[k] = y;
    e ? (e = z ^ a[a[a[G ^ z]]], j ^= a[a[j]]) : e = j = 1;
  }
  var H = [
      0,
      1,
      2,
      4,
      8,
      16,
      32,
      64,
      128,
      27,
      54
    ], d = d.AES = p.extend({
      _doReset: function () {
        for (var a = this._key, c = a.words, d = a.sigBytes / 4, a = 4 * ((this._nRounds = d + 6) + 1), e = this._keySchedule = [], j = 0; j < a; j++)
          if (j < d)
            e[j] = c[j];
          else {
            var k = e[j - 1];
            j % d ? 6 < d && 4 == j % d && (k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255]) : (k = k << 8 | k >>> 24, k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255], k ^= H[j / d | 0] << 24);
            e[j] = e[j - d] ^ k;
          }
        c = this._invKeySchedule = [];
        for (d = 0; d < a; d++)
          j = a - d, k = d % 4 ? e[j] : e[j - 4], c[d] = 4 > d || 4 >= j ? k : b[l[k >>> 24]] ^ x[l[k >>> 16 & 255]] ^ q[l[k >>> 8 & 255]] ^ n[l[k & 255]];
      },
      encryptBlock: function (a, b) {
        this._doCryptBlock(a, b, this._keySchedule, t, r, w, v, l);
      },
      decryptBlock: function (a, c) {
        var d = a[c + 1];
        a[c + 1] = a[c + 3];
        a[c + 3] = d;
        this._doCryptBlock(a, c, this._invKeySchedule, b, x, q, n, s);
        d = a[c + 1];
        a[c + 1] = a[c + 3];
        a[c + 3] = d;
      },
      _doCryptBlock: function (a, b, c, d, e, j, l, f) {
        for (var m = this._nRounds, g = a[b] ^ c[0], h = a[b + 1] ^ c[1], k = a[b + 2] ^ c[2], n = a[b + 3] ^ c[3], p = 4, r = 1; r < m; r++)
          var q = d[g >>> 24] ^ e[h >>> 16 & 255] ^ j[k >>> 8 & 255] ^ l[n & 255] ^ c[p++], s = d[h >>> 24] ^ e[k >>> 16 & 255] ^ j[n >>> 8 & 255] ^ l[g & 255] ^ c[p++], t = d[k >>> 24] ^ e[n >>> 16 & 255] ^ j[g >>> 8 & 255] ^ l[h & 255] ^ c[p++], n = d[n >>> 24] ^ e[g >>> 16 & 255] ^ j[h >>> 8 & 255] ^ l[k & 255] ^ c[p++], g = q, h = s, k = t;
        q = (f[g >>> 24] << 24 | f[h >>> 16 & 255] << 16 | f[k >>> 8 & 255] << 8 | f[n & 255]) ^ c[p++];
        s = (f[h >>> 24] << 24 | f[k >>> 16 & 255] << 16 | f[n >>> 8 & 255] << 8 | f[g & 255]) ^ c[p++];
        t = (f[k >>> 24] << 24 | f[n >>> 16 & 255] << 16 | f[g >>> 8 & 255] << 8 | f[h & 255]) ^ c[p++];
        n = (f[n >>> 24] << 24 | f[g >>> 16 & 255] << 16 | f[h >>> 8 & 255] << 8 | f[k & 255]) ^ c[p++];
        a[b] = q;
        a[b + 1] = s;
        a[b + 2] = t;
        a[b + 3] = n;
      },
      keySize: 8
    });
  u.AES = p._createHelper(d);
}());
angular.module('mdo-angular-cryptography', []).provider('$crypto', function CryptoKeyProvider() {
  var cryptoKey;
  this.setCryptographyKey = function (value) {
    cryptoKey = value;
  };
  this.$get = [function () {
      return {
        getCryptoKey: function () {
          return cryptoKey;
        },
        encrypt: function (message, key) {
          if (key === undefined) {
            key = cryptoKey;
          }
          return CryptoJS.AES.encrypt(message, key).toString();
        },
        decrypt: function (message, key) {
          if (key === undefined) {
            key = cryptoKey;
          }
          return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
        }
      };
    }];
});
angular.module('appoints.appointment', ['ngRoute']).controller('AppointmentCtrl', [
  '$scope',
  '_',
  'flash',
  'moment',
  'config',
  '$location',
  '$routeParams',
  '$http',
  function AppointmentController($scope, _, flash, moment, config, $location, $routeParams, $http) {
    $scope.doctor = {};
    $scope.isreadonly = $routeParams.isreadonly === 'true';
    $scope.getEndTime = function (appointment) {
      return moment(appointment.dateAndTime).add(appointment.duration, 'minutes').format('H:mm');
    };
    $scope.updateAppointment = function () {
      $scope.editAppointment.doctorId = $scope.doctor.DoctorId;
      var reqURL = config.apiEndpoint + '/appointments';
      var req = {
          method: 'PUT',
          url: reqURL,
          data: $scope.editAppointment
        };
      return $http(req).then(function () {
        flash.add('Appointment updated successfully', 'info');
        $location.url('/dashboard');
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.getAppointment = function () {
      $scope.appointmentId = 1;
      var req = {
          method: 'GET',
          url: config.apiEndpoint + '/appointments/' + $routeParams.appointmentid
        };
      return $http(req).then(function (result) {
        $scope.editAppointment = result.data;
        $scope.editAppointment.DateAndTime = moment($scope.editAppointment.DateAndTime);
        $scope.doctor.DoctorId = $scope.editAppointment.DoctorId;
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.getDoctors = function () {
      var req = {
          method: 'GET',
          url: config.apiEndpoint + '/doctors'
        };
      return $http(req).then(function (result) {
        $scope.doctors = result.data;
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.goToDashboard = function () {
      $location.url('/dashboard');
    };
    $scope.getAppointment();
    $scope.getDoctors();  // initAppointment();
  }
]);
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('appointments/appointment.html', '<div ng-app="appoints" class="row"><div style="font-size: larger;padding-left: 1%"><a class="dropdown-toggle" role="button" title="Go to Dashboard" id="patient{{$index}}" href="" ng-click="goToDashboard()"><span class="glyphicon glyphicon-circle-arrow-left"></span>Go to dashboard</a></div><div class="col-md-6"><h2 style="text-align: center"><b>Appointment Details</b></h2><form role="form" name="form"><div class="form-group"><label for="doctor">Doctor</label><span class="mandatoryField" style="color: red">*</span><select class="form-control" id="doctor" ng-readonly="{{isreadonly}}" ng-options="doctor as doctor.UserDetails.FirstName for doctor in doctors track by doctor.DoctorId" ng-model="doctor" ng-change="optionChange()" required><option value="" disabled selected>Select your option</option></select></div><div class="form-group"><label for="title">Title</label><span class="mandatoryField" style="color: red">*</span> <input class="form-control" id="title" placeholder="Enter appointment description" ng-model="editAppointment.Title" ng-readonly="{{isreadonly}}" required></div><div class="form-group"><label for="dateAndTime">Appointment date and time</label><span class="mandatoryField" style="color: red">*</span><div class="dropdown"><a class="dropdown-toggle" id="dropdown1" role="button" data-toggle="dropdown"><div class="input-group"><input required data-date-time-input="MM/DD/YYYY HH:mm:ss" class="form-control" data-ng-model="editAppointment.DateAndTime" ng-readonly="{{isreadonly}}" required> <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><datetimepicker data-ng-model="editAppointment.DateAndTime" ng-readonly="{{isreadonly}}" data-datetimepicker-config="{ dropdownSelector: \'#dropdown1\', startView: \'hour\', minuteStep: 15 }"></datetimepicker></ul></div></div><div class="form-group"><label for="duration">Duration</label><span class="mandatoryField" style="color: red">*</span><select class="form-control" id="duration" ng-model="editAppointment.Duration" ng-readonly="{{isreadonly}}" required><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option></select></div><div class="form-group"><label for="remarks">Remarks</label><textarea id="remarks" class="form-control" rows="4" placeholder="Enter additional remarks" ng-model="editAppointment.Remarks"></textarea></div><button type="submit" class="btn btn-default" ng-click="updateAppointment()" ng-disabled="form.$invalid">Submit</button></form></div></div>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('appointments/CreateAppointment.html', '<div id="example" ng-app="appoints"><div class="col-md-4"><h2 style="text-align: center"><b>Create new appointment</b></h2><form role="form" name="form"><div class="form-group"><label for="doctor">Doctor</label><span class="mandatoryField" style="color: red">*</span><select class="form-control" id="doctor" ng-options="doctor as doctor.UserDetails.FirstName for doctor in doctors track by doctor.DoctorId" ng-model="doctor" ng-change="optionChange()" required><option value="" disabled selected>Select your option</option></select></div><div class="form-group"><label for="title">Title</label><span class="mandatoryField" style="color: red">*</span> <input class="form-control" id="title" placeholder="Enter appointment description" ng-model="newAppointment.title" required></div><div class="form-group"><label for="dateAndTime">Appointment date and time</label><span class="mandatoryField" style="color: red">*</span><div class="dropdown"><a class="dropdown-toggle" id="dropdown1" role="button" data-toggle="dropdown"><div class="input-group"><input required data-date-time-input="MM/DD/YYYY HH:mm:ss" class="form-control" data-ng-model="newAppointment.dateAndTime" required> <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><datetimepicker data-ng-model="newAppointment.dateAndTime" data-datetimepicker-config="{ dropdownSelector: \'#dropdown1\', startView: \'hour\', minuteStep: 15 }"></datetimepicker></ul></div></div><div class="form-group"><label for="duration">Duration</label><span class="mandatoryField" style="color: red">*</span><select class="form-control" id="duration" ng-model="newAppointment.duration" required><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option></select></div><div class="form-group"><label for="remarks">Remarks</label><textarea id="remarks" class="form-control" rows="4" placeholder="Enter additional remarks" ng-model="newAppointment.remarks"> </textarea></div><button type="submit" class="btn btn-default" ng-click="createAppointment()" ng-disabled="form.$invalid">Create</button></form></div><div class="col-md-8"><h2 style="text-align: center"><b>Doctor\'s Appointment Calendar</b></h2><div class="btn-toolbar"><div class="btn-group"><button class="btn btn-success" ng-click="changeView(\'agendaDay\', \'myCalendar\')">AgendaDay</button> <button class="btn btn-success" ng-click="changeView(\'agendaWeek\', \'myCalendar\')">AgendaWeek</button> <button class="btn btn-success" ng-click="changeView(\'month\', \'myCalendar\')">Month</button></div></div><div class="calendar" ng-model="eventSources" calendar="myCalendar" ui-calendar="uiConfig.calendar"></div></div></div>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('appointments/dashboard.html', '<div ng-app="appoints"><h1 style="text-align: center"><b>Welcome! {{user.displayName}}</b></h1><div class="col-md-4" ng-if="user.isAdmin"><h2><b>List of Doctors</b></h2><p ng-if="doctors.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="doctor in doctors"><h4 class="list-group-item-heading"><a href="" ng-click="openDoctorDetails(doctor)"><b>{{doctor.UserDetails.FirstName}} {{doctor.UserDetails.LastName}}</b></a></h4><h5 class="list-group-item-heading">Graduated from: {{doctor.GraduatedFrom}}</h5><h5 class="list-group-item-heading">Practice: {{doctor.FieldOfPractice}}</h5><p class="list-group-item-text">{{doctor.CurrentWorkingStatus}}</p></li></ul></div><div class="col-md-4" ng-if="user.isAdmin"><h2><b>List of Patients</b></h2><p ng-if="patients.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="patient in patients"><h4 class="list-group-item-heading"><a href="" ng-click="openPatientDetails(patient)"><b>{{patient.UserDetails.FirstName}} {{patient.UserDetails.LastName}}</b></a></h4><h5 class="list-group-item-heading">Health Issues: {{patient.HealthIssues}}</h5><h5 class="list-group-item-heading">Allergies: {{patient.Allergies}}</h5><p class="list-group-item-text">{{patient.CurrentWorkingStatus}}</p></li></ul></div><div class="col-md-4" ng-if="user.isAdmin"><h2><b>Upcoming Appointments</b></h2><p ng-if="upcomingAdminAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in upcomingAdminAppointments"><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Patient: <a href="" ng-click="openAppointmentPatient(appointment)">{{appointment.PatientName}}</a></h5><h5 class="list-group-item-heading">Doctor: <a href="" ng-click="openAppointmentDoctor(appointment)">{{appointment.DoctorName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul><h2><b>Past Appointments</b></h2><p ng-if="pastAdminAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in pastAdminAppointments"><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Patient: <a href="" ng-click="openAppointmentPatient(appointment)">{{appointment.PatientName}}</a></h5><h5 class="list-group-item-heading">Doctor: <a href="" ng-click="openAppointmentDoctor(appointment)">{{appointment.DoctorName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul></div><div class="col-md-4" ng-if="!user.isAdmin && user.isDoctor"><h2><b>Upcoming Appointments</b></h2><p ng-if="upcomingDoctorAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in upcomingDoctorAppointments"><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Patient: <a href="" ng-click="openAppointmentPatient(appointment)">{{appointment.PatientName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul><h2><b>Past Appointments</b></h2><p ng-if="pastDoctorAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in pastDoctorAppointments"><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Patient: <a href="" ng-click="openAppointmentPatient(appointment)">{{appointment.PatientName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul></div><div class="col-md-8" ng-if="!user.isAdmin && user.isDoctor"><h2 style="text-align: center"><b>Doctor\'s Appointment Calendar</b></h2><div class="btn-toolbar"><div class="btn-group"><button class="btn btn-success" ng-click="changeView(\'agendaDay\', \'myCalendar\')">AgendaDay</button> <button class="btn btn-success" ng-click="changeView(\'agendaWeek\', \'myCalendar\')">AgendaWeek</button> <button class="btn btn-success" ng-click="changeView(\'month\', \'myCalendar\')">Month</button></div></div><div class="calendar" ng-model="eventSourceDoctor" calendar="myCalendar" ui-calendar="uiConfig.calendar"></div></div><div class="col-md-4" ng-if="!user.isAdmin && !user.isDoctor"><h2><b>Upcoming appointments</b></h2><p ng-if="upcomingPatientAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in upcomingPatientAppointments"><div><a href="" class="pull-right" ng-click="deleteAppointment(appointment)" title="Delete Appointment"><span class="glyphicon glyphicon-remove"></span></a></div><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Doctor: <a href="" ng-click="openAppointmentDoctor(appointment)">{{appointment.DoctorName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul><h2><b>Past appointments</b></h2><p ng-if="pastPatientAppointments.length === 0">-- None --</p><ul class="list-group"><li class="list-group-item" ng-repeat="appointment in pastPatientAppointments"><h4 class="list-group-item-heading"><a href="" ng-click="openAppointment(appointment)"><b>{{appointment.Title}}</b></a></h4><h5 class="list-group-item-heading">{{appointment.DateAndTime | date:\'d MMM, y H:mm\'}}, duration: {{appointment.Duration}} mins</h5><h5 class="list-group-item-heading">Doctor: <a href="" ng-click="openAppointmentDoctor(appointment)">{{appointment.DoctorName}}</a></h5><h5 class="list-group-item-heading">Remarks: {{appointment.Remarks}}</h5></li></ul></div><div class="col-md-8" ng-if="!user.isAdmin && !user.isDoctor"><h2 style="text-align: center"><b>Patient\'s Appointment Calendar</b></h2><div class="btn-toolbar"><div class="btn-group"><button class="btn btn-success" ng-click="changeView(\'agendaDay\', \'myCalendar\')">AgendaDay</button> <button class="btn btn-success" ng-click="changeView(\'agendaWeek\', \'myCalendar\')">AgendaWeek</button> <button class="btn btn-success" ng-click="changeView(\'month\', \'myCalendar\')">Month</button></div></div><div class="calendar" ng-model="eventSourcePatient" calendar="myCalendar" ui-calendar="uiConfig.calendar"></div></div></div>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('appointments/profile.html', '<div class="" ng-app="appoints" ng-controller="ProfileCtrl"><div style="font-size: larger;padding-left: 5%" ng-if="isreadonly"><a class="dropdown-toggle" role="button" title="Go to Dashboard" id="patient{{$index}}" href="" ng-click="goToDashboard()"><span class="glyphicon glyphicon-circle-arrow-left"></span>Go to dashboard</a></div><h2 ng-if="!dataLoading" style="text-align: center">Details of: <b>{{profileData.UserDetails.FirstName}} {{profileData.UserDetails.LastName}}</b></h2><form name="form" ng-submit="register()" ng-if="!dataLoading" role="form"><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-12" ng-class="{ \'has-error\': form.email.$dirty && (form.email.$error.required || form.email.$error.email) }"><label for="email">Email</label><span class="mandatoryField" style="color: red">*</span> <input type="email" name="email" id="email" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.Email" placeholder="Email" required> <span ng-show="form.email.$dirty && form.email.$error.email" class="help-block">This email format is invalid!</span> <span ng-show="form.email.$dirty && form.email.$error.required" class="help-block">Email is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6" ng-class="{ \'has-error\': form.firstName.$dirty && form.firstName.$error.required }"><label for="firstName">First name</label><span class="mandatoryField" style="color: red">*</span> <input name="firstName" id="firstName" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.FirstName" placeholder="First name" required> <span ng-show="form.firstName.$dirty && form.firstName.$error.required" class="help-block">First name is required</span></div><div class="form-group col-md-6" ng-class="{ \'has-error\': form.lastName.$dirty && form.lastName.$error.required }"><label for="lastName">Last name</label><span class="mandatoryField" style="color: red">*</span> <input name="lastName" id="lastName" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.LastName" placeholder="Last name" required> <span ng-show="form.lastName.$dirty && form.lastName.$error.required" class="help-block">Last name is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="maritalStatus">Marital Status</label><select class="form-control" id="maritalStatus" ng-options="maritalStatus as maritalStatus.Description for maritalStatus in maritalStatusData track by maritalStatus.Id" ng-model="maritalStatus" ng-readonly="{{isreadonly}}" required><option value="" disabled selected>Select your option</option></select></div><div class="form-group col-md-6"><label for="gender">Gender</label><select class="form-control" id="gender" ng-options="gender as gender.Description for gender in gendersData track by gender.Id" ng-model="gender" ng-readonly="{{isreadonly}}" required><option value="" disabled selected>Select your option</option></select></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="address">Address</label><input name="address" id="address" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.Address" placeholder="Address"></div><div class="form-group col-md-6"><label for="postalCode">Postal Code</label><input name="postalCode" id="postalCode" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.PostalCode" placeholder="Postal Code"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="city">City</label><input name="city" id="city" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.City" placeholder="City"></div><div class="form-group col-md-6"><label for="province">Province</label><input name="province" id="province" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.Province" placeholder="Province"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="country">Country</label><input name="country" id="country" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.UserDetails.Country" placeholder="Country"></div><div class="form-group col-md-6" ng-class="{ \'has-error\': form.contact.$dirty && form.contact.$invalid }"><label for="contact">Contact</label><input name="contact" id="contact" class="form-control" ng-readonly="{{isreadonly}}" ng-pattern="/\\d{3}-\\d{3}-\\d{4}/" ng-model="profileData.UserDetails.Contact" placeholder="Contact"> <span ng-show="form.contact.$dirty && form.contact.$invalid" class="help-block">This contact format is invalid! Valid format is XXX-XXX-XXXX</span></div></div><h2 style="text-align: center" ng-if="!profileData.UserDetails.IsAdmin && profileData.UserDetails.IsDoctor"><b>Doctor\'s Details</b></h2><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%" ng-if="!profileData.UserDetails.IsAdmin && profileData.UserDetails.IsDoctor"><div class="form-group col-md-6"><label for="availability">Availability</label><input name="availability" id="availability" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.Availability" placeholder="Availability"></div><div class="form-group col-md-6"><label for="currentWorkingStatus">Current Working Status</label><input name="currentWorkingStatus" id="currentWorkingStatus" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.CurrentWorkingStatus" placeholder="Current Working Status"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%" ng-if="!profileData.UserDetails.IsAdmin && profileData.UserDetails.IsDoctor"><div class="form-group col-md-6"><label for="department">Department</label><input name="department" id="department" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.Department" placeholder="Department"></div><div class="form-group col-md-6"><label for="fieldOfPractice">Field of Practice</label><input name="fieldOfPractice" id="fieldOfPractice" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.FieldOfPractice" placeholder="Field of Practice"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%" ng-if="!profileData.UserDetails.IsAdmin && profileData.UserDetails.IsDoctor"><div class="form-group col-md-6"><label for="degree">Degree</label><input name="degree" id="degree" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.Degree" placeholder="Degree"></div><div class="form-group col-md-6"><label for="graduatedFrom">Graduated From</label><input name="graduatedFrom" id="graduatedFrom" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.GraduatedFrom" placeholder="Graduated From"></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%" ng-if="!profileData.UserDetails.IsAdmin && profileData.UserDetails.IsDoctor"><div class="form-group col-md-6"><label for="dateOfJoining">Date of Joining</label><md-datepicker ng-model="ctrl.myDate" md-placeholder="Enter date" input-aria-describedby="datepicker-description" input-aria-labelledby="datepicker-header "></md-datepicker></div><div class="form-group col-md-6"><label for="yearsOfExp">Years of Experience</label><input name="yearsOfExp" id="yearsOfExp" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.YearsOfExp" placeholder="Years of Experience"></div></div><h2 style="text-align: center" ng-if="!profileData.UserDetails.IsAdmin && !profileData.UserDetails.IsDoctor"><b>Patient\'s Details</b></h2><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%" ng-if="(!profileData.UserDetails.IsAdmin && !profileData.UserDetails.IsDoctor)"><div class="form-group col-md-6"><label for="allergies">Allergies</label><input name="allergies" id="allergies" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.Allergies" placeholder="Allergies"></div><div class="form-group col-md-6"><label for="healthIssues">Health Issues</label><input name="healthIssues" id="healthIssues" class="form-control" ng-readonly="{{isreadonly}}" ng-model="profileData.HealthIssues" placeholder="Health Issues"></div></div><div class="form-group col-md-12" ng-if="!isreadonly" style="padding-left: 15%;padding-right: 15%"><div class="form-actions col-md-6"><button type="submit" ng-click="saveProfileData()" ng-disabled="form.$invalid || dataLoading" class="btn btn-primary">Submit</button> <a href="#/dashboard" class="btn btn-link">Cancel</a></div></div></form></div>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('auth/logindetails.html', '<div ng-app="appoints" class="col-md-6 col-md-offset-3"><h1 style="text-align: center;padding-bottom: 25px"><b>Update Login Details</b></h1><form name="form" ng-submit="vm.login()" role="form"><div class="form-group" ng-class="{ \'has-error\': form.oldPassword.$dirty && form.oldPassword.$error.required }"><label for="oldPassword">Old Password</label><span class="mandatoryField" style="color: red">*</span> <input type="password" name="oldPassword" id="oldPassword" class="form-control" ng-model="oldPassword" placeholder="Old Password" required> <span ng-show="form.oldPassword.$dirty && form.oldPassword.$error.required" class="help-block">Old password is required</span></div><div class="form-group" ng-class="{ \'has-error\': form.newPassword.$dirty && form.newPassword.$error.required }"><label for="newPassword">New Password</label><span class="mandatoryField" style="color: red">*</span> <input type="password" name="newPassword" id="newPassword" class="form-control" ng-model="newPassword" placeholder="New Password" required> <span ng-show="form.newPassword.$dirty && form.newPassword.$error.required" class="help-block">New password is required</span></div><div class="form-actions"><button type="submit" ng-click="updatelogindetails()" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Submit</button> <a href="#/dashboard" class="btn btn-link">Cancel</a></div></form></div>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('auth/usersignin.html', '<div ng-app="appoints" class="col-md-6 col-md-offset-3"><h1 style="text-align: center;padding-bottom: 25px">Sign In to <b>DOC Connect</b></h1><form name="form" ng-submit="vm.login()" role="form"><div class="form-group" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }"><label for="username">Username</label><span class="mandatoryField" style="color: red">*</span> <input name="username" id="username" class="form-control" ng-model="username" placeholder="Username" required> <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username is required</span></div><label for="password">Password</label><span class="mandatoryField" style="color: red">*</span><div class="form-group input-group" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }"><input type="{{ showPassword ? \'text\' : \'password\' }}" name="password" id="password" class="form-control" ng-model="password" placeholder="Password" required> <span class="input-group-addon" ng-click="toggleShowPassword()" ng-class="{\'glyphicon glyphicon-eye-close form-control-feedback\': showPassword,\'glyphicon glyphicon-eye-open form-control-feedback\': !showPassword}" style="cursor: pointer; pointer-events: all"></span></div><div ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }"><span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password is required</span></div><div class="form-actions"><button type="submit" ng-click="login()" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Sign In</button> <a href="#/usersignup" class="btn btn-link">Sign Up</a></div></form></div>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('auth/usersignup.html', '<div class="" ng-app="appoints"><h1 style="text-align: center;padding-bottom: 25px">Sign Up your practice to <b>DOC Connect</b></h1><form name="form" ng-submit="vm.register()" role="form"><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-12" ng-class="{ \'has-error\': form.email.$dirty && (form.email.$error.required || form.email.$error.email) }"><label for="username">Email</label><span class="mandatoryField" style="color: red">*</span> <input type="email" name="email" id="email" class="form-control" ng-model="signupObj.email" placeholder="Email" required> <span ng-show="form.email.$dirty && form.email.$error.email" class="help-block">This email format is invalid!</span> <span ng-show="form.email.$dirty && form.email.$error.required" class="help-block">Email is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6" ng-class="{ \'has-error\': form.firstName.$dirty && form.firstName.$error.required }"><label for="username">First name</label><span class="mandatoryField" style="color: red">*</span> <input name="firstName" id="firstName" class="form-control" ng-model="signupObj.firstName" placeholder="First name" required> <span ng-show="form.firstName.$dirty && form.firstName.$error.required" class="help-block">First name is required</span></div><div class="form-group col-md-6" ng-class="{ \'has-error\': form.lastName.$dirty && form.lastName.$error.required }"><label for="username">Last name</label><span class="mandatoryField" style="color: red">*</span> <input name="lastName" id="lastName" class="form-control" ng-model="signupObj.lastName" placeholder="Last name" required> <span ng-show="form.lastName.$dirty && form.lastName.$error.required" class="help-block">Last name is required</span></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }"><label for="username">Username</label><span class="mandatoryField" style="color: red">*</span> <input name="username" id="username" class="form-control" ng-model="signupObj.username" placeholder="Username" required> <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username is required</span></div><div class="form-group col-md-6" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }"><label for="password">Password</label><span class="mandatoryField" style="color: red">*</span> <input type="password" name="password" id="password" class="form-control" ng-model="signupObj.password" placeholder="Password" required> <span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password is required</span></div></div><div class="form-check col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="isPractitioner">I am a practitioner</label><input type="checkbox" name="isPractitioner" id="isPractitioner" ng-model="signupObj.isPractitioner"></div></div><div class="form-group col-md-12" ng-show="signupObj.isPractitioner" style="padding-left: 15%;padding-right: 15%"><div class="form-group col-md-6"><label for="specialty">Your specialty</label><input name="specialty" id="specialty" class="form-control" ng-model="signupObj.specialty" placeholder="Your specialty"> <small class="form-text text-muted"><i>"Dentistry", "Chiropractics"</i>, etc.</small></div><div class="form-group col-md-6"><label for="credentials">Credentials</label><input name="credentials" id="credentials" class="form-control" ng-model="signupObj.credentials" placeholder="Credentials"> <small class="form-text text-muted"><i>MD, BDS, DPM</i>, etc.</small></div></div><div class="form-group col-md-12" style="padding-left: 15%;padding-right: 15%"><div class="form-actions col-md-6"><button type="submit" ng-click="signup()" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Sign Up</button> <a href="#/usersignin" class="btn btn-link">Cancel</a></div></div></form></div>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('home/home.html', '<div class="row" style="padding-top: 20px"><div class="col-md-12" style="font-family: cursive;font-size: 30px;text-align: center;padding-bottom: 20px;text-decoration-line: underline">A Good and healthy body is the reason behind a healthy mind.</div><div class="col-md-3" style="border-right: 1px solid white"><img src="assets/images/image2.png" style="height: 310px;width: 260px"></div><div class="col-md-4"><h2 style="text-align: center;padding-bottom: 10px">Sign in to manage my account.</h2><div class="col-md-12"><form name="form" ng-submit="vm.login()" role="form"><div class="form-group" ng-class="{ \'has-error\': form.username.$dirty && form.username.$error.required }"><label for="username">Username</label><span class="mandatoryField" style="color: red">*</span> <input name="username" id="username" class="form-control" ng-model="username" placeholder="Username" required> <span ng-show="form.username.$dirty && form.username.$error.required" class="help-block">Username is required</span></div><label for="password">Password</label><span class="mandatoryField" style="color: red">*</span><div class="form-group input-group" ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }"><input type="{{ showPassword ? \'text\' : \'password\' }}" name="password" id="password" class="form-control" ng-model="password" placeholder="Password" required> <span class="input-group-addon" ng-click="toggleShowPassword()" ng-class="{\'glyphicon glyphicon-eye-close form-control-feedback\': showPassword,\'glyphicon glyphicon-eye-open form-control-feedback\': !showPassword}" style="cursor: pointer; pointer-events: all"></span></div><div ng-class="{ \'has-error\': form.password.$dirty && form.password.$error.required }"><span ng-show="form.password.$dirty && form.password.$error.required" class="help-block">Password is required</span></div><div class="form-actions"><button type="submit" class="block" ng-click="login()" ng-disabled="form.$invalid || vm.dataLoading" class="btn btn-primary">Sign In</button> </div><div><strong><p>Don\'t have an account? <a href="#/usersignup" class="btn btn-link">Register Now</a></p></strong></div></form></div></div><div class="col-md-5" style="border-left: 1px solid white"><img src="assets/images/image3.png" style="height: 310px;width: 470px"></div></div><footer class="pull-right">DOC Connect {{version}} - &copy; Pritpal Singh Kandhari, 2022</footer>');
    }
  ]);
}());
(function (module) {
  try {
    module = angular.module('appoints-client-templates');
  } catch (e) {
    module = angular.module('appoints-client-templates', []);
  }
  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('shared/flash.html', '<section ng-controller="FlashCtrl" class="flashcontainer"><div ng-repeat="flashMessage in flashMessages" ng-class="getMessageClass(flashMessage.level)"><button type="button" class="close" data-dismiss="alert" ng-click="dismiss(flashMessage)">&times;</button> {{flashMessage.message}}<ul ng-if="flashMessage.details.errors"><li ng-repeat="error in flashMessage.details.errors">{{error.message}}</li></ul></div></section>');
    }
  ]);
}());
angular.module('appoints.signup', ['ngRoute']).controller('UserSignupCtrl', [
  '$scope',
  'usersession',
  '$location',
  function UserSignupController($scope, usersession, $location) {
    $scope.signupObj = {
      'email': '',
      'firstName': '',
      'lastName': '',
      'username': '',
      'password': '',
      'isPractitioner': false,
      'specialty': '',
      'credentials': ''
    };
    $scope.signup = function () {
      if ($scope.signupObj.isPractitioner) {
        $scope.signupObj.firstName = 'Dr. ' + $scope.signupObj.firstName;
      }
      usersession.signup($scope.signupObj).then(function (result) {
        var userResource = result.data;
        if (userResource.UserId > 0) {
          $location.url('/usersignin');
        }
      });
    };
  }
]);
/*
*  Angular Calendar Directive that takes in the [eventSources] nested array object as the ng-model and watches it deeply changes.
*       Can also take in multiple event urls as a source object(s) and feed the events per view.
*       The calendar will watch any eventSource array and update itself when a change is made.
*/
angular.module('ui.calendar', []).constant('uiCalendarConfig', { calendars: {} }).controller('uiCalendarCtrl', [
  '$scope',
  '$locale',
  'moment',
  function ($scope, $locale, moment) {
    var sources = $scope.eventSources;
    var extraEventSignature = $scope.calendarWatchEvent ? $scope.calendarWatchEvent : angular.noop;
    var wrapFunctionWithScopeApply = function (functionToWrap) {
      return function () {
        // This may happen outside of angular context, so create one if outside.
        if ($scope.$root.$$phase) {
          return functionToWrap.apply(this, arguments);
        }
        var args = arguments;
        var that = this;
        return $scope.$root.$apply(function () {
          return functionToWrap.apply(that, args);
        });
      };
    };
    var eventSerialId = 1;
    // @return {String} fingerprint of the event object and its properties
    this.eventFingerprint = function (e) {
      if (!e._id) {
        e._id = eventSerialId++;
      }
      var extraSignature = extraEventSignature({ event: e }) || '';
      var start = moment.isMoment(e.start) ? e.start.unix() : e.start ? moment(e.start).unix() : '';
      var end = moment.isMoment(e.end) ? e.end.unix() : e.end ? moment(e.end).unix() : '';
      // This extracts all the information we need from the event. http://jsperf.com/angular-calendar-events-fingerprint/3
      return [
        e._id,
        e.id || '',
        e.title || '',
        e.url || '',
        start,
        end,
        e.allDay || '',
        e.className || '',
        extraSignature
      ].join('');
    };
    var sourceSerialId = 1;
    var sourceEventsSerialId = 1;
    // @return {String} fingerprint of the source object and its events array
    this.sourceFingerprint = function (source) {
      var fp = '' + (source.__id || (source.__id = sourceSerialId++));
      var events = angular.isObject(source) && source.events;
      if (events) {
        fp = fp + '-' + (events.__id || (events.__id = sourceEventsSerialId++));
      }
      return fp;
    };
    // @return {Array} all events from all sources
    this.allEvents = function () {
      return Array.prototype.concat.apply([], (sources || []).reduce(function (previous, source) {
        if (angular.isArray(source)) {
          previous.push(source);
        } else if (angular.isObject(source) && angular.isArray(source.events)) {
          var extEvent = Object.keys(source).filter(function (key) {
              return key !== '_id' && key !== 'events';
            });
          source.events.forEach(function (event) {
            angular.extend(event, extEvent);
          });
          previous.push(source.events);
        }
        return previous;
      }, []));
    };
    // Track changes in array of objects by assigning id tokens to each element and watching the scope for changes in the tokens
    // @param {Array|Function} arraySource array of objects to watch
    // @param tokenFn {Function} that returns the token for a given object
    // @return {Object}
    //  subscribe: function(scope, function(newTokens, oldTokens))
    //    called when source has changed. return false to prevent individual callbacks from firing
    //  onAdded/Removed/Changed:
    //    when set to a callback, called each item where a respective change is detected
    this.changeWatcher = function (arraySource, tokenFn) {
      var self;
      var getTokens = function () {
        return ((angular.isFunction(arraySource) ? arraySource() : arraySource) || []).reduce(function (rslt, el) {
          var token = tokenFn(el);
          map[token] = el;
          rslt.push(token);
          return rslt;
        }, []);
      };
      // @param {Array} a
      // @param {Array} b
      // @return {Array} elements in that are in a but not in b
      // @example
      //  subtractAsSets([6, 100, 4, 5], [4, 5, 7]) // [6, 100]
      var subtractAsSets = function (a, b) {
        var obj = (b || []).reduce(function (rslt, val) {
            rslt[val] = true;
            return rslt;
          }, Object.create(null));
        return (a || []).filter(function (val) {
          return !obj[val];
        });
      };
      // Map objects to tokens and vice-versa
      var map = {};
      // Compare newTokens to oldTokens and call onAdded, onRemoved, and onChanged handlers for each affected event respectively.
      var applyChanges = function (newTokens, oldTokens) {
        var i;
        var token;
        var replacedTokens = {};
        var removedTokens = subtractAsSets(oldTokens, newTokens);
        for (i = 0; i < removedTokens.length; i++) {
          var removedToken = removedTokens[i];
          var el = map[removedToken];
          delete map[removedToken];
          var newToken = tokenFn(el);
          // if the element wasn't removed but simply got a new token, its old token will be different from the current one
          if (newToken === removedToken) {
            self.onRemoved(el);
          } else {
            replacedTokens[newToken] = removedToken;
            self.onChanged(el);
          }
        }
        var addedTokens = subtractAsSets(newTokens, oldTokens);
        for (i = 0; i < addedTokens.length; i++) {
          token = addedTokens[i];
          if (!replacedTokens[token]) {
            self.onAdded(map[token]);
          }
        }
      };
      self = {
        subscribe: function (scope, onArrayChanged) {
          scope.$watch(getTokens, function (newTokens, oldTokens) {
            var notify = !(onArrayChanged && onArrayChanged(newTokens, oldTokens) === false);
            if (notify) {
              applyChanges(newTokens, oldTokens);
            }
          }, true);
        },
        onAdded: angular.noop,
        onChanged: angular.noop,
        onRemoved: angular.noop
      };
      return self;
    };
    this.getFullCalendarConfig = function (calendarSettings, uiCalendarConfig) {
      var config = {};
      angular.extend(config, uiCalendarConfig);
      angular.extend(config, calendarSettings);
      angular.forEach(config, function (value, key) {
        if (typeof value === 'function') {
          config[key] = wrapFunctionWithScopeApply(config[key]);
        }
      });
      return config;
    };
    this.getLocaleConfig = function (fullCalendarConfig) {
      if (!fullCalendarConfig.lang && !fullCalendarConfig.locale || fullCalendarConfig.useNgLocale) {
        // Configure to use locale names by default
        var tValues = function (data) {
          // convert {0: "Jan", 1: "Feb", ...} to ["Jan", "Feb", ...]
          return (Object.keys(data) || []).reduce(function (rslt, el) {
            rslt.push(data[el]);
            return rslt;
          }, []);
        };
        var dtf = $locale.DATETIME_FORMATS;
        return {
          monthNames: tValues(dtf.MONTH),
          monthNamesShort: tValues(dtf.SHORTMONTH),
          dayNames: tValues(dtf.DAY),
          dayNamesShort: tValues(dtf.SHORTDAY)
        };
      }
      return {};
    };
  }
]).directive('uiCalendar', [
  'uiCalendarConfig',
  function (uiCalendarConfig) {
    return {
      restrict: 'A',
      scope: {
        eventSources: '=ngModel',
        calendarWatchEvent: '&'
      },
      controller: 'uiCalendarCtrl',
      link: function (scope, elm, attrs, controller) {
        var sources = scope.eventSources;
        var sourcesChanged = false;
        var calendar;
        var eventSourcesWatcher = controller.changeWatcher(sources, controller.sourceFingerprint);
        var eventsWatcher = controller.changeWatcher(controller.allEvents, controller.eventFingerprint);
        var options = null;
        function getOptions() {
          var calendarSettings = attrs.uiCalendar ? scope.$parent.$eval(attrs.uiCalendar) : {};
          var fullCalendarConfig = controller.getFullCalendarConfig(calendarSettings, uiCalendarConfig);
          var localeFullCalendarConfig = controller.getLocaleConfig(fullCalendarConfig);
          angular.extend(localeFullCalendarConfig, fullCalendarConfig);
          options = { eventSources: sources };
          angular.extend(options, localeFullCalendarConfig);
          //remove calendars from options
          options.calendars = null;
          var options2 = {};
          for (var o in options) {
            if (o !== 'eventSources') {
              options2[o] = options[o];
            }
          }
          return JSON.stringify(options2);
        }
        scope.destroyCalendar = function () {
          if (calendar && calendar.fullCalendar) {
            calendar.fullCalendar('destroy');
          }
          if (attrs.calendar) {
            calendar = uiCalendarConfig.calendars[attrs.calendar] = angular.element(elm).html('');
          } else {
            calendar = angular.element(elm).html('');
          }
        };
        scope.initCalendar = function () {
          if (!calendar) {
            calendar = $(elm).html('');
          }
          calendar.fullCalendar(options);
          if (attrs.calendar) {
            uiCalendarConfig.calendars[attrs.calendar] = calendar;
          }
        };
        scope.$on('$destroy', function () {
          scope.destroyCalendar();
        });
        eventSourcesWatcher.onAdded = function (source) {
          if (calendar && calendar.fullCalendar) {
            calendar.fullCalendar(options);
            if (attrs.calendar) {
              uiCalendarConfig.calendars[attrs.calendar] = calendar;
            }
            calendar.fullCalendar('addEventSource', source);
            sourcesChanged = true;
          }
        };
        eventSourcesWatcher.onRemoved = function (source) {
          if (calendar && calendar.fullCalendar) {
            calendar.fullCalendar('removeEventSource', source);
            sourcesChanged = true;
          }
        };
        eventSourcesWatcher.onChanged = function () {
          if (calendar && calendar.fullCalendar) {
            calendar.fullCalendar('refetchEvents');
            sourcesChanged = true;
          }
        };
        eventsWatcher.onAdded = function (event) {
          if (calendar && calendar.fullCalendar) {
            calendar.fullCalendar('renderEvent', event, !!event.stick);
          }
        };
        eventsWatcher.onRemoved = function (event) {
          if (calendar && calendar.fullCalendar) {
            calendar.fullCalendar('removeEvents', event._id);
          }
        };
        eventsWatcher.onChanged = function (event) {
          if (calendar && calendar.fullCalendar) {
            var clientEvents = calendar.fullCalendar('clientEvents', event._id);
            for (var i = 0; i < clientEvents.length; i++) {
              var clientEvent = clientEvents[i];
              clientEvent = angular.extend(clientEvent, event);
              calendar.fullCalendar('updateEvent', clientEvent);
            }
          }
        };
        eventSourcesWatcher.subscribe(scope);
        eventsWatcher.subscribe(scope, function () {
          if (sourcesChanged === true) {
            sourcesChanged = false;
            // return false to prevent onAdded/Removed/Changed handlers from firing in this case
            return false;
          }
        });
        scope.$watch(getOptions, function (newValue, oldValue) {
          if (newValue !== oldValue) {
            scope.destroyCalendar();
            scope.initCalendar();
          } else if (newValue && angular.isUndefined(calendar)) {
            scope.initCalendar();
          }
        });
      }
    };
  }
]);
angular.module('appoints.config', []).constant('config', { 'apiEndpoint': 'http://localhost/DocConnectAPI' }).constant('appName', 'appoints-client').constant('appVersion', '0.1.0').constant('appDescription', 'Doctor appointment scheduler app');
;
angular.module('appoints.directives', []).directive('backImg', function () {
  return function (scope, element, attrs) {
    var url = attrs.backImg;
    element.css({
      'background-image': 'url(' + url + ')',
      'background-size': 'cover'
    });
  };
});
angular.module('appoints.flash', []).factory('flash', [
  '$rootScope',
  '$timeout',
  function ($rootScope, $timeout) {
    var flashes = [];
    function add(message, level, details) {
      level = level || 'info';
      var flash = {
          message: message,
          level: level,
          details: details
        };
      flashes.push(flash);
      $timeout(function () {
        remove(flash);
      }, 5000);
      $rootScope.$broadcast('event:flash.add', flash);
    }
    function addError(err) {
      if (err.message) {
        add(err.message, 'error', err);
      } else {
        add(err, 'error');
      }
    }
    function all() {
      return flashes;
    }
    function remove(flashMessage) {
      var index = flashes.indexOf(flashMessage);
      flashes.splice(index, 1);
      $rootScope.$broadcast('event:flash.remove', flashMessage);
    }
    function clear() {
      flashes = [];
      $rootScope.$broadcast('event:flash.clear', true);
    }
    return {
      add: add,
      addError: addError,
      all: all,
      remove: remove,
      clear: clear
    };
  }
]).controller('FlashCtrl', [
  '$scope',
  'flash',
  function ($scope, flash) {
    $scope.flashMessages = [];
    $scope.getMessageClass = function (level) {
      if (level === 'error') {
        level = 'danger';
      }
      return 'alert alert-' + level;
    };
    $scope.dismiss = function (flashMessage) {
      flash.remove(flashMessage);
    };
    $scope.$on('event:flash.add', function () {
      $scope.flashMessages = flash.all();
    });
    $scope.$on('event:flash.remove', function () {
      $scope.flashMessages = flash.all();
    });
    $scope.$on('event:flash.clear', function () {
      $scope.flashMessages = [];
      $scope.$apply();
    });
  }
]).directive('apHideFlash', [
  'flash',
  function (flash) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.bind('click', function (e) {
          // Clear flash messages when the user clicks anywhere in the element where this directive is applied to.
          var target = angular.element(e.target);
          if (!target.parents().hasClass('flashcontainer')) {
            flash.clear();
          }
        });
      }
    };
  }
]);
angular.module('appoints.createappointment', [
  'ngRoute',
  'ui.calendar'
]).controller('CreateAppointmentCtrl', [
  '$scope',
  '$compile',
  'usersession',
  '$timeout',
  '$location',
  'uiCalendarConfig',
  'config',
  '$http',
  '_',
  'flash',
  'moment',
  function CreateAppointmentController($scope, $compile, usersession, $timeout, $location, uiCalendarConfig, config, $http, _, flash, moment) {
    function initAppointment() {
      $scope.newAppointment = {
        title: '',
        dateAndTime: moment().startOf('day').add(1, 'days').add(9, 'hours').toDate(),
        duration: 30,
        remarks: ''
      };
      $scope.editAppointment = null;
    }
    initAppointment();
    // $scope.getEndTime = function (appointment) {
    //     return moment(appointment.dateAndTime).add(appointment.duration, 'minutes').format('H:mm');
    // };
    $scope.createAppointment = function () {
      $scope.newAppointment.patientId = usersession.current.userId;
      $scope.newAppointment.doctorId = $scope.doctor.DoctorId;
      var reqURL = config.apiEndpoint + '/appointments';
      var req = {
          method: 'POST',
          url: reqURL,
          data: $scope.newAppointment
        };
      return $http(req).then(function () {
        flash.add('Appointment created successfully', 'info');
        $location.url('/dashboard');
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.getDoctors = function () {
      var req = {
          method: 'GET',
          url: config.apiEndpoint + '/doctors'
        };
      return $http(req).then(function (result) {
        $scope.doctors = result.data;
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.getAppointments = function () {
      $scope.calEventsExt.events = [];
      var reqURL = config.apiEndpoint + '/doctors/' + $scope.doctor.UserDetails.UserId + '/appointments';
      var req = {
          method: 'GET',
          url: reqURL
        };
      return $http(req).then(function (appointments) {
        $scope.eventSources3 = _.filter(appointments.data, function (appointment) {
          appointment.title = appointment.Title;
          appointment.start = moment(appointment.DateAndTime);
          appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
          appointment.allDay = false;
          $scope.addEvent(appointment);
          return appointment;
        });
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.addEvent = function (appointment) {
      $scope.calEventsExt.events.push(appointment);
    };
    $scope.calEventsExt = { events: [] };
    /* alert on eventClick */
    $scope.alertOnEventClick = function (date) {
      $scope.alertMessage = date.title + ' was clicked ';
    };
    /* Change View */
    $scope.changeView = function (view, calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalendar = function (calendar) {
      $timeout(function () {
        if (uiCalendarConfig.calendars[calendar]) {
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
    /* Render Tooltip */
    $scope.eventRender = function (event, element) {
      element.attr({
        'tooltip': event.title,
        'tooltip-append-to-body': true
      });
      $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar: {
        height: 450,
        editable: false,
        header: {
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };
    $scope.optionChange = function () {
      $scope.getAppointments();
    };
    /* event sources array*/
    $scope.eventSources = [$scope.calEventsExt];
    $scope.getDoctors();
  }
]);
angular.module('appoints.usersession', [
  'appoints.flash',
  'appoints.config',
  'mdo-angular-cryptography'
]).factory('usersession', [
  '$rootScope',
  '$window',
  'config',
  'flash',
  '$http',
  'Base64',
  '$crypto',
  function ($rootScope, $window, config, flash, $http, Base64, $crypto) {
    var defaultSession = {
        userId: '',
        displayName: '',
        isAuthenticated: false,
        isAdmin: false,
        isDoctor: false,
        authdata: ''
      };
    function Session() {
      return angular.copy(defaultSession, this);
    }
    var currentSession = new Session();
    function login(loginObj) {
      var req = {
          method: 'POST',
          url: config.apiEndpoint + '/login',
          data: loginObj
        };
      return $http(req).then(function (result) {
        var userResource = result.data;
        if (userResource.UserId > 0) {
          currentSession.isAuthenticated = true;
          currentSession.userId = userResource.UserId;
          currentSession.displayName = userResource.DisplayName;
          currentSession.isAdmin = userResource.IsAdmin;
          currentSession.isDoctor = userResource.IsDoctor;
          currentSession.authdata = Base64.encode(loginObj.username + ':' + loginObj.password);
          $http.defaults.headers.common['Authorization'] = 'Basic ' + currentSession.authdata;
          $window.localStorage.setItem('access_token', $crypto.encrypt(JSON.stringify(currentSession)));
          $rootScope.$broadcast('event:loggedin', currentSession);
        }
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    }
    function signup(signupObj) {
      var req = {
          method: 'POST',
          url: config.apiEndpoint + '/signup',
          data: signupObj
        };
      return $http(req).then(function (result) {
        return result;
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    }
    function updatelogindetails(loginObj) {
      var req = {
          method: 'PUT',
          url: config.apiEndpoint + '/login',
          data: loginObj
        };
      return $http(req).then(function (result) {
        return result;
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    }
    function logout() {
      $window.localStorage.removeItem('access_token');
      currentSession = new Session();
      $rootScope.$broadcast('event:loggedout', currentSession);
    }
    var returnTo = '';
    return {
      current: currentSession,
      login: login,
      signup: signup,
      updatelogindetails: updatelogindetails,
      logout: logout,
      returnTo: returnTo
    };
  }
]).run([
  '$window',
  '$rootScope',
  'usersession',
  '$http',
  '$crypto',
  function ($window, $rootScope, usersession, $http, $crypto) {
    // Automatically try to login the user when starting up this module
    if ($window.localStorage.getItem('access_token') !== null) {
      var userResource = JSON.parse($crypto.decrypt($window.localStorage.getItem('access_token')));
      if (userResource.userId > 0) {
        usersession.current = userResource;
        $http.defaults.headers.common['Authorization'] = 'Basic ' + userResource.authdata;
        $rootScope.$broadcast('event:loggedin', usersession.current);
      }
    }
  }
]).factory('Base64', function () {
  /* jshint ignore:start */
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  return {
    encode: function (input) {
      var output = '';
      var chr1, chr2, chr3 = '';
      var enc1, enc2, enc3, enc4 = '';
      var i = 0;
      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
      } while (i < input.length);
      return output;
    },
    decode: function (input) {
      var output = '';
      var chr1, chr2, chr3 = '';
      var enc1, enc2, enc3, enc4 = '';
      var i = 0;
      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        window.alert('There were invalid base64 characters in the input text.\n' + 'Valid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\n' + 'Expect errors in decoding.');
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
      } while (i < input.length);
      return output;
    }
  };  /* jshint ignore:end */
});
angular.module('appoints.home', [
  'appoints.config',
  'ngRoute'
]).controller('HomeCtrl', [
  '$scope',
  'appVersion',
  'flash',
  '$location',
  'usersession',
  function HomeController($scope, appVersion, flash, $location, usersession) {
    $scope.version = appVersion;
    $scope.showPassword = false;
    $scope.toggleShowPassword = function () {
      $scope.showPassword = !$scope.showPassword;
    };
    $scope.login = function () {
      var loginObj = {};
      loginObj.username = $scope.username;
      loginObj.password = $scope.password;
      usersession.login(loginObj).then(function () {
        if (usersession.current.isAuthenticated) {
          if (usersession.returnTo) {
            $location.url(usersession.returnTo);
          } else {
            $location.url('/dashboard');
          }
        } else {
          flash.add('Invalid username or password.', 'error');
        }
      });
    };
  }
]);
angular.module('appoints.dashboard', [
  'appoints.config',
  'appoints.usersession'
]).controller('DashboardCtrl', [
  '$scope',
  '$compile',
  '$timeout',
  'uiCalendarConfig',
  'config',
  'usersession',
  '$http',
  '$location',
  'flash',
  '_',
  'moment',
  function DashboardController($scope, $compile, $timeout, uiCalendarConfig, config, usersession, $http, $location, flash, _, moment) {
    $scope.user = usersession.current;
    $scope.getDoctors = function () {
      var req = {
          method: 'GET',
          url: config.apiEndpoint + '/doctors'
        };
      return $http(req).then(function (result) {
        $scope.doctors = result.data;
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.getPatients = function () {
      var req = {
          method: 'GET',
          url: config.apiEndpoint + '/patients'
        };
      return $http(req).then(function (result) {
        $scope.patients = result.data;
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.getAppointments = function () {
      var req = {
          method: 'GET',
          url: config.apiEndpoint + '/appointments'
        };
      return $http(req).then(function (appointments) {
        $scope.upcomingAdminAppointments = _.filter(appointments.data, function (appointment) {
          return moment(appointment.DateAndTime) > moment();
        });
        $scope.pastAdminAppointments = _.filter(appointments.data, function (appointment) {
          return moment(appointment.DateAndTime) <= moment();
        });
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.getDoctorAppointments = function () {
      var req = {
          method: 'GET',
          url: config.apiEndpoint + '/doctors/' + usersession.current.userId + '/appointments'
        };
      return $http(req).then(function (appointments) {
        $scope.upcomingDoctorAppointments = _.filter(appointments.data, function (appointment) {
          appointment.title = appointment.Title;
          appointment.start = moment(appointment.DateAndTime);
          appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
          appointment.allDay = false;
          return moment(appointment.DateAndTime) > moment();
        });
        $scope.pastDoctorAppointments = _.filter(appointments.data, function (appointment) {
          appointment.title = appointment.Title;
          appointment.start = moment(appointment.DateAndTime);
          appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
          appointment.allDay = false;
          $scope.addEventDoc(appointment);
          return moment(appointment.DateAndTime) <= moment();
        });
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.getPatientAppointments = function () {
      var req = {
          method: 'GET',
          url: config.apiEndpoint + '/patients/' + usersession.current.userId + '/appointments'
        };
      return $http(req).then(function (appointments) {
        $scope.upcomingPatientAppointments = _.filter(appointments.data, function (appointment) {
          appointment.title = appointment.Title;
          appointment.start = moment(appointment.DateAndTime);
          appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
          appointment.allDay = false;
          return moment(appointment.DateAndTime) > moment();
        });
        $scope.pastPatientAppointments = _.filter(appointments.data, function (appointment) {
          appointment.title = appointment.Title;
          appointment.start = moment(appointment.DateAndTime);
          appointment.end = moment(appointment.DateAndTime).add(appointment.Duration, 'minutes');
          appointment.allDay = false;
          $scope.addEventPat(appointment);
          return moment(appointment.DateAndTime) <= moment();
        });
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.deleteAppointment = function (appointment) {
      var req = {
          method: 'DELETE',
          url: config.apiEndpoint + '/appointments/' + appointment.AppointmentId
        };
      return $http(req).then(function () {
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.addEvent = function (appointment) {
      $scope.calEventsExt.events.push(appointment);
    };
    $scope.addEventDoc = function (appointment) {
      $scope.calEventsDoc.events.push(appointment);
    };
    $scope.addEventPat = function (appointment) {
      $scope.calEventsPat.events.push(appointment);
    };
    $scope.calEventsExt = { events: [] };
    $scope.calEventsDoc = { events: [] };
    $scope.calEventsPat = { events: [] };
    $scope.eventSources = [$scope.calEventsExt];
    $scope.eventSourceDoctor = [$scope.calEventsDoc];
    $scope.eventSourcePatient = [$scope.calEventsPat];
    $scope.openDoctorDetails = function (doctor) {
      $location.url('/profile/true/true/' + doctor.UserDetails.UserId);
    };
    $scope.openPatientDetails = function (patient) {
      $location.url('/profile/true/false/' + patient.UserDetails.UserId);
    };
    $scope.openAppointment = function (appointment) {
      if (moment(appointment.DateAndTime) <= moment()) {
        $location.url('/appointment/true/' + appointment.AppointmentId);
      } else {
        $location.url('/appointment/false/' + appointment.AppointmentId);
      }
    };
    $scope.openAppointmentDoctor = function (appointment) {
      $location.url('/profile/true/true/' + appointment.DoctorUserId);
    };
    $scope.openAppointmentPatient = function (appointment) {
      $location.url('/profile/true/false/' + appointment.PatientUserId);
    };
    if (usersession.current.isAdmin) {
      $scope.getDoctors();
      $scope.getPatients();
      $scope.getAppointments();
    } else if (usersession.current.isDoctor) {
      $scope.getDoctorAppointments();
    } else {
      $scope.getPatientAppointments();
    }
    /* eventClick */
    $scope.eventClick = function (appointment) {
      if (moment(appointment.DateAndTime) <= moment()) {
        $location.url('/appointment/true/' + appointment.AppointmentId);
      } else {
        $location.url('/appointment/false/' + appointment.AppointmentId);
      }
    };
    /* Change View */
    $scope.changeView = function (view, calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalendar = function (calendar) {
      $timeout(function () {
        if (uiCalendarConfig.calendars[calendar]) {
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
    /* Render Tooltip */
    $scope.eventRender = function (event, element) {
      element.attr({
        'tooltip': event.title,
        'tooltip-append-to-body': true
      });
      $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar: {
        height: 450,
        editable: false,
        header: {
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.eventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };
  }
]);
angular.module('appoints.profile', [
  'appoints.config',
  'appoints.usersession'
]).controller('ProfileCtrl', [
  '$scope',
  'moment',
  'config',
  'usersession',
  '$http',
  '$location',
  'flash',
  '$routeParams',
  function ProfileController($scope, moment, config, usersession, $http, $location, flash, $routeParams) {
    // var profileVM = this;
    $scope.isreadonly = $routeParams.isreadonly === 'true';
    $scope.dataLoading = true;
    $scope.maritalStatus = {
      Id: 0,
      Description: ''
    };
    $scope.gender = {
      Id: 0,
      Description: ''
    };
    $scope.getProfileData = function () {
      var reqURL = config.apiEndpoint;
      if ($scope.isreadonly) {
        if ($routeParams.isdoctor === 'true') {
          reqURL = reqURL + '/doctors/' + $routeParams.userid;
        } else {
          reqURL = reqURL + '/patients/' + $routeParams.userid;
        }
      } else {
        if (usersession.current.isAdmin) {
          reqURL = reqURL + '/admins/' + usersession.current.userId;
        } else if (usersession.current.isDoctor) {
          reqURL = reqURL + '/doctors/' + usersession.current.userId;
        } else {
          reqURL = reqURL + '/patients/' + usersession.current.userId;
        }
      }
      var req = {
          method: 'GET',
          url: reqURL
        };
      return $http(req).then(function (result) {
        $scope.dataLoading = false;
        $scope.profileData = result.data;
        $scope.maritalStatus.Id = $scope.profileData.UserDetails.MaritalStatus;
        $scope.gender.Id = $scope.profileData.UserDetails.Gender;
        if ($scope.profileData.dateOfJoining) {
          $scope.profileData.dateOfJoining = moment($scope.profileData.DOJ);
        }
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.saveProfileData = function () {
      var reqURL = config.apiEndpoint;
      if (usersession.current.isAdmin) {
        reqURL = reqURL + '/admins';
      } else if (usersession.current.isDoctor) {
        reqURL = reqURL + '/doctors';
      } else {
        reqURL = reqURL + '/patients';
      }
      $scope.profileData.UserDetails.MaritalStatus = $scope.maritalStatus.Id;
      $scope.profileData.UserDetails.Gender = $scope.gender.Id;
      var req = {
          method: 'PUT',
          url: reqURL,
          data: $scope.profileData
        };
      return $http(req).then(function () {
        flash.add('Profile saved successfully', 'info');
        $location.url('/dashboard');
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.getGenderData = function () {
      var req = {
          method: 'GET',
          url: config.apiEndpoint + '/genders'
        };
      return $http(req).then(function (result) {
        $scope.gendersData = result.data;
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.getMaritalStatusData = function () {
      var req = {
          method: 'GET',
          url: config.apiEndpoint + '/maritalstatus'
        };
      return $http(req).then(function (result) {
        $scope.maritalStatusData = result.data;
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
    $scope.goToDashboard = function () {
      $location.url('/dashboard');
    };
    $scope.getProfileData();
    $scope.getGenderData();
    $scope.getMaritalStatusData();
  }
]);
angular.module('appoints.logindetails', [
  'appoints.usersession',
  'appoints.flash',
  'ngRoute'
]).controller('LoginDetailsCtrl', [
  '$scope',
  'flash',
  '$location',
  'usersession',
  function LoginDetailsController($scope, flash, $location, usersession) {
    $scope.updatelogindetails = function () {
      var loginObj = {};
      loginObj.userId = usersession.current.userId;
      loginObj.oldPassword = $scope.oldPassword;
      loginObj.newPassword = $scope.newPassword;
      usersession.updatelogindetails(loginObj).then(function (result) {
        if (result) {
          if (usersession.returnTo) {
            $location.url(usersession.returnTo);
          } else {
            $location.url('/');
          }
        }
      }, function (err) {
        flash.add(err.data.ExceptionMessage, 'error');
      });
    };
  }
]);
angular.module('appoints.signin', [
  'appoints.usersession',
  'appoints.flash',
  'ngRoute'
]).controller('UserSigninCtrl', [
  '$scope',
  'flash',
  '$location',
  'usersession',
  function UserSigninController($scope, flash, $location, usersession) {
    $scope.showPassword = false;
    $scope.toggleShowPassword = function () {
      $scope.showPassword = !$scope.showPassword;
    };
    $scope.login = function () {
      var loginObj = {};
      loginObj.username = $scope.username;
      loginObj.password = $scope.password;
      usersession.login(loginObj).then(function () {
        if (usersession.current.isAuthenticated) {
          if (usersession.returnTo) {
            $location.url(usersession.returnTo);
          } else {
            $location.url('/dashboard');
          }
        } else {
          flash.add('Invalid username or password.', 'error');
        }
      });
    };
  }
]);
angular.module('appoints', [
  'ngRoute',
  'ui.bootstrap.datetimepicker',
  'appoints.directives',
  'appoints.flash',
  'appoints.usersession',
  'appoints.home',
  'appoints.signin',
  'appoints.logindetails',
  'appoints.signup',
  'appoints.dashboard',
  'appoints.profile',
  'appoints.createappointment',
  'appoints.appointment',
  'appoints-client-templates',
  'mdo-angular-cryptography'
]).constant('_', window._).constant('moment', window.moment).config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]).config([
  '$cryptoProvider',
  function ($cryptoProvider) {
    $cryptoProvider.setCryptographyKey('123456');
  }
]).config([
  '$routeProvider',
  function config($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'home/home.html',
      controller: 'HomeCtrl',
      title: 'Home'
    }).when('/appointment/:isreadonly/:appointmentid', {
      templateUrl: 'appointments/appointment.html',
      controller: 'AppointmentCtrl',
      title: 'Appointment'
    }).when('/usersignin', {
      templateUrl: 'auth/usersignin.html',
      controller: 'UserSigninCtrl',
      title: 'UserSignin'
    }).when('/usersignup', {
      templateUrl: 'auth/usersignup.html',
      controller: 'UserSignupCtrl',
      title: 'UserSignup'
    }).when('/logindetails', {
      templateUrl: 'auth/logindetails.html',
      controller: 'LoginDetailsCtrl',
      title: 'LoginDetails'
    }).when('/dashboard', {
      templateUrl: 'appointments/dashboard.html',
      controller: 'DashboardCtrl',
      title: 'Dashboard'
    }).when('/createappointment', {
      templateUrl: 'appointments/CreateAppointment.html',
      controller: 'CreateAppointmentCtrl',
      title: 'CreateAppointment'
    }).when('/profile/:isreadonly/:isdoctor/:userid', {
      templateUrl: 'appointments/profile.html',
      controller: 'ProfileCtrl',
      title: 'Profile'
    });
  }
]).controller('AppCtrl', [
  '$scope',
  '$location',
  'usersession',
  function AppController($scope, $location, usersession) {
    var defaultPageTitle = 'Appoints';
    $scope.pageTitle = defaultPageTitle;
    $scope.$on('$routeChangeSuccess', function (ev, currentRoute) {
      if (angular.isUndefined) {
        $scope.pageTitle = defaultPageTitle;
      } else {
        $scope.pageTitle = currentRoute.title || defaultPageTitle;
      }
    });
    $scope.user = usersession.current;
    $scope.routeIs = function (routeName) {
      return $location.path() === routeName;
    };
    $scope.logout = function () {
      usersession.logout();
      $location.url('/');
    };
    $scope.goToDashboard = function () {
      if ($scope.user.isAuthenticated) {
        $location.url('/dashboard');
      } else {
        $location.url('/');
      }
    };
    $scope.$on('event:loggedin', function (ev, currentSession) {
      $scope.user = currentSession;
      usersession.current = currentSession;
    });
    $scope.$on('event:loggedout', function (ev, currentSession) {
      $scope.user = currentSession;
      usersession.current = currentSession;
    });
  }
]);