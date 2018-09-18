const mongoose = require('mongoose');

const Store = mongoose.Schema({
    name: { type: String, required: true },
    face_id: { type: String, required: true },
});

module.exports = mongoose.model('StoreData', Store);