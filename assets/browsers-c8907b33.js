const br = Object.defineProperty;
const Tr = (e, t, r) =>
  t in e
    ? br(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
    : (e[t] = r);
const M = (e, t, r) => (Tr(e, typeof t !== 'symbol' ? `${t}` : t, r), r);
const me = (e, t, r) => {
  if (!t.has(e)) throw TypeError(`Cannot ${r}`);
};
const z = (e, t, r) => (
  me(e, t, 'read from private field'), r ? r.call(e) : t.get(e)
);
const ve = (e, t, r) => {
  if (t.has(e))
    throw TypeError('Cannot add the same private member more than once');
  t instanceof WeakSet ? t.add(e) : t.set(e, r);
};
const De = (e, t, r, s) => (
  me(e, t, 'write to private field'), s ? s.call(e, r) : t.set(e, r), r
);
const ne = (e, t, r) => (me(e, t, 'access private method'), r);
const xr = /(%?)(%([sdijo]))/g;
function Or(e, t) {
  switch (t) {
    case 's':
      return e;
    case 'd':
    case 'i':
      return Number(e);
    case 'j':
      return JSON.stringify(e);
    case 'o': {
      if (typeof e === 'string') return e;
      const r = JSON.stringify(e);
      return r === '{}' || r === '[]' || /^\[object .+?\]$/.test(r) ? e : r;
    }
  }
}
function J(e, ...t) {
  if (t.length === 0) return e;
  let r = 0;
  let s = e.replace(xr, (n, i, c, l) => {
    const o = t[r];
    const a = Or(o, l);
    return i ? n : (r++, a);
  });
  return (
    r < t.length && (s += ` ${t.slice(r).join(' ')}`),
    (s = s.replace(/%{2,2}/g, '%')),
    s
  );
}
const Sr = 2;
function Rr(e) {
  if (!e.stack) return;
  const t = e.stack.split(`
`);
  t.splice(1, Sr),
    (e.stack = t.join(`
`));
}
const Nr = class extends Error {
  constructor(e, ...t) {
    super(e),
      (this.message = e),
      (this.name = 'Invariant Violation'),
      (this.message = J(e, ...t)),
      Rr(this);
  }
};
const N = (e, t, ...r) => {
  if (!e) throw new Nr(t, ...r);
};
N.as = (e, t, r, ...s) => {
  if (!t) {
    const n = s.length === 0 ? r : J(r, s);
    let i;
    try {
      i = Reflect.construct(e, [n]);
    } catch {
      i = e(n);
    }
    throw i;
  }
};
const Ir = '[MSW]';
function Pe(e, ...t) {
  const r = J(e, ...t);
  return `${Ir} ${r}`;
}
function Ar(e, ...t) {
  console.warn(Pe(e, ...t));
}
function Pr(e, ...t) {
  console.error(Pe(e, ...t));
}
const b = { formatMessage: Pe, warn: Ar, error: Pr };
function kr() {
  N(
    typeof URL < 'u',
    b.formatMessage(
      `Global "URL" class is not defined. This likely means that you're running MSW in an environment that doesn't support all Node.js standard API (e.g. React Native). If that's the case, please use an appropriate polyfill for the "URL" class, like "react-native-url-polyfill".`
    )
  );
}
const Cr = class extends Error {
  constructor(e, t, r) {
    super(
      `Possible EventEmitter memory leak detected. ${r} ${t.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`
    ),
      (this.emitter = e),
      (this.type = t),
      (this.count = r),
      (this.name = 'MaxListenersExceededWarning');
  }
};
var Et = class {
  static listenerCount(e, t) {
    return e.listenerCount(t);
  }

  constructor() {
    (this.events = new Map()),
      (this.maxListeners = Et.defaultMaxListeners),
      (this.hasWarnedAboutPotentialMemoryLeak = !1);
  }

  _emitInternalEvent(e, t, r) {
    this.emit(e, t, r);
  }

  _getListeners(e) {
    return Array.prototype.concat.apply([], this.events.get(e)) || [];
  }

  _removeListener(e, t) {
    const r = e.indexOf(t);
    return r > -1 && e.splice(r, 1), [];
  }

  _wrapOnceListener(e, t) {
    const r = (...s) => (this.removeListener(e, r), t.apply(this, s));
    return Object.defineProperty(r, 'name', { value: t.name }), r;
  }

  setMaxListeners(e) {
    return (this.maxListeners = e), this;
  }

  getMaxListeners() {
    return this.maxListeners;
  }

  eventNames() {
    return Array.from(this.events.keys());
  }

  emit(e, ...t) {
    const r = this._getListeners(e);
    return (
      r.forEach((s) => {
        s.apply(this, t);
      }),
      r.length > 0
    );
  }

  addListener(e, t) {
    this._emitInternalEvent('newListener', e, t);
    const r = this._getListeners(e).concat(t);
    if (
      (this.events.set(e, r),
      this.maxListeners > 0 &&
        this.listenerCount(e) > this.maxListeners &&
        !this.hasWarnedAboutPotentialMemoryLeak)
    ) {
      this.hasWarnedAboutPotentialMemoryLeak = !0;
      const s = new Cr(this, e, this.listenerCount(e));
      console.warn(s);
    }
    return this;
  }

  on(e, t) {
    return this.addListener(e, t);
  }

  once(e, t) {
    return this.addListener(e, this._wrapOnceListener(e, t));
  }

  prependListener(e, t) {
    const r = this._getListeners(e);
    if (r.length > 0) {
      const s = [t].concat(r);
      this.events.set(e, s);
    } else this.events.set(e, r.concat(t));
    return this;
  }

  prependOnceListener(e, t) {
    return this.prependListener(e, this._wrapOnceListener(e, t));
  }

  removeListener(e, t) {
    const r = this._getListeners(e);
    return (
      r.length > 0 &&
        (this._removeListener(r, t),
        this.events.set(e, r),
        this._emitInternalEvent('removeListener', e, t)),
      this
    );
  }

  off(e, t) {
    return this.removeListener(e, t);
  }

  removeAllListeners(e) {
    return e ? this.events.delete(e) : this.events.clear(), this;
  }

  listeners(e) {
    return Array.from(this._getListeners(e));
  }

  listenerCount(e) {
    return this._getListeners(e).length;
  }

  rawListeners(e) {
    return this.listeners(e);
  }
};
const ce = Et;
ce.defaultMaxListeners = 10;
function Lr(e, t) {
  const r = e.emit;
  if (r._isPiped) return;
  const s = function (i, ...c) {
    return t.emit(i, ...c), r.call(this, i, ...c);
  };
  (s._isPiped = !0), (e.emit = s);
}
function Me(e) {
  const t = [...e];
  return Object.freeze(t), t;
}
const Dr = (e, t, r) =>
  new Promise((s, n) => {
    const i = (o) => {
      try {
        l(r.next(o));
      } catch (a) {
        n(a);
      }
    };
    const c = (o) => {
      try {
        l(r.throw(o));
      } catch (a) {
        n(a);
      }
    };
    var l = (o) => (o.done ? s(o.value) : Promise.resolve(o.value).then(i, c));
    l((r = r.apply(e, t)).next());
  });
class Mr {
  constructor() {
    this.subscriptions = [];
  }

  dispose() {
    return Dr(this, null, function* () {
      yield Promise.all(this.subscriptions.map((t) => t()));
    });
  }
}
class qr extends Mr {
  constructor(...t) {
    super(),
      N(
        this.validateHandlers(t),
        b.formatMessage(
          'Failed to apply given request handlers: invalid input. Did you forget to spread the request handlers Array?'
        )
      ),
      (this.initialHandlers = Me(t)),
      (this.currentHandlers = [...t]),
      (this.emitter = new ce()),
      (this.publicEmitter = new ce()),
      Lr(this.emitter, this.publicEmitter),
      (this.events = this.createLifeCycleEvents()),
      this.subscriptions.push(() => {
        this.emitter.removeAllListeners(),
          this.publicEmitter.removeAllListeners();
      });
  }

  validateHandlers(t) {
    return t.every((r) => !Array.isArray(r));
  }

  use(...t) {
    N(
      this.validateHandlers(t),
      b.formatMessage(
        'Failed to call "use()" with the given request handlers: invalid input. Did you forget to spread the array of request handlers?'
      )
    ),
      this.currentHandlers.unshift(...t);
  }

  restoreHandlers() {
    this.currentHandlers.forEach((t) => {
      t.isUsed = !1;
    });
  }

  resetHandlers(...t) {
    this.currentHandlers = t.length > 0 ? [...t] : [...this.initialHandlers];
  }

  listHandlers() {
    return Me(this.currentHandlers);
  }

  createLifeCycleEvents() {
    return {
      on: (...t) => this.publicEmitter.on(...t),
      removeListener: (...t) => this.publicEmitter.removeListener(...t),
      removeAllListeners: (...t) => this.publicEmitter.removeAllListeners(...t),
    };
  }
}
const $r = /[\/\\]msw[\/\\]src[\/\\](.+)/;
const jr =
  /(node_modules)?[\/\\]lib[\/\\](core|browser|node|native|iife)[\/\\]|^[^\/\\]*$/;
function Fr(e) {
  const t = e.stack;
  if (!t) return;
  const s = t
    .split(
      `
`
    )
    .slice(1)
    .find((i) => !($r.test(i) || jr.test(i)));
  return s
    ? s.replace(/\s*at [^()]*\(([^)]+)\)/, '$1').replace(/^@/, '')
    : void 0;
}
function Ur(e) {
  return e ? typeof e[Symbol.iterator] === 'function' : !1;
}
const Br = Object.defineProperty;
const Hr = Object.defineProperties;
const Vr = Object.getOwnPropertyDescriptors;
const qe = Object.getOwnPropertySymbols;
const Gr = Object.prototype.hasOwnProperty;
const Wr = Object.prototype.propertyIsEnumerable;
const $e = (e, t, r) =>
  t in e
    ? Br(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
    : (e[t] = r);
const je = (e, t) => {
  for (var r in t || (t = {})) Gr.call(t, r) && $e(e, r, t[r]);
  if (qe) for (var r of qe(t)) Wr.call(t, r) && $e(e, r, t[r]);
  return e;
};
const Fe = (e, t) => Hr(e, Vr(t));
const se = (e, t, r) =>
  new Promise((s, n) => {
    const i = (o) => {
      try {
        l(r.next(o));
      } catch (a) {
        n(a);
      }
    };
    const c = (o) => {
      try {
        l(r.throw(o));
      } catch (a) {
        n(a);
      }
    };
    var l = (o) => (o.done ? s(o.value) : Promise.resolve(o.value).then(i, c));
    l((r = r.apply(e, t)).next());
  });
class _t {
  constructor(t) {
    (this.resolver = t.resolver), (this.options = t.options);
    const r = Fr(new Error());
    (this.info = Fe(je({}, t.info), { callFrame: r })), (this.isUsed = !1);
  }

  parse(t) {
    return se(this, null, function* () {
      return {};
    });
  }

  test(t) {
    return se(this, null, function* () {
      const r = yield this.parse({
        request: t.request,
        resolutionContext: t.resolutionContext,
      });
      return this.predicate({
        request: t.request,
        parsedResult: r,
        resolutionContext: t.resolutionContext,
      });
    });
  }

  extendResolverArgs(t) {
    return {};
  }

  run(t) {
    return se(this, null, function* () {
      let r;
      let s;
      if (this.isUsed && (r = this.options) != null && r.once) return null;
      const n = t.request.clone();
      const i = yield this.parse({
        request: t.request,
        resolutionContext: t.resolutionContext,
      });
      if (
        !this.predicate({
          request: t.request,
          parsedResult: i,
          resolutionContext: t.resolutionContext,
        }) ||
        (this.isUsed && (s = this.options) != null && s.once)
      )
        return null;
      this.isUsed = !0;
      const l = this.wrapResolver(this.resolver);
      const o = this.extendResolverArgs({
        request: t.request,
        parsedResult: i,
      });
      const a = yield l(Fe(je({}, o), { request: t.request }));
      return this.createExecutionResult({
        request: n,
        response: a,
        parsedResult: i,
      });
    });
  }

  wrapResolver(t) {
    return (r) =>
      se(this, null, function* () {
        const s = this.resolverGenerator || (yield t(r));
        if (Ur(s)) {
          this.isUsed = !1;
          const { value: n, done: i } = s[Symbol.iterator]().next();
          const c = yield n;
          return (
            i && (this.isUsed = !0),
            !c && i
              ? (N(
                  this.resolverGeneratorResult,
                  'Failed to returned a previously stored generator response: the value is not a valid Response.'
                ),
                this.resolverGeneratorResult.clone())
              : (this.resolverGenerator || (this.resolverGenerator = s),
                c &&
                  (this.resolverGeneratorResult =
                    c == null ? void 0 : c.clone()),
                c)
          );
        }
        return s;
      });
  }

  createExecutionResult(t) {
    return {
      handler: this,
      request: t.request,
      response: t.response,
      parsedResult: t.parsedResult,
    };
  }
}
function wt(e, t) {
  return e.toLowerCase() === t.toLowerCase();
}
function bt(e) {
  return e < 300 ? '#69AB32' : e < 400 ? '#F0BB4B' : '#E95F5D';
}
function Tt() {
  const e = new Date();
  return [e.getHours(), e.getMinutes(), e.getSeconds()]
    .map(String)
    .map((t) => t.slice(0, 2))
    .map((t) => t.padStart(2, '0'))
    .join(':');
}
const Xr = (e, t, r) =>
  new Promise((s, n) => {
    const i = (o) => {
      try {
        l(r.next(o));
      } catch (a) {
        n(a);
      }
    };
    const c = (o) => {
      try {
        l(r.throw(o));
      } catch (a) {
        n(a);
      }
    };
    var l = (o) => (o.done ? s(o.value) : Promise.resolve(o.value).then(i, c));
    l((r = r.apply(e, t)).next());
  });
function xt(e) {
  return Xr(this, null, function* () {
    const r = yield e.clone().text();
    return {
      url: new URL(e.url),
      method: e.method,
      headers: Object.fromEntries(e.headers.entries()),
      body: r,
    };
  });
}
const Jr = Object.create;
const Ot = Object.defineProperty;
const Yr = Object.getOwnPropertyDescriptor;
const St = Object.getOwnPropertyNames;
const zr = Object.getPrototypeOf;
const Qr = Object.prototype.hasOwnProperty;
const Rt = (e, t) =>
  function () {
    return t || (0, e[St(e)[0]])((t = { exports: {} }).exports, t), t.exports;
  };
const Kr = (e, t, r, s) => {
  if ((t && typeof t === 'object') || typeof t === 'function')
    for (const n of St(t))
      !Qr.call(e, n) &&
        n !== r &&
        Ot(e, n, {
          get: () => t[n],
          enumerable: !(s = Yr(t, n)) || s.enumerable,
        });
  return e;
};
const Zr = (e, t, r) => (
  (r = e != null ? Jr(zr(e)) : {}),
  Kr(
    t || !e || !e.__esModule
      ? Ot(r, 'default', { value: e, enumerable: !0 })
      : r,
    e
  )
);
const en = Rt({
  'node_modules/statuses/codes.json': function (e, t) {
    t.exports = {
      100: 'Continue',
      101: 'Switching Protocols',
      102: 'Processing',
      103: 'Early Hints',
      200: 'OK',
      201: 'Created',
      202: 'Accepted',
      203: 'Non-Authoritative Information',
      204: 'No Content',
      205: 'Reset Content',
      206: 'Partial Content',
      207: 'Multi-Status',
      208: 'Already Reported',
      226: 'IM Used',
      300: 'Multiple Choices',
      301: 'Moved Permanently',
      302: 'Found',
      303: 'See Other',
      304: 'Not Modified',
      305: 'Use Proxy',
      307: 'Temporary Redirect',
      308: 'Permanent Redirect',
      400: 'Bad Request',
      401: 'Unauthorized',
      402: 'Payment Required',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      406: 'Not Acceptable',
      407: 'Proxy Authentication Required',
      408: 'Request Timeout',
      409: 'Conflict',
      410: 'Gone',
      411: 'Length Required',
      412: 'Precondition Failed',
      413: 'Payload Too Large',
      414: 'URI Too Long',
      415: 'Unsupported Media Type',
      416: 'Range Not Satisfiable',
      417: 'Expectation Failed',
      418: "I'm a Teapot",
      421: 'Misdirected Request',
      422: 'Unprocessable Entity',
      423: 'Locked',
      424: 'Failed Dependency',
      425: 'Too Early',
      426: 'Upgrade Required',
      428: 'Precondition Required',
      429: 'Too Many Requests',
      431: 'Request Header Fields Too Large',
      451: 'Unavailable For Legal Reasons',
      500: 'Internal Server Error',
      501: 'Not Implemented',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout',
      505: 'HTTP Version Not Supported',
      506: 'Variant Also Negotiates',
      507: 'Insufficient Storage',
      508: 'Loop Detected',
      509: 'Bandwidth Limit Exceeded',
      510: 'Not Extended',
      511: 'Network Authentication Required',
    };
  },
});
const tn = Rt({
  'node_modules/statuses/index.js': function (e, t) {
    const r = en();
    (t.exports = l),
      (l.message = r),
      (l.code = s(r)),
      (l.codes = n(r)),
      (l.redirect = {
        300: !0,
        301: !0,
        302: !0,
        303: !0,
        305: !0,
        307: !0,
        308: !0,
      }),
      (l.empty = { 204: !0, 205: !0, 304: !0 }),
      (l.retry = { 502: !0, 503: !0, 504: !0 });
    function s(o) {
      const a = {};
      return (
        Object.keys(o).forEach(function (d) {
          const p = o[d];
          const v = Number(d);
          a[p.toLowerCase()] = v;
        }),
        a
      );
    }
    function n(o) {
      return Object.keys(o).map(function (u) {
        return Number(u);
      });
    }
    function i(o) {
      const a = o.toLowerCase();
      if (!Object.prototype.hasOwnProperty.call(l.code, a))
        throw new Error(`invalid status message: "${o}"`);
      return l.code[a];
    }
    function c(o) {
      if (!Object.prototype.hasOwnProperty.call(l.message, o))
        throw new Error(`invalid status code: ${o}`);
      return l.message[o];
    }
    function l(o) {
      if (typeof o === 'number') return c(o);
      if (typeof o !== 'string')
        throw new TypeError('code must be a number or string');
      const a = parseInt(o, 10);
      return isNaN(a) ? i(o) : c(a);
    }
  },
});
const rn = Zr(tn(), 1);
const Nt = rn.default;
/*! Bundled license information:

statuses/index.js:
  (*!
   * statuses
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/ const nn = (e, t, r) =>
  new Promise((s, n) => {
    const i = (o) => {
      try {
        l(r.next(o));
      } catch (a) {
        n(a);
      }
    };
    const c = (o) => {
      try {
        l(r.throw(o));
      } catch (a) {
        n(a);
      }
    };
    var l = (o) => (o.done ? s(o.value) : Promise.resolve(o.value).then(i, c));
    l((r = r.apply(e, t)).next());
  });
const { message: sn } = Nt;
function It(e) {
  return nn(this, null, function* () {
    const t = e.clone();
    const r = yield t.text();
    const s = t.status || 200;
    const n = t.statusText || sn[s] || 'OK';
    return {
      status: s,
      statusText: n,
      headers: Object.fromEntries(t.headers.entries()),
      body: r,
    };
  });
}
function on(e) {
  for (var t = [], r = 0; r < e.length; ) {
    const s = e[r];
    if (s === '*' || s === '+' || s === '?') {
      t.push({ type: 'MODIFIER', index: r, value: e[r++] });
      continue;
    }
    if (s === '\\') {
      t.push({ type: 'ESCAPED_CHAR', index: r++, value: e[r++] });
      continue;
    }
    if (s === '{') {
      t.push({ type: 'OPEN', index: r, value: e[r++] });
      continue;
    }
    if (s === '}') {
      t.push({ type: 'CLOSE', index: r, value: e[r++] });
      continue;
    }
    if (s === ':') {
      for (var n = '', i = r + 1; i < e.length; ) {
        const c = e.charCodeAt(i);
        if (
          (c >= 48 && c <= 57) ||
          (c >= 65 && c <= 90) ||
          (c >= 97 && c <= 122) ||
          c === 95
        ) {
          n += e[i++];
          continue;
        }
        break;
      }
      if (!n) throw new TypeError('Missing parameter name at '.concat(r));
      t.push({ type: 'NAME', index: r, value: n }), (r = i);
      continue;
    }
    if (s === '(') {
      let l = 1;
      let o = '';
      var i = r + 1;
      if (e[i] === '?')
        throw new TypeError('Pattern cannot start with "?" at '.concat(i));
      for (; i < e.length; ) {
        if (e[i] === '\\') {
          o += e[i++] + e[i++];
          continue;
        }
        if (e[i] === ')') {
          if ((l--, l === 0)) {
            i++;
            break;
          }
        } else if (e[i] === '(' && (l++, e[i + 1] !== '?'))
          throw new TypeError('Capturing groups are not allowed at '.concat(i));
        o += e[i++];
      }
      if (l) throw new TypeError('Unbalanced pattern at '.concat(r));
      if (!o) throw new TypeError('Missing pattern at '.concat(r));
      t.push({ type: 'PATTERN', index: r, value: o }), (r = i);
      continue;
    }
    t.push({ type: 'CHAR', index: r, value: e[r++] });
  }
  return t.push({ type: 'END', index: r, value: '' }), t;
}
function an(e, t) {
  t === void 0 && (t = {});
  for (
    var r = on(e),
      s = t.prefixes,
      n = s === void 0 ? './' : s,
      i = '[^'.concat(H(t.delimiter || '/#?'), ']+?'),
      c = [],
      l = 0,
      o = 0,
      a = '',
      u = function (T) {
        if (o < r.length && r[o].type === T) return r[o++].value;
      },
      d = function (T) {
        const A = u(T);
        if (A !== void 0) return A;
        const D = r[o];
        const de = D.type;
        const fe = D.index;
        throw new TypeError(
          'Unexpected '.concat(de, ' at ').concat(fe, ', expected ').concat(T)
        );
      },
      p = function () {
        for (var T = '', A; (A = u('CHAR') || u('ESCAPED_CHAR')); ) T += A;
        return T;
      };
    o < r.length;

  ) {
    const v = u('CHAR');
    const m = u('NAME');
    const f = u('PATTERN');
    if (m || f) {
      var g = v || '';
      n.indexOf(g) === -1 && ((a += g), (g = '')),
        a && (c.push(a), (a = '')),
        c.push({
          name: m || l++,
          prefix: g,
          suffix: '',
          pattern: f || i,
          modifier: u('MODIFIER') || '',
        });
      continue;
    }
    const E = v || u('ESCAPED_CHAR');
    if (E) {
      a += E;
      continue;
    }
    a && (c.push(a), (a = ''));
    const _ = u('OPEN');
    if (_) {
      var g = p();
      const x = u('NAME') || '';
      const w = u('PATTERN') || '';
      const I = p();
      d('CLOSE'),
        c.push({
          name: x || (w ? l++ : ''),
          pattern: x && !w ? i : w,
          prefix: g,
          suffix: I,
          modifier: u('MODIFIER') || '',
        });
      continue;
    }
    d('END');
  }
  return c;
}
function cn(e, t) {
  const r = [];
  const s = Pt(e, r, t);
  return ln(s, r, t);
}
function ln(e, t, r) {
  r === void 0 && (r = {});
  const s = r.decode;
  const n =
    s === void 0
      ? function (i) {
          return i;
        }
      : s;
  return function (i) {
    const c = e.exec(i);
    if (!c) return !1;
    for (
      var l = c[0],
        o = c.index,
        a = Object.create(null),
        u = function (p) {
          if (c[p] === void 0) return 'continue';
          const v = t[p - 1];
          v.modifier === '*' || v.modifier === '+'
            ? (a[v.name] = c[p].split(v.prefix + v.suffix).map(function (m) {
                return n(m, v);
              }))
            : (a[v.name] = n(c[p], v));
        },
        d = 1;
      d < c.length;
      d++
    )
      u(d);
    return { path: l, index: o, params: a };
  };
}
function H(e) {
  return e.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
}
function At(e) {
  return e && e.sensitive ? '' : 'i';
}
function un(e, t) {
  if (!t) return e;
  for (let r = /\((?:\?<(.*?)>)?(?!\?)/g, s = 0, n = r.exec(e.source); n; )
    t.push({
      name: n[1] || s++,
      prefix: '',
      suffix: '',
      modifier: '',
      pattern: '',
    }),
      (n = r.exec(e.source));
  return e;
}
function pn(e, t, r) {
  const s = e.map(function (n) {
    return Pt(n, t, r).source;
  });
  return new RegExp('(?:'.concat(s.join('|'), ')'), At(r));
}
function hn(e, t, r) {
  return dn(an(e, r), t, r);
}
function dn(e, t, r) {
  r === void 0 && (r = {});
  for (
    var s = r.strict,
      n = s === void 0 ? !1 : s,
      i = r.start,
      c = i === void 0 ? !0 : i,
      l = r.end,
      o = l === void 0 ? !0 : l,
      a = r.encode,
      u =
        a === void 0
          ? function (fe) {
              return fe;
            }
          : a,
      d = r.delimiter,
      p = d === void 0 ? '/#?' : d,
      v = r.endsWith,
      m = v === void 0 ? '' : v,
      f = '['.concat(H(m), ']|$'),
      g = '['.concat(H(p), ']'),
      E = c ? '^' : '',
      _ = 0,
      x = e;
    _ < x.length;
    _++
  ) {
    const w = x[_];
    if (typeof w === 'string') E += H(u(w));
    else {
      const I = H(u(w.prefix));
      const T = H(u(w.suffix));
      if (w.pattern)
        if ((t && t.push(w), I || T))
          if (w.modifier === '+' || w.modifier === '*') {
            const A = w.modifier === '*' ? '?' : '';
            E += '(?:'
              .concat(I, '((?:')
              .concat(w.pattern, ')(?:')
              .concat(T)
              .concat(I, '(?:')
              .concat(w.pattern, '))*)')
              .concat(T, ')')
              .concat(A);
          } else
            E += '(?:'
              .concat(I, '(')
              .concat(w.pattern, ')')
              .concat(T, ')')
              .concat(w.modifier);
        else
          w.modifier === '+' || w.modifier === '*'
            ? (E += '((?:'.concat(w.pattern, ')').concat(w.modifier, ')'))
            : (E += '('.concat(w.pattern, ')').concat(w.modifier));
      else E += '(?:'.concat(I).concat(T, ')').concat(w.modifier);
    }
  }
  if (o)
    n || (E += ''.concat(g, '?')),
      (E += r.endsWith ? '(?='.concat(f, ')') : '$');
  else {
    const D = e[e.length - 1];
    const de =
      typeof D === 'string' ? g.indexOf(D[D.length - 1]) > -1 : D === void 0;
    n || (E += '(?:'.concat(g, '(?=').concat(f, '))?')),
      de || (E += '(?='.concat(g, '|').concat(f, ')'));
  }
  return new RegExp(E, At(r));
}
function Pt(e, t, r) {
  return e instanceof RegExp
    ? un(e, t)
    : Array.isArray(e)
      ? pn(e, t, r)
      : hn(e, t, r);
}
const fn = new TextEncoder();
function mn(e) {
  return fn.encode(e);
}
function vn(e, t) {
  return new TextDecoder(t).decode(e);
}
function gn(e) {
  return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
}
const yn = new Set([101, 103, 204, 205, 304]);
function kt(e) {
  return yn.has(e);
}
function ke() {
  if (typeof navigator < 'u' && navigator.product === 'ReactNative') return !0;
  if (typeof process < 'u') {
    const e = process.type;
    return e === 'renderer' || e === 'worker'
      ? !1
      : !!(process.versions && process.versions.node);
  }
  return !1;
}
const En = Object.defineProperty;
const _n = (e, t) => {
  for (const r in t) En(e, r, { get: t[r], enumerable: !0 });
};
const Te = {};
_n(Te, {
  blue: () => bn,
  gray: () => xe,
  green: () => xn,
  red: () => Tn,
  yellow: () => wn,
});
function wn(e) {
  return `\x1B[33m${e}\x1B[0m`;
}
function bn(e) {
  return `\x1B[34m${e}\x1B[0m`;
}
function xe(e) {
  return `\x1B[90m${e}\x1B[0m`;
}
function Tn(e) {
  return `\x1B[31m${e}\x1B[0m`;
}
function xn(e) {
  return `\x1B[32m${e}\x1B[0m`;
}
const ue = ke();
var Ct = class {
  constructor(e) {
    M(this, 'prefix');
    (this.name = e), (this.prefix = `[${this.name}]`);
    const t = Ue('DEBUG');
    const r = Ue('LOG_LEVEL');
    t === '1' || t === 'true' || (typeof t < 'u' && this.name.startsWith(t))
      ? ((this.debug = Q(r, 'debug') ? P : this.debug),
        (this.info = Q(r, 'info') ? P : this.info),
        (this.success = Q(r, 'success') ? P : this.success),
        (this.warning = Q(r, 'warning') ? P : this.warning),
        (this.error = Q(r, 'error') ? P : this.error))
      : ((this.info = P),
        (this.success = P),
        (this.warning = P),
        (this.error = P),
        (this.only = P));
  }

  extend(e) {
    return new Ct(`${this.name}:${e}`);
  }

  debug(e, ...t) {
    this.logEntry({
      level: 'debug',
      message: xe(e),
      positionals: t,
      prefix: this.prefix,
      colors: { prefix: 'gray' },
    });
  }

  info(e, ...t) {
    this.logEntry({
      level: 'info',
      message: e,
      positionals: t,
      prefix: this.prefix,
      colors: { prefix: 'blue' },
    });
    const r = new On();
    return (s, ...n) => {
      r.measure(),
        this.logEntry({
          level: 'info',
          message: `${s} ${xe(`${r.deltaTime}ms`)}`,
          positionals: n,
          prefix: this.prefix,
          colors: { prefix: 'blue' },
        });
    };
  }

  success(e, ...t) {
    this.logEntry({
      level: 'info',
      message: e,
      positionals: t,
      prefix: `✔ ${this.prefix}`,
      colors: { timestamp: 'green', prefix: 'green' },
    });
  }

  warning(e, ...t) {
    this.logEntry({
      level: 'warning',
      message: e,
      positionals: t,
      prefix: `⚠ ${this.prefix}`,
      colors: { timestamp: 'yellow', prefix: 'yellow' },
    });
  }

  error(e, ...t) {
    this.logEntry({
      level: 'error',
      message: e,
      positionals: t,
      prefix: `✖ ${this.prefix}`,
      colors: { timestamp: 'red', prefix: 'red' },
    });
  }

  only(e) {
    e();
  }

  createEntry(e, t) {
    return { timestamp: new Date(), level: e, message: t };
  }

  logEntry(e) {
    const {
      level: t,
      message: r,
      prefix: s,
      colors: n,
      positionals: i = [],
    } = e;
    const c = this.createEntry(t, r);
    const l = (n == null ? void 0 : n.timestamp) || 'gray';
    const o = (n == null ? void 0 : n.prefix) || 'gray';
    const a = { timestamp: Te[l], prefix: Te[o] };
    this.getWriter(t)(
      [a.timestamp(this.formatTimestamp(c.timestamp))]
        .concat(s != null ? a.prefix(s) : [])
        .concat(Be(r))
        .join(' '),
      ...i.map(Be)
    );
  }

  formatTimestamp(e) {
    return `${e.toLocaleTimeString('en-GB')}:${e.getMilliseconds()}`;
  }

  getWriter(e) {
    switch (e) {
      case 'debug':
      case 'success':
      case 'info':
        return Sn;
      case 'warning':
        return Rn;
      case 'error':
        return Nn;
    }
  }
};
var On = class {
  constructor() {
    M(this, 'startTime');
    M(this, 'endTime');
    M(this, 'deltaTime');
    this.startTime = performance.now();
  }

  measure() {
    this.endTime = performance.now();
    const e = this.endTime - this.startTime;
    this.deltaTime = e.toFixed(2);
  }
};
var P = () => {};
function Sn(e, ...t) {
  if (ue) {
    process.stdout.write(`${J(e, ...t)}
`);
    return;
  }
  console.log(e, ...t);
}
function Rn(e, ...t) {
  if (ue) {
    process.stderr.write(
      `${J(e, ...t)}
`
    );
    return;
  }
  console.warn(e, ...t);
}
function Nn(e, ...t) {
  if (ue) {
    process.stderr.write(
      `${J(e, ...t)}
`
    );
    return;
  }
  console.error(e, ...t);
}
function Ue(e) {
  let t;
  return ue
    ? process.env[e]
    : (t = globalThis[e]) == null
      ? void 0
      : t.toString();
}
function Q(e, t) {
  return e !== void 0 && e !== t;
}
function Be(e) {
  return typeof e > 'u'
    ? 'undefined'
    : e === null
      ? 'null'
      : typeof e === 'string'
        ? e
        : typeof e === 'object'
          ? JSON.stringify(e)
          : e.toString();
}
const W = Symbol('isPatchedModule');
function He(e) {
  return globalThis[e] || void 0;
}
function In(e, t) {
  globalThis[e] = t;
}
function An(e) {
  delete globalThis[e];
}
const Ce = class {
  constructor(e) {
    (this.symbol = e),
      (this.readyState = 'INACTIVE'),
      (this.emitter = new ce()),
      (this.subscriptions = []),
      (this.logger = new Ct(e.description)),
      this.emitter.setMaxListeners(0),
      this.logger.info('constructing the interceptor...');
  }

  checkEnvironment() {
    return !0;
  }

  apply() {
    const e = this.logger.extend('apply');
    if (
      (e.info('applying the interceptor...'), this.readyState === 'APPLIED')
    ) {
      e.info('intercepted already applied!');
      return;
    }
    if (!this.checkEnvironment()) {
      e.info('the interceptor cannot be applied in this environment!');
      return;
    }
    this.readyState = 'APPLYING';
    const r = this.getInstance();
    if (r) {
      e.info('found a running instance, reusing...'),
        (this.on = (s, n) => (
          e.info('proxying the "%s" listener', s),
          r.emitter.addListener(s, n),
          this.subscriptions.push(() => {
            r.emitter.removeListener(s, n),
              e.info('removed proxied "%s" listener!', s);
          }),
          this
        )),
        (this.readyState = 'APPLIED');
      return;
    }
    e.info('no running instance found, setting up a new instance...'),
      this.setup(),
      this.setInstance(),
      (this.readyState = 'APPLIED');
  }

  setup() {}

  on(e, t) {
    const r = this.logger.extend('on');
    return this.readyState === 'DISPOSING' || this.readyState === 'DISPOSED'
      ? (r.info('cannot listen to events, already disposed!'), this)
      : (r.info('adding "%s" event listener:', e, t),
        this.emitter.on(e, t),
        this);
  }

  once(e, t) {
    return this.emitter.once(e, t), this;
  }

  off(e, t) {
    return this.emitter.off(e, t), this;
  }

  removeAllListeners(e) {
    return this.emitter.removeAllListeners(e), this;
  }

  dispose() {
    const e = this.logger.extend('dispose');
    if (this.readyState === 'DISPOSED') {
      e.info('cannot dispose, already disposed!');
      return;
    }
    if (
      (e.info('disposing the interceptor...'),
      (this.readyState = 'DISPOSING'),
      !this.getInstance())
    ) {
      e.info('no interceptors running, skipping dispose...');
      return;
    }
    if (
      (this.clearInstance(),
      e.info('global symbol deleted:', He(this.symbol)),
      this.subscriptions.length > 0)
    ) {
      e.info('disposing of %d subscriptions...', this.subscriptions.length);
      for (const t of this.subscriptions) t();
      (this.subscriptions = []),
        e.info('disposed of all subscriptions!', this.subscriptions.length);
    }
    this.emitter.removeAllListeners(),
      e.info('destroyed the listener!'),
      (this.readyState = 'DISPOSED');
  }

  getInstance() {
    let e;
    const t = He(this.symbol);
    return (
      this.logger.info(
        'retrieved global instance:',
        (e = t == null ? void 0 : t.constructor) == null ? void 0 : e.name
      ),
      t
    );
  }

  setInstance() {
    In(this.symbol, this),
      this.logger.info('set global instance!', this.symbol.description);
  }

  clearInstance() {
    An(this.symbol),
      this.logger.info('cleared global instance!', this.symbol.description);
  }
};
var Oe = class extends Ce {
  constructor(e) {
    (Oe.symbol = Symbol(e.name)),
      super(Oe.symbol),
      (this.interceptors = e.interceptors);
  }

  setup() {
    const e = this.logger.extend('setup');
    e.info('applying all %d interceptors...', this.interceptors.length);
    for (const t of this.interceptors)
      e.info('applying "%s" interceptor...', t.constructor.name),
        t.apply(),
        e.info('adding interceptor dispose subscription'),
        this.subscriptions.push(() => t.dispose());
  }

  on(e, t) {
    for (const r of this.interceptors) r.on(e, t);
    return this;
  }

  once(e, t) {
    for (const r of this.interceptors) r.once(e, t);
    return this;
  }

  off(e, t) {
    for (const r of this.interceptors) r.off(e, t);
    return this;
  }

  removeAllListeners(e) {
    for (const t of this.interceptors) t.removeAllListeners(e);
    return this;
  }
};
function Pn(e, t = !0) {
  return [t && e.origin, e.pathname].filter(Boolean).join('');
}
const kn = /[\?|#].*$/g;
function Cn(e) {
  return new URL(`/${e}`, 'http://localhost').searchParams;
}
function Lt(e) {
  return e.replace(kn, '');
}
function Ln(e) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);
}
function Dn(e, t) {
  if (Ln(e) || e.startsWith('*')) return e;
  const r = t || (typeof document < 'u' && document.baseURI);
  return r ? decodeURI(new URL(encodeURI(e), r).href) : e;
}
function Mn(e, t) {
  if (e instanceof RegExp) return e;
  const r = Dn(e, t);
  return Lt(r);
}
function qn(e) {
  return e
    .replace(/([:a-zA-Z_-]*)(\*{1,2})+/g, (t, r, s) => {
      const n = '(.*)';
      return r ? (r.startsWith(':') ? `${r}${s}` : `${r}${n}`) : n;
    })
    .replace(/([^\/])(:)(?=\d+)/, '$1\\$2')
    .replace(/^([^\/]+)(:)(?=\/\/)/, '$1\\$2');
}
function Dt(e, t, r) {
  const s = Mn(t, r);
  const n = typeof s === 'string' ? qn(s) : s;
  const i = Pn(e);
  const c = cn(n, { decode: decodeURIComponent })(i);
  const l = (c && c.params) || {};
  return { matches: c !== !1, params: l };
}
function re(e) {
  if (typeof location > 'u') return e.url;
  const t = new URL(e.url);
  return t.origin === location.origin ? t.pathname : t.origin + t.pathname;
}
const $n = Object.create;
const Mt = Object.defineProperty;
const jn = Object.getOwnPropertyDescriptor;
const qt = Object.getOwnPropertyNames;
const Fn = Object.getPrototypeOf;
const Un = Object.prototype.hasOwnProperty;
const Bn = (e, t) =>
  function () {
    return t || (0, e[qt(e)[0]])((t = { exports: {} }).exports, t), t.exports;
  };
const Hn = (e, t, r, s) => {
  if ((t && typeof t === 'object') || typeof t === 'function')
    for (const n of qt(t))
      !Un.call(e, n) &&
        n !== r &&
        Mt(e, n, {
          get: () => t[n],
          enumerable: !(s = jn(t, n)) || s.enumerable,
        });
  return e;
};
const Vn = (e, t, r) => (
  (r = e != null ? $n(Fn(e)) : {}),
  Hn(
    t || !e || !e.__esModule
      ? Mt(r, 'default', { value: e, enumerable: !0 })
      : r,
    e
  )
);
const Gn = Bn({
  'node_modules/cookie/index.js': function (e) {
    (e.parse = s), (e.serialize = n);
    const t = Object.prototype.toString;
    const r = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function s(a, u) {
      if (typeof a !== 'string')
        throw new TypeError('argument str must be a string');
      for (var d = {}, p = u || {}, v = p.decode || i, m = 0; m < a.length; ) {
        const f = a.indexOf('=', m);
        if (f === -1) break;
        let g = a.indexOf(';', m);
        if (g === -1) g = a.length;
        else if (g < f) {
          m = a.lastIndexOf(';', f - 1) + 1;
          continue;
        }
        const E = a.slice(m, f).trim();
        if (d[E] === void 0) {
          let _ = a.slice(f + 1, g).trim();
          _.charCodeAt(0) === 34 && (_ = _.slice(1, -1)), (d[E] = o(_, v));
        }
        m = g + 1;
      }
      return d;
    }
    function n(a, u, d) {
      const p = d || {};
      const v = p.encode || c;
      if (typeof v !== 'function')
        throw new TypeError('option encode is invalid');
      if (!r.test(a)) throw new TypeError('argument name is invalid');
      const m = v(u);
      if (m && !r.test(m)) throw new TypeError('argument val is invalid');
      let f = `${a}=${m}`;
      if (p.maxAge != null) {
        const g = p.maxAge - 0;
        if (isNaN(g) || !isFinite(g))
          throw new TypeError('option maxAge is invalid');
        f += `; Max-Age=${Math.floor(g)}`;
      }
      if (p.domain) {
        if (!r.test(p.domain)) throw new TypeError('option domain is invalid');
        f += `; Domain=${p.domain}`;
      }
      if (p.path) {
        if (!r.test(p.path)) throw new TypeError('option path is invalid');
        f += `; Path=${p.path}`;
      }
      if (p.expires) {
        const E = p.expires;
        if (!l(E) || isNaN(E.valueOf()))
          throw new TypeError('option expires is invalid');
        f += `; Expires=${E.toUTCString()}`;
      }
      if (
        (p.httpOnly && (f += '; HttpOnly'),
        p.secure && (f += '; Secure'),
        p.priority)
      ) {
        const _ =
          typeof p.priority === 'string'
            ? p.priority.toLowerCase()
            : p.priority;
        switch (_) {
          case 'low':
            f += '; Priority=Low';
            break;
          case 'medium':
            f += '; Priority=Medium';
            break;
          case 'high':
            f += '; Priority=High';
            break;
          default:
            throw new TypeError('option priority is invalid');
        }
      }
      if (p.sameSite) {
        const x =
          typeof p.sameSite === 'string'
            ? p.sameSite.toLowerCase()
            : p.sameSite;
        switch (x) {
          case !0:
            f += '; SameSite=Strict';
            break;
          case 'lax':
            f += '; SameSite=Lax';
            break;
          case 'strict':
            f += '; SameSite=Strict';
            break;
          case 'none':
            f += '; SameSite=None';
            break;
          default:
            throw new TypeError('option sameSite is invalid');
        }
      }
      return f;
    }
    function i(a) {
      return a.indexOf('%') !== -1 ? decodeURIComponent(a) : a;
    }
    function c(a) {
      return encodeURIComponent(a);
    }
    function l(a) {
      return t.call(a) === '[object Date]' || a instanceof Date;
    }
    function o(a, u) {
      try {
        return u(a);
      } catch {
        return a;
      }
    }
  },
});
const Wn = Vn(Gn(), 1);
const Se = Wn.default;
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/ const Xn = Object.create;
const $t = Object.defineProperty;
const Jn = Object.getOwnPropertyDescriptor;
const jt = Object.getOwnPropertyNames;
const Yn = Object.getPrototypeOf;
const zn = Object.prototype.hasOwnProperty;
const Qn = (e, t) =>
  function () {
    return t || (0, e[jt(e)[0]])((t = { exports: {} }).exports, t), t.exports;
  };
const Kn = (e, t, r, s) => {
  if ((t && typeof t === 'object') || typeof t === 'function')
    for (const n of jt(t))
      !zn.call(e, n) &&
        n !== r &&
        $t(e, n, {
          get: () => t[n],
          enumerable: !(s = Jn(t, n)) || s.enumerable,
        });
  return e;
};
const Zn = (e, t, r) => (
  (r = e != null ? Xn(Yn(e)) : {}),
  Kn(
    t || !e || !e.__esModule
      ? $t(r, 'default', { value: e, enumerable: !0 })
      : r,
    e
  )
);
const es = Qn({
  'node_modules/set-cookie-parser/lib/set-cookie.js': function (e, t) {
    const r = { decodeValues: !0, map: !1, silent: !1 };
    function s(o) {
      return typeof o === 'string' && !!o.trim();
    }
    function n(o, a) {
      const u = o.split(';').filter(s);
      const d = u.shift();
      const p = i(d);
      const v = p.name;
      let m = p.value;
      a = a ? { ...r, ...a } : r;
      try {
        m = a.decodeValues ? decodeURIComponent(m) : m;
      } catch (g) {
        console.error(
          `set-cookie-parser encountered an error while decoding a cookie with value '${m}'. Set options.decodeValues to false to disable this feature.`,
          g
        );
      }
      const f = { name: v, value: m };
      return (
        u.forEach(function (g) {
          const E = g.split('=');
          const _ = E.shift().trimLeft().toLowerCase();
          const x = E.join('=');
          _ === 'expires'
            ? (f.expires = new Date(x))
            : _ === 'max-age'
              ? (f.maxAge = parseInt(x, 10))
              : _ === 'secure'
                ? (f.secure = !0)
                : _ === 'httponly'
                  ? (f.httpOnly = !0)
                  : _ === 'samesite'
                    ? (f.sameSite = x)
                    : (f[_] = x);
        }),
        f
      );
    }
    function i(o) {
      let a = '';
      let u = '';
      const d = o.split('=');
      return (
        d.length > 1 ? ((a = d.shift()), (u = d.join('='))) : (u = o),
        { name: a, value: u }
      );
    }
    function c(o, a) {
      if (((a = a ? { ...r, ...a } : r), !o)) return a.map ? {} : [];
      if (o.headers)
        if (typeof o.headers.getSetCookie === 'function')
          o = o.headers.getSetCookie();
        else if (o.headers['set-cookie']) o = o.headers['set-cookie'];
        else {
          const u =
            o.headers[
              Object.keys(o.headers).find(function (p) {
                return p.toLowerCase() === 'set-cookie';
              })
            ];
          !u &&
            o.headers.cookie &&
            !a.silent &&
            console.warn(
              'Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.'
            ),
            (o = u);
        }
      if (
        (Array.isArray(o) || (o = [o]), (a = a ? { ...r, ...a } : r), a.map)
      ) {
        const d = {};
        return o.filter(s).reduce(function (p, v) {
          const m = n(v, a);
          return (p[m.name] = m), p;
        }, d);
      }
      return o.filter(s).map(function (p) {
        return n(p, a);
      });
    }
    function l(o) {
      if (Array.isArray(o)) return o;
      if (typeof o !== 'string') return [];
      const a = [];
      let u = 0;
      let d;
      let p;
      let v;
      let m;
      let f;
      function g() {
        for (; u < o.length && /\s/.test(o.charAt(u)); ) u += 1;
        return u < o.length;
      }
      function E() {
        return (p = o.charAt(u)), p !== '=' && p !== ';' && p !== ',';
      }
      for (; u < o.length; ) {
        for (d = u, f = !1; g(); )
          if (((p = o.charAt(u)), p === ',')) {
            for (v = u, u += 1, g(), m = u; u < o.length && E(); ) u += 1;
            u < o.length && o.charAt(u) === '='
              ? ((f = !0), (u = m), a.push(o.substring(d, v)), (d = u))
              : (u = v + 1);
          } else u += 1;
        (!f || u >= o.length) && a.push(o.substring(d, o.length));
      }
      return a;
    }
    (t.exports = c),
      (t.exports.parse = c),
      (t.exports.parseString = n),
      (t.exports.splitCookiesString = l);
  },
});
const Ve = Zn(es());
const V = 'MSW_COOKIE_STORE';
function Ge() {
  try {
    if (localStorage == null) return !1;
    const e = `${V}_test`;
    return (
      localStorage.setItem(e, 'test'),
      localStorage.getItem(e),
      localStorage.removeItem(e),
      !0
    );
  } catch {
    return !1;
  }
}
function We(e, t) {
  try {
    return e[t], !0;
  } catch {
    return !1;
  }
}
const ts = class {
  constructor() {
    this.store = new Map();
  }

  add(e, t) {
    if (We(e, 'credentials') && e.credentials === 'omit') return;
    const r = new URL(e.url);
    const s = t.headers.get('set-cookie');
    if (!s) return;
    const n = Date.now();
    const i = (0, Ve.parse)(s).map(({ maxAge: l, ...o }) => ({
      ...o,
      expires: l === void 0 ? o.expires : new Date(n + l * 1e3),
      maxAge: l,
    }));
    const c = this.store.get(r.origin) || new Map();
    i.forEach((l) => {
      this.store.set(r.origin, c.set(l.name, l));
    });
  }

  get(e) {
    this.deleteExpiredCookies();
    const t = new URL(e.url);
    const r = this.store.get(t.origin) || new Map();
    if (!We(e, 'credentials')) return r;
    switch (e.credentials) {
      case 'include':
        return (
          typeof document > 'u' ||
            (0, Ve.parse)(document.cookie).forEach((n) => {
              r.set(n.name, n);
            }),
          r
        );
      case 'same-origin':
        return r;
      default:
        return new Map();
    }
  }

  getAll() {
    return this.deleteExpiredCookies(), this.store;
  }

  deleteAll(e) {
    const t = new URL(e.url);
    this.store.delete(t.origin);
  }

  clear() {
    this.store.clear();
  }

  hydrate() {
    if (!Ge()) return;
    const e = localStorage.getItem(V);
    if (e)
      try {
        JSON.parse(e).forEach(([r, s]) => {
          this.store.set(
            r,
            new Map(
              s.map(([n, { expires: i, ...c }]) => [
                n,
                i === void 0 ? c : { ...c, expires: new Date(i) },
              ])
            )
          );
        });
      } catch (t) {
        console.warn(`
[virtual-cookie] Failed to parse a stored cookie from the localStorage (key "${V}").

Stored value:
${localStorage.getItem(V)}

Thrown exception:
${t}

Invalid value has been removed from localStorage to prevent subsequent failed parsing attempts.`),
          localStorage.removeItem(V);
      }
  }

  persist() {
    if (!Ge()) return;
    const e = Array.from(this.store.entries()).map(([t, r]) => [
      t,
      Array.from(r.entries()),
    ]);
    localStorage.setItem(V, JSON.stringify(e));
  }

  deleteExpiredCookies() {
    const e = Date.now();
    this.store.forEach((t, r) => {
      t.forEach(({ expires: s, name: n }) => {
        s !== void 0 && s.getTime() <= e && t.delete(n);
      }),
        t.size === 0 && this.store.delete(r);
    });
  }
};
const le = new ts();
const rs = Object.defineProperty;
const Xe = Object.getOwnPropertySymbols;
const ns = Object.prototype.hasOwnProperty;
const ss = Object.prototype.propertyIsEnumerable;
const Je = (e, t, r) =>
  t in e
    ? rs(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
    : (e[t] = r);
const ie = (e, t) => {
  for (var r in t || (t = {})) ns.call(t, r) && Je(e, r, t[r]);
  if (Xe) for (var r of Xe(t)) ss.call(t, r) && Je(e, r, t[r]);
  return e;
};
function Ye() {
  return Se.parse(document.cookie);
}
function is(e) {
  if (typeof document > 'u' || typeof location > 'u') return {};
  switch (e.credentials) {
    case 'same-origin': {
      const t = new URL(e.url);
      return location.origin === t.origin ? Ye() : {};
    }
    case 'include':
      return Ye();
    default:
      return {};
  }
}
function Ft(e) {
  let t;
  const r = e.headers.get('cookie');
  const s = r ? Se.parse(r) : {};
  le.hydrate();
  const n = Array.from((t = le.get(e)) == null ? void 0 : t.entries()).reduce(
    (l, [o, { value: a }]) => Object.assign(l, { [o.trim()]: a }),
    {}
  );
  const i = is(e);
  const c = ie(ie({}, i), n);
  for (const [l, o] of Object.entries(c))
    e.headers.append('cookie', Se.serialize(l, o));
  return ie(ie({}, c), s);
}
const ze = (e, t, r) =>
  new Promise((s, n) => {
    const i = (o) => {
      try {
        l(r.next(o));
      } catch (a) {
        n(a);
      }
    };
    const c = (o) => {
      try {
        l(r.throw(o));
      } catch (a) {
        n(a);
      }
    };
    var l = (o) => (o.done ? s(o.value) : Promise.resolve(o.value).then(i, c));
    l((r = r.apply(e, t)).next());
  });
var C = ((e) => (
  (e.HEAD = 'HEAD'),
  (e.GET = 'GET'),
  (e.POST = 'POST'),
  (e.PUT = 'PUT'),
  (e.PATCH = 'PATCH'),
  (e.OPTIONS = 'OPTIONS'),
  (e.DELETE = 'DELETE'),
  e
))(C || {});
class Ut extends _t {
  constructor(t, r, s, n) {
    super({
      info: { header: `${t} ${r}`, path: r, method: t },
      resolver: s,
      options: n,
    }),
      this.checkRedundantQueryParameters();
  }

  checkRedundantQueryParameters() {
    const { method: t, path: r } = this.info;
    if (r instanceof RegExp || Lt(r) === r) return;
    Cn(r).forEach((i, c) => {}),
      b.warn(
        `Found a redundant usage of query parameters in the request handler URL for "${t} ${r}". Please match against a path instead and access query parameters in the response resolver function using "req.url.searchParams".`
      );
  }

  parse(t) {
    return ze(this, null, function* () {
      let r;
      const s = new URL(t.request.url);
      const n = Dt(
        s,
        this.info.path,
        (r = t.resolutionContext) == null ? void 0 : r.baseUrl
      );
      const i = Ft(t.request);
      return { match: n, cookies: i };
    });
  }

  predicate(t) {
    const r = this.matchMethod(t.request.method);
    const s = t.parsedResult.match.matches;
    return r && s;
  }

  matchMethod(t) {
    return this.info.method instanceof RegExp
      ? this.info.method.test(t)
      : wt(this.info.method, t);
  }

  extendResolverArgs(t) {
    let r;
    return {
      params: ((r = t.parsedResult.match) == null ? void 0 : r.params) || {},
      cookies: t.parsedResult.cookies,
    };
  }

  log(t) {
    return ze(this, null, function* () {
      const r = re(t.request);
      const s = yield xt(t.request);
      const n = yield It(t.response);
      const i = bt(n.status);
      console.groupCollapsed(
        b.formatMessage(
          `${Tt()} ${t.request.method} ${r} (%c${n.status} ${n.statusText}%c)`
        ),
        `color:${i}`,
        'color:inherit'
      ),
        console.log('Request', s),
        console.log('Handler:', this),
        console.log('Response', n),
        console.groupEnd();
    });
  }
}
function k(e) {
  return (t, r, s = {}) => new Ut(e, t, r, s);
}
const os = {
  all: k(/.+/),
  head: k(C.HEAD),
  get: k(C.GET),
  post: k(C.POST),
  put: k(C.PUT),
  delete: k(C.DELETE),
  patch: k(C.PATCH),
  options: k(C.OPTIONS),
};
function ge(e, t) {
  if (!e) throw new Error(t);
}
function as(e) {
  return typeof e === 'object' && e !== null;
}
function cs(e, t) {
  if (!e) throw new Error(t ?? 'Unexpected invariant triggered.');
}
const ls = /\r\n|[\n\r]/g;
function Re(e, t) {
  let r = 0;
  let s = 1;
  for (const n of e.body.matchAll(ls)) {
    if ((typeof n.index === 'number' || cs(!1), n.index >= t)) break;
    (r = n.index + n[0].length), (s += 1);
  }
  return { line: s, column: t + 1 - r };
}
function us(e) {
  return Bt(e.source, Re(e.source, e.start));
}
function Bt(e, t) {
  const r = e.locationOffset.column - 1;
  const s = ''.padStart(r) + e.body;
  const n = t.line - 1;
  const i = e.locationOffset.line - 1;
  const c = t.line + i;
  const l = t.line === 1 ? r : 0;
  const o = t.column + l;
  const a = `${e.name}:${c}:${o}
`;
  const u = s.split(/\r\n|[\n\r]/g);
  const d = u[n];
  if (d.length > 120) {
    const p = Math.floor(o / 80);
    const v = o % 80;
    const m = [];
    for (let f = 0; f < d.length; f += 80) m.push(d.slice(f, f + 80));
    return (
      a +
      Qe([
        [`${c} |`, m[0]],
        ...m.slice(1, p + 1).map((f) => ['|', f]),
        ['|', '^'.padStart(v)],
        ['|', m[p + 1]],
      ])
    );
  }
  return (
    a +
    Qe([
      [`${c - 1} |`, u[n - 1]],
      [`${c} |`, d],
      ['|', '^'.padStart(o)],
      [`${c + 1} |`, u[n + 1]],
    ])
  );
}
function Qe(e) {
  const t = e.filter(([s, n]) => n !== void 0);
  const r = Math.max(...t.map(([s]) => s.length));
  return t.map(([s, n]) => s.padStart(r) + (n ? ` ${n}` : '')).join(`
`);
}
function ps(e) {
  const t = e[0];
  return t == null || 'kind' in t || 'length' in t
    ? {
        nodes: t,
        source: e[1],
        positions: e[2],
        path: e[3],
        originalError: e[4],
        extensions: e[5],
      }
    : t;
}
class Le extends Error {
  constructor(t, ...r) {
    let s;
    let n;
    let i;
    const {
      nodes: c,
      source: l,
      positions: o,
      path: a,
      originalError: u,
      extensions: d,
    } = ps(r);
    super(t),
      (this.name = 'GraphQLError'),
      (this.path = a ?? void 0),
      (this.originalError = u ?? void 0),
      (this.nodes = Ke(Array.isArray(c) ? c : c ? [c] : void 0));
    const p = Ke(
      (s = this.nodes) === null || s === void 0
        ? void 0
        : s.map((m) => m.loc).filter((m) => m != null)
    );
    (this.source =
      l ??
      (p == null || (n = p[0]) === null || n === void 0 ? void 0 : n.source)),
      (this.positions = o ?? (p == null ? void 0 : p.map((m) => m.start))),
      (this.locations =
        o && l
          ? o.map((m) => Re(l, m))
          : p == null
            ? void 0
            : p.map((m) => Re(m.source, m.start)));
    const v = as(u == null ? void 0 : u.extensions)
      ? u == null
        ? void 0
        : u.extensions
      : void 0;
    (this.extensions =
      (i = d ?? v) !== null && i !== void 0 ? i : Object.create(null)),
      Object.defineProperties(this, {
        message: { writable: !0, enumerable: !0 },
        name: { enumerable: !1 },
        nodes: { enumerable: !1 },
        source: { enumerable: !1 },
        positions: { enumerable: !1 },
        originalError: { enumerable: !1 },
      }),
      u != null && u.stack
        ? Object.defineProperty(this, 'stack', {
            value: u.stack,
            writable: !0,
            configurable: !0,
          })
        : Error.captureStackTrace
          ? Error.captureStackTrace(this, Le)
          : Object.defineProperty(this, 'stack', {
              value: Error().stack,
              writable: !0,
              configurable: !0,
            });
  }

  get [Symbol.toStringTag]() {
    return 'GraphQLError';
  }

  toString() {
    let t = this.message;
    if (this.nodes)
      for (const r of this.nodes)
        r.loc &&
          (t += `

${us(r.loc)}`);
    else if (this.source && this.locations)
      for (const r of this.locations)
        t += `

${Bt(this.source, r)}`;
    return t;
  }

  toJSON() {
    const t = { message: this.message };
    return (
      this.locations != null && (t.locations = this.locations),
      this.path != null && (t.path = this.path),
      this.extensions != null &&
        Object.keys(this.extensions).length > 0 &&
        (t.extensions = this.extensions),
      t
    );
  }
}
function Ke(e) {
  return e === void 0 || e.length === 0 ? void 0 : e;
}
function S(e, t, r) {
  return new Le(`Syntax Error: ${r}`, { source: e, positions: [t] });
}
class hs {
  constructor(t, r, s) {
    (this.start = t.start),
      (this.end = r.end),
      (this.startToken = t),
      (this.endToken = r),
      (this.source = s);
  }

  get [Symbol.toStringTag]() {
    return 'Location';
  }

  toJSON() {
    return { start: this.start, end: this.end };
  }
}
class Ht {
  constructor(t, r, s, n, i, c) {
    (this.kind = t),
      (this.start = r),
      (this.end = s),
      (this.line = n),
      (this.column = i),
      (this.value = c),
      (this.prev = null),
      (this.next = null);
  }

  get [Symbol.toStringTag]() {
    return 'Token';
  }

  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column,
    };
  }
}
const ds = {
  Name: [],
  Document: ['definitions'],
  OperationDefinition: [
    'name',
    'variableDefinitions',
    'directives',
    'selectionSet',
  ],
  VariableDefinition: ['variable', 'type', 'defaultValue', 'directives'],
  Variable: ['name'],
  SelectionSet: ['selections'],
  Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
  Argument: ['name', 'value'],
  FragmentSpread: ['name', 'directives'],
  InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
  FragmentDefinition: [
    'name',
    'variableDefinitions',
    'typeCondition',
    'directives',
    'selectionSet',
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ['values'],
  ObjectValue: ['fields'],
  ObjectField: ['name', 'value'],
  Directive: ['name', 'arguments'],
  NamedType: ['name'],
  ListType: ['type'],
  NonNullType: ['type'],
  SchemaDefinition: ['description', 'directives', 'operationTypes'],
  OperationTypeDefinition: ['type'],
  ScalarTypeDefinition: ['description', 'name', 'directives'],
  ObjectTypeDefinition: [
    'description',
    'name',
    'interfaces',
    'directives',
    'fields',
  ],
  FieldDefinition: ['description', 'name', 'arguments', 'type', 'directives'],
  InputValueDefinition: [
    'description',
    'name',
    'type',
    'defaultValue',
    'directives',
  ],
  InterfaceTypeDefinition: [
    'description',
    'name',
    'interfaces',
    'directives',
    'fields',
  ],
  UnionTypeDefinition: ['description', 'name', 'directives', 'types'],
  EnumTypeDefinition: ['description', 'name', 'directives', 'values'],
  EnumValueDefinition: ['description', 'name', 'directives'],
  InputObjectTypeDefinition: ['description', 'name', 'directives', 'fields'],
  DirectiveDefinition: ['description', 'name', 'arguments', 'locations'],
  SchemaExtension: ['directives', 'operationTypes'],
  ScalarTypeExtension: ['name', 'directives'],
  ObjectTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
  InterfaceTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
  UnionTypeExtension: ['name', 'directives', 'types'],
  EnumTypeExtension: ['name', 'directives', 'values'],
  InputObjectTypeExtension: ['name', 'directives', 'fields'],
};
new Set(Object.keys(ds));
let G;
(function (e) {
  (e.QUERY = 'query'),
    (e.MUTATION = 'mutation'),
    (e.SUBSCRIPTION = 'subscription');
})(G || (G = {}));
let Ne;
(function (e) {
  (e.QUERY = 'QUERY'),
    (e.MUTATION = 'MUTATION'),
    (e.SUBSCRIPTION = 'SUBSCRIPTION'),
    (e.FIELD = 'FIELD'),
    (e.FRAGMENT_DEFINITION = 'FRAGMENT_DEFINITION'),
    (e.FRAGMENT_SPREAD = 'FRAGMENT_SPREAD'),
    (e.INLINE_FRAGMENT = 'INLINE_FRAGMENT'),
    (e.VARIABLE_DEFINITION = 'VARIABLE_DEFINITION'),
    (e.SCHEMA = 'SCHEMA'),
    (e.SCALAR = 'SCALAR'),
    (e.OBJECT = 'OBJECT'),
    (e.FIELD_DEFINITION = 'FIELD_DEFINITION'),
    (e.ARGUMENT_DEFINITION = 'ARGUMENT_DEFINITION'),
    (e.INTERFACE = 'INTERFACE'),
    (e.UNION = 'UNION'),
    (e.ENUM = 'ENUM'),
    (e.ENUM_VALUE = 'ENUM_VALUE'),
    (e.INPUT_OBJECT = 'INPUT_OBJECT'),
    (e.INPUT_FIELD_DEFINITION = 'INPUT_FIELD_DEFINITION');
})(Ne || (Ne = {}));
let y;
(function (e) {
  (e.NAME = 'Name'),
    (e.DOCUMENT = 'Document'),
    (e.OPERATION_DEFINITION = 'OperationDefinition'),
    (e.VARIABLE_DEFINITION = 'VariableDefinition'),
    (e.SELECTION_SET = 'SelectionSet'),
    (e.FIELD = 'Field'),
    (e.ARGUMENT = 'Argument'),
    (e.FRAGMENT_SPREAD = 'FragmentSpread'),
    (e.INLINE_FRAGMENT = 'InlineFragment'),
    (e.FRAGMENT_DEFINITION = 'FragmentDefinition'),
    (e.VARIABLE = 'Variable'),
    (e.INT = 'IntValue'),
    (e.FLOAT = 'FloatValue'),
    (e.STRING = 'StringValue'),
    (e.BOOLEAN = 'BooleanValue'),
    (e.NULL = 'NullValue'),
    (e.ENUM = 'EnumValue'),
    (e.LIST = 'ListValue'),
    (e.OBJECT = 'ObjectValue'),
    (e.OBJECT_FIELD = 'ObjectField'),
    (e.DIRECTIVE = 'Directive'),
    (e.NAMED_TYPE = 'NamedType'),
    (e.LIST_TYPE = 'ListType'),
    (e.NON_NULL_TYPE = 'NonNullType'),
    (e.SCHEMA_DEFINITION = 'SchemaDefinition'),
    (e.OPERATION_TYPE_DEFINITION = 'OperationTypeDefinition'),
    (e.SCALAR_TYPE_DEFINITION = 'ScalarTypeDefinition'),
    (e.OBJECT_TYPE_DEFINITION = 'ObjectTypeDefinition'),
    (e.FIELD_DEFINITION = 'FieldDefinition'),
    (e.INPUT_VALUE_DEFINITION = 'InputValueDefinition'),
    (e.INTERFACE_TYPE_DEFINITION = 'InterfaceTypeDefinition'),
    (e.UNION_TYPE_DEFINITION = 'UnionTypeDefinition'),
    (e.ENUM_TYPE_DEFINITION = 'EnumTypeDefinition'),
    (e.ENUM_VALUE_DEFINITION = 'EnumValueDefinition'),
    (e.INPUT_OBJECT_TYPE_DEFINITION = 'InputObjectTypeDefinition'),
    (e.DIRECTIVE_DEFINITION = 'DirectiveDefinition'),
    (e.SCHEMA_EXTENSION = 'SchemaExtension'),
    (e.SCALAR_TYPE_EXTENSION = 'ScalarTypeExtension'),
    (e.OBJECT_TYPE_EXTENSION = 'ObjectTypeExtension'),
    (e.INTERFACE_TYPE_EXTENSION = 'InterfaceTypeExtension'),
    (e.UNION_TYPE_EXTENSION = 'UnionTypeExtension'),
    (e.ENUM_TYPE_EXTENSION = 'EnumTypeExtension'),
    (e.INPUT_OBJECT_TYPE_EXTENSION = 'InputObjectTypeExtension');
})(y || (y = {}));
function fs(e) {
  return e === 9 || e === 32;
}
function te(e) {
  return e >= 48 && e <= 57;
}
function Vt(e) {
  return (e >= 97 && e <= 122) || (e >= 65 && e <= 90);
}
function Gt(e) {
  return Vt(e) || e === 95;
}
function ms(e) {
  return Vt(e) || te(e) || e === 95;
}
function vs(e) {
  let t;
  let r = Number.MAX_SAFE_INTEGER;
  let s = null;
  let n = -1;
  for (let c = 0; c < e.length; ++c) {
    var i;
    const l = e[c];
    const o = gs(l);
    o !== l.length &&
      ((s = (i = s) !== null && i !== void 0 ? i : c),
      (n = c),
      c !== 0 && o < r && (r = o));
  }
  return e
    .map((c, l) => (l === 0 ? c : c.slice(r)))
    .slice((t = s) !== null && t !== void 0 ? t : 0, n + 1);
}
function gs(e) {
  let t = 0;
  for (; t < e.length && fs(e.charCodeAt(t)); ) ++t;
  return t;
}
let h;
(function (e) {
  (e.SOF = '<SOF>'),
    (e.EOF = '<EOF>'),
    (e.BANG = '!'),
    (e.DOLLAR = '$'),
    (e.AMP = '&'),
    (e.PAREN_L = '('),
    (e.PAREN_R = ')'),
    (e.SPREAD = '...'),
    (e.COLON = ':'),
    (e.EQUALS = '='),
    (e.AT = '@'),
    (e.BRACKET_L = '['),
    (e.BRACKET_R = ']'),
    (e.BRACE_L = '{'),
    (e.PIPE = '|'),
    (e.BRACE_R = '}'),
    (e.NAME = 'Name'),
    (e.INT = 'Int'),
    (e.FLOAT = 'Float'),
    (e.STRING = 'String'),
    (e.BLOCK_STRING = 'BlockString'),
    (e.COMMENT = 'Comment');
})(h || (h = {}));
class ys {
  constructor(t) {
    const r = new Ht(h.SOF, 0, 0, 0, 0);
    (this.source = t),
      (this.lastToken = r),
      (this.token = r),
      (this.line = 1),
      (this.lineStart = 0);
  }

  get [Symbol.toStringTag]() {
    return 'Lexer';
  }

  advance() {
    return (this.lastToken = this.token), (this.token = this.lookahead());
  }

  lookahead() {
    let t = this.token;
    if (t.kind !== h.EOF)
      do
        if (t.next) t = t.next;
        else {
          const r = _s(this, t.end);
          (t.next = r), (r.prev = t), (t = r);
        }
      while (t.kind === h.COMMENT);
    return t;
  }
}
function Es(e) {
  return (
    e === h.BANG ||
    e === h.DOLLAR ||
    e === h.AMP ||
    e === h.PAREN_L ||
    e === h.PAREN_R ||
    e === h.SPREAD ||
    e === h.COLON ||
    e === h.EQUALS ||
    e === h.AT ||
    e === h.BRACKET_L ||
    e === h.BRACKET_R ||
    e === h.BRACE_L ||
    e === h.PIPE ||
    e === h.BRACE_R
  );
}
function Y(e) {
  return (e >= 0 && e <= 55295) || (e >= 57344 && e <= 1114111);
}
function pe(e, t) {
  return Wt(e.charCodeAt(t)) && Xt(e.charCodeAt(t + 1));
}
function Wt(e) {
  return e >= 55296 && e <= 56319;
}
function Xt(e) {
  return e >= 56320 && e <= 57343;
}
function $(e, t) {
  const r = e.source.body.codePointAt(t);
  if (r === void 0) return h.EOF;
  if (r >= 32 && r <= 126) {
    const s = String.fromCodePoint(r);
    return s === '"' ? `'"'` : `"${s}"`;
  }
  return `U+${r.toString(16).toUpperCase().padStart(4, '0')}`;
}
function O(e, t, r, s, n) {
  const i = e.line;
  const c = 1 + r - e.lineStart;
  return new Ht(t, r, s, i, c, n);
}
function _s(e, t) {
  const r = e.source.body;
  const s = r.length;
  let n = t;
  for (; n < s; ) {
    const i = r.charCodeAt(n);
    switch (i) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++n;
        continue;
      case 10:
        ++n, ++e.line, (e.lineStart = n);
        continue;
      case 13:
        r.charCodeAt(n + 1) === 10 ? (n += 2) : ++n,
          ++e.line,
          (e.lineStart = n);
        continue;
      case 35:
        return ws(e, n);
      case 33:
        return O(e, h.BANG, n, n + 1);
      case 36:
        return O(e, h.DOLLAR, n, n + 1);
      case 38:
        return O(e, h.AMP, n, n + 1);
      case 40:
        return O(e, h.PAREN_L, n, n + 1);
      case 41:
        return O(e, h.PAREN_R, n, n + 1);
      case 46:
        if (r.charCodeAt(n + 1) === 46 && r.charCodeAt(n + 2) === 46)
          return O(e, h.SPREAD, n, n + 3);
        break;
      case 58:
        return O(e, h.COLON, n, n + 1);
      case 61:
        return O(e, h.EQUALS, n, n + 1);
      case 64:
        return O(e, h.AT, n, n + 1);
      case 91:
        return O(e, h.BRACKET_L, n, n + 1);
      case 93:
        return O(e, h.BRACKET_R, n, n + 1);
      case 123:
        return O(e, h.BRACE_L, n, n + 1);
      case 124:
        return O(e, h.PIPE, n, n + 1);
      case 125:
        return O(e, h.BRACE_R, n, n + 1);
      case 34:
        return r.charCodeAt(n + 1) === 34 && r.charCodeAt(n + 2) === 34
          ? Rs(e, n)
          : Ts(e, n);
    }
    if (te(i) || i === 45) return bs(e, n, i);
    if (Gt(i)) return Ns(e, n);
    throw S(
      e.source,
      n,
      i === 39
        ? `Unexpected single quote character ('), did you mean to use a double quote (")?`
        : Y(i) || pe(r, n)
          ? `Unexpected character: ${$(e, n)}.`
          : `Invalid character: ${$(e, n)}.`
    );
  }
  return O(e, h.EOF, s, s);
}
function ws(e, t) {
  const r = e.source.body;
  const s = r.length;
  let n = t + 1;
  for (; n < s; ) {
    const i = r.charCodeAt(n);
    if (i === 10 || i === 13) break;
    if (Y(i)) ++n;
    else if (pe(r, n)) n += 2;
    else break;
  }
  return O(e, h.COMMENT, t, n, r.slice(t + 1, n));
}
function bs(e, t, r) {
  const s = e.source.body;
  let n = t;
  let i = r;
  let c = !1;
  if ((i === 45 && (i = s.charCodeAt(++n)), i === 48)) {
    if (((i = s.charCodeAt(++n)), te(i)))
      throw S(
        e.source,
        n,
        `Invalid number, unexpected digit after 0: ${$(e, n)}.`
      );
  } else (n = ye(e, n, i)), (i = s.charCodeAt(n));
  if (
    (i === 46 &&
      ((c = !0),
      (i = s.charCodeAt(++n)),
      (n = ye(e, n, i)),
      (i = s.charCodeAt(n))),
    (i === 69 || i === 101) &&
      ((c = !0),
      (i = s.charCodeAt(++n)),
      (i === 43 || i === 45) && (i = s.charCodeAt(++n)),
      (n = ye(e, n, i)),
      (i = s.charCodeAt(n))),
    i === 46 || Gt(i))
  )
    throw S(e.source, n, `Invalid number, expected digit but got: ${$(e, n)}.`);
  return O(e, c ? h.FLOAT : h.INT, t, n, s.slice(t, n));
}
function ye(e, t, r) {
  if (!te(r))
    throw S(e.source, t, `Invalid number, expected digit but got: ${$(e, t)}.`);
  const s = e.source.body;
  let n = t + 1;
  for (; te(s.charCodeAt(n)); ) ++n;
  return n;
}
function Ts(e, t) {
  const r = e.source.body;
  const s = r.length;
  let n = t + 1;
  let i = n;
  let c = '';
  for (; n < s; ) {
    const l = r.charCodeAt(n);
    if (l === 34) return (c += r.slice(i, n)), O(e, h.STRING, t, n + 1, c);
    if (l === 92) {
      c += r.slice(i, n);
      const o =
        r.charCodeAt(n + 1) === 117
          ? r.charCodeAt(n + 2) === 123
            ? xs(e, n)
            : Os(e, n)
          : Ss(e, n);
      (c += o.value), (n += o.size), (i = n);
      continue;
    }
    if (l === 10 || l === 13) break;
    if (Y(l)) ++n;
    else if (pe(r, n)) n += 2;
    else throw S(e.source, n, `Invalid character within String: ${$(e, n)}.`);
  }
  throw S(e.source, n, 'Unterminated string.');
}
function xs(e, t) {
  const r = e.source.body;
  let s = 0;
  let n = 3;
  for (; n < 12; ) {
    const i = r.charCodeAt(t + n++);
    if (i === 125) {
      if (n < 5 || !Y(s)) break;
      return { value: String.fromCodePoint(s), size: n };
    }
    if (((s = (s << 4) | ee(i)), s < 0)) break;
  }
  throw S(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${r.slice(t, t + n)}".`
  );
}
function Os(e, t) {
  const r = e.source.body;
  const s = Ze(r, t + 2);
  if (Y(s)) return { value: String.fromCodePoint(s), size: 6 };
  if (Wt(s) && r.charCodeAt(t + 6) === 92 && r.charCodeAt(t + 7) === 117) {
    const n = Ze(r, t + 8);
    if (Xt(n)) return { value: String.fromCodePoint(s, n), size: 12 };
  }
  throw S(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${r.slice(t, t + 6)}".`
  );
}
function Ze(e, t) {
  return (
    (ee(e.charCodeAt(t)) << 12) |
    (ee(e.charCodeAt(t + 1)) << 8) |
    (ee(e.charCodeAt(t + 2)) << 4) |
    ee(e.charCodeAt(t + 3))
  );
}
function ee(e) {
  return e >= 48 && e <= 57
    ? e - 48
    : e >= 65 && e <= 70
      ? e - 55
      : e >= 97 && e <= 102
        ? e - 87
        : -1;
}
function Ss(e, t) {
  const r = e.source.body;
  switch (r.charCodeAt(t + 1)) {
    case 34:
      return { value: '"', size: 2 };
    case 92:
      return { value: '\\', size: 2 };
    case 47:
      return { value: '/', size: 2 };
    case 98:
      return { value: '\b', size: 2 };
    case 102:
      return { value: '\f', size: 2 };
    case 110:
      return {
        value: `
`,
        size: 2,
      };
    case 114:
      return { value: '\r', size: 2 };
    case 116:
      return { value: '	', size: 2 };
  }
  throw S(
    e.source,
    t,
    `Invalid character escape sequence: "${r.slice(t, t + 2)}".`
  );
}
function Rs(e, t) {
  const r = e.source.body;
  const s = r.length;
  let n = e.lineStart;
  let i = t + 3;
  let c = i;
  let l = '';
  const o = [];
  for (; i < s; ) {
    const a = r.charCodeAt(i);
    if (a === 34 && r.charCodeAt(i + 1) === 34 && r.charCodeAt(i + 2) === 34) {
      (l += r.slice(c, i)), o.push(l);
      const u = O(
        e,
        h.BLOCK_STRING,
        t,
        i + 3,
        vs(o).join(`
`)
      );
      return (e.line += o.length - 1), (e.lineStart = n), u;
    }
    if (
      a === 92 &&
      r.charCodeAt(i + 1) === 34 &&
      r.charCodeAt(i + 2) === 34 &&
      r.charCodeAt(i + 3) === 34
    ) {
      (l += r.slice(c, i)), (c = i + 1), (i += 4);
      continue;
    }
    if (a === 10 || a === 13) {
      (l += r.slice(c, i)),
        o.push(l),
        a === 13 && r.charCodeAt(i + 1) === 10 ? (i += 2) : ++i,
        (l = ''),
        (c = i),
        (n = i);
      continue;
    }
    if (Y(a)) ++i;
    else if (pe(r, i)) i += 2;
    else throw S(e.source, i, `Invalid character within String: ${$(e, i)}.`);
  }
  throw S(e.source, i, 'Unterminated string.');
}
function Ns(e, t) {
  const r = e.source.body;
  const s = r.length;
  let n = t + 1;
  for (; n < s; ) {
    const i = r.charCodeAt(n);
    if (ms(i)) ++n;
    else break;
  }
  return O(e, h.NAME, t, n, r.slice(t, n));
}
const Is = 10;
const Jt = 2;
function Yt(e) {
  return he(e, []);
}
function he(e, t) {
  switch (typeof e) {
    case 'string':
      return JSON.stringify(e);
    case 'function':
      return e.name ? `[function ${e.name}]` : '[function]';
    case 'object':
      return As(e, t);
    default:
      return String(e);
  }
}
function As(e, t) {
  if (e === null) return 'null';
  if (t.includes(e)) return '[Circular]';
  const r = [...t, e];
  if (Ps(e)) {
    const s = e.toJSON();
    if (s !== e) return typeof s === 'string' ? s : he(s, r);
  } else if (Array.isArray(e)) return Cs(e, r);
  return ks(e, r);
}
function Ps(e) {
  return typeof e.toJSON === 'function';
}
function ks(e, t) {
  const r = Object.entries(e);
  return r.length === 0
    ? '{}'
    : t.length > Jt
      ? `[${Ls(e)}]`
      : `{ ${r.map(([n, i]) => `${n}: ${he(i, t)}`).join(', ')} }`;
}
function Cs(e, t) {
  if (e.length === 0) return '[]';
  if (t.length > Jt) return '[Array]';
  const r = Math.min(Is, e.length);
  const s = e.length - r;
  const n = [];
  for (let i = 0; i < r; ++i) n.push(he(e[i], t));
  return (
    s === 1
      ? n.push('... 1 more item')
      : s > 1 && n.push(`... ${s} more items`),
    `[${n.join(', ')}]`
  );
}
function Ls(e) {
  const t = Object.prototype.toString
    .call(e)
    .replace(/^\[object /, '')
    .replace(/]$/, '');
  if (t === 'Object' && typeof e.constructor === 'function') {
    const r = e.constructor.name;
    if (typeof r === 'string' && r !== '') return r;
  }
  return t;
}
const Ds = globalThis.process
  ? function (t, r) {
      return t instanceof r;
    }
  : function (t, r) {
      if (t instanceof r) return !0;
      if (typeof t === 'object' && t !== null) {
        let s;
        const n = r.prototype[Symbol.toStringTag];
        const i =
          Symbol.toStringTag in t
            ? t[Symbol.toStringTag]
            : (s = t.constructor) === null || s === void 0
              ? void 0
              : s.name;
        if (n === i) {
          const c = Yt(t);
          throw new Error(`Cannot use ${n} "${c}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
        }
      }
      return !1;
    };
class zt {
  constructor(t, r = 'GraphQL request', s = { line: 1, column: 1 }) {
    typeof t === 'string' ||
      ge(!1, `Body must be a string. Received: ${Yt(t)}.`),
      (this.body = t),
      (this.name = r),
      (this.locationOffset = s),
      this.locationOffset.line > 0 ||
        ge(!1, 'line in locationOffset is 1-indexed and must be positive.'),
      this.locationOffset.column > 0 ||
        ge(!1, 'column in locationOffset is 1-indexed and must be positive.');
  }

  get [Symbol.toStringTag]() {
    return 'Source';
  }
}
function Ms(e) {
  return Ds(e, zt);
}
function qs(e, t) {
  return new $s(e, t).parseDocument();
}
class $s {
  constructor(t, r = {}) {
    const s = Ms(t) ? t : new zt(t);
    (this._lexer = new ys(s)), (this._options = r), (this._tokenCounter = 0);
  }

  parseName() {
    const t = this.expectToken(h.NAME);
    return this.node(t, { kind: y.NAME, value: t.value });
  }

  parseDocument() {
    return this.node(this._lexer.token, {
      kind: y.DOCUMENT,
      definitions: this.many(h.SOF, this.parseDefinition, h.EOF),
    });
  }

  parseDefinition() {
    if (this.peek(h.BRACE_L)) return this.parseOperationDefinition();
    const t = this.peekDescription();
    const r = t ? this._lexer.lookahead() : this._lexer.token;
    if (r.kind === h.NAME) {
      switch (r.value) {
        case 'schema':
          return this.parseSchemaDefinition();
        case 'scalar':
          return this.parseScalarTypeDefinition();
        case 'type':
          return this.parseObjectTypeDefinition();
        case 'interface':
          return this.parseInterfaceTypeDefinition();
        case 'union':
          return this.parseUnionTypeDefinition();
        case 'enum':
          return this.parseEnumTypeDefinition();
        case 'input':
          return this.parseInputObjectTypeDefinition();
        case 'directive':
          return this.parseDirectiveDefinition();
      }
      if (t)
        throw S(
          this._lexer.source,
          this._lexer.token.start,
          'Unexpected description, descriptions are supported only on type definitions.'
        );
      switch (r.value) {
        case 'query':
        case 'mutation':
        case 'subscription':
          return this.parseOperationDefinition();
        case 'fragment':
          return this.parseFragmentDefinition();
        case 'extend':
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(r);
  }

  parseOperationDefinition() {
    const t = this._lexer.token;
    if (this.peek(h.BRACE_L))
      return this.node(t, {
        kind: y.OPERATION_DEFINITION,
        operation: G.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet(),
      });
    const r = this.parseOperationType();
    let s;
    return (
      this.peek(h.NAME) && (s = this.parseName()),
      this.node(t, {
        kind: y.OPERATION_DEFINITION,
        operation: r,
        name: s,
        variableDefinitions: this.parseVariableDefinitions(),
        directives: this.parseDirectives(!1),
        selectionSet: this.parseSelectionSet(),
      })
    );
  }

  parseOperationType() {
    const t = this.expectToken(h.NAME);
    switch (t.value) {
      case 'query':
        return G.QUERY;
      case 'mutation':
        return G.MUTATION;
      case 'subscription':
        return G.SUBSCRIPTION;
    }
    throw this.unexpected(t);
  }

  parseVariableDefinitions() {
    return this.optionalMany(
      h.PAREN_L,
      this.parseVariableDefinition,
      h.PAREN_R
    );
  }

  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: y.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(h.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(h.EQUALS)
        ? this.parseConstValueLiteral()
        : void 0,
      directives: this.parseConstDirectives(),
    });
  }

  parseVariable() {
    const t = this._lexer.token;
    return (
      this.expectToken(h.DOLLAR),
      this.node(t, { kind: y.VARIABLE, name: this.parseName() })
    );
  }

  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: y.SELECTION_SET,
      selections: this.many(h.BRACE_L, this.parseSelection, h.BRACE_R),
    });
  }

  parseSelection() {
    return this.peek(h.SPREAD) ? this.parseFragment() : this.parseField();
  }

  parseField() {
    const t = this._lexer.token;
    const r = this.parseName();
    let s;
    let n;
    return (
      this.expectOptionalToken(h.COLON)
        ? ((s = r), (n = this.parseName()))
        : (n = r),
      this.node(t, {
        kind: y.FIELD,
        alias: s,
        name: n,
        arguments: this.parseArguments(!1),
        directives: this.parseDirectives(!1),
        selectionSet: this.peek(h.BRACE_L) ? this.parseSelectionSet() : void 0,
      })
    );
  }

  parseArguments(t) {
    const r = t ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(h.PAREN_L, r, h.PAREN_R);
  }

  parseArgument(t = !1) {
    const r = this._lexer.token;
    const s = this.parseName();
    return (
      this.expectToken(h.COLON),
      this.node(r, {
        kind: y.ARGUMENT,
        name: s,
        value: this.parseValueLiteral(t),
      })
    );
  }

  parseConstArgument() {
    return this.parseArgument(!0);
  }

  parseFragment() {
    const t = this._lexer.token;
    this.expectToken(h.SPREAD);
    const r = this.expectOptionalKeyword('on');
    return !r && this.peek(h.NAME)
      ? this.node(t, {
          kind: y.FRAGMENT_SPREAD,
          name: this.parseFragmentName(),
          directives: this.parseDirectives(!1),
        })
      : this.node(t, {
          kind: y.INLINE_FRAGMENT,
          typeCondition: r ? this.parseNamedType() : void 0,
          directives: this.parseDirectives(!1),
          selectionSet: this.parseSelectionSet(),
        });
  }

  parseFragmentDefinition() {
    const t = this._lexer.token;
    return (
      this.expectKeyword('fragment'),
      this._options.allowLegacyFragmentVariables === !0
        ? this.node(t, {
            kind: y.FRAGMENT_DEFINITION,
            name: this.parseFragmentName(),
            variableDefinitions: this.parseVariableDefinitions(),
            typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
            directives: this.parseDirectives(!1),
            selectionSet: this.parseSelectionSet(),
          })
        : this.node(t, {
            kind: y.FRAGMENT_DEFINITION,
            name: this.parseFragmentName(),
            typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
            directives: this.parseDirectives(!1),
            selectionSet: this.parseSelectionSet(),
          })
    );
  }

  parseFragmentName() {
    if (this._lexer.token.value === 'on') throw this.unexpected();
    return this.parseName();
  }

  parseValueLiteral(t) {
    const r = this._lexer.token;
    switch (r.kind) {
      case h.BRACKET_L:
        return this.parseList(t);
      case h.BRACE_L:
        return this.parseObject(t);
      case h.INT:
        return (
          this.advanceLexer(), this.node(r, { kind: y.INT, value: r.value })
        );
      case h.FLOAT:
        return (
          this.advanceLexer(), this.node(r, { kind: y.FLOAT, value: r.value })
        );
      case h.STRING:
      case h.BLOCK_STRING:
        return this.parseStringLiteral();
      case h.NAME:
        switch ((this.advanceLexer(), r.value)) {
          case 'true':
            return this.node(r, { kind: y.BOOLEAN, value: !0 });
          case 'false':
            return this.node(r, { kind: y.BOOLEAN, value: !1 });
          case 'null':
            return this.node(r, { kind: y.NULL });
          default:
            return this.node(r, { kind: y.ENUM, value: r.value });
        }
      case h.DOLLAR:
        if (t)
          if ((this.expectToken(h.DOLLAR), this._lexer.token.kind === h.NAME)) {
            const s = this._lexer.token.value;
            throw S(
              this._lexer.source,
              r.start,
              `Unexpected variable "$${s}" in constant value.`
            );
          } else throw this.unexpected(r);
        return this.parseVariable();
      default:
        throw this.unexpected();
    }
  }

  parseConstValueLiteral() {
    return this.parseValueLiteral(!0);
  }

  parseStringLiteral() {
    const t = this._lexer.token;
    return (
      this.advanceLexer(),
      this.node(t, {
        kind: y.STRING,
        value: t.value,
        block: t.kind === h.BLOCK_STRING,
      })
    );
  }

  parseList(t) {
    const r = () => this.parseValueLiteral(t);
    return this.node(this._lexer.token, {
      kind: y.LIST,
      values: this.any(h.BRACKET_L, r, h.BRACKET_R),
    });
  }

  parseObject(t) {
    const r = () => this.parseObjectField(t);
    return this.node(this._lexer.token, {
      kind: y.OBJECT,
      fields: this.any(h.BRACE_L, r, h.BRACE_R),
    });
  }

  parseObjectField(t) {
    const r = this._lexer.token;
    const s = this.parseName();
    return (
      this.expectToken(h.COLON),
      this.node(r, {
        kind: y.OBJECT_FIELD,
        name: s,
        value: this.parseValueLiteral(t),
      })
    );
  }

  parseDirectives(t) {
    const r = [];
    for (; this.peek(h.AT); ) r.push(this.parseDirective(t));
    return r;
  }

  parseConstDirectives() {
    return this.parseDirectives(!0);
  }

  parseDirective(t) {
    const r = this._lexer.token;
    return (
      this.expectToken(h.AT),
      this.node(r, {
        kind: y.DIRECTIVE,
        name: this.parseName(),
        arguments: this.parseArguments(t),
      })
    );
  }

  parseTypeReference() {
    const t = this._lexer.token;
    let r;
    if (this.expectOptionalToken(h.BRACKET_L)) {
      const s = this.parseTypeReference();
      this.expectToken(h.BRACKET_R),
        (r = this.node(t, { kind: y.LIST_TYPE, type: s }));
    } else r = this.parseNamedType();
    return this.expectOptionalToken(h.BANG)
      ? this.node(t, { kind: y.NON_NULL_TYPE, type: r })
      : r;
  }

  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: y.NAMED_TYPE,
      name: this.parseName(),
    });
  }

  peekDescription() {
    return this.peek(h.STRING) || this.peek(h.BLOCK_STRING);
  }

  parseDescription() {
    if (this.peekDescription()) return this.parseStringLiteral();
  }

  parseSchemaDefinition() {
    const t = this._lexer.token;
    const r = this.parseDescription();
    this.expectKeyword('schema');
    const s = this.parseConstDirectives();
    const n = this.many(
      h.BRACE_L,
      this.parseOperationTypeDefinition,
      h.BRACE_R
    );
    return this.node(t, {
      kind: y.SCHEMA_DEFINITION,
      description: r,
      directives: s,
      operationTypes: n,
    });
  }

  parseOperationTypeDefinition() {
    const t = this._lexer.token;
    const r = this.parseOperationType();
    this.expectToken(h.COLON);
    const s = this.parseNamedType();
    return this.node(t, {
      kind: y.OPERATION_TYPE_DEFINITION,
      operation: r,
      type: s,
    });
  }

  parseScalarTypeDefinition() {
    const t = this._lexer.token;
    const r = this.parseDescription();
    this.expectKeyword('scalar');
    const s = this.parseName();
    const n = this.parseConstDirectives();
    return this.node(t, {
      kind: y.SCALAR_TYPE_DEFINITION,
      description: r,
      name: s,
      directives: n,
    });
  }

  parseObjectTypeDefinition() {
    const t = this._lexer.token;
    const r = this.parseDescription();
    this.expectKeyword('type');
    const s = this.parseName();
    const n = this.parseImplementsInterfaces();
    const i = this.parseConstDirectives();
    const c = this.parseFieldsDefinition();
    return this.node(t, {
      kind: y.OBJECT_TYPE_DEFINITION,
      description: r,
      name: s,
      interfaces: n,
      directives: i,
      fields: c,
    });
  }

  parseImplementsInterfaces() {
    return this.expectOptionalKeyword('implements')
      ? this.delimitedMany(h.AMP, this.parseNamedType)
      : [];
  }

  parseFieldsDefinition() {
    return this.optionalMany(h.BRACE_L, this.parseFieldDefinition, h.BRACE_R);
  }

  parseFieldDefinition() {
    const t = this._lexer.token;
    const r = this.parseDescription();
    const s = this.parseName();
    const n = this.parseArgumentDefs();
    this.expectToken(h.COLON);
    const i = this.parseTypeReference();
    const c = this.parseConstDirectives();
    return this.node(t, {
      kind: y.FIELD_DEFINITION,
      description: r,
      name: s,
      arguments: n,
      type: i,
      directives: c,
    });
  }

  parseArgumentDefs() {
    return this.optionalMany(h.PAREN_L, this.parseInputValueDef, h.PAREN_R);
  }

  parseInputValueDef() {
    const t = this._lexer.token;
    const r = this.parseDescription();
    const s = this.parseName();
    this.expectToken(h.COLON);
    const n = this.parseTypeReference();
    let i;
    this.expectOptionalToken(h.EQUALS) && (i = this.parseConstValueLiteral());
    const c = this.parseConstDirectives();
    return this.node(t, {
      kind: y.INPUT_VALUE_DEFINITION,
      description: r,
      name: s,
      type: n,
      defaultValue: i,
      directives: c,
    });
  }

  parseInterfaceTypeDefinition() {
    const t = this._lexer.token;
    const r = this.parseDescription();
    this.expectKeyword('interface');
    const s = this.parseName();
    const n = this.parseImplementsInterfaces();
    const i = this.parseConstDirectives();
    const c = this.parseFieldsDefinition();
    return this.node(t, {
      kind: y.INTERFACE_TYPE_DEFINITION,
      description: r,
      name: s,
      interfaces: n,
      directives: i,
      fields: c,
    });
  }

  parseUnionTypeDefinition() {
    const t = this._lexer.token;
    const r = this.parseDescription();
    this.expectKeyword('union');
    const s = this.parseName();
    const n = this.parseConstDirectives();
    const i = this.parseUnionMemberTypes();
    return this.node(t, {
      kind: y.UNION_TYPE_DEFINITION,
      description: r,
      name: s,
      directives: n,
      types: i,
    });
  }

  parseUnionMemberTypes() {
    return this.expectOptionalToken(h.EQUALS)
      ? this.delimitedMany(h.PIPE, this.parseNamedType)
      : [];
  }

  parseEnumTypeDefinition() {
    const t = this._lexer.token;
    const r = this.parseDescription();
    this.expectKeyword('enum');
    const s = this.parseName();
    const n = this.parseConstDirectives();
    const i = this.parseEnumValuesDefinition();
    return this.node(t, {
      kind: y.ENUM_TYPE_DEFINITION,
      description: r,
      name: s,
      directives: n,
      values: i,
    });
  }

  parseEnumValuesDefinition() {
    return this.optionalMany(
      h.BRACE_L,
      this.parseEnumValueDefinition,
      h.BRACE_R
    );
  }

  parseEnumValueDefinition() {
    const t = this._lexer.token;
    const r = this.parseDescription();
    const s = this.parseEnumValueName();
    const n = this.parseConstDirectives();
    return this.node(t, {
      kind: y.ENUM_VALUE_DEFINITION,
      description: r,
      name: s,
      directives: n,
    });
  }

  parseEnumValueName() {
    if (
      this._lexer.token.value === 'true' ||
      this._lexer.token.value === 'false' ||
      this._lexer.token.value === 'null'
    )
      throw S(
        this._lexer.source,
        this._lexer.token.start,
        `${oe(
          this._lexer.token
        )} is reserved and cannot be used for an enum value.`
      );
    return this.parseName();
  }

  parseInputObjectTypeDefinition() {
    const t = this._lexer.token;
    const r = this.parseDescription();
    this.expectKeyword('input');
    const s = this.parseName();
    const n = this.parseConstDirectives();
    const i = this.parseInputFieldsDefinition();
    return this.node(t, {
      kind: y.INPUT_OBJECT_TYPE_DEFINITION,
      description: r,
      name: s,
      directives: n,
      fields: i,
    });
  }

  parseInputFieldsDefinition() {
    return this.optionalMany(h.BRACE_L, this.parseInputValueDef, h.BRACE_R);
  }

  parseTypeSystemExtension() {
    const t = this._lexer.lookahead();
    if (t.kind === h.NAME)
      switch (t.value) {
        case 'schema':
          return this.parseSchemaExtension();
        case 'scalar':
          return this.parseScalarTypeExtension();
        case 'type':
          return this.parseObjectTypeExtension();
        case 'interface':
          return this.parseInterfaceTypeExtension();
        case 'union':
          return this.parseUnionTypeExtension();
        case 'enum':
          return this.parseEnumTypeExtension();
        case 'input':
          return this.parseInputObjectTypeExtension();
      }
    throw this.unexpected(t);
  }

  parseSchemaExtension() {
    const t = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('schema');
    const r = this.parseConstDirectives();
    const s = this.optionalMany(
      h.BRACE_L,
      this.parseOperationTypeDefinition,
      h.BRACE_R
    );
    if (r.length === 0 && s.length === 0) throw this.unexpected();
    return this.node(t, {
      kind: y.SCHEMA_EXTENSION,
      directives: r,
      operationTypes: s,
    });
  }

  parseScalarTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('scalar');
    const r = this.parseName();
    const s = this.parseConstDirectives();
    if (s.length === 0) throw this.unexpected();
    return this.node(t, {
      kind: y.SCALAR_TYPE_EXTENSION,
      name: r,
      directives: s,
    });
  }

  parseObjectTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('type');
    const r = this.parseName();
    const s = this.parseImplementsInterfaces();
    const n = this.parseConstDirectives();
    const i = this.parseFieldsDefinition();
    if (s.length === 0 && n.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: y.OBJECT_TYPE_EXTENSION,
      name: r,
      interfaces: s,
      directives: n,
      fields: i,
    });
  }

  parseInterfaceTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('interface');
    const r = this.parseName();
    const s = this.parseImplementsInterfaces();
    const n = this.parseConstDirectives();
    const i = this.parseFieldsDefinition();
    if (s.length === 0 && n.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: y.INTERFACE_TYPE_EXTENSION,
      name: r,
      interfaces: s,
      directives: n,
      fields: i,
    });
  }

  parseUnionTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('union');
    const r = this.parseName();
    const s = this.parseConstDirectives();
    const n = this.parseUnionMemberTypes();
    if (s.length === 0 && n.length === 0) throw this.unexpected();
    return this.node(t, {
      kind: y.UNION_TYPE_EXTENSION,
      name: r,
      directives: s,
      types: n,
    });
  }

  parseEnumTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('enum');
    const r = this.parseName();
    const s = this.parseConstDirectives();
    const n = this.parseEnumValuesDefinition();
    if (s.length === 0 && n.length === 0) throw this.unexpected();
    return this.node(t, {
      kind: y.ENUM_TYPE_EXTENSION,
      name: r,
      directives: s,
      values: n,
    });
  }

  parseInputObjectTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword('extend'), this.expectKeyword('input');
    const r = this.parseName();
    const s = this.parseConstDirectives();
    const n = this.parseInputFieldsDefinition();
    if (s.length === 0 && n.length === 0) throw this.unexpected();
    return this.node(t, {
      kind: y.INPUT_OBJECT_TYPE_EXTENSION,
      name: r,
      directives: s,
      fields: n,
    });
  }

  parseDirectiveDefinition() {
    const t = this._lexer.token;
    const r = this.parseDescription();
    this.expectKeyword('directive'), this.expectToken(h.AT);
    const s = this.parseName();
    const n = this.parseArgumentDefs();
    const i = this.expectOptionalKeyword('repeatable');
    this.expectKeyword('on');
    const c = this.parseDirectiveLocations();
    return this.node(t, {
      kind: y.DIRECTIVE_DEFINITION,
      description: r,
      name: s,
      arguments: n,
      repeatable: i,
      locations: c,
    });
  }

  parseDirectiveLocations() {
    return this.delimitedMany(h.PIPE, this.parseDirectiveLocation);
  }

  parseDirectiveLocation() {
    const t = this._lexer.token;
    const r = this.parseName();
    if (Object.prototype.hasOwnProperty.call(Ne, r.value)) return r;
    throw this.unexpected(t);
  }

  node(t, r) {
    return (
      this._options.noLocation !== !0 &&
        (r.loc = new hs(t, this._lexer.lastToken, this._lexer.source)),
      r
    );
  }

  peek(t) {
    return this._lexer.token.kind === t;
  }

  expectToken(t) {
    const r = this._lexer.token;
    if (r.kind === t) return this.advanceLexer(), r;
    throw S(this._lexer.source, r.start, `Expected ${Qt(t)}, found ${oe(r)}.`);
  }

  expectOptionalToken(t) {
    return this._lexer.token.kind === t ? (this.advanceLexer(), !0) : !1;
  }

  expectKeyword(t) {
    const r = this._lexer.token;
    if (r.kind === h.NAME && r.value === t) this.advanceLexer();
    else
      throw S(this._lexer.source, r.start, `Expected "${t}", found ${oe(r)}.`);
  }

  expectOptionalKeyword(t) {
    const r = this._lexer.token;
    return r.kind === h.NAME && r.value === t ? (this.advanceLexer(), !0) : !1;
  }

  unexpected(t) {
    const r = t ?? this._lexer.token;
    return S(this._lexer.source, r.start, `Unexpected ${oe(r)}.`);
  }

  any(t, r, s) {
    this.expectToken(t);
    const n = [];
    for (; !this.expectOptionalToken(s); ) n.push(r.call(this));
    return n;
  }

  optionalMany(t, r, s) {
    if (this.expectOptionalToken(t)) {
      const n = [];
      do n.push(r.call(this));
      while (!this.expectOptionalToken(s));
      return n;
    }
    return [];
  }

  many(t, r, s) {
    this.expectToken(t);
    const n = [];
    do n.push(r.call(this));
    while (!this.expectOptionalToken(s));
    return n;
  }

  delimitedMany(t, r) {
    this.expectOptionalToken(t);
    const s = [];
    do s.push(r.call(this));
    while (this.expectOptionalToken(t));
    return s;
  }

  advanceLexer() {
    const { maxTokens: t } = this._options;
    const r = this._lexer.advance();
    if (
      t !== void 0 &&
      r.kind !== h.EOF &&
      (++this._tokenCounter, this._tokenCounter > t)
    )
      throw S(
        this._lexer.source,
        r.start,
        `Document contains more that ${t} tokens. Parsing aborted.`
      );
  }
}
function oe(e) {
  const t = e.value;
  return Qt(e.kind) + (t != null ? ` "${t}"` : '');
}
function Qt(e) {
  return Es(e) ? `"${e}"` : e;
}
function Ee(e) {
  try {
    return JSON.parse(e);
  } catch {}
}
const js = Object.create;
const Kt = Object.defineProperty;
const Fs = Object.getOwnPropertyDescriptor;
const Zt = Object.getOwnPropertyNames;
const Us = Object.getPrototypeOf;
const Bs = Object.prototype.hasOwnProperty;
const Hs = (e, t) =>
  function () {
    return t || (0, e[Zt(e)[0]])((t = { exports: {} }).exports, t), t.exports;
  };
const Vs = (e, t, r, s) => {
  if ((t && typeof t === 'object') || typeof t === 'function')
    for (const n of Zt(t))
      !Bs.call(e, n) &&
        n !== r &&
        Kt(e, n, {
          get: () => t[n],
          enumerable: !(s = Fs(t, n)) || s.enumerable,
        });
  return e;
};
const Gs = (e, t, r) => (
  (r = e != null ? js(Us(e)) : {}),
  Vs(
    t || !e || !e.__esModule
      ? Kt(r, 'default', { value: e, enumerable: !0 })
      : r,
    e
  )
);
const Ws = Hs({
  'node_modules/set-cookie-parser/lib/set-cookie.js': function (e, t) {
    const r = { decodeValues: !0, map: !1, silent: !1 };
    function s(o) {
      return typeof o === 'string' && !!o.trim();
    }
    function n(o, a) {
      const u = o.split(';').filter(s);
      const d = u.shift();
      const p = i(d);
      const v = p.name;
      let m = p.value;
      a = a ? { ...r, ...a } : r;
      try {
        m = a.decodeValues ? decodeURIComponent(m) : m;
      } catch (g) {
        console.error(
          `set-cookie-parser encountered an error while decoding a cookie with value '${m}'. Set options.decodeValues to false to disable this feature.`,
          g
        );
      }
      const f = { name: v, value: m };
      return (
        u.forEach(function (g) {
          const E = g.split('=');
          const _ = E.shift().trimLeft().toLowerCase();
          const x = E.join('=');
          _ === 'expires'
            ? (f.expires = new Date(x))
            : _ === 'max-age'
              ? (f.maxAge = parseInt(x, 10))
              : _ === 'secure'
                ? (f.secure = !0)
                : _ === 'httponly'
                  ? (f.httpOnly = !0)
                  : _ === 'samesite'
                    ? (f.sameSite = x)
                    : (f[_] = x);
        }),
        f
      );
    }
    function i(o) {
      let a = '';
      let u = '';
      const d = o.split('=');
      return (
        d.length > 1 ? ((a = d.shift()), (u = d.join('='))) : (u = o),
        { name: a, value: u }
      );
    }
    function c(o, a) {
      if (((a = a ? { ...r, ...a } : r), !o)) return a.map ? {} : [];
      if (o.headers)
        if (typeof o.headers.getSetCookie === 'function')
          o = o.headers.getSetCookie();
        else if (o.headers['set-cookie']) o = o.headers['set-cookie'];
        else {
          const u =
            o.headers[
              Object.keys(o.headers).find(function (p) {
                return p.toLowerCase() === 'set-cookie';
              })
            ];
          !u &&
            o.headers.cookie &&
            !a.silent &&
            console.warn(
              'Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.'
            ),
            (o = u);
        }
      if (
        (Array.isArray(o) || (o = [o]), (a = a ? { ...r, ...a } : r), a.map)
      ) {
        const d = {};
        return o.filter(s).reduce(function (p, v) {
          const m = n(v, a);
          return (p[m.name] = m), p;
        }, d);
      }
      return o.filter(s).map(function (p) {
        return n(p, a);
      });
    }
    function l(o) {
      if (Array.isArray(o)) return o;
      if (typeof o !== 'string') return [];
      const a = [];
      let u = 0;
      let d;
      let p;
      let v;
      let m;
      let f;
      function g() {
        for (; u < o.length && /\s/.test(o.charAt(u)); ) u += 1;
        return u < o.length;
      }
      function E() {
        return (p = o.charAt(u)), p !== '=' && p !== ';' && p !== ',';
      }
      for (; u < o.length; ) {
        for (d = u, f = !1; g(); )
          if (((p = o.charAt(u)), p === ',')) {
            for (v = u, u += 1, g(), m = u; u < o.length && E(); ) u += 1;
            u < o.length && o.charAt(u) === '='
              ? ((f = !0), (u = m), a.push(o.substring(d, v)), (d = u))
              : (u = v + 1);
          } else u += 1;
        (!f || u >= o.length) && a.push(o.substring(d, o.length));
      }
      return a;
    }
    (t.exports = c),
      (t.exports.parse = c),
      (t.exports.parseString = n),
      (t.exports.splitCookiesString = l);
  },
});
const Xs = Gs(Ws());
const Js = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function K(e) {
  if (Js.test(e) || e.trim() === '')
    throw new TypeError('Invalid character in header field name');
  return e.trim().toLowerCase();
}
const et = [
  String.fromCharCode(10),
  String.fromCharCode(13),
  String.fromCharCode(9),
  String.fromCharCode(32),
];
const Ys = new RegExp(`(^[${et.join('')}]|$[${et.join('')}])`, 'g');
function _e(e) {
  return e.replace(Ys, '');
}
function Z(e) {
  if (typeof e !== 'string' || e.length === 0) return !1;
  for (let t = 0; t < e.length; t++) {
    const r = e.charCodeAt(t);
    if (r > 127 || !zs(r)) return !1;
  }
  return !0;
}
function zs(e) {
  return ![
    127,
    32,
    '(',
    ')',
    '<',
    '>',
    '@',
    ',',
    ';',
    ':',
    '\\',
    '"',
    '/',
    '[',
    ']',
    '?',
    '=',
    '{',
    '}',
  ].includes(e);
}
function tt(e) {
  if (typeof e !== 'string' || e.trim() !== e) return !1;
  for (let t = 0; t < e.length; t++) {
    const r = e.charCodeAt(t);
    if (r === 0 || r === 10 || r === 13) return !1;
  }
  return !0;
}
const F = Symbol('normalizedHeaders');
const we = Symbol('rawHeaderNames');
const rt = ', ';
let nt;
let st;
const Qs = class er {
  constructor(t) {
    (this[nt] = {}),
      (this[st] = new Map()),
      ['Headers', 'HeadersPolyfill'].includes(
        t == null ? void 0 : t.constructor.name
      ) ||
      t instanceof er ||
      (typeof globalThis.Headers < 'u' && t instanceof globalThis.Headers)
        ? t.forEach((s, n) => {
            this.append(n, s);
          }, this)
        : Array.isArray(t)
          ? t.forEach(([r, s]) => {
              this.append(r, Array.isArray(s) ? s.join(rt) : s);
            })
          : t &&
            Object.getOwnPropertyNames(t).forEach((r) => {
              const s = t[r];
              this.append(r, Array.isArray(s) ? s.join(rt) : s);
            });
  }

  [((nt = F), (st = we), Symbol.iterator)]() {
    return this.entries();
  }

  *keys() {
    for (const [t] of this.entries()) yield t;
  }

  *values() {
    for (const [, t] of this.entries()) yield t;
  }

  *entries() {
    const t = Object.keys(this[F]).sort((r, s) => r.localeCompare(s));
    for (const r of t)
      if (r === 'set-cookie') for (const s of this.getSetCookie()) yield [r, s];
      else yield [r, this.get(r)];
  }

  has(t) {
    if (!Z(t)) throw new TypeError(`Invalid header name "${t}"`);
    return this[F].hasOwnProperty(K(t));
  }

  get(t) {
    if (!Z(t)) throw TypeError(`Invalid header name "${t}"`);
    return this[F][K(t)] ?? null;
  }

  set(t, r) {
    if (!Z(t) || !tt(r)) return;
    const s = K(t);
    const n = _e(r);
    (this[F][s] = _e(n)), this[we].set(s, t);
  }

  append(t, r) {
    if (!Z(t) || !tt(r)) return;
    const s = K(t);
    const n = _e(r);
    const i = this.has(s) ? `${this.get(s)}, ${n}` : n;
    this.set(t, i);
  }

  delete(t) {
    if (!Z(t) || !this.has(t)) return;
    const r = K(t);
    delete this[F][r], this[we].delete(r);
  }

  forEach(t, r) {
    for (const [s, n] of this.entries()) t.call(r, n, s, this);
  }

  getSetCookie() {
    const t = this.get('set-cookie');
    return t === null ? [] : t === '' ? [''] : (0, Xs.splitCookiesString)(t);
  }
};
function Ks(e) {
  return e
    .trim()
    .split(/[\r\n]+/)
    .reduce((r, s) => {
      if (s.trim() === '') return r;
      const n = s.split(': ');
      const i = n.shift();
      const c = n.join(': ');
      return r.append(i, c), r;
    }, new Qs());
}
function Zs(e) {
  let t;
  let r;
  const s = Ks(e);
  const n = s.get('content-type') || 'text/plain';
  const i = s.get('content-disposition');
  if (!i) throw new Error('"Content-Disposition" header is required.');
  const c = i.split(';').reduce((a, u) => {
    const [d, ...p] = u.trim().split('=');
    return (a[d] = p.join('=')), a;
  }, {});
  const l = (t = c.name) == null ? void 0 : t.slice(1, -1);
  const o = (r = c.filename) == null ? void 0 : r.slice(1, -1);
  return { name: l, filename: o, contentType: n };
}
function ei(e, t) {
  const r = t == null ? void 0 : t.get('content-type');
  if (!r) return;
  const [, ...s] = r.split(/; */);
  const n = s
    .filter((o) => o.startsWith('boundary='))
    .map((o) => o.replace(/^boundary=/, ''))[0];
  if (!n) return;
  const i = new RegExp(`--+${n}`);
  const c = e
    .split(i)
    .filter(
      (o) =>
        o.startsWith(`\r
`) &&
        o.endsWith(`\r
`)
    )
    .map((o) => o.trimStart().replace(/\r\n$/, ''));
  if (!c.length) return;
  const l = {};
  try {
    for (const o of c) {
      const [a, ...u] = o.split(`\r
\r
`);
      const d = u.join(`\r
\r
`);
      const { contentType: p, filename: v, name: m } = Zs(a);
      const f = v === void 0 ? d : new File([d], v, { type: p });
      const g = l[m];
      g === void 0
        ? (l[m] = f)
        : Array.isArray(g)
          ? (l[m] = [...g, f])
          : (l[m] = [g, f]);
    }
    return l;
  } catch {}
}
const it = Object.getOwnPropertySymbols;
const ti = Object.prototype.hasOwnProperty;
const ri = Object.prototype.propertyIsEnumerable;
const ni = (e, t) => {
  const r = {};
  for (var s in e) ti.call(e, s) && t.indexOf(s) < 0 && (r[s] = e[s]);
  if (e != null && it)
    for (var s of it(e)) t.indexOf(s) < 0 && ri.call(e, s) && (r[s] = e[s]);
  return r;
};
const tr = (e, t, r) =>
  new Promise((s, n) => {
    const i = (o) => {
      try {
        l(r.next(o));
      } catch (a) {
        n(a);
      }
    };
    const c = (o) => {
      try {
        l(r.throw(o));
      } catch (a) {
        n(a);
      }
    };
    var l = (o) => (o.done ? s(o.value) : Promise.resolve(o.value).then(i, c));
    l((r = r.apply(e, t)).next());
  });
