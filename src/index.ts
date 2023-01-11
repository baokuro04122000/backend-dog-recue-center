import server from './server';
import logger from './v1/core/loggers';
require('dotenv-safe').config();

const port = process.env.PORT || 3000;

server.listen(port, () => {
  logger.info(`server running at ${port}`);
});
