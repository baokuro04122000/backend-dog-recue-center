import server from './server';
import {Response, Request} from 'express';
import logger from './v1/core/loggers';

require('dotenv-safe').config();

const port = process.env.PORT || 9000;

server.listen(port, () => {
  logger.info(`server running at ${port}`);
});
