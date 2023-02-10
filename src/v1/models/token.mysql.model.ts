import sequelize from '../databases/init.mysql';
import {
  DataTypes,
  Model,
  Op
} from 'sequelize';
import cron from 'node-cron';
import User from './users.mysql.model'

class Token extends Model {
  public id!: number;
  public token!: string;
  public expiration!: Date;
}

Token.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiration:{
    type: DataTypes.DATE,
    allowNull: true
  }

},{
  sequelize,
  modelName: 'token'
});

Token.addHook('beforeCreate', (instance: any) => {
  instance.expiration = sequelize.literal('DATE_ADD(NOW(), INTERVAL 1 DAY)');
});

Token.belongsTo(User, {as: 'user', foreignKey: 'userId'});
export default Token;

async function deleteExpiredTokens() {
  await Token.destroy({
    where: {
      expiration: {
        [Op.lt]: new Date(),
      },
    },
  });
}

cron.schedule('0 0 */12 * *', async () => {
  await deleteExpiredTokens();
});