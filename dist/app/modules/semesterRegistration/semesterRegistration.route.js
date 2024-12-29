"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.semesterRegistrationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const semesterRegistration_controller_1 = require("./semesterRegistration.controller");
const semesterRegistration_validation_1 = require("./semesterRegistration.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post('/create-semester-registration', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidations.createSemesterRegistrationValidationSchema), semesterRegistration_controller_1.SemesterRegistrationController.createSemesterRegistration);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema), semesterRegistration_controller_1.SemesterRegistrationController.updateSemesterRegistration);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.faculty, user_constant_1.USER_ROLES.student), semesterRegistration_controller_1.SemesterRegistrationController.getSingleSemesterRegistration);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin), semesterRegistration_controller_1.SemesterRegistrationController.deleteSemesterRegistration);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.faculty, user_constant_1.USER_ROLES.student), semesterRegistration_controller_1.SemesterRegistrationController.getAllSemesterRegistrations);
exports.semesterRegistrationRoutes = router;
