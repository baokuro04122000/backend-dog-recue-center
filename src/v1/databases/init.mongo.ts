import mongoose from 'mongoose';
import logger from '../core/loggers';
require('dotenv-safe').config();

class MongoDBConnection {
    private static instance: MongoDBConnection;
    private mongoInstance: typeof mongoose;
    private connection: mongoose.Connection;

    private constructor(uri: string) {
        this.mongoInstance = mongoose;

        // connect mongoose
        this.mongoInstance.connect(
            uri,
        // `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.81ywfpz.mongodb.net/
        // ${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
            {
            autoIndex: false
        }).then( _ => logger.info('Connected mongoose success!...'))
        .catch( err => logger.error(`Error: connect:::`, JSON.stringify(err)));

        // all executed methods log output to console
        this.mongoInstance.set('debug', true);

        // disable colors in debug mode
        this.mongoInstance.set('debug', { color: false });

        // get mongodb-shell friendly output (ISODate)
        this.mongoInstance.set('debug', { shell: true });

        this.connection = this.mongoInstance.connection;
    }

    public static getInstance(uri: string): MongoDBConnection {
        if(!MongoDBConnection.instance){
            MongoDBConnection.instance = new MongoDBConnection(uri);
        }

        return MongoDBConnection.instance;
    }

    public getConnection(): mongoose.Connection {
        return this.connection;
    }
}

export default MongoDBConnection.getInstance(process.env.MONGO_URI || 'mongodb://localhost:27017/test').getConnection();
