const { Schema, model } = require('mongoose');

const logoShema = new Schema({
    url: String,
    public_id: String,
    name: String,
    dimensions: {
        width: Number,
        height: Number
    },
}, {
    timestamps: true
});

module.exports = model('logo', logoShema);
