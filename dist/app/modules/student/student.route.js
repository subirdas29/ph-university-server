"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const student_controller_1 = require("./student.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const student_validation_1 = require("./student.validation");
const router = express_1.default.Router();
// ekhane client side theke jkn /create-student route e hit hbe tkn StudentController.studentController ae controller function e route call hbe
router.get('/', student_controller_1.StudentController.getAllStudent);
router.get('/:id', student_controller_1.StudentController.getOneStudent);
router.patch('/:id', (0, validateRequest_1.default)(student_validation_1.updateStudentValidationSchema), student_controller_1.StudentController.updateStudent);
router.delete('/:id', student_controller_1.StudentController.deleteOneStudent);
exports.StudentRoutes = router; // eta nijei ekta object tai alada kore object create korar drkr nai.
