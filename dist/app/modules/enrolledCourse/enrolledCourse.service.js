"use strict";
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
exports.EnrolledCourseService = void 0;
const enrolledCourse_model_1 = require("./enrolledCourse.model");
const student_model_1 = require("../student/student.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const OfferedCourse_model_1 = require("../OfferedCourse/OfferedCourse.model");
const mongoose_1 = __importDefault(require("mongoose"));
const semesterRegistration_model_1 = require("../semesterRegistration/semesterRegistration.model");
const course_model_1 = require("../course/course.model");
const createEnrolledCourse = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { offeredCourse } = payload;
    /**
  * Step1: Check if the offered cousres is exists
  * Step2: Check if the student is already enrolled
  * Step3: Check if the max credits exceed
  * Step4: Create an enrolled course
  */
    const isOfferedCourseExists = yield OfferedCourse_model_1.OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Offered Course not found');
    }
    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Room is full");
    }
    const course = yield course_model_1.Course.findById(isOfferedCourseExists.course);
    const credits = course === null || course === void 0 ? void 0 : course.credits;
    const isStudentExists = yield student_model_1.Student.findOne({ id: userId }, { _id: 1 }); // performance vlo howar jonno field filtering kore sudu _id ta niya hyse
    if (!isStudentExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Student not found');
    }
    const isAlreadyEnrolled = yield enrolledCourse_model_1.EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        offeredCourse,
        student: isStudentExists._id
    });
    if (isAlreadyEnrolled) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "You are already enrolled in this course");
    }
    // check total credits exceeds maxCredit
    const semesterRegistration = yield semesterRegistration_model_1.SemesterRegistration.findById(isOfferedCourseExists.semesterRegistration).select('maxCredit');
    const maxCredit = semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.maxCredit;
    //total enrolled credits + new enrolled course credit > maxCredit
    //Note: Complex logic er khtre aggregation use korbo. jmn ekta collection er reference data onno collection e refer kore thake and sekhane jodi kno calcultion lage tkn aggregation use krbo
    const enrolledCourse = yield enrolledCourse_model_1.EnrolledCourse.aggregate([
        { $match: {
                semesterRegistration: isOfferedCourseExists.semesterRegistration,
                student: isStudentExists._id
            } },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "enrolledCourseData"
            }
        },
        {
            $unwind: "$enrolledCourseData"
        },
        {
            $group: { _id: null, totalEnrollCredits: { $sum: "$enrolledCourseData.credits" } }
        },
        {
            $project: {
                _id: 0,
                totalEnrollCredits: 1
            }
        }
    ]);
    const totalCredits = enrolledCourse.length > 0 ? enrolledCourse[0].totalEnrollCredits : 0;
    if (totalCredits && maxCredit && totalCredits + credits > maxCredit) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have exceeds maximum number of credits");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const result = yield enrolledCourse_model_1.EnrolledCourse.create([{
                semesterRegistration: isOfferedCourseExists.semesterRegistration,
                academicSemester: isOfferedCourseExists.academicSemester,
                academicFaculty: isOfferedCourseExists.academicFaculty,
                academicDepartment: isOfferedCourseExists.academicDepartment,
                offeredCourse: offeredCourse,
                course: isOfferedCourseExists.course,
                student: isStudentExists._id,
                faculty: isOfferedCourseExists.faculty,
                isEnrolled: true
            }], { session });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to enrolled course");
        }
        const maxCapacity = isOfferedCourseExists.maxCapacity;
        yield OfferedCourse_model_1.OfferedCourse.findByIdAndUpdate(offeredCourse, {
            maxCapacity: maxCapacity - 1 // ekhane data ekta tai ekhane transaction er jonno array er moddhe object k rakha lagbe na
        }, { new: true, session });
        if (!maxCapacity) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "maxCapacity cannot decrease");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, err);
    }
});
exports.EnrolledCourseService = {
    createEnrolledCourse
};
