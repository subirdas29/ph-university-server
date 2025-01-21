/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import config from '../config';
import { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import { verifyToken } from '../modules/auth/auth.utils';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    let decoded
  
    try{
       decoded = verifyToken(token, config.jwt_access_secret as string);
    }
    catch(err){
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    const { userId, role, iat } = decoded;

    const user = await User.isUserExistsByCustomId(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    // checking if the user is already deleted

    const isUserDeleted = user?.isDeleted;

    if (isUserDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
    }

    // checking if the user is blocked

    const isUserBlocked = user?.status;
    if (isUserBlocked === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
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
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
