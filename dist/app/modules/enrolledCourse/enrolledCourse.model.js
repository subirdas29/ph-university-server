"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledCourse = void 0;
const mongoose_1 = require("mongoose");
const enrolledCourse_constant_1 = require("./enrolledCourse.constant");
const courseMarksSchema = new mongoose_1.Schema({
    classTest1: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },
    midTerm: {
        type: Number,
        min: 0,
        max: 30,
        default: 0,
    },
    classTest2: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },
    finalTerm: {
        type: Number,
        min: 0,
        max: 50,
        default: 0,
    },
});
const enrolledCourseSchema = new mongoose_1.Schema({
    semesterRegistration: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'SemesterRegistration',
        required: true,
    },
    academicSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicSemester',
        required: true,
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicFaculty',
        required: true,
    },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicDepartment',
        required: true,
    },
    offeredCourse: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'OfferedCourse',
        required: true,
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    faculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true,
    },
    isEnrolled: {
        type: Boolean,
        default: false,
    },
    courseMarks: {
        type: courseMarksSchema,
        default: {},
    },
    grade: {
        type: String,
        enum: enrolledCourse_constant_1.Grade,
        default: 'NA',
    },
    gradePoints: {
        type: Number,
        min: 0,
        max: 4,
        default: 0,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
});
exports.EnrolledCourse = (0, mongoose_1.model)('EnrolledCourse', enrolledCourseSchema);
