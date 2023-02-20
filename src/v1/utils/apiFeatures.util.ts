import {Request} from 'express'
import { FindOptions } from 'sequelize';
import {Op} from 'sequelize'

class APIFeatures {
  query: FindOptions<any>;
  queryStr: any;
  

  constructor(query: FindOptions, req: Request) {
      this.query = query;
      this.queryStr = req.query;
  }

  search() {
    const name = this.queryStr.name
      ? {
        where:{
          name:{
            [Op.like]: '%' + this.queryStr.name + '%'
          }
        }
      }
      : {where:{
        
      }}

    this.query = {...name };
    return this;
  }

  sort(){


  }

  filter() {
     
      return this;
  }

  pagination(resPerPage = 10) {
      const currentPage = Number(this.queryStr.page) || 1;
      const skip = resPerPage * (currentPage - 1);

      this.query = {...this.query, limit: resPerPage, offset: skip};
      return this;
  }
}

export default APIFeatures