function rr(e) {
  let t;
  const r = e.definitions.find((s) => s.kind === 'OperationDefinition');
  return {
    operationType: r == null ? void 0 : r.operation,
    operationName: (t = r == null ? void 0 : r.name) == null ? void 0 : t.value,
  };
}
function si(e) {
  try {
    const t = qs(e);
    return rr(t);
  } catch (t) {
    return t;
  }
}
function ii(e, t, r) {
  const s = { variables: e };
  for (const [n, i] of Object.entries(t)) {
    if (!(n in r)) throw new Error(`Given files do not have a key '${n}' .`);
    for (const c of i) {
      const [l, ...o] = c.split('.').reverse();
      const a = o.reverse();
      let u = s;
      for (const d of a) {
        if (!(d in u)) throw new Error(`Property '${a}' is not in operations.`);
        u = u[d];
      }
      u[l] = r[n];
    }
  }
  return s.variables;
}
function oi(e) {
  return tr(this, null, function* () {
    let t;
    switch (e.method) {
      case 'GET': {
        const r = new URL(e.url);
        const s = r.searchParams.get('query');
        const n = r.searchParams.get('variables') || '';
        return { query: s, variables: Ee(n) };
      }
      case 'POST': {
        const r = e.clone();
        if (
          (t = e.headers.get('content-type')) != null &&
          t.includes('multipart/form-data')
        ) {
          const n = ei(yield r.text(), e.headers);
          if (!n) return null;
          const i = n;
          const { operations: c, map: l } = i;
          const o = ni(i, ['operations', 'map']);
          const a = Ee(c) || {};
          if (!a.query) return null;
          const u = Ee(l || '') || {};
          const d = a.variables ? ii(a.variables, u, o) : {};
          return { query: a.query, variables: d };
        }
        const s = yield r.json().catch(() => null);
        if (s != null && s.query) {
          const { query: n, variables: i } = s;
          return { query: n, variables: i };
        }
      }
      default:
        return null;
    }
  });
}
function nr(e) {
  return tr(this, null, function* () {
    const t = yield oi(e);
    if (!t || !t.query) return;
    const { query: r, variables: s } = t;
    const n = si(r);
    if (n instanceof Error) {
      const i = re(e);
      throw new Error(
        b.formatMessage(
          `Failed to intercept a GraphQL request to "%s %s": cannot parse query. See the error message from the parser below.

%s`,
          e.method,
          i,
          n.message
        )
      );
    }
    return {
      query: t.query,
      operationType: n.operationType,
      operationName: n.operationName,
      variables: s,
    };
  });
}
const ot = (e, t, r) =>
  new Promise((s, n) => {
    const i = (o) => {
      try {
        l(r.next(o));
      } catch (a) {
        n(a);
      }
    };
    const c = (o) => {
      try {
        l(r.throw(o));
      } catch (a) {
        n(a);
      }
    };
    var l = (o) => (o.done ? s(o.value) : Promise.resolve(o.value).then(i, c));
    l((r = r.apply(e, t)).next());
  });
