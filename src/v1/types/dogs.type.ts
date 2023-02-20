import { DataType } from "sequelize"

export type DogBodyRequest = {
  name: string,
  title: string,
  breed: string,
  hobbies: string,
  avatar?: string,
  address: string,
  age: string, // '3m','3d'. '3y'
  about: string,
  city: string,
  userId: number
}

export type DetailsDogPayload = {
  id: number,
  name: string,
  title: string,
  breed: string,
  hobbies: boolean,
  avatar: string,
  address: string,
  age: string,
  status: string,
  contact:{
    phone: string,
    address: string,
    name: string
  },
  createdAt?: DataType,
  updatedAt?: DataType
}