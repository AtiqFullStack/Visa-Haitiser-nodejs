const Geetest = require('geetest');
const { GEETEST_ID, GEETEST_KEY } = require('./cofig');

const geetest = new Geetest({
    geetest_id: GEETEST_ID,
    geetest_key: GEETEST_KEY,
});

module.exports = geetest;