function ai(e) {
  return e == null
    ? !1
    : typeof e === 'object' && 'kind' in e && 'definitions' in e;
}
class ci extends _t {
  constructor(t, r, s, n, i) {
    let c = r;
    if (ai(r)) {
      const o = rr(r);
      if (o.operationType !== t)
        throw new Error(
          `Failed to create a GraphQL handler: provided a DocumentNode with a mismatched operation type (expected "${t}", but got "${o.operationType}").`
        );
      if (!o.operationName)
        throw new Error(
          'Failed to create a GraphQL handler: provided a DocumentNode with no operation name.'
        );
      c = o.operationName;
    }
    const l =
      t === 'all'
        ? `${t} (origin: ${s.toString()})`
        : `${t} ${c} (origin: ${s.toString()})`;
    super({
      info: { header: l, operationType: t, operationName: c },
      resolver: n,
      options: i,
    }),
      (this.endpoint = s);
  }

  parse(t) {
    return ot(this, null, function* () {
      const r = Dt(new URL(t.request.url), this.endpoint);
      if (!r.matches) return { match: r };
      const s = yield nr(t.request).catch((n) => {
        console.error(n);
      });
      return typeof s > 'u'
        ? { match: r }
        : {
            match: r,
            query: s.query,
            operationType: s.operationType,
            operationName: s.operationName,
            variables: s.variables,
          };
    });
  }

