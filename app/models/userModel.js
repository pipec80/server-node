'use strict';
// Importing Node packages required for schema
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;
const ROLE_MEMBER = require('../../config/constants').ROLE_MEMBER;
const ROLE_CLIENT = require('../../config/constants').ROLE_CLIENT;
const ROLE_OWNER = require('../../config/constants').ROLE_OWNER;
const ROLE_ADMIN = require('../../config/constants').ROLE_ADMIN;

//= ===============================
// User Schema
//= ===============================
var UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        firstName: { type: String },
        lastName: { type: String }
    },
    role: {
        type: String,
        enum: [ROLE_MEMBER, ROLE_CLIENT, ROLE_OWNER, ROLE_ADMIN],
        default: ROLE_MEMBER
    },
    stripe: {
        customerId: { type: String },
        subscriptionId: { type: String },
        lastFour: { type: String },
        plan: { type: String },
        activeUntil: { type: Date }
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, {
    timestamps: true
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', UserSchema);