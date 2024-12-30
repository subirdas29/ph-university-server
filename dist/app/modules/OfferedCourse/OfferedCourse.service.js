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
exports.OfferedCourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const semesterRegistration_model_1 = require("../semesterRegistration/semesterRegistration.model");
const OfferedCourse_model_1 = require("./OfferedCourse.model");
const academicFaculty_model_1 = require("../academicFaculty/academicFaculty.model");
const academicDepartment_model_1 = require("../academicDepartment/academicDepartment.model");
const course_model_1 = require("../course/course.model");
const faculty_model_1 = require("../faculty/faculty.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const OfferedCourse_utils_1 = require("./OfferedCourse.utils");
const student_model_1 = require("../student/student.model");
const createOfferedCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, academicFaculty, academicDepartment, course, section, faculty, days, startTime, endTime, } = payload;
    /**
     * Step 1: check if the semester registration id is exists!
     * Step 2: check if the academic faculty id is exists!
     * Step 3: check if the academic department id is exists!
     * Step 4: check if the course id is exists!
     * Step 5: check if the faculty id is exists!
     * Step 6: check if the department is belong to the  faculty
     * Step 7: check if the same offered course same section in same registered semester exists
     * Step 8: get the schedules of the faculties
     * Step 9: check if the faculty is available at that time. If not then throw error
     * Step 10: create the offered course
     */
    //check if the semester registration id is exists!
    const isSemesterRegistrationExits = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExits) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Semester registration not found !');
    }
    const academicSemester = isSemesterRegistrationExits.academicSemester;
    const isAcademicFacultyExits = yield academicFaculty_model_1.AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExits) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Academic Faculty not found !');
    }
    const isAcademicDepartmentExits = yield academicDepartment_model_1.AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExits) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Academic Department not found !');
    }
    const isCourseExits = yield course_model_1.Course.findById(course);
    if (!isCourseExits) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found !');
    }
    const isFacultyExits = yield faculty_model_1.Faculty.findById(faculty);
    if (!isFacultyExits) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found !');
    }
    // check if the department is belong to the  faculty
    const isDepartmentBelongToFaculty = yield academicDepartment_model_1.AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty,
    });
    if (!isDepartmentBelongToFaculty) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `This ${isAcademicDepartmentExits.name} is not  belong to this ${isAcademicFacultyExits.name}`);
    }
    // check if the same offered course same section in same registered semester exists
    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection = yield OfferedCourse_model_1.OfferedCourse.findOne({
        semesterRegistration,
        course,
        section,
    });
    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Offered course with same section is already exist!`);
    }
    // get the schedules of the faculties
    //ekhane sei day te faculty mane sir er time schedule ta bair kore milaite hbe.jei sir er same day te time slot book oi time slot ar niya jabe na.
    const assignedSchedules = yield OfferedCourse_model_1.OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }, // days er upor depend kore time gula compare korbo
    }).select('days startTime endTime');
    const newSchedule = {
        days,
        startTime,
        endTime,
    };
    if ((0, OfferedCourse_utils_1.hasTimeConflict)(assignedSchedules, newSchedule)) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, `This faculty is not available at that time ! Choose other time or day`);
    }
    const result = yield OfferedCourse_model_1.OfferedCourse.create(Object.assign(Object.assign({}, payload), { academicSemester }));
    return result;
});
const getAllOfferedCoursesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const offeredCourseQuery = new QueryBuilder_1.default(OfferedCourse_model_1.OfferedCourse.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield offeredCourseQuery.modelQuery;
    const meta = yield offeredCourseQuery.countTotal();
    return {
        meta,
        result,
    };
});
const getMyOfferedCoursesFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findOne({ id: userId });
    if (!student) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Student not found");
    }
    const currentOngoingRegistrationSemester = yield semesterRegistration_model_1.SemesterRegistration.findOne({ status: "ONGOING" });
    if (!currentOngoingRegistrationSemester) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "There is no ongoing semester registration");
    }
    //ekhane sei course gula kei show korbo jeigula preRequisiteCourses nai, trpr jeigula specific student er faculty,department and tar semesterregistration ongoing, ar jodi sei student already kno course enroll kore fele sei course ar dekhabo na.
    const result = yield OfferedCourse_model_1.OfferedCourse.aggregate([
        {
            $match: {
                semesterRegistration: currentOngoingRegistrationSemester._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $unwind: '$course'
        },
        //ae stage e enrolled Course gula k filter out korte hbe
        {
            $lookup: {
                from: "enrolledcourses",
                let: {
                    currentOngoingRegistrationSemester: currentOngoingRegistrationSemester._id,
                    currentStudent: student._id
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$semesterRegistration',
                                            '$$currentOngoingRegistrationSemester']
                                    },
                                    {
                                        $eq: ['$student', '$$currentStudent']
                                    },
                                    {
                                        $eq: ['$isEnrolled', true]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: "enrolledCourses"
            }
        },
        {
            $lookup: {
                from: "enrolledcourses",
                let: {
                    currentStudent: student._id
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$currentStudent']
                                    },
                                    {
                                        $eq: ['$isCompleted', true]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: "completedCourses"
            }
        },
        {
            $addFields: {
                completedCoursesIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'complete',
                        in: '$$complete.course'
                    }
                }
            }
        },
        {
            $addFields: {
                isPreRequisiteFulFilled: {
                    $or: [
                        { $eq: ['$course.preRequisiteCourses', []] },
                        { $setIsSubset: ['$course.preRequisiteCourses.course', '$completedCoursesIds'] } //ekhane sob course er 7e onno complete course er subset full check kore
                    ]
                },
                isAlreadyEnrolled: {
                    $in: ['$course._id', {
                            $map: {
                                input: '$enrolledCourses',
                                as: 'enroll', // enrollcourses array tar vitor thaka protita object k enroll nam diya holo loop er jonno
                                in: '$$enroll.course' // ekn proti ta enroll er course er 7e course._id er compare hbe, enroll nam ta mainly exist kore na tai er data paite gele $$ dite hoi
                            }
                        }]
                }
            }
        },
        {
            $match: {
                isPreRequisiteFulFilled: true,
                isAlreadyEnrolled: false
            }
        }
    ]);
    return result;
});
const getSingleOfferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const offeredCourse = yield OfferedCourse_model_1.OfferedCourse.findById(id);
    if (!offeredCourse) {
        throw new AppError_1.default(404, 'Offered Course not found');
    }
    return offeredCourse;
});
const updateOfferedCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { faculty, days, startTime, endTime } = payload;
    const isOfferCourseExists = yield OfferedCourse_model_1.OfferedCourse.findById(id);
    if (!isOfferCourseExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Offer course not found');
    }
    const isFacultyExists = yield faculty_model_1.Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'faculty is not found');
    }
    const semesterRegistration = isOfferCourseExists === null || isOfferCourseExists === void 0 ? void 0 : isOfferCourseExists.semesterRegistration;
    const semesterRegistrationStatus = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if ((semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status) !== 'UPCOMING') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `You can not update this offered course as it is ${semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status}`);
    }
    const assignedSchedules = yield OfferedCourse_model_1.OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');
    const newSchedule = {
        days,
        startTime,
        endTime,
    };
    if ((0, OfferedCourse_utils_1.hasTimeConflict)(assignedSchedules, newSchedule)) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, `This faculty is not available at that time ! Choose other time or day`);
    }
    const result = yield OfferedCourse_model_1.OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteOfferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the semester registration status is upcoming
     * Step 3: delete the offered course
     */
    const isOfferedCourseExists = yield OfferedCourse_model_1.OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Offered Course not found');
    }
    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    const semesterRegistrationStatus = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration).select('status');
    if ((semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status) !== 'UPCOMING') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Offered course can not update ! because the semester ${semesterRegistrationStatus}`);
    }
    const result = yield OfferedCourse_model_1.OfferedCourse.findByIdAndDelete(id);
    return result;
});
exports.OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getMyOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    deleteOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
};
