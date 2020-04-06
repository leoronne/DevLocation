const { Segments, Joi } = require('celebrate');

module.exports = {
      create: {
            [Segments.BODY]: Joi.object().keys({
                  email: Joi.string().required().email().error(new Error('Invalid email!')),
                  password: Joi.string().required().regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')).error(new Error('Invalid password!')),
                  githubUser: Joi.string().required().error(new Error('GitHub user is a required field!')),
                  techs: Joi.array().items(Joi.string().required()).required().error(new Error('Techs is a required field!')),
                  latitude: Joi.number().required().error(new Error('Latitude is a required field!')),
                  longitude: Joi.number().required().error(new Error('Longitude is a required field!')),
            })
      },
      delete: {
            [Segments.BODY]: {
                  id: Joi.string().required().token().min(4).error(new Error('Invalid ID!')),
            }
      },
      confirm: {
            [Segments.BODY]: {
                  id: Joi.string().required().token().min(4).error(new Error('Invalid ID!')),
            }
      },
      sendEmail: {
            [Segments.BODY]: Joi.object().keys({
                  email: Joi.string().required().email().error(new Error('Invalid email!')),
            })
      },
      validPasswordToken: {
            [Segments.QUERY]: Joi.object().keys({
                  passtoken: Joi.string().required().token().error(new Error('Invalid password token!')),
                  token: Joi.string().required().error(new Error('Invalid token!')),
            })
      },
      updatepassword: {
            [Segments.BODY]: Joi.object().keys({
                  password: Joi.string().required().regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')).error(new Error('Invalid password!')),
            }),
            [Segments.HEADERS]: Joi.object({
                  authorization: Joi.string().required().error(new Error('Token field is required!')),
                  passtoken: Joi.string().required().token().error(new Error('Invalid password token!')),
            }).unknown(),
      },
      index: {
            [Segments.QUERY]: {
                  token: Joi.string().error(new Error('Invalid token!')),
                  techs: Joi.optional().error(new Error('Invalid Techs!')),
                  latitude: Joi.number().error(new Error('Invalid Latitude!')),
                  longitude: Joi.number().error(new Error('Invalid Longitude!')),
            }
      },
      updateuser: {
            [Segments.BODY]: Joi.object().keys({
                  // password: Joi.string().required().regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')).error(new Error('Invalid password!')),
                  name: Joi.string().error(new Error('Invalid name!')),
                  techs: Joi.array().items(Joi.string().required()).required().error(new Error('Techs is a required field!')),
                  latitude: Joi.number().required().error(new Error('Latitude is a required field!')),
                  longitude: Joi.number().required().error(new Error('Longitude is a required field!')),
            }),
            [Segments.HEADERS]: Joi.object({
                  authorization: Joi.string().required().error(new Error('Token field is required!'))
            }).unknown(),
      },
}