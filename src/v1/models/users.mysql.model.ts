import sequelize from '../databases/init.mysql';
import {
  DataTypes,
  Model
} from 'sequelize';

class User extends Model {
  readonly id!: number;
  public name!: string;
  readonly email!: string;
  public password!: string;
  public active!: boolean;
  public avatar!: string;
  public phone!: string;
  public address!: string;
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
  phone:{
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
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