  predicate(t) {
    if (t.parsedResult.operationType === void 0) return !1;
    if (!t.parsedResult.operationName && this.info.operationType !== 'all') {
      const n = re(t.request);
      return (
        b.warn(`Failed to intercept a GraphQL request at "${t.request.method} ${n}": anonymous GraphQL operations are not supported.

Consider naming this operation or using "graphql.operation()" request handler to intercept GraphQL requests regardless of their operation name/type. Read more: https://mswjs.io/docs/api/graphql/#graphqloperationresolver`),
        !1
      );
    }
    const r =
      this.info.operationType === 'all' ||
      t.parsedResult.operationType === this.info.operationType;
    const s =
      this.info.operationName instanceof RegExp
        ? this.info.operationName.test(t.parsedResult.operationName || '')
        : t.parsedResult.operationName === this.info.operationName;
    return t.parsedResult.match.matches && r && s;
  }

  extendResolverArgs(t) {
    const r = Ft(t.request);
    return {
      query: t.parsedResult.query || '',
      operationName: t.parsedResult.operationName || '',
      variables: t.parsedResult.variables || {},
      cookies: r,
    };
  }

  log(t) {
    return ot(this, null, function* () {
      const r = yield xt(t.request);
      const s = yield It(t.response);
      const n = bt(s.status);
      const i = t.parsedResult.operationName
        ? `${t.parsedResult.operationType} ${t.parsedResult.operationName}`
        : `anonymous ${t.parsedResult.operationType}`;
      console.groupCollapsed(
        b.formatMessage(`${Tt()} ${i} (%c${s.status} ${s.statusText}%c)`),
        `color:${n}`,
        'color:inherit'
      ),
        console.log('Request:', r),
        console.log('Handler:', this),
        console.log('Response:', s),
        console.groupEnd();
    });
  }
}
const j = async (e) => {
  try {
    return {
      error: null,
      data: await e().catch((r) => {
        throw r;
      }),
    };
  } catch (t) {
    return { error: t, data: null };
  }
};
const li = (e, t, r) =>
  new Promise((s, n) => {
    const i = (o) => {
      try {
        l(r.next(o));
      } catch (a) {
        n(a);
      }
    };
    const c = (o) => {
      try {
        l(r.throw(o));
      } catch (a) {
        n(a);
      }
    };
    var l = (o) => (o.done ? s(o.value) : Promise.resolve(o.value).then(i, c));
    l((r = r.apply(e, t)).next());
  });
