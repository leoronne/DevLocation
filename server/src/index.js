require('dotenv/config');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const swaggerUi = require('swagger-ui-express');

const swaggerConfiguration = require('./Swagger/swaggerConfiguration');
const { setupWebsocket } = require('./websocket');
const routes = require('./routes');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

app.get('/api-doc.json', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerConfiguration.swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfiguration.swaggerSpec, swaggerConfiguration.swaggerConfig));

app.use(cors());
app.use(express.json());

app.use('/', routes.copyright);
app.use('/dev', routes.dev);
app.use('/session', routes.session);

app.use(errors());

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
});