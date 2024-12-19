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
exports.AcademicDepartmentControllers = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const academicDepartment_service_1 = require("./academicDepartment.service");
const createAcademicDepartment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicDepartment_service_1.AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Academic Department is Created successfully',
        data: result,
    });
}));
const getAllAcademicDepartments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicDepartment_service_1.AcademicDepartmentServices.getAllAcademicDepartmentIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Academic Departments are retrieved successfully',
        data: result,
    });
}));
const getOneAcademicDepartment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentId } = req.params;
    const result = yield academicDepartment_service_1.AcademicDepartmentServices.getOneAcademicDepartmentIntoDB(departmentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Academic Department is retrieved successfully',
        data: result,
    });
}));
const updateAcademicDepartmentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentId } = req.params;
    const result = yield academicDepartment_service_1.AcademicDepartmentServices.updateAcademicDepartmentIntoDB(departmentId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Academic Department is updated successfully',
        data: result,
    });
}));
exports.AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getOneAcademicDepartment,
    updateAcademicDepartmentController,
};
