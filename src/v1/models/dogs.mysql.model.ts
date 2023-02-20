import sequelize from '../databases/init.mysql';
import {
  DataTypes,
  Model
} from 'sequelize';

import User from './users.mysql.model'
class Dog extends Model {
  readonly id!: number;
  public name!: string;
  public title!: string;
  public breed!: string;
  public hobbies!: boolean;
  public avatar!: string;
  public address!: string;
  public age!: string;
  public status!: string;
  public 'user.name'!: string 
  public 'user.phone'!: string 
  public 'user.address'!: string 
}

Dog.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title:{
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  about: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hobbies: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address:{
    type: DataTypes.STRING,
    allowNull: false
  },
  city:{
    type: DataTypes.STRING,
    allowNull: false
  },
  age:{
    type: DataTypes.STRING,
    allowNull: false
  },
  status:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
},{
  sequelize,
  modelName: 'dog'
});

Dog.belongsTo(User, {as: 'user', foreignKey: 'userId'});

export default Dog;
