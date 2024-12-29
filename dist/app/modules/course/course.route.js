"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("./course.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const course_validation_1 = require("./course.validation");
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/create-course', (0, auth_1.default)(user_constant_1.USER_ROLES.admin), (0, validateRequest_1.default)(course_validation_1.CourseValidations.createCourseValidationSchema), course_controller_1.CourseControllers.createCourse);
router.patch('/:id', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(course_validation_1.CourseValidations.updateCourseValidationSchema), course_controller_1.CourseControllers.updateSingleCourse);
router.get('/', 
// auth('admin', 'faculty', 'student'),
course_controller_1.CourseControllers.getAllCourses);
router.get('/:id', (0, auth_1.default)('admin', 'faculty', 'student'), course_controller_1.CourseControllers.getSingleCourse);
router.delete('/:id', (0, auth_1.default)('admin'), course_controller_1.CourseControllers.deleteCourse);
router.put('/:courseId/assign-faculties', (0, validateRequest_1.default)(course_validation_1.CourseValidations.facultiesWithCourseValidationSchema), course_controller_1.CourseControllers.assignFacultiesWithCourse);
router.delete('/:courseId/remove-faculties', (0, validateRequest_1.default)(course_validation_1.CourseValidations.facultiesWithCourseValidationSchema), course_controller_1.CourseControllers.removeFacultiesWithCourse);
exports.CourseRoutes = router;
