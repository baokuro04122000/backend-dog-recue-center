require('dotenv-safe').config();
import logger from '../core/loggers';

import {Sequelize,  Options} from 'sequelize';

const env =  process.env.NODE_ENV || 'development';

const config = require('../config/database')[env];

class MySQLDbConnection{
  private static instance: MySQLDbConnection;
  private connection: Sequelize;

  private constructor(option: Options) {
    this.connection = new Sequelize(option);
    this.connection.sync().then(() => {
      logger.info('Database mysql connected successfully');
    }).catch((err) => {
      logger.error(JSON.stringify(err));
    });
  }

  public static getInstance(option: Options): MySQLDbConnection {
    if(!MySQLDbConnection.instance){
      MySQLDbConnection.instance = new MySQLDbConnection(option);
    }
    return MySQLDbConnection.instance;
  }

  public getConnection(): Sequelize {
    return this.connection;
  }

}

export default MySQLDbConnection.getInstance({
  dialect: 'mysql',
  host: config.host,
  username: config.username,
  password: config.password,
  port: config.port,
  database: config.database,
  logging: true,
  pool: config.pool
}).getConnection();
