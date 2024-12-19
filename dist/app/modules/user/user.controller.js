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
exports.UserControllers = void 0;
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
//controller request and response k controll korbe.eta sudu handle korbe application logic
const createStudentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, student: studentData } = req.body;
    // data validation using zod
    //   const zodParseData = studentValidationSchema.parse(studentData);
    //data validation using joi
    // const { error,value } = studentValidationSchema.validate(studentData);//3rd party joi schema diya validation kora hyse
    //route theke call hoi asar por controller e asbe, then service function e call hbe.service business logic er kaj korbe
    const result = yield user_service_1.UserServices.createStudentIntoDB(password, studentData);
    // if(error){ // Joi validation error message
    //   res.status(500).json({
    //     success: false,
    //     message: 'something went wrong',
    //     // ae data direct client er kase pathabe
    //     error: error.details,
    //   });
    // }
    //send response
    // res.status(200).json({
    //   success: true,
    //   message: 'data added successfully',
    //   // ae data direct client er kase pathabe
    //   data: result,
    // });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'data added successfully',
        data: result,
    });
}));
const createFacultyController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, faculty: facultyData } = req.body;
    const result = yield user_service_1.UserServices.createFacultyIntoDB(password, facultyData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'data added successfully',
        data: result,
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, admin: adminData } = req.body;
    const result = yield user_service_1.UserServices.createAdminIntoDB(password, adminData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin is created succesfully',
        data: result,
    });
}));
exports.UserControllers = {
    createStudentController,
    createFacultyController,
    createAdmin
};
