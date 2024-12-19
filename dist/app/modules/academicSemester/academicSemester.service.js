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
exports.AcademicSemesterServices = void 0;
const academicSemester_constant_1 = require("./academicSemester.constant");
const academicSemester_model_1 = require("./academicSemester.model");
const createAcademicSemesterIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (academicSemester_constant_1.academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        //eta common logic er kaj na business common mane sudu academicSemester er khtre client data theke check hbe tai service validation check hyse. jodi common logic hyto thle model e use kortm
        throw new Error('Invalid Semester Code');
    }
    const result = yield academicSemester_model_1.AcademicSemester.create(payload);
    return result;
});
const getAllAcademicSemesterFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicSemester_model_1.AcademicSemester.find();
    return result;
});
const getOneAcademicSemesterFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicSemester_model_1.AcademicSemester.findById(id);
    return result;
});
const updateAcademicSemester = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.name &&
        payload.code &&
        academicSemester_constant_1.academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid Semester Code');
    }
    const result = yield academicSemester_model_1.AcademicSemester.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
exports.AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getOneAcademicSemesterFromDB,
    updateAcademicSemester,
};
