"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicDepartmentValidation = void 0;
const zod_1 = require("zod");
const createAcademicDepartmentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            invalid_type_error: 'Department Name must be string',
            required_error: 'Department is required',
        }),
        academicFaculty: zod_1.z.string({
            invalid_type_error: 'Academic Faculty must be string',
            required_error: 'Faculty is required',
        }),
    }),
});
const updateAcademicDepartmentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            invalid_type_error: 'Department Name must be string',
            required_error: 'Department is required',
        })
            .optional(),
        academicFaculty: zod_1.z
            .string({
            invalid_type_error: 'Academic Faculty must be string',
            required_error: 'Faculty is required',
        })
            .optional(),
    }),
});
exports.AcademicDepartmentValidation = {
    createAcademicDepartmentValidationSchema,
    updateAcademicDepartmentValidationSchema,
};
