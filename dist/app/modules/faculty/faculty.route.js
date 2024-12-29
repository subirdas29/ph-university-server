"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const faculty_controller_1 = require("./faculty.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.faculty), faculty_controller_1.FacultyController.getAllFaculty);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin, user_constant_1.USER_ROLES.faculty), faculty_controller_1.FacultyController.getOneFaculty);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin), faculty_controller_1.FacultyController.updateFaculty);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLES.superAdmin, user_constant_1.USER_ROLES.admin), faculty_controller_1.FacultyController.deleteFaculty);
exports.FacultyRoutes = router;
