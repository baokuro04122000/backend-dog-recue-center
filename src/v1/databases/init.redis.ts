import Redis, {RedisOptions} from 'ioredis';
import logger from '../core/loggers';
import dotenv from 'dotenv-safe';
dotenv.config();

logger.info('connecting redis');

class RedisConnection{
    private static instance: RedisConnection;
    private connection: Redis;

    private constructor(option: RedisOptions){
        // connecting redis cloud
        this.connection = new Redis(option);
        this.connection.ping( (err, result) => {
            logger.info('Ping connection redis::', result);
        });

        this.connection.on('connect', () => {
            logger.info('Redis client connected');
        });

        this.connection.on('error', (error) => {
            logger.error(JSON.stringify(error));
        });
    }

    public static getInstance(option: RedisOptions): RedisConnection{
        if(!RedisConnection.instance){
            RedisConnection.instance = new RedisConnection(option);
        }
        return RedisConnection.instance;
    }

    public getConnection(): Redis {
        return this.connection;
    }
}

export default RedisConnection.getInstance({
    port:process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 7000,
    host:process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost',
    username:process.env.REDIS_USERNAME ? process.env.REDIS_USERNAME : '',
    password:process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : ''
}).getConnection();
