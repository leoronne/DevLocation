const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = require('./swagger.json');

const swaggerOptions = {
      swaggerDefinition,
      apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

const swaggerConfig =
{
      explorer: false,
      customCss: '.swagger-ui .topbar {display :none}',
      customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.1/themes/3.x/theme-muted.css',
      customSiteTitle: 'Dev Location - API Documentation',
      customfavIcon: "https://raw.githubusercontent.com/leoronne/DevLocation/master/assets/img/favicon.ico"
};

module.exports = { swaggerSpec, swaggerConfig }