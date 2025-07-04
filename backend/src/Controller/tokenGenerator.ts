import jwt from 'jsonwebtoken'
import { JWT_ACCESS_SECRET_KEY ,JWT_REFRESH_SECRET_KEY} from '../config.js'

export const tokenGenerator = (data:any)=>{
    
    const accessToken =  jwt.sign(data,JWT_ACCESS_SECRET_KEY,{expiresIn:'5hr'}) //{payload,secret,options}

    const refreshToken = jwt.sign(data,JWT_REFRESH_SECRET_KEY,{expiresIn:'1d'}) //{payload,secret,options}

    return [accessToken,refreshToken]
}