const ui = (e, t, r) =>
  li(void 0, null, function* () {
    let s = null;
    let n = null;
    for (const i of t)
      if (
        ((n = yield i.run({ request: e, resolutionContext: r })),
        n !== null && (s = i),
        n != null && n.response)
      )
        break;
    return s
      ? {
          handler: s,
          parsedResult: n == null ? void 0 : n.parsedResult,
          response: n == null ? void 0 : n.response,
        }
      : null;
  });
const pi = Object.create;
const sr = Object.defineProperty;
const hi = Object.getOwnPropertyDescriptor;
const ir = Object.getOwnPropertyNames;
const di = Object.getPrototypeOf;
const fi = Object.prototype.hasOwnProperty;
const mi = (e, t) =>
  function () {
    return t || (0, e[ir(e)[0]])((t = { exports: {} }).exports, t), t.exports;
  };
const vi = (e, t, r, s) => {
  if ((t && typeof t === 'object') || typeof t === 'function')
    for (const n of ir(t))
      !fi.call(e, n) &&
        n !== r &&
        sr(e, n, {
          get: () => t[n],
          enumerable: !(s = hi(t, n)) || s.enumerable,
        });
  return e;
};
const gi = (e, t, r) => (
  (r = e != null ? pi(di(e)) : {}),
  vi(
    t || !e || !e.__esModule
      ? sr(r, 'default', { value: e, enumerable: !0 })
      : r,
    e
  )
);
const yi = mi({
  'node_modules/js-levenshtein/index.js': function (e, t) {
    t.exports = (function () {
      function r(s, n, i, c, l) {
        return s < n || i < n ? (s > i ? i + 1 : s + 1) : c === l ? n : n + 1;
      }
      return function (s, n) {
        if (s === n) return 0;
        if (s.length > n.length) {
          const i = s;
          (s = n), (n = i);
        }
        for (
          var c = s.length, l = n.length;
          c > 0 && s.charCodeAt(c - 1) === n.charCodeAt(l - 1);

        )
          c--, l--;
        for (var o = 0; o < c && s.charCodeAt(o) === n.charCodeAt(o); ) o++;
        if (((c -= o), (l -= o), c === 0 || l < 3)) return l;
        let a = 0;
        let u;
        let d;
        let p;
        let v;
        let m;
        let f;
        let g;
        let E;
        let _;
        let x;
        let w;
        let I;
        const T = [];
        for (u = 0; u < c; u++) T.push(u + 1), T.push(s.charCodeAt(o + u));
        for (var A = T.length - 1; a < l - 3; )
          for (
            _ = n.charCodeAt(o + (d = a)),
              x = n.charCodeAt(o + (p = a + 1)),
              w = n.charCodeAt(o + (v = a + 2)),
              I = n.charCodeAt(o + (m = a + 3)),
              f = a += 4,
              u = 0;
            u < A;
            u += 2
          )
            (g = T[u]),
              (E = T[u + 1]),
              (d = r(g, d, p, _, E)),
              (p = r(d, p, v, x, E)),
              (v = r(p, v, m, w, E)),
              (f = r(v, m, f, I, E)),
              (T[u] = f),
              (m = v),
              (v = p),
              (p = d),
              (d = g);
        for (; a < l; )
          for (_ = n.charCodeAt(o + (d = a)), f = ++a, u = 0; u < A; u += 2)
            (g = T[u]), (T[u] = f = r(g, d, f, _, T[u + 1])), (d = g);
        return f;
      };
    })();
  },
});
const Ei = gi(yi(), 1);
const _i = Ei.default;
const wi = (e, t, r) =>
  new Promise((s, n) => {
    const i = (o) => {
      try {
        l(r.next(o));
      } catch (a) {
        n(a);
      }
    };
    const c = (o) => {
      try {
        l(r.throw(o));
      } catch (a) {
        n(a);
      }
    };
    var l = (o) => (o.done ? s(o.value) : Promise.resolve(o.value).then(i, c));
    l((r = r.apply(e, t)).next());
  });
