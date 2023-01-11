import sequelize from '../databases/init.mysql';
import {
  DataTypes,
  Model
} from 'sequelize';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public active!: boolean;
  public avatar!: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

},{
  sequelize,
  modelName: 'user'
});

export default User;
