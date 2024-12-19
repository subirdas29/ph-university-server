import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import  { JwtPayload } from "jsonwebtoken"
import config from "../../config";
import bcrypt from "bcrypt";
import { createToken } from "./auth.utils";
import jwt from "jsonwebtoken"

const loginUser = async(payload:TLoginUser)=>{
    // checking if the user is exist

    // const isUserExists = await User.findOne({id: payload?.id});
    // if(!isUserExists){
    //     throw new AppError(httpStatus.NOT_FOUND,"User is not found");
    // }
    const user = await User.isUserExistsByCustomId(payload.id);
    

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    // checking if the user is already deleted

    const isUserDeleted = user?.isDeleted

    if(isUserDeleted){
        throw new AppError(httpStatus.FORBIDDEN,"This user is deleted")
    }

    // checking if the user is blocked
    
    const isUserBlocked = user?.status
    if(isUserBlocked === 'blocked'){
        throw new AppError(httpStatus.FORBIDDEN,"This user is blocked")
    }

    //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password))){
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }
    
//create token and send to the client


const jwtPayload ={
    userId:user?.id,
    role: user?.role
}



   const accessToken = createToken(jwtPayload,config.jwt_access_secret as string,config.jwt_access_expires_in as string)

    const refreshToken = createToken(jwtPayload,config.jwt_refresh_secret as string,config.jwt_refresh_expires_in as string)

    return{
        accessToken,
        refreshToken,
        needPasswordChange:user?.needsPasswordChange
    }
}

const changePassword = async(userData:JwtPayload,payload:{oldPassword:string, newPassword:string})=>{

    const user = await User.isUserExistsByCustomId(userData?.userId);

        

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    // checking if the user is already deleted

    const isUserDeleted = user?.isDeleted

    if(isUserDeleted){
        throw new AppError(httpStatus.FORBIDDEN,"This user is deleted")
    }

    // checking if the user is blocked
    
    const isUserBlocked = user?.status
    if(isUserBlocked === 'blocked'){
        throw new AppError(httpStatus.FORBIDDEN,"This user is blocked")
    }

    //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))){
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  //hash new password

  const newHashedPassword = await bcrypt.hash(payload?.newPassword,Number(config.bcrypt_salt_rounds))

    await User.findOneAndUpdate({
        id:userData?.userId,
        role:userData?.role
    },{
        password:newHashedPassword,
        needsPasswordChange:false,
        passwordChangedAt:new Date(),
    })

    return null

}



const refreshToken = async(token:string)=>{
  if(!token){
    throw new AppError(httpStatus.UNAUTHORIZED,"You are not authorized")
}

const decoded = jwt.verify(token,config.jwt_refresh_secret as string) as JwtPayload


const {userId,iat} = decoded

const user = await User.isUserExistsByCustomId(userId);
    

if (!user) {
  throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
}

// checking if the user is already deleted

const isUserDeleted = user?.isDeleted

if(isUserDeleted){
    throw new AppError(httpStatus.FORBIDDEN,"This user is deleted")
}

// checking if the user is blocked

const isUserBlocked = user?.status
if(isUserBlocked === 'blocked'){
    throw new AppError(httpStatus.FORBIDDEN,"This user is blocked")
}

if (
  user.passwordChangedAt &&
  User.isJWTIssuedBeforePasswordChanged(
    user.passwordChangedAt,
    iat as number,
  )
) {
  throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
}
const jwtPayload ={
  userId:user?.id,
  role: user?.role
}

 const accessToken = createToken(jwtPayload,config.jwt_access_secret as string,config.jwt_access_expires_in as string)

 return{
  accessToken,
 }

}

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken
}