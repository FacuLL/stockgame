const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cors = require('cors');
const helmet = require("helmet");
const updateService = require('./services/quotationUpdate')

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors({origin:'*'}));
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(__dirname + '/assets'));
app.use(require('./routes/app.routes'));

updateService.startUpdates();

module.exports = app;