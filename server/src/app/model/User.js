const bcrypt = require('bcryptjs');
const mongoose = require('../../database');
const PointSchema = require('./utils/PointSchema');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    githubUser: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    bio: {
        type: String,
    },
    avatar_url: {
        type: String,
        lowercase: true,
    },
    techs: {
        type: [String],
    },
    techsString: {
        type: String,
        lowercase: true,
    },
    location: {
        type: PointSchema,
        index: '2dsphere',
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    active: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);    
    this.password = hash;
    next();
});
module.exports = mongoose.model('User', UserSchema);