const bcrypt = require('bcrypt');
const { SALT_ROUND } = require('../utils/cofig');

const passwordHash = async (password) => {
    return await bcrypt.hash(password, SALT_ROUND);
};

const passwordCompare = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = {
    passwordHash,
    passwordCompare
};
