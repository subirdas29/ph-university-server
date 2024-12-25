"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const enrolledCourse_validation_1 = require("./enrolledCourse.validation");
const enrolledCourse_controller_1 = require("./enrolledCourse.controller");
const router = express_1.default.Router();
router.post('/create-enrolled-course', (0, validateRequest_1.default)(enrolledCourse_validation_1.EnrolledCourseValidation.createEnrolledCourseValidationZodSchema), enrolledCourse_controller_1.EnrolledCourseControllers.createEnrolledCourse);
exports.EnrolledCourseRoutes = router;