const or = _i;
const bi = 3;
const Ti = 4;
const ar = 0.5;
function xi(e) {
  return e.reduce(
    (t, r) => (
      r instanceof Ut && t.http.push(r), r instanceof ci && t.graphql.push(r), t
    ),
    { http: [], graphql: [] }
  );
}
function Oi() {
  return (e, t) => {
    const { path: r, method: s } = t.info;
    if (r instanceof RegExp || s instanceof RegExp) return 1 / 0;
    const i = wt(e.method, s) ? ar : 0;
    const c = re(e);
    return or(c, r) - i;
  };
}
function Si(e) {
  return (t, r) => {
    if (typeof e.operationName > 'u') return 1 / 0;
    const { operationType: s, operationName: n } = r.info;
    if (typeof n !== 'string') return 1 / 0;
    const c = e.operationType === s ? ar : 0;
    return or(e.operationName, n) - c;
  };
}
function Ri(e, t, r) {
  return t
    .reduce((n, i) => {
      const c = r(e, i);
      return n.concat([[c, i]]);
    }, [])
    .sort(([n], [i]) => n - i)
    .filter(([n]) => n <= bi)
    .slice(0, Ti)
    .map(([, n]) => n);
}
function Ni(e) {
  return e.length > 1
    ? `Did you mean to request one of the following resources instead?

${e.map((t) => `  • ${t.info.header}`).join(`
`)}`
    : `Did you mean to request "${e[0].info.header}" instead?`;
}
function Ii(e, t, r = 'warn') {
  return wi(this, null, function* () {
    const s = yield nr(e).catch(() => null);
    const n = re(e);
    function i() {
      const a = xi(t);
      const u = s ? a.graphql : a.http;
      const d = Ri(e, u, s ? Si(s) : Oi());
      return d.length > 0 ? Ni(d) : '';
    }
    function c(a) {
      return a != null && a.operationName
        ? `${a.operationType} ${a.operationName} (${e.method} ${n})`
        : `anonymous ${a == null ? void 0 : a.operationType} (${
            e.method
          } ${n})`;
    }
    function l() {
      const a = s ? c(s) : `${e.method} ${n}`;
      const u = i();
      return [
        'intercepted a request without a matching request handler:',
        `  • ${a}`,
        u,
        `If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/getting-started/mocks`,
      ].filter(Boolean).join(`

`);
    }
    function o(a) {
      const u = l();
      switch (a) {
        case 'error':
          throw (
            (b.error('Error: %s', u),
            new Error(
              b.formatMessage(
                'Cannot bypass a request when using the "error" strategy for the "onUnhandledRequest" option.'
              )
            ))
          );
        case 'warn': {
          b.warn('Warning: %s', u);
          break;
        }
        case 'bypass':
          break;
        default:
          throw new Error(
            b.formatMessage(
              'Failed to react to an unhandled request: unknown strategy "%s". Please provide one of the supported strategies ("bypass", "warn", "error") or a custom callback function as the value of the "onUnhandledRequest" option.',
              a
            )
          );
      }
    }
    if (typeof r === 'function') {
      r(e, { warning: o.bind(null, 'warn'), error: o.bind(null, 'error') });
      return;
    }
    o(r);
  });
}
const Ai = Object.defineProperty;
const Pi = Object.defineProperties;
const ki = Object.getOwnPropertyDescriptors;
const at = Object.getOwnPropertySymbols;
const Ci = Object.prototype.hasOwnProperty;
const Li = Object.prototype.propertyIsEnumerable;
const ct = (e, t, r) =>
  t in e
    ? Ai(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
    : (e[t] = r);
const Di = (e, t) => {
  for (var r in t || (t = {})) Ci.call(t, r) && ct(e, r, t[r]);
  if (at) for (var r of at(t)) Li.call(t, r) && ct(e, r, t[r]);
  return e;
};
const Mi = (e, t) => Pi(e, ki(t));
function qi(e, t) {
  le.add(Mi(Di({}, e), { url: e.url.toString() }), t), le.persist();
}
const $i = (e, t, r) =>
  new Promise((s, n) => {
    const i = (o) => {
      try {
        l(r.next(o));
      } catch (a) {
        n(a);
      }
    };
    const c = (o) => {
      try {
        l(r.throw(o));
      } catch (a) {
        n(a);
      }
    };
    var l = (o) => (o.done ? s(o.value) : Promise.resolve(o.value).then(i, c));
    l((r = r.apply(e, t)).next());
  });
function cr(e, t, r, s, n, i) {
  return $i(this, null, function* () {
    let c;
    let l;
    let o;
    let a;
    let u;
    let d;
    if (
      (n.emit('request:start', { request: e, requestId: t }),
      e.headers.get('x-msw-intention') === 'bypass')
    ) {
      n.emit('request:end', { request: e, requestId: t }),
        (c = i == null ? void 0 : i.onPassthroughResponse) == null ||
          c.call(i, e);
      return;
    }
    const p = yield j(() => ui(e, r, i == null ? void 0 : i.resolutionContext));
    if (p.error)
      throw (
        (n.emit('unhandledException', {
          error: p.error,
          request: e,
          requestId: t,
        }),
        p.error)
      );
    if (!p.data) {
      yield Ii(e, r, s.onUnhandledRequest),
        n.emit('request:unhandled', { request: e, requestId: t }),
        n.emit('request:end', { request: e, requestId: t }),
        (l = i == null ? void 0 : i.onPassthroughResponse) == null ||
          l.call(i, e);
      return;
    }
    const { response: v } = p.data;
    if (!v) {
      n.emit('request:end', { request: e, requestId: t }),
        (o = i == null ? void 0 : i.onPassthroughResponse) == null ||
          o.call(i, e);
      return;
    }
    if (
      v.status === 302 &&
      v.headers.get('x-msw-intention') === 'passthrough'
    ) {
      n.emit('request:end', { request: e, requestId: t }),
        (a = i == null ? void 0 : i.onPassthroughResponse) == null ||
          a.call(i, e);
      return;
    }
    qi(e, v), n.emit('request:match', { request: e, requestId: t });
    const m = p.data;
    const f =
      ((u = i == null ? void 0 : i.transformResponse) == null
        ? void 0
        : u.call(i, v)) || v;
    return (
      (d = i == null ? void 0 : i.onMockedResponse) == null || d.call(i, f, m),
      n.emit('request:end', { request: e, requestId: t }),
      f
    );
  });
}
const ji = Object.defineProperty;
const Fi = Object.defineProperties;
const Ui = Object.getOwnPropertyDescriptors;
const lt = Object.getOwnPropertySymbols;
const Bi = Object.prototype.hasOwnProperty;
const Hi = Object.prototype.propertyIsEnumerable;
const ut = (e, t, r) =>
  t in e
    ? ji(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
    : (e[t] = r);
const Vi = (e, t) => {
  for (var r in t || (t = {})) Bi.call(t, r) && ut(e, r, t[r]);
  if (lt) for (var r of lt(t)) Hi.call(t, r) && ut(e, r, t[r]);
  return e;
};
const Gi = (e, t) => Fi(e, Ui(t));
const { message: Wi } = Nt;
function U(e = {}) {
  const t = (e == null ? void 0 : e.status) || 200;
  const r = (e == null ? void 0 : e.statusText) || Wi[t] || '';
  const s = new Headers(e == null ? void 0 : e.headers);
  return Gi(Vi({}, e), { headers: s, status: t, statusText: r });
}
function Xi(e, t) {
  let r;
  if (
    (t.type &&
      Object.defineProperty(e, 'type', {
        value: t.type,
        enumerable: !0,
        writable: !1,
      }),
    typeof document < 'u')
  ) {
    const s =
      ((r = t.headers.get('Set-Cookie')) == null ? void 0 : r.split(',')) || [];
    for (const n of s) document.cookie = n;
  }
  return e;
}
class q extends Response {
  constructor(t, r) {
    const s = U(r);
    super(t, s), Xi(this, s);
  }

  static text(t, r) {
    const s = U(r);
    return (
      s.headers.has('Content-Type') ||
        s.headers.set('Content-Type', 'text/plain'),
      new q(t, s)
    );
  }

  static json(t, r) {
    const s = U(r);
    return (
      s.headers.has('Content-Type') ||
        s.headers.set('Content-Type', 'application/json'),
      new q(JSON.stringify(t), s)
    );
  }

  static xml(t, r) {
    const s = U(r);
    return (
      s.headers.has('Content-Type') ||
        s.headers.set('Content-Type', 'text/xml'),
      new q(t, s)
    );
  }

  static arrayBuffer(t, r) {
    const s = U(r);
    return (
      t && s.headers.set('Content-Length', t.byteLength.toString()), new q(t, s)
    );
  }

  static formData(t, r) {
    return new q(t, U(r));
  }
}
kr();
const Ji = [
  os.get('/', () =>
    q.json([
      {
        id: 1,
        introduce:
          '오늘 내가 만든 프로그램이 누군가에게 도움을 줄 수 있다는 사실에서 동기를 얻습니다. 아이디어가 제 손을 통해 현실화되고, 그렇게 현실화된 프로덕트를 통해 사용자가 해피모먼트를 경험하는 것을 보면 보람을 느낍니다.',
        work: [
          {
            name: '텔루스 인터네셔널',
            introduce:
              '텔루스 인터내셔널 에이아이코리아는 기업의 인공지능 학습 모델을 평가하고 개선하는 일을 돕고 있습니다.',
            engname: 'TELUS',
            id: 1e3,
            href: 'https://www.telusinternational.com/',
            startdate: '2022.08',
            enddate: '2023.11',
            method: 'GET',
            position: 'Frontend Developer',
            detail: [
              {
                id: 10001,
                role: 'Frontend Developer',
                explain:
                  '기존에 JSP로 만들어진 사내 작업등록 페이지를 React로 신규 개발하는 업무를 수행했습니다. 신규로 개발하며 반응형 웹 및 기존에 있었던 input 관련 불편한 점을 해소하여 사용자 경험 향상에 기여했습니다.',
              },
              {
                id: 10002,
                role: 'JavaScript Developer',
                explain:
                  '사내 node.js 런타임 환경에서 es6 문법을 일부 지원함에 따라 이전 JavaScript ES5 문법으로 작성된 코드를 ES6으로 업데이트하는 업무를 수행했습니다. 변수 호이스팅으로 인한 사이드 이펙트를 해결하여 코드 관련 이슈 발생 빈도를 15% 감소시킨 경험이 있습니다.',
              },
              {
                id: 10003,
                role: 'JavaScript Developer',
                explain:
                  'Bixby 팀의 Web SDK 신규 개발 프로젝트에 투입되어 개발을 일부 진행했습니다. 코드 분석 및 일부 구현 단계에서 퇴사하게 되었습니다.',
              },
            ],
          },
          {
            name: '지인시스템',
            introduce:
              '지인시스템은 공공, 국방, 민간 분야 시스템 통합(SI) 전문업체로서 기업의 요구사항에 맞게 제품을 개발하고 있습니다.',
            engname: 'JIIN',
            id: 2e3,
            href: 'http://www.ji-in.co.kr/',
            startdate: '2019.01',
            enddate: '2022.03',
            method: 'GET',
            position: 'Web Developer',
            detail: [
              {
                id: 20001,
                role: 'Web Developer',
                explain:
                  '국가 위기관리 및 전시전환절차 연습인 을지훈련을 체계적으로 할 수 있는 상황도를 만들었습니다. 주니어 개발자와 협업하여 프로젝트를 진행하였습니다. 주로 맡았던 부분은 서버와의 소켓/ajax 통신과, 서버로부터 전달받은 좌표를 계산해서 상황도에 도시하는 역할을 담당했습니다.',
              },
              {
                id: 20003,
                role: '형상관리 도구로 Git 신규 도입',
                explain:
                  '기존에 svn을 사용하며 충돌이 자주 발생하는 문제점을 해결하기 위해 팀 내 형상관리 도구를 Git으로 마이그레이션하여 충돌 빈도를 줄이고, 더 나은 작업 환경을 구축했습니다.',
              },
            ],
          },
        ],
        project: [
          {
            name: 'Clone.op.gg',
            introduce:
              'Riot API를 활용해 리그 오브 레전드(롤) 게임에 대한 사용자의 전적 검색이 가능한 서비스입니다.',
            href: 'https://github.com/Jaesin22/clone_op_gg',
            demoUrl:
              'http://clone.op.gg.s3-website.ap-northeast-2.amazonaws.com/',
            engname: 'OPGG',
            method: 'GET',
            id: 3e3,
            detail: [
              {
                id: 30001,
                postDate: '2023.9.12',
                postTitle: 'op.gg 클론 코딩 프로젝트 - 성능 개선(1)',
                postCategory: 'Project/op.gg 클론하기',
                postLink: 'https://webdiv-diary.tistory.com/24',
              },
              {
                id: 30002,
                postDate: '2023.9.13',
                postTitle:
                  'op.gg 클론 코딩 프로젝트 - 즐겨찾기, 최근 검색 기능 구현',
                postCategory: 'Project/op.gg 클론하기',
                postLink: 'https://webdiv-diary.tistory.com/25',
              },
            ],
          },
          {
            name: 'Banner Maker',
            introduce: `곽철용 짤 생성기 개발 과정에 대한 읽은 뒤, 어느 순간 문득 프로젝트 생각이 나서 직접 만들어보게 되었습니다.
            
단순히 정해져 있는 짤(사진)에만 국한된 것이 아닌 내가 직접 사진을 올려서 만들어 볼 수 있게끔 하면 더 좋을 것 같다는 생각이 들어 좀 더 찾아본 결과, 
이미 godori라는 분이 만들어놓으신 Banner Maker 프로젝트가 있었습니다.

이걸 직접 비슷하게 만들어봐도 좋겠다 라는 생각이 들어 직접 만들게 되었습니다.`,
            href: 'https://github.com/Jaesin22/jjalmaker',
            demoUrl: 'https://jaesin22.github.io/jjalmaker/',
            engname: 'Banner Maker',
            method: 'GET',
            id: 4e3,
            detail: [],
          },
        ],
        side_project: [
          {
            name: 'Banner Maker',
            introduce:
              'Riot API를 활용해 리그 오브 레전드(롤) 게임에 대한 사용자의 전적 검색이 가능한 서비스입니다.',
            href: 'http://clone.op.gg.s3-website.ap-northeast-2.amazonaws.com/',
            engname: 'OPGG',
            method: 'GET',
            id: 3e3,
            position: 'Frontend Chapter Lead',
            detail: [
              {
                id: 30001,
                postDate: '2018-11-11',
                postTitle: 'testtttt1',
                postCategory: '프로그래밍/머신러닝',
                postLink: 'www.naver.com',
              },
              {
                id: 30002,
                postDate: '2018-11-11',
                postTitle: 'testtttt2',
                postCategory: '프로그래밍/머신러닝',
                postLink: 'www.naver.com',
              },
            ],
          },
        ],
      },
    ])
  ),
];
function Yi(e) {
  return {
    status: e.status,
    statusText: e.statusText,
    headers: Object.fromEntries(e.headers.entries()),
  };
}
function pt(e) {
  return e != null && typeof e === 'object' && !Array.isArray(e);
}
function lr(e, t) {
  return Object.entries(t).reduce(
    (r, [s, n]) => {
      const i = r[s];
      return Array.isArray(i) && Array.isArray(n)
        ? ((r[s] = i.concat(n)), r)
        : pt(i) && pt(n)
          ? ((r[s] = lr(i, n)), r)
          : ((r[s] = n), r);
    },
    { ...e }
  );
}
function zi() {
  const e = (t, r) => {
    (e.state = 'pending'),
      (e.resolve = (s) => {
        if (e.state !== 'pending') return;
        e.result = s;
        const n = (i) => ((e.state = 'fulfilled'), i);
        return t(s instanceof Promise ? s : Promise.resolve(s).then(n));
      }),
      (e.reject = (s) => {
        if (e.state === 'pending')
          return (
            queueMicrotask(() => {
              e.state = 'rejected';
            }),
            r((e.rejectionReason = s))
          );
      });
  };
  return e;
}
let L;
let X;
let ae;
let yt;
const ur =
  ((yt = class extends Promise {
    constructor(t = null) {
      const r = zi();
      super((s, n) => {
        r(s, n), t == null || t(r.resolve, r.reject);
      });
      ve(this, X);
      ve(this, L, void 0);
      M(this, 'resolve');
      M(this, 'reject');
      De(this, L, r),
        (this.resolve = z(this, L).resolve),
        (this.reject = z(this, L).reject);
    }

    get state() {
      return z(this, L).state;
    }

    get rejectionReason() {
      return z(this, L).rejectionReason;
    }

    then(t, r) {
      return ne(this, X, ae).call(this, super.then(t, r));
    }

    catch(t) {
      return ne(this, X, ae).call(this, super.catch(t));
    }

    finally(t) {
      return ne(this, X, ae).call(this, super.finally(t));
    }
  }),
  (L = new WeakMap()),
  (X = new WeakSet()),
  (ae = function (t) {
    return Object.defineProperties(t, {
      resolve: { configurable: !0, value: this.resolve },
      reject: { configurable: !0, value: this.reject },
    });
  }),
  yt);
function pr() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (e) {
    const t = (Math.random() * 16) | 0;
    return (e == 'x' ? t : (t & 3) | 8).toString(16);
  });
}
const Qi = class {
  constructor(e) {
    (this.request = e), (this.responsePromise = new ur());
  }

  respondWith(e) {
    N(
      this.responsePromise.state === 'pending',
      'Failed to respond to "%s %s" request: the "request" event has already been responded to.',
      this.request.method,
      this.request.url
    ),
      this.responsePromise.resolve(e);
  }
};
function hr(e) {
  const t = new Qi(e);
  return (
    Reflect.set(e, 'respondWith', t.respondWith.bind(t)),
    { interactiveRequest: e, requestController: t }
  );
}
async function dr(e, t, ...r) {
  const s = e.listeners(t);
  if (s.length !== 0) for (const n of s) await n.apply(e, r);
}
function Ki(e, t) {
  try {
    return e[t], !0;
  } catch {
    return !1;
  }
}
var fr = class extends Ce {
  constructor() {
    super(fr.symbol);
  }

  checkEnvironment() {
    return typeof globalThis < 'u' && typeof globalThis.fetch < 'u';
  }

  setup() {
    const e = globalThis.fetch;
    N(!e[W], 'Failed to patch the "fetch" module: already patched.'),
      (globalThis.fetch = async (t, r) => {
        let s;
        const n = pr();
        const i = new Request(t, r);
        this.logger.info('[%s] %s', i.method, i.url);
        const { interactiveRequest: c, requestController: l } = hr(i);
        this.logger.info(
          'emitting the "request" event for %d listener(s)...',
          this.emitter.listenerCount('request')
        ),
          this.emitter.once('request', ({ requestId: p }) => {
            p === n &&
              l.responsePromise.state === 'pending' &&
              l.responsePromise.resolve(void 0);
          }),
          this.logger.info('awaiting for the mocked response...');
        const o = c.signal;
        const a = new ur();
        o.addEventListener(
          'abort',
          () => {
            a.reject(o.reason);
          },
          { once: !0 }
        );
        const u = await j(async () => {
          const p = dr(this.emitter, 'request', { request: c, requestId: n });
          await Promise.race([a, p, l.responsePromise]),
            this.logger.info('all request listeners have been resolved!');
          const v = await l.responsePromise;
          return this.logger.info('event.respondWith called with:', v), v;
        });
        if (a.state === 'rejected') return Promise.reject(a.rejectionReason);
        if (u.error) return Promise.reject(ht(u.error));
        const d = u.data;
        if (d && !((s = i.signal) != null && s.aborted)) {
          if (
            (this.logger.info('received mocked response:', d),
            Ki(d, 'type') && d.type === 'error')
          )
            return (
              this.logger.info(
                'received a network error response, rejecting the request promise...'
              ),
              Promise.reject(ht(d))
            );
          const p = d.clone();
          this.emitter.emit('response', {
            response: p,
            isMockedResponse: !0,
            request: c,
            requestId: n,
          });
          const v = new Response(d.body, d);
          return (
            Object.defineProperty(v, 'url', {
              writable: !1,
              enumerable: !0,
              configurable: !1,
              value: i.url,
            }),
            v
          );
        }
        return (
          this.logger.info('no mocked response received!'),
          e(i).then((p) => {
            const v = p.clone();
            return (
              this.logger.info('original fetch performed', v),
              this.emitter.emit('response', {
                response: v,
                isMockedResponse: !1,
                request: c,
                requestId: n,
              }),
              p
            );
          })
        );
      }),
      Object.defineProperty(globalThis.fetch, W, {
        enumerable: !0,
        configurable: !0,
        value: !0,
      }),
      this.subscriptions.push(() => {
        Object.defineProperty(globalThis.fetch, W, { value: void 0 }),
          (globalThis.fetch = e),
          this.logger.info(
            'restored native "globalThis.fetch"!',
            globalThis.fetch.name
          );
      });
  }
};
const mr = fr;
mr.symbol = Symbol('fetch');
function ht(e) {
  return Object.assign(new TypeError('Failed to fetch'), { cause: e });
}
function Zi(e, t) {
  const r = new Uint8Array(e.byteLength + t.byteLength);
  return r.set(e, 0), r.set(t, e.byteLength), r;
}
const vr = class {
  constructor(e, t) {
    (this.AT_TARGET = 0),
      (this.BUBBLING_PHASE = 0),
      (this.CAPTURING_PHASE = 0),
      (this.NONE = 0),
      (this.type = ''),
      (this.srcElement = null),
      (this.currentTarget = null),
      (this.eventPhase = 0),
      (this.isTrusted = !0),
      (this.composed = !1),
      (this.cancelable = !0),
      (this.defaultPrevented = !1),
      (this.bubbles = !0),
      (this.lengthComputable = !0),
      (this.loaded = 0),
      (this.total = 0),
      (this.cancelBubble = !1),
      (this.returnValue = !0),
      (this.type = e),
      (this.target = (t == null ? void 0 : t.target) || null),
      (this.currentTarget = (t == null ? void 0 : t.currentTarget) || null),
      (this.timeStamp = Date.now());
  }

  composedPath() {
    return [];
  }

  initEvent(e, t, r) {
    (this.type = e), (this.bubbles = !!t), (this.cancelable = !!r);
  }

  preventDefault() {
    this.defaultPrevented = !0;
  }

  stopPropagation() {}

  stopImmediatePropagation() {}
};
const eo = class extends vr {
  constructor(e, t) {
    super(e),
      (this.lengthComputable = (t == null ? void 0 : t.lengthComputable) || !1),
      (this.composed = (t == null ? void 0 : t.composed) || !1),
      (this.loaded = (t == null ? void 0 : t.loaded) || 0),
      (this.total = (t == null ? void 0 : t.total) || 0);
  }
};
const to = typeof ProgressEvent < 'u';
function ro(e, t, r) {
  const s = [
    'error',
    'progress',
    'loadstart',
    'loadend',
    'load',
    'timeout',
    'abort',
  ];
  const n = to ? ProgressEvent : eo;
  return s.includes(t)
    ? new n(t, {
        lengthComputable: !0,
        loaded: (r == null ? void 0 : r.loaded) || 0,
        total: (r == null ? void 0 : r.total) || 0,
      })
    : new vr(t, { target: e, currentTarget: e });
}
function gr(e, t) {
  if (!(t in e)) return null;
  if (Object.prototype.hasOwnProperty.call(e, t)) return e;
  const s = Reflect.getPrototypeOf(e);
  return s ? gr(s, t) : null;
}
function dt(e, t) {
  return new Proxy(e, no(t));
}
function no(e) {
  const {
    constructorCall: t,
    methodCall: r,
    getProperty: s,
    setProperty: n,
  } = e;
  const i = {};
  return (
    typeof t < 'u' &&
      (i.construct = function (c, l, o) {
        const a = Reflect.construct.bind(null, c, l, o);
        return t.call(o, l, a);
      }),
    (i.set = function (c, l, o) {
      const a = () => {
        const u = gr(c, l) || c;
        const d = Reflect.getOwnPropertyDescriptor(u, l);
        return typeof (d == null ? void 0 : d.set) < 'u'
          ? (d.set.apply(c, [o]), !0)
          : Reflect.defineProperty(u, l, {
              writable: !0,
              enumerable: !0,
              configurable: !0,
              value: o,
            });
      };
      return typeof n < 'u' ? n.call(c, [l, o], a) : a();
    }),
    (i.get = function (c, l, o) {
      const a = () => c[l];
      const u = typeof s < 'u' ? s.call(c, [l, o], a) : a();
      return typeof u === 'function'
        ? (...d) => {
            const p = u.bind(c, ...d);
            return typeof r < 'u' ? r.call(c, [l, d], p) : p();
          }
        : u;
    }),
    i
  );
}
function so(e) {
  return [
    'application/xhtml+xml',
    'application/xml',
    'image/svg+xml',
    'text/html',
    'text/xml',
  ].some((r) => e.startsWith(r));
}
function io(e) {
  try {
    return JSON.parse(e);
  } catch {
    return null;
  }
}
function oo(e, t) {
  const r = kt(e.status) ? null : t;
  return new Response(r, {
    status: e.status,
    statusText: e.statusText,
    headers: ao(e.getAllResponseHeaders()),
  });
}
function ao(e) {
  const t = new Headers();
  const r = e.split(/[\r\n]+/);
  for (const s of r) {
    if (s.trim() === '') continue;
    const [n, ...i] = s.split(': ');
    const c = i.join(': ');
    t.append(n, c);
  }
  return t;
}
const ft = Symbol('isMockedResponse');
const co = ke();
const lo = class {
  constructor(e, t) {
    (this.initialRequest = e),
      (this.logger = t),
      (this.method = 'GET'),
      (this.url = null),
      (this.events = new Map()),
      (this.requestId = pr()),
      (this.requestHeaders = new Headers()),
      (this.responseBuffer = new Uint8Array()),
      (this.request = dt(e, {
        setProperty: ([r, s], n) => {
          switch (r) {
            case 'ontimeout': {
              const i = r.slice(2);
              return this.request.addEventListener(i, s), n();
            }
            default:
              return n();
          }
        },
        methodCall: ([r, s], n) => {
          let i;
          switch (r) {
            case 'open': {
              const [c, l] = s;
              return (
                typeof l > 'u'
                  ? ((this.method = 'GET'), (this.url = mt(c)))
                  : ((this.method = c), (this.url = mt(l))),
                (this.logger = this.logger.extend(
                  `${this.method} ${this.url.href}`
                )),
                this.logger.info('open', this.method, this.url.href),
                n()
              );
            }
            case 'addEventListener': {
              const [c, l] = s;
              return (
                this.registerEvent(c, l),
                this.logger.info('addEventListener', c, l),
                n()
              );
            }
            case 'setRequestHeader': {
              const [c, l] = s;
              return (
                this.requestHeaders.set(c, l),
                this.logger.info('setRequestHeader', c, l),
                n()
              );
            }
            case 'send': {
              const [c] = s;
              c != null &&
                (this.requestBody = typeof c === 'string' ? mn(c) : c),
                this.request.addEventListener('load', () => {
                  if (typeof this.onResponse < 'u') {
                    const a = oo(this.request, this.request.response);
                    this.onResponse.call(this, {
                      response: a,
                      isMockedResponse: ft in this.request,
                      request: l,
                      requestId: this.requestId,
                    });
                  }
                });
              const l = this.toFetchApiRequest();
              (
                ((i = this.onRequest) == null
                  ? void 0
                  : i.call(this, {
                      request: l,
                      requestId: this.requestId,
                    })) || Promise.resolve()
              ).finally(() => {
                if (this.request.readyState < this.request.LOADING)
                  return (
                    this.logger.info(
                      'request callback settled but request has not been handled (readystate %d), performing as-is...',
                      this.request.readyState
                    ),
                    co &&
                      this.request.setRequestHeader(
                        'X-Request-Id',
                        this.requestId
                      ),
                    n()
                  );
              });
              break;
            }
            default:
              return n();
          }
        },
      }));
  }

  registerEvent(e, t) {
    const s = (this.events.get(e) || []).concat(t);
    this.events.set(e, s), this.logger.info('registered event "%s"', e, t);
  }

  respondWith(e) {
    this.logger.info(
      'responding with a mocked response: %d %s',
      e.status,
      e.statusText
    ),
      B(this.request, ft, !0),
      B(this.request, 'status', e.status),
      B(this.request, 'statusText', e.statusText),
      B(this.request, 'responseURL', this.url.href),
      (this.request.getResponseHeader = new Proxy(
        this.request.getResponseHeader,
        {
          apply: (s, n, i) => {
            if (
              (this.logger.info('getResponseHeader', i[0]),
              this.request.readyState < this.request.HEADERS_RECEIVED)
            )
              return (
                this.logger.info('headers not received yet, returning null'),
                null
              );
            const c = e.headers.get(i[0]);
            return (
              this.logger.info('resolved response header "%s" to', i[0], c), c
            );
          },
        }
      )),
      (this.request.getAllResponseHeaders = new Proxy(
        this.request.getAllResponseHeaders,
        {
          apply: () => {
            if (
              (this.logger.info('getAllResponseHeaders'),
              this.request.readyState < this.request.HEADERS_RECEIVED)
            )
              return (
                this.logger.info(
                  'headers not received yet, returning empty string'
                ),
                ''
              );
            const n = Array.from(e.headers.entries()).map(
              ([i, c]) => `${i}: ${c}`
            ).join(`\r
`);
            return this.logger.info('resolved all response headers to', n), n;
          },
        }
      )),
      Object.defineProperties(this.request, {
        response: {
          enumerable: !0,
          configurable: !1,
          get: () => this.response,
        },
        responseText: {
          enumerable: !0,
          configurable: !1,
          get: () => this.responseText,
        },
        responseXML: {
          enumerable: !0,
          configurable: !1,
          get: () => this.responseXML,
        },
      });
    const t = e.headers.has('Content-Length')
      ? Number(e.headers.get('Content-Length'))
      : void 0;
    this.logger.info('calculated response body length', t),
      this.trigger('loadstart', { loaded: 0, total: t }),
      this.setReadyState(this.request.HEADERS_RECEIVED),
      this.setReadyState(this.request.LOADING);
    const r = () => {
      this.logger.info('finalizing the mocked response...'),
        this.setReadyState(this.request.DONE),
        this.trigger('load', {
          loaded: this.responseBuffer.byteLength,
          total: t,
        }),
        this.trigger('loadend', {
          loaded: this.responseBuffer.byteLength,
          total: t,
        });
    };
    if (e.body) {
      this.logger.info('mocked response has body, streaming...');
      const s = e.body.getReader();
      const n = async () => {
        const { value: i, done: c } = await s.read();
        if (c) {
          this.logger.info('response body stream done!'), r();
          return;
        }
        i &&
          (this.logger.info('read response body chunk:', i),
          (this.responseBuffer = Zi(this.responseBuffer, i)),
          this.trigger('progress', {
            loaded: this.responseBuffer.byteLength,
            total: t,
          })),
          n();
      };
      n();
    } else r();
  }

  responseBufferToText() {
    return vn(this.responseBuffer);
  }

  get response() {
    if (
      (this.logger.info(
        'getResponse (responseType: %s)',
        this.request.responseType
      ),
      this.request.readyState !== this.request.DONE)
    )
      return null;
    switch (this.request.responseType) {
      case 'json': {
        const e = io(this.responseBufferToText());
        return this.logger.info('resolved response JSON', e), e;
      }
      case 'arraybuffer': {
        const e = gn(this.responseBuffer);
        return this.logger.info('resolved response ArrayBuffer', e), e;
      }
      case 'blob': {
        const e =
          this.request.getResponseHeader('Content-Type') || 'text/plain';
        const t = new Blob([this.responseBufferToText()], { type: e });
        return (
          this.logger.info('resolved response Blob (mime type: %s)', t, e), t
        );
      }
      default: {
        const e = this.responseBufferToText();
        return (
          this.logger.info(
            'resolving "%s" response type as text',
            this.request.responseType,
            e
          ),
          e
        );
      }
    }
  }

  get responseText() {
    if (
      (N(
        this.request.responseType === '' ||
          this.request.responseType === 'text',
        'InvalidStateError: The object is in invalid state.'
      ),
      this.request.readyState !== this.request.LOADING &&
        this.request.readyState !== this.request.DONE)
    )
      return '';
    const e = this.responseBufferToText();
    return this.logger.info('getResponseText: "%s"', e), e;
  }

  get responseXML() {
    if (
      (N(
        this.request.responseType === '' ||
          this.request.responseType === 'document',
        'InvalidStateError: The object is in invalid state.'
      ),
      this.request.readyState !== this.request.DONE)
    )
      return null;
    const e = this.request.getResponseHeader('Content-Type') || '';
    return typeof DOMParser > 'u'
      ? (console.warn(
          'Cannot retrieve XMLHttpRequest response body as XML: DOMParser is not defined. You are likely using an environment that is not browser or does not polyfill browser globals correctly.'
        ),
        null)
      : so(e)
        ? new DOMParser().parseFromString(this.responseBufferToText(), e)
        : null;
  }

  errorWith(e) {
    this.logger.info('responding with an error'),
      this.setReadyState(this.request.DONE),
      this.trigger('error'),
      this.trigger('loadend');
  }

  setReadyState(e) {
    if (
      (this.logger.info('setReadyState: %d -> %d', this.request.readyState, e),
      this.request.readyState === e)
    ) {
      this.logger.info('ready state identical, skipping transition...');
      return;
    }
    B(this.request, 'readyState', e),
      this.logger.info('set readyState to: %d', e),
      e !== this.request.UNSENT &&
        (this.logger.info('triggerring "readystatechange" event...'),
        this.trigger('readystatechange'));
  }

  trigger(e, t) {
    const r = this.request[`on${e}`];
    const s = ro(this.request, e, t);
    this.logger.info('trigger "%s"', e, t || ''),
      typeof r === 'function' &&
        (this.logger.info('found a direct "%s" callback, calling...', e),
        r.call(this.request, s));
    for (const [n, i] of this.events)
      n === e &&
        (this.logger.info(
          'found %d listener(s) for "%s" event, calling...',
          i.length,
          e
        ),
        i.forEach((c) => c.call(this.request, s)));
  }

  toFetchApiRequest() {
    this.logger.info('converting request to a Fetch API Request...');
    const e = new Request(this.url.href, {
      method: this.method,
      headers: this.requestHeaders,
      credentials: this.request.withCredentials ? 'include' : 'same-origin',
      body: ['GET', 'HEAD'].includes(this.method) ? null : this.requestBody,
    });
    const t = dt(e.headers, {
      methodCall: ([r, s], n) => {
        switch (r) {
          case 'append':
          case 'set': {
            const [i, c] = s;
            this.request.setRequestHeader(i, c);
            break;
          }
          case 'delete': {
            const [i] = s;
            console.warn(
              `XMLHttpRequest: Cannot remove a "${i}" header from the Fetch API representation of the "${e.method} ${e.url}" request. XMLHttpRequest headers cannot be removed.`
            );
            break;
          }
        }
        return n();
      },
    });
    return (
      B(e, 'headers', t),
      this.logger.info('converted request to a Fetch API Request!', e),
      e
    );
  }
};
function mt(e) {
  return typeof location > 'u'
    ? new URL(e)
    : new URL(e.toString(), location.href);
}
function B(e, t, r) {
  Reflect.defineProperty(e, t, { writable: !0, enumerable: !0, value: r });
}
function uo({ emitter: e, logger: t }) {
  return new Proxy(globalThis.XMLHttpRequest, {
    construct(s, n, i) {
      t.info('constructed new XMLHttpRequest');
      const c = Reflect.construct(s, n, i);
      const l = Object.getOwnPropertyDescriptors(s.prototype);
      for (const a in l) Reflect.defineProperty(c, a, l[a]);
      const o = new lo(c, t);
      return (
        (o.onRequest = async function ({ request: a, requestId: u }) {
          const { interactiveRequest: d, requestController: p } = hr(a);
          this.logger.info('awaiting mocked response...'),
            e.once('request', ({ requestId: f }) => {
              f === u &&
                p.responsePromise.state === 'pending' &&
                p.respondWith(void 0);
            });
          const v = await j(async () => {
            this.logger.info(
              'emitting the "request" event for %s listener(s)...',
              e.listenerCount('request')
            ),
              await dr(e, 'request', { request: d, requestId: u }),
              this.logger.info('all "request" listeners settled!');
            const f = await p.responsePromise;
            return this.logger.info('event.respondWith called with:', f), f;
          });
          if (v.error) {
            this.logger.info(
              'request listener threw an exception, aborting request...',
              v.error
            ),
              o.errorWith(v.error);
            return;
          }
          const m = v.data;
          if (typeof m < 'u') {
            if (
              (this.logger.info(
                'received mocked response: %d %s',
                m.status,
                m.statusText
              ),
              m.type === 'error')
            ) {
              this.logger.info(
                'received a network error response, rejecting the request promise...'
              ),
                o.errorWith(new TypeError('Network error'));
              return;
            }
            return o.respondWith(m);
          }
          this.logger.info(
            'no mocked response received, performing request as-is...'
          );
        }),
        (o.onResponse = async function ({
          response: a,
          isMockedResponse: u,
          request: d,
          requestId: p,
        }) {
          this.logger.info(
            'emitting the "response" event for %s listener(s)...',
            e.listenerCount('response')
          ),
            e.emit('response', {
              response: a,
              isMockedResponse: u,
              request: d,
              requestId: p,
            });
        }),
        o.request
      );
    },
  });
}
var yr = class extends Ce {
  constructor() {
    super(yr.interceptorSymbol);
  }

  checkEnvironment() {
    return typeof globalThis.XMLHttpRequest < 'u';
  }

  setup() {
    const e = this.logger.extend('setup');
    e.info('patching "XMLHttpRequest" module...');
    const t = globalThis.XMLHttpRequest;
    N(!t[W], 'Failed to patch the "XMLHttpRequest" module: already patched.'),
      (globalThis.XMLHttpRequest = uo({
        emitter: this.emitter,
        logger: this.logger,
      })),
      e.info(
        'native "XMLHttpRequest" module patched!',
        globalThis.XMLHttpRequest.name
      ),
      Object.defineProperty(globalThis.XMLHttpRequest, W, {
        enumerable: !0,
        configurable: !0,
        value: !0,
      }),
      this.subscriptions.push(() => {
        Object.defineProperty(globalThis.XMLHttpRequest, W, {
          value: void 0,
        }),
          (globalThis.XMLHttpRequest = t),
          e.info(
            'native "XMLHttpRequest" module restored!',
            globalThis.XMLHttpRequest.name
          );
      });
  }
};
const Er = yr;
Er.interceptorSymbol = Symbol('xhr');
const po = Object.defineProperty;
const ho = Object.defineProperties;
const fo = Object.getOwnPropertyDescriptors;
const vt = Object.getOwnPropertySymbols;
const mo = Object.prototype.hasOwnProperty;
const vo = Object.prototype.propertyIsEnumerable;
const gt = (e, t, r) =>
  t in e
    ? po(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
    : (e[t] = r);
const Ie = (e, t) => {
  for (var r in t || (t = {})) mo.call(t, r) && gt(e, r, t[r]);
  if (vt) for (var r of vt(t)) vo.call(t, r) && gt(e, r, t[r]);
  return e;
};
const Ae = (e, t) => ho(e, fo(t));
const R = (e, t, r) =>
  new Promise((s, n) => {
    const i = (o) => {
      try {
        l(r.next(o));
      } catch (a) {
        n(a);
      }
    };
    const c = (o) => {
      try {
        l(r.throw(o));
      } catch (a) {
        n(a);
      }
    };
    var l = (o) => (o.done ? s(o.value) : Promise.resolve(o.value).then(i, c));
    l((r = r.apply(e, t)).next());
  });
function go(e) {
  return new URL(e, location.href).href;
}
function be(e, t, r) {
  return (
    [e.active, e.installing, e.waiting]
      .filter((c) => c != null)
      .find((c) => r(c.scriptURL, t)) || null
  );
}
const yo = (e, ...t) =>
  R(void 0, [e, ...t], function* (r, s = {}, n) {
    const i = go(r);
    const c = yield navigator.serviceWorker
      .getRegistrations()
      .then((a) => a.filter((u) => be(u, i, n)));
    !navigator.serviceWorker.controller && c.length > 0 && location.reload();
    const [l] = c;
    if (l) return l.update().then(() => [be(l, i, n), l]);
    const o = yield j(() =>
      R(void 0, null, function* () {
        const a = yield navigator.serviceWorker.register(r, s);
        return [be(a, i, n), a];
      })
    );
    if (o.error) {
      if (o.error.message.includes('(404)')) {
        const u = new URL((s == null ? void 0 : s.scope) || '/', location.href);
        throw new Error(
          b.formatMessage(`Failed to register a Service Worker for scope ('${u.href}') with script ('${i}'): Service Worker script does not exist at the given path.

Did you forget to run "npx msw init <PUBLIC_DIR>"?

Learn more about creating the Service Worker script: https://mswjs.io/docs/cli/init`)
        );
      }
      throw new Error(
        b.formatMessage(
          `Failed to register the Service Worker:

%s`,
          o.error.message
        )
      );
    }
    return o.data;
  });
function _r(e = {}) {
  if (e.quiet) return;
  const t = e.message || 'Mocking enabled.';
  console.groupCollapsed(
    `%c${b.formatMessage(t)}`,
    'color:orangered;font-weight:bold;'
  ),
    console.log(
      '%cDocumentation: %chttps://mswjs.io/docs',
      'font-weight:bold',
      'font-weight:normal'
    ),
    console.log('Found an issue? https://github.com/mswjs/msw/issues'),
    e.workerUrl && console.log('Worker script URL:', e.workerUrl),
    e.workerScope && console.log('Worker scope:', e.workerScope),
    console.groupEnd();
}
function Eo(e, t) {
  return R(this, null, function* () {
    let r;
    let s;
    if (
      (e.workerChannel.send('MOCK_ACTIVATE'),
      yield e.events.once('MOCKING_ENABLED'),
      e.isMockingEnabled)
    ) {
      b.warn(
        'Found a redundant "worker.start()" call. Note that starting the worker while mocking is already enabled will have no effect. Consider removing this "worker.start()" call.'
      );
      return;
    }
    (e.isMockingEnabled = !0),
      _r({
        quiet: t.quiet,
        workerScope: (r = e.registration) == null ? void 0 : r.scope,
        workerUrl: (s = e.worker) == null ? void 0 : s.scriptURL,
      });
  });
}
const _o = class {
  constructor(e) {
    this.port = e;
  }

  postMessage(e, ...t) {
    const [r, s] = t;
    this.port.postMessage({ type: e, data: r }, { transfer: s });
  }
};
function wo(e) {
  if (!['HEAD', 'GET'].includes(e.method)) return e.body;
}
function bo(e) {
  return new Request(e.url, Ae(Ie({}, e), { body: wo(e) }));
}
const To = (e, t) => (r, s) =>
  R(void 0, null, function* () {
    let n;
    const i = new _o(r.ports[0]);
    const c = s.payload.id;
    const l = bo(s.payload);
    const o = l.clone();
    try {
      let a;
      yield cr(l, c, e.requestHandlers, t, e.emitter, {
        onPassthroughResponse() {
          i.postMessage('NOT_FOUND');
        },
        onMockedResponse(u, d) {
          return R(
            this,
            arguments,
            function* (p, { handler: v, parsedResult: m }) {
              const f = p.clone();
              const g = p.clone();
              const E = Yi(p);
              if (e.supports.readableStreamTransfer) {
                const _ = p.body;
                i.postMessage(
                  'MOCK_RESPONSE',
                  Ae(Ie({}, E), { body: _ }),
                  _ ? [_] : void 0
                );
              } else {
                const _ = p.body === null ? null : yield f.arrayBuffer();
                i.postMessage('MOCK_RESPONSE', Ae(Ie({}, E), { body: _ }));
              }
              t.quiet ||
                e.emitter.once('response:mocked', () => {
                  v.log({ request: o, response: g, parsedResult: m });
                });
            }
          );
        },
      });
    } catch (a) {
      a instanceof Error &&
        (b.error(
          `Uncaught exception in the request handler for "%s %s":

%s

This exception has been gracefully handled as a 500 response, however, it's strongly recommended to resolve this error, as it indicates a mistake in your code. If you wish to mock an error response, please see this guide: https://mswjs.io/docs/recipes/mocking-error-responses`,
          l.method,
          l.url,
          (n = a.stack) != null ? n : a
        ),
        i.postMessage('MOCK_RESPONSE', {
          status: 500,
          statusText: 'Request Handler Error',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: a.name,
            message: a.message,
            stack: a.stack,
          }),
        }));
    }
  });
