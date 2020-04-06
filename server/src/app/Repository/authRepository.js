'use strict';
const mongoose = require('../../database');
const User = mongoose.model('User');

exports.get = async (data) => {
    const user = await User.findOne(data);

    return user;
};

exports.getUserAuth = async (data) => {
    const user = await User.findOne(data).select('+password');

    return user;
};

exports.getUserReset = async (data) => {
    const user = await User.findOne(data).select('+passwordResetToken passwordResetExpires');

    return user;
};

exports.post = async (data) => {
    const user = new User(data);
    await user.save();

    return user.id
};

exports.put = async (id, data) => {
    const user = await User.findByIdAndUpdate(id, data);

    return user;
};

exports.putPasswrd = async (user,password) => {
    user.password = password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    return user;
};