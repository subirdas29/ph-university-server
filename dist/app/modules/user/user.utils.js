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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminId = exports.findLastAdminId = exports.generatedFacultyId = exports.generatedStudentId = void 0;
const user_model_1 = require("./user.model");
const findLastStudentId = () => __awaiter(void 0, void 0, void 0, function* () {
    const latestStudent = yield user_model_1.User.findOne({
        role: 'student',
    }, {
        id: 1,
        _id: 0,
    })
        .sort({ createdAt: -1 })
        .lean();
    return (latestStudent === null || latestStudent === void 0 ? void 0 : latestStudent.id) ? latestStudent.id : undefined;
});
const generatedStudentId = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let currentId = (0).toString();
    const latestStudentDetails = yield findLastStudentId();
    //2030010001
    const latestStudentSemesterYear = latestStudentDetails === null || latestStudentDetails === void 0 ? void 0 : latestStudentDetails.substring(0, 4);
    const latestStudentSemesterCode = latestStudentDetails === null || latestStudentDetails === void 0 ? void 0 : latestStudentDetails.substring(4, 6);
    if (latestStudentDetails &&
        latestStudentSemesterCode === payload.code &&
        latestStudentSemesterYear === payload.year) {
        currentId = latestStudentDetails === null || latestStudentDetails === void 0 ? void 0 : latestStudentDetails.substring(6);
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `${payload.year}${payload.code}${incrementId}`;
    return incrementId;
});
exports.generatedStudentId = generatedStudentId;
const findLastFacultyId = () => __awaiter(void 0, void 0, void 0, function* () {
    const latestFaculty = yield user_model_1.User.findOne({
        role: 'faculty'
    }, {
        id: 1,
        _id: 0
    }).sort({ createdAt: -1 }).lean();
    return (latestFaculty === null || latestFaculty === void 0 ? void 0 : latestFaculty.id) ? latestFaculty === null || latestFaculty === void 0 ? void 0 : latestFaculty.id : undefined;
});
const generatedFacultyId = () => __awaiter(void 0, void 0, void 0, function* () {
    let currentId = (0).toString();
    const latestFacultyDetails = yield findLastFacultyId();
    if (latestFacultyDetails) {
        currentId = latestFacultyDetails.substring(2);
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `F-${incrementId}`;
    return incrementId;
});
exports.generatedFacultyId = generatedFacultyId;
// Admin ID
const findLastAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastAdmin = yield user_model_1.User.findOne({
        role: 'admin',
    }, {
        id: 1,
        _id: 0,
    })
        .sort({
        createdAt: -1,
    })
        .lean();
    return (lastAdmin === null || lastAdmin === void 0 ? void 0 : lastAdmin.id) ? lastAdmin.id.substring(2) : undefined;
});
exports.findLastAdminId = findLastAdminId;
const generateAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    let currentId = (0).toString();
    const lastAdminId = yield (0, exports.findLastAdminId)();
    if (lastAdminId) {
        currentId = lastAdminId.substring(2);
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `A-${incrementId}`;
    return incrementId;
});
exports.generateAdminId = generateAdminId;
