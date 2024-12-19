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
exports.AcademicDepartment = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const academicDepartmentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicFaculty',
    },
}, {
    timestamps: true,
});
// academicDepartmentSchema.pre('save', async function (next) {
//   const isDepartmentExit = await AcademicDepartment.findOne({
//     name: this.name,
//   });
//   if (isDepartmentExit) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Department already Exits');
//   }
//   next();
// });
academicDepartmentSchema.pre('findOneAndUpdate', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const query = this.getQuery();
        const isDepartmentExit = yield exports.AcademicDepartment.findOne(query);
        if (!isDepartmentExit) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Department doesn't exit");
        }
    });
});
exports.AcademicDepartment = (0, mongoose_2.model)('AcademicDepartment', academicDepartmentSchema);
