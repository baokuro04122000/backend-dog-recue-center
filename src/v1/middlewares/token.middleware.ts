import * as JWT from 'jsonwebtoken';

export const generateToken = async (payload: object, options: JWT.SignOptions) => {
    return await JWT.sign(
        payload,
        process.env.TOKEN_SECRET ?  process.env.TOKEN_SECRET : 'token-secret',
        options
    );
};

export const verifyToken =(token: string) => new Promise(
  (resolve, reject) => {
    JWT.verify(
        token,
        process.env.TOKEN_SECRET ?  process.env.TOKEN_SECRET : 'token-secret',
        (err, payload) => {
          if(err){
            if(err.name === 'JsonWebTokenError'){
              return reject(err.message);
            }
            return reject(err.message);
          }
          return resolve(payload);
     });
});
