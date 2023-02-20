const JWT = require('jsonwebtoken')

async function encode(payload, secret){
  return await JWT.sign(payload, secret)
} 
function decode(token, secret){
  console.log(token)
  JWT.verify(token, secret, (err, decode) => {
    if(err){
      console.log(err)
      return
    }
    console.log(decode)
  })
}

encode({key:'bao'}, 'dinhbao').then((token) => decode(token, 'dinhbao'))

