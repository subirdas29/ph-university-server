"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    // const isUserExists = await User.findOne({id: payload?.id});
    // if(!isUserExists){
    //     throw new AppError(httpStatus.NOT_FOUND,"User is not found");
    // }
    const user = yield user_model_1.User.isUserExistsByCustomId(payload.id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isUserDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isUserDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted");
    }
    // checking if the user is blocked
    const isUserBlocked = user === null || user === void 0 ? void 0 : user.status;
    if (isUserBlocked === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked");
    }
    //checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    }
    //create token and send to the client
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user.id,
        role: user === null || user === void 0 ? void 0 : user.role
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: user === null || user === void 0 ? void 0 : user.needsPasswordChange
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExistsByCustomId(userData === null || userData === void 0 ? void 0 : userData.userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isUserDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isUserDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted");
    }
    // checking if the user is blocked
    const isUserBlocked = user === null || user === void 0 ? void 0 : user.status;
    if (isUserBlocked === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked");
    }
    //checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.oldPassword, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    }
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findOneAndUpdate({
        id: userData === null || userData === void 0 ? void 0 : userData.userId,
        role: userData === null || userData === void 0 ? void 0 : userData.role
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    });
    return null;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { userId, iat } = decoded;
    const user = yield user_model_1.User.isUserExistsByCustomId(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isUserDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isUserDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted");
    }
    // checking if the user is blocked
    const isUserBlocked = user === null || user === void 0 ? void 0 : user.status;
    if (isUserBlocked === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked");
    }
    if (user.passwordChangedAt &&
        user_model_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized !');
    }
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user.id,
        role: user === null || user === void 0 ? void 0 : user.role
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
exports.AuthServices = {
    loginUser,
    changePassword,
    refreshToken
};
