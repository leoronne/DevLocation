require('dotenv/config');
const crypto = require('crypto');
const axios = require('axios');
const mailer = require('../../modules/mailer');

const User = require('../model/User');
const authServices = require('../Services/authServices');
const { findConnections, sendMessage } = require('../../websocket');

module.exports = {
    async create(req, res) {
        const {
            email,
            githubUser,
            techs,
            password,
            latitude,
            longitude
        } = req.body;
        try {
            var user = ((await User.find({
                $or: [{ githubUser }, { email }]
            })))
            if (user.length > 0)
                return res.status(401).json({
                    message: 'User is already registered!'
                });

            var githubResponse;
            await axios.get(`https://api.github.com/users/${githubUser}`)
                .then((response) => {
                    githubResponse = response.data;
                })
                .catch((err) => {
                    throw new Error('GitHub user not found!')
                });

            const { name = login, avatar_url, bio } = githubResponse;

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            user = await User.create({
                name,
                email,
                githubUser,
                bio,
                avatar_url,
                techs,
                techsString: techs.join().trim(),
                password,
                location
            });

            user.password = undefined;

            var link = `${process.env.APP_URL}confirm?id=${user.id}`;

            const sendSocketMessageTo = findConnections({
                latitude, longitude
            }, techs);

            sendMessage(sendSocketMessageTo, 'new_dev', user);

            mailer.sendMail({
                to: `${email}`,
                bc: process.env.GMAIL_USER,
                from: '"Léo, of Dev Location" <devlocation@no-reply.com>',
                subject: `Hi ${name}, please confirm your email!`,
                template: 'auth/verifyaccount',
                context: {
                    name,
                    link
                },
            }, (err) => {
                if (err)
                    return res.status(503).json({
                        message: err.message
                    });
            });

            return res.json({
                'id': user.id,
            });


        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    },

    async delete(req, res) {
        const { id } = req.body;
        try {

            const user = (await User.findOne({
                _id: id
            }))

            if (!user)
                return res.status(404).json({
                    message: 'User not found!'
                });

            await User.findByIdAndRemove(
                id
            );

            return res.status(204).send()

        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    },

    async confirm(req, res) {
        const { id } = req.body;
        try {
            var user = (await User.findOne({
                '_id': id
            }))

            if (!user)
                return res.status(404).json({
                    message: 'User not found!'
                });


            if (user.active === true) {
                return res.status(401).json({
                    message: 'Account already verified!'
                });
            }
            await User.findByIdAndUpdate({ '_id': id }, { "active": true });

            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    },

    async index(req, res) {
        const { token, techs = '', latitude, longitude } = req.query;
        try {

            if (token) {
                var user = (await User.find({
                    '_id': await authServices.decodeToken(token)
                }).select('+_id techs active name email githubUser bio avatar_url location.coordinates '));

                if (!user)
                    return res.status(404).json({
                        message: 'User not found!'
                    });

                return res.status(200).json(user);
            };


            if (techs.trim() !== '' || latitude || longitude) {
                if (techs.trim() !== '') {
                    const techsArray = techs.split(',').map(techs => techs.trim());
                    if (latitude && longitude) {
                        var user = (await User.find({
                            'techs': {
                                $in: techsArray,
                            },
                            location: {
                                $near: {
                                    $geometry: {
                                        type: 'Point',
                                        coordinates: [longitude, latitude],
                                    },
                                    $maxDistance: 10000,
                                }
                            }
                        }).select('+_id techs active name email githubUser bio avatar_url location.coordinates ').sort('-createdAt'));
                    } else {
                        var user = (await User.find({
                            'techs': {
                                $in: techsArray,
                            }
                        }).select('+_id techs active name email githubUser bio avatar_url location.coordinates ').sort('-createdAt'));
                    }
                } else {
                    var user = (await User.find({
                        location: {
                            $near: {
                                $geometry: {
                                    type: 'Point',
                                    coordinates: [longitude, latitude],
                                },
                                $maxDistance: 10000,
                            }
                        }
                    }).select('+_id techs active name email githubUser bio avatar_url location.coordinates ').sort('-createdAt'));
                }

                return res.status(200).json(user);
            }

            var user = (await User.find({
            }).select('+_id techs active name email githubUser bio avatar_url location.coordinates ').sort('-createdAt'));

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    },

    async sendEmail(req, res) {
        const {
            email
        } = req.body;
        try {
            var user = (await User.findOne({
                'email': email
            }))

            if (!user)
                return res.status(404).json({
                    message: 'User not found!'
                });


            if (user.active === true) {
                return res.status(401).json({
                    message: 'Account already verified!'
                });
            }

            var link = `${process.env.APP_URL}confirm?id=${user.id}`;

            mailer.sendMail({
                to: `${email}`,
                bc: process.env.GMAIL_USER,
                from: '"Léo, of Dev Location" <devlocation@no-reply.com>',
                subject: `Hi ${user.name}, please confirm your email!`,
                template: 'auth/verifyaccount',
                context: {
                    name: user.name,
                    link
                },
            }, (err) => {
                if (err)
                    return res.status(503).json({
                        message: err.message
                    });
            });

            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    },

    async forgotPassword(req, res) {
        const {
            email
        } = req.body;
        try {
            var user = (await User.findOne({
                'email': email
            }))

            if (!user)
                return res.status(404).json({
                    message: 'User not found!'
                });

            const token = crypto.randomBytes(20).toString('hex');
            const name = user.name;
            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
            });

            mailer.sendMail({
                to: `${email}`,
                bc: process.env.GMAIL_USER,
                from: '"Léo, of Dev Location" <devlocation@no-reply.com>',
                subject: `Hey ${name}, do you need to change your password?`,
                template: 'auth/forgotPassword',
                context: {
                    name,
                    link: `${process.env.APP_URL}updatepassword?token=${await authServices.generateToken({
                        id: user.id
                    })}&passtoken=${token}`
                },
            }, (err) => {
                if (err)
                    return res.status(503).json({
                        message: err.message
                    });
            });

            return res.status(200).json(JSON.stringify(token));

        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    },

    async  validPasswordToken(req, res) {
        const {
            passtoken,
            token
        } = req.query

        try {
            if (await authServices.validateToken(token) === false) {
                return res.status(401).json({
                    message: 'Invalid token!'
                });
            };

            const user = await User.findOne({
                '_id': await authServices.decodeToken(token)
            }).select('+passwordResetToken passwordResetExpires');

            if (!user)
                return res.status(404).json({
                    message: 'User not found!'
                });

            if (passtoken !== user.passwordResetToken)
                return res.status(401).json({
                    message: 'Invalid token!'
                });

            const now = new Date();

            if (!now > user.passwordResetExpires)
                return res.status(401).json({
                    message: 'Password token expired!'
                })

            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }
    },

    async  updatepassword(req, res) {
        const {
            password,
        } = req.body

        const passtoken = req.headers.passtoken;
        const token = req.headers.authorization;

        try {
            if (await authServices.validateToken(token) === false) {
                return res.status(401).json({
                    message: 'Invalid token!'
                });
            };

            const user = await User.findOne({
                '_id': await authServices.decodeToken(token)
            }).select('+passwordResetToken passwordResetExpires email name');

            if (!user)
                return res.status(404).json({
                    message: 'User not found!'
                });

            if (passtoken !== user.passwordResetToken)
                return res.status(401).json({
                    message: 'Invalid token!'
                });

            const now = new Date();

            if (!now > user.passwordResetExpires)
                return res.status(401).json({
                    message: 'Password token expired!'
                })

            const name = user.name;

            const link = process.env.APP_URL

            user.password = password;
            user.passwordResetToken = '';
            user.passwordResetExpires = now;

            await user.save();

            mailer.sendMail({
                to: `${user.email}`,
                bc: process.env.GMAIL_USER,
                from: '"Léo, of Dev Location" <devlocation@no-reply.com>',
                subject: `Hi ${name}, your password was changed!`,
                template: 'auth/updatePassword',
                context: {
                    name,
                    link
                },
            }, (err) => {
                if (err)
                    return res.status(503).json({
                        message: err.message
                    });
            });

            return res.status(204).send();
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    },

    async  updateuser(req, res) {
        const {
            name, techs, latitude, longitude
        } = req.body

        const token = req.headers.authorization;

        try {
            if (await authServices.validateToken(token) === false) {
                return res.status(401).json({
                    message: 'Invalid token!'
                });
            };

            let user = await User.findOne({
                '_id': await authServices.decodeToken(token)
            }).select('+email name githubUser');

            if (!user)
                return res.status(404).json({
                    message: 'User not found!'
                });

            var githubResponse;
            await axios.get(`https://api.github.com/users/${user.githubUser}`)
                .then((response) => {
                    githubResponse = response.data;
                })
                .catch((err) => {
                    throw new Error('GitHub user not found!')
                });

            const { avatar_url, bio } = githubResponse;

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
            User.findByIdAndUpdate({ '_id': user.id },
                {
                    techs,
                    techsString: techs.join().trim(),
                    name,
                    bio,
                    avatar_url,
                    location
                }, { new: true },
                function (err, result) {
                    if (err) {
                        throw new Error(err.message)
                    }
                    return res.status(204).send();
                });
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }

};