function xo(e, t) {
  return R(this, null, function* () {
    e.workerChannel.send('INTEGRITY_CHECK_REQUEST');
    const { payload: r } = yield e.events.once('INTEGRITY_CHECK_RESPONSE');
    if (r !== 'c5f7f8e188b673ea4e677df7ea3c5a39')
      throw new Error(
        `Currently active Service Worker (${r}) is behind the latest published one (c5f7f8e188b673ea4e677df7ea3c5a39).`
      );
    return t;
  });
}
function Oo(e) {
  const t = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function (...s) {
    j(() => e).then(() => {
      (window.XMLHttpRequest.prototype.send = t), this.send(...s);
    });
  };
  const r = window.fetch;
  window.fetch = (...s) =>
    R(this, null, function* () {
      return yield j(() => e), (window.fetch = r), window.fetch(...s);
    });
}
function So(e) {
  return (t, r) => {
    let s;
    const { payload: n } = r;
    if ((s = n.type) != null && s.includes('opaque')) return;
    const i =
      n.status === 0
        ? Response.error()
        : new Response(kt(n.status) ? null : n.body, n);
    e.emitter.emit(n.isMockedResponse ? 'response:mocked' : 'response:bypass', {
      response: i,
      request: null,
      requestId: n.requestId,
    });
  };
}
function Ro(e, t) {
  !(t != null && t.quiet) &&
    !location.href.startsWith(e.scope) &&
    b.warn(`Cannot intercept requests on this page because it's outside of the worker's scope ("${e.scope}"). If you wish to mock API requests on this page, you must resolve this scope issue.

- (Recommended) Register the worker at the root level ("/") of your application.
- Set the "Service-Worker-Allowed" response header to allow out-of-scope workers.`);
}
const No = (e) =>
  function (r, s) {
    const i = (() =>
      R(this, null, function* () {
        e.events.removeAllListeners(),
          e.workerChannel.on('REQUEST', To(e, r)),
          e.workerChannel.on('RESPONSE', So(e));
        const c = yield yo(
          r.serviceWorker.url,
          r.serviceWorker.options,
          r.findWorker
        );
        const [l, o] = c;
        if (!l) {
          const u =
            s != null && s.findWorker
              ? b.formatMessage(
                  `Failed to locate the Service Worker registration using a custom "findWorker" predicate.

Please ensure that the custom predicate properly locates the Service Worker registration at "%s".
More details: https://mswjs.io/docs/api/setup-worker/start#findworker
`,
                  r.serviceWorker.url
                )
              : b.formatMessage(
                  `Failed to locate the Service Worker registration.

This most likely means that the worker script URL "%s" cannot resolve against the actual public hostname (%s). This may happen if your application runs behind a proxy, or has a dynamic hostname.

Please consider using a custom "serviceWorker.url" option to point to the actual worker script location, or a custom "findWorker" option to resolve the Service Worker registration manually. More details: https://mswjs.io/docs/api/setup-worker/start`,
                  r.serviceWorker.url,
                  location.host
                );
          throw new Error(u);
        }
        (e.worker = l),
          (e.registration = o),
          e.events.addListener(window, 'beforeunload', () => {
            l.state !== 'redundant' && e.workerChannel.send('CLIENT_CLOSED'),
              window.clearInterval(e.keepAliveInterval);
          });
        const a = yield j(() => xo(e, l));
        return (
          a.error &&
            b.error(`Detected outdated Service Worker: ${a.error.message}

The mocking is still enabled, but it's highly recommended that you update your Service Worker by running:

$ npx msw init <PUBLIC_DIR>

This is necessary to ensure that the Service Worker is in sync with the library to guarantee its stability.
If this message still persists after updating, please report an issue: https://github.com/open-draft/msw/issues      `),
          (e.keepAliveInterval = window.setInterval(
            () => e.workerChannel.send('KEEPALIVE_REQUEST'),
            5e3
          )),
          Ro(o, e.startOptions),
          o
        );
      }))().then((c) =>
      R(this, null, function* () {
        const l = c.installing || c.waiting;
        return (
          l &&
            (yield new Promise((o) => {
              l.addEventListener('statechange', () => {
                if (l.state === 'activated') return o();
              });
            })),
          yield Eo(e, r).catch((o) => {
            throw new Error(
              `Failed to enable mocking: ${o == null ? void 0 : o.message}`
            );
          }),
          c
        );
      })
    );
    return r.waitUntilReady && Oo(i), i;
  };
