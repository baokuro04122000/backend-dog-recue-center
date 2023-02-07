import sequelize from '../databases/init.mysql';
import {
  DataTypes,
  Model
} from 'sequelize';
import User from './users.mysql.model';
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
