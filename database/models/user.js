const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true,
    },
    api_key: {
        type: String || null,
        required: false,
        default: null,
    },
    account_creation_time: {
        type: Number,
        default: Date.now(),
    },
    roles: {
        type: Array,
        default: [ "user" ]
    },
    iracing_account_id: {
        type: String,
        default: "-1",
    },
    alerts: {
        type: Array,
        default: [{
            "id": "new-account",
            "title": "Welcome to Gabir Motors",
            "type": "tip",
            "text": "Welcome to your new Gabir Motors account!"
          }]
    },
    setupComplete: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.models.userdata || mongoose.model("userdata", UserSchema);