function wr(e = {}) {
  e.quiet ||
    console.log(
      `%c${b.formatMessage('Mocking disabled.')}`,
      'color:orangered;font-weight:bold;'
    );
}
const Io = (e) =>
  function () {
    let r;
    if (!e.isMockingEnabled) {
      b.warn(
        'Found a redundant "worker.stop()" call. Note that stopping the worker while mocking already stopped has no effect. Consider removing this "worker.stop()" call.'
      );
      return;
    }
    e.workerChannel.send('MOCK_DEACTIVATE'),
      (e.isMockingEnabled = !1),
      window.clearInterval(e.keepAliveInterval),
      wr({ quiet: (r = e.startOptions) == null ? void 0 : r.quiet });
  };
const Ao = {
  serviceWorker: { url: '/mockServiceWorker.js', options: null },
  quiet: !1,
  waitUntilReady: !0,
  onUnhandledRequest: 'warn',
  findWorker(e, t) {
    return e === t;
  },
};
function Po(e, t) {
  const r = new Oe({ name: 'fallback', interceptors: [new mr(), new Er()] });
  return (
    r.on('request', (s) =>
      R(this, [s], function* ({ request: n, requestId: i }) {
        const c = n.clone();
        const l = yield cr(n, i, e.requestHandlers, t, e.emitter, {
          onMockedResponse(o, { handler: a, parsedResult: u }) {
            t.quiet ||
              e.emitter.once('response:mocked', ({ response: d }) => {
                a.log({ request: c, response: d, parsedResult: u });
              });
          },
        });
        l && n.respondWith(l);
      })
    ),
    r.on(
      'response',
      ({ response: s, isMockedResponse: n, request: i, requestId: c }) => {
        e.emitter.emit(n ? 'response:mocked' : 'response:bypass', {
          response: s,
          request: i,
          requestId: c,
        });
      }
    ),
    r.apply(),
    r
  );
}
function ko(e) {
  return function (r) {
    return R(this, null, function* () {
      (e.fallbackInterceptor = Po(e, r)),
        _r({ message: 'Mocking enabled (fallback mode).', quiet: r.quiet });
    });
  };
}
function Co(e) {
  return function () {
    let r;
    let s;
    (r = e.fallbackInterceptor) == null || r.dispose(),
      wr({ quiet: (s = e.startOptions) == null ? void 0 : s.quiet });
  };
}
function Lo() {
  try {
    const e = new ReadableStream({ start: (r) => r.close() });
    return new MessageChannel().port1.postMessage(e, [e]), !0;
  } catch {
    return !1;
  }
}
const Do = class extends qr {
  constructor(...e) {
    super(...e),
      (this.startHandler = null),
      (this.stopHandler = null),
      N(
        !ke(),
        b.formatMessage(
          'Failed to execute `setupWorker` in a non-browser environment. Consider using `setupServer` for Node.js environment instead.'
        )
      ),
      (this.listeners = []),
      (this.context = this.createWorkerContext());
  }

  createWorkerContext() {
    const e = {
      isMockingEnabled: !1,
      startOptions: null,
      worker: null,
      registration: null,
      requestHandlers: this.currentHandlers,
      emitter: this.emitter,
      workerChannel: {
        on: (t, r) => {
          this.context.events.addListener(
            navigator.serviceWorker,
            'message',
            (s) => {
              if (s.source !== this.context.worker) return;
              const n = s.data;
              n && n.type === t && r(s, n);
            }
          );
        },
        send: (t) => {
          let r;
          (r = this.context.worker) == null || r.postMessage(t);
        },
      },
      events: {
        addListener: (t, r, s) => (
          t.addEventListener(r, s),
          this.listeners.push({ eventType: r, target: t, callback: s }),
          () => {
            t.removeEventListener(r, s);
          }
        ),
        removeAllListeners: () => {
          for (const { target: t, eventType: r, callback: s } of this.listeners)
            t.removeEventListener(r, s);
          this.listeners = [];
        },
        once: (t) => {
          const r = [];
          return new Promise((s, n) => {
            const i = (c) => {
              try {
                const l = c.data;
                l.type === t && s(l);
              } catch (l) {
                n(l);
              }
            };
            r.push(
              this.context.events.addListener(
                navigator.serviceWorker,
                'message',
                i
              ),
              this.context.events.addListener(
                navigator.serviceWorker,
                'messageerror',
                n
              )
            );
          }).finally(() => {
            r.forEach((s) => s());
          });
        },
      },
      supports: {
        serviceWorkerApi:
          !('serviceWorker' in navigator) || location.protocol === 'file:',
        readableStreamTransfer: Lo(),
      },
    };
    return (
      Object.defineProperties(e, {
        requestHandlers: { get: () => this.currentHandlers },
      }),
      (this.startHandler = e.supports.serviceWorkerApi ? ko(e) : No(e)),
      (this.stopHandler = e.supports.serviceWorkerApi ? Co(e) : Io(e)),
      e
    );
  }

  start() {
    return R(this, arguments, function* (e = {}) {
      return (
        (this.context.startOptions = lr(Ao, e)),
        yield this.startHandler(this.context.startOptions, e)
      );
    });
  }

  stop() {
    super.dispose(),
      this.context.events.removeAllListeners(),
      this.context.emitter.removeAllListeners(),
      this.stopHandler();
  }
};
function Mo(...e) {
  return new Do(...e);
}
const $o = Mo(...Ji);
export { $o as worker };
