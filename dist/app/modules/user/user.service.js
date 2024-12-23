"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicSemester_model_1 = require("../academicSemester/academicSemester.model");
const student_model_1 = require("../student/student.model");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const mongoose_1 = __importDefault(require("mongoose"));
const faculty_model_1 = require("../faculty/faculty.model");
const admin_model_1 = require("../admin/admin.model");
//create Student
const createStudentIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // controller theke service e asar por service model er upor dbquery calai database e data insert korbe.
    // if (await Student.isUserExists(payload.id)) {
    //   throw new Error('User already Exists!');
    // }
    //create a user object
    const userData = {};
    userData.password = password || config_1.default.default_password;
    //set student role
    userData.role = 'student';
    userData.email = payload === null || payload === void 0 ? void 0 : payload.email;
    // find academic semester info
    const admissionSemester = yield academicSemester_model_1.AcademicSemester.findById(payload.admissionSemester);
    if (!admissionSemester) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Admission semester not found.');
    }
    // Transaction and Rollback:
    //eta kora hoi jkn 2ta bah tar bsi collection e ek7e data write kora lage, tkn ae process e data jate properly error bah properly database e write korte er dara properly handle kora jai.
    const session = yield mongoose_1.default.startSession(); // isolated environment create kora hyse trasaction er jonno
    try {
        session.startTransaction();
        //set  generated id
        userData.id = yield (0, user_utils_1.generatedStudentId)(admissionSemester);
        //create a user
        //(Transaction-1)
        const newUser = yield user_model_1.User.create([userData], { session }); //transaction e data array hisabe ashe. tai [useData] array hisabe diya hyse
        //create a student
        // if (Object.keys(newUser).length)
        if (!newUser.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        payload.id = newUser[0].id; //embedded id
        payload.user = newUser[0]._id; //reference id
        //(Transaction-2)
        const newStudent = yield student_model_1.Student.create([payload], { session });
        if (!newStudent.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Student');
        }
        yield session.commitTransaction(); // etar maddhome transaction complete kore isolated environment theke data database e parmanently add hbe
        yield session.endSession(); // create kora session ta end kortehbe
        return newStudent;
    }
    catch (err) {
        yield session.abortTransaction(); // eta diya rollback er maddhome abr session er surute pathano hoi and session ses kora hoi
        yield session.endSession();
        throw new Error('Failed to create student');
    }
});
// ae return data controller er kase data pathabe
// const student = new Student(payload); //create an instance
// if(await student.isUserExists(payload.id)){ // isUserExists ekn db query korbe tai time lage er jonno await use korte hbe
//   throw new Error('User already Exists!')
// }
// const result = await student.save(); //built in instance method of mongoose
//Create Faculty 
const createFacultyIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {};
    userData.role = 'faculty';
    userData.password = password || config_1.default.default_password;
    userData.email = payload === null || payload === void 0 ? void 0 : payload.email;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        userData.id = yield (0, user_utils_1.generatedFacultyId)();
        const newUser = yield user_model_1.User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to Create User');
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
        const newFaculty = yield faculty_model_1.Faculty.create([payload], { session });
        if (!newFaculty.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to Create Faculty');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newFaculty;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to Create Faculty');
    }
});
const createAdminIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // create a user object
    const userData = {};
    //if password is not given , use deafult password
    userData.password = password || config_1.default.default_password;
    //set student role
    userData.role = 'admin';
    userData.email = payload === null || payload === void 0 ? void 0 : payload.email;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //set  generated id
        userData.id = yield (0, user_utils_1.generateAdminId)();
        // create a user (transaction-1)
        const newUser = yield user_model_1.User.create([userData], { session });
        //create a admin
        if (!newUser.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id
        // create a admin (transaction-2)
        const newAdmin = yield admin_model_1.Admin.create([payload], { session });
        if (!newAdmin.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newAdmin;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getMe = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === 'student') {
        result = yield student_model_1.Student.findOne({ id: userId }).populate('user');
    }
    if (role === 'admin') {
        result = yield admin_model_1.Admin.findOne({ id: userId }).populate('user');
    }
    if (role === 'faculty') {
        result = yield faculty_model_1.Faculty.findOne({ id: userId }).populate('user');
    }
    return result;
});
exports.UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMe
};
