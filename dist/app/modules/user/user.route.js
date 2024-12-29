"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const student_validation_1 = require("../student/student.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faculty_validation_1 = require("../faculty/faculty.validation");
const admin_validation_1 = require("../admin/admin.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const user_validation_1 = require("./user.validation");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
// ekhane client side theke jkn /create-student route e hit hbe tkn StudentController.studentController ae controller function e route call hbe
router.post('/create-student', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin), sendImageToCloudinary_1.upload.single('file'), //ekhane multer middleware ti img file k json file e parse kore and temporary ekta file create kore uploads folder rakbe
(req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(student_validation_1.studentValidations.createStudentValidationSchema), user_controller_1.UserControllers.createStudentController);
router.post('/create-faculty', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(faculty_validation_1.facultyValidations.createFacultyValidationSchema), user_controller_1.UserControllers.createFacultyController);
router.post('/create-admin', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(admin_validation_1.createAdminValidationSchema), user_controller_1.UserControllers.createAdmin);
router.get('/me', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.student, user_constant_1.USER_ROLES.faculty), user_controller_1.UserControllers.getMe);
router.post('/change-status/:id', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin), (0, auth_1.default)(user_constant_1.USER_ROLES.admin), (0, validateRequest_1.default)(user_validation_1.UserValidation.changeStatusValidationSchema), user_controller_1.UserControllers.changeStatus);
exports.UserRoutes = router; // eta nijei ekta object tai alada kore object create korar drkr nai.
