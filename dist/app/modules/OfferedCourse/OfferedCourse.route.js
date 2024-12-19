"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offeredCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const OfferedCourse_controller_1 = require("./OfferedCourse.controller");
const OfferedCourse_validation_1 = require("./OfferedCourse.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.post('/create-offered-course', (0, validateRequest_1.default)(OfferedCourse_validation_1.OfferedCourseValidations.createOfferedCourseValidationSchema), OfferedCourse_controller_1.OfferedCourseControllers.createOfferedCourse);
router.patch('/:id', (0, validateRequest_1.default)(OfferedCourse_validation_1.OfferedCourseValidations.updateOfferedCourseValidationSchema), OfferedCourse_controller_1.OfferedCourseControllers.updateOfferedCourse);
exports.offeredCourseRoutes = router;
