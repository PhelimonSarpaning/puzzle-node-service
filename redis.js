// @ts-nocheck
const redis = require('redis');

const resolvePromise = (resolve, reject) => {
  return (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  };
};

/** @type {import('redis').RedisClient} */
const client = redis.createClient();

/** @type {import('redis').RedisClient} */
const sub = redis.createClient();

module.exports = {
  client,
  sub,
  incr: (key = 'key') =>
    // @ts-ignore
    new Promise((a, b) => client.incr(key, resolvePromise(a, b))),
  decr: (key = 'key') =>
    // @ts-ignore
    new Promise((a, b) => client.decr(key, resolvePromise(a, b))),
  hmset: (key = 'key', values = []) =>
    // @ts-ignore
    new Promise((a, b) => client.hmset(key, values, resolvePromise(a, b))),
  exists: (key = 'key') =>
    // @ts-ignore
    new Promise((a, b) => client.exists(key, resolvePromise(a, b))),
  hexists: (key = 'key', key2 = '') =>
    // @ts-ignore
    new Promise((a, b) => client.hexists(key, key2, resolvePromise(a, b))),
  set: (key = 'key', value) =>
    // @ts-ignore
    new Promise((a, b) => client.set(key, value, resolvePromise(a, b))),
  get: (key = 'key') =>
    // @ts-ignore
    new Promise((a, b) => client.get(key, resolvePromise(a, b))),
  hgetall: (key = 'key') =>
    // @ts-ignore
    new Promise((a, b) => client.hgetall(key, resolvePromise(a, b))),
  zrangebyscore: (key = 'key', min = 0, max = 1) =>
    new Promise((a, b) =>
      // @ts-ignore
      client.zrangebyscore(key, min, max, resolvePromise(a, b))
    ),
  zadd: (key = 'key', key2 = '', value) =>
    // @ts-ignore
    new Promise((a, b) => client.zadd(key, key2, value, resolvePromise(a, b))),
  sadd: (key = 'key', value) =>
    // @ts-ignore
    new Promise((a, b) => client.sadd(key, value, resolvePromise(a, b))),
  hmget: (key = 'key', key2 = '') =>
    // @ts-ignore
    new Promise((a, b) => client.hmget(key, key2, resolvePromise(a, b))),
  sismember: (key = 'key', key2 = '') =>
    // @ts-ignore
    new Promise((a, b) => client.sismember(key, key2, resolvePromise(a, b))),
  smembers: (key = 'key') =>
    // @ts-ignore
    new Promise((a, b) => client.smembers(key, resolvePromise(a, b))),
  srem: (key = 'key', key2 = '') =>
    // @ts-ignore
    new Promise((a, b) => client.srem(key, key2, resolvePromise(a, b))),
};
