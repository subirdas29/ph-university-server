"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const academicSemester_controller_1 = require("./academicSemester.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicSemester_validation_1 = require("./academicSemester.validation");
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/create-academic-semester', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin), (0, validateRequest_1.default)(academicSemester_validation_1.AcademicSemesterValidations.createAcademicSemesterValidationSchema), academicSemester_controller_1.AcademicSemesterControllers.createAcademicSemester);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.faculty, user_constant_1.USER_ROLES.student), academicSemester_controller_1.AcademicSemesterControllers.getAllAcademicSemester);
router.get('/:semesterId', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.faculty, user_constant_1.USER_ROLES.student), academicSemester_controller_1.AcademicSemesterControllers.getOneAcademicSemester);
router.patch('/:semesterId', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin), (0, validateRequest_1.default)(academicSemester_validation_1.AcademicSemesterValidations.updateAcademicSemesterValidationSchema), academicSemester_controller_1.AcademicSemesterControllers.updateAcademicSemesterController);
exports.AcademicSemesterRoutes = router;
