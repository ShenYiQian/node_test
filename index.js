import mongoose from 'mongoose';
import http from 'http';
import util from 'util';
//import mysql from 'mysql';

// config should be imported before importing any other file
import config from './config/config';
import app from './config/express';

const debug = require('debug')('express-mongoose-es6-rest-api:index');

mongoose.Promise = Promise;
/*
let connection;
function handleDisconnect() {
  connection = mysql.createConnection(config.sql);
  connection.connect(err => {
    if (err) {
      console.log('try to reconnect sql' + new Date());
      setTimeout(handleDisconnect, 2000);
      return;
    }
    console.log('connect sql success');
  });
  connection.on('error', err => {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();*/

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  //http.createServer(app).listen(config.port, config.host);
  app.listen(config.port, config.host, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

export default app;
