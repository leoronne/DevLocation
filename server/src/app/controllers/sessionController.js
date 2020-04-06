require('dotenv/config');
const bcrypt = require('bcryptjs');

const User = require('../model/User');
const authServices = require('../Services/authServices')

module.exports = {
      async create(req, res) {
            const {
                  email,
                  password,
            } = req.body;

            try {
                  const user = await User.findOne({
                        email
                  }).select('+password');

                  if (!user) {
                        return res.status(404).send({
                              message: 'Dev not found!'
                        });
                  }

                  if (!await bcrypt.compare(password, user.password))
                        return res.status(401).send({
                              message: 'Invalid credentials!'
                        });

                  if (user.active === false) {
                        return res.status(401).send({
                              message: 'Please, you need to verify your email adress first!'
                        });
                  }

                  var token = await authServices.generateToken({
                        id: user.id
                  });

                  res.json({
                        token,
                        name: user.name
                  });
            } catch (err) {
                  return res.status(500).send({
                        message: err.message
                  });
            }
      },
      async validateToken(req, res) {
            const {
                  token
            } = req.query;

            try {
                  if (await authServices.validateToken(token) === false) {
                        return res.status(401).send({
                              message: 'Invalid token!'
                        });
                  };

                  var user = (await User.findOne({
                        '_id': await authServices.decodeToken(token)
                  }))

                  if (!user)
                        return res.status(404).json({
                              message: 'User not found!'
                        });
                  user.password = undefined;
                  return res.status(204).send();
            } catch (err) {
                  return res.status(500).send({
                        message: err.message
                  });
            }
      }
};
