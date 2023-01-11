import express from 'express';
import cors from 'cors';
import * as routes from './v1/routers';
import authRoutes from './v1/routers/auth.router';
const app = express();

// initial database
// require('./v1/databases/init.mongo');
require('./v1/databases/init.mysql');
require('./v1/databases/init.redis');

app.use(express.json());
app.use(cors({
  origin: '*'
}));

// configure routes
routes.register(app);
app.use('/v1/auth',authRoutes);

export default app;