"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentValidations = exports.updateStudentValidationSchema = void 0;
const zod_1 = require("zod");
// User Name Schema
const userNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'First name is required' })
        .max(10, { message: 'First name cannot exceed 10 characters' })
        .refine((value) => /^[A-Z][a-z]*$/.test(value), {
        message: 'First name must start with a capital letter',
    }),
    middleName: zod_1.z.string().trim().optional(),
    lastName: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Last name is required' })
        .refine((value) => /^[A-Za-z]+$/.test(value), {
        message: 'Last name must contain only letters',
    }),
});
// Guardian Schema
const guardianValidationSchema = zod_1.z.object({
    fatherName: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Father's name is required" }),
    fatherOccupation: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Father's occupation is required" }),
    fatherContactNo: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Father's contact number is required" }),
    motherName: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Mother's name is required" }),
    motherOccupation: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Mother's occupation is required" }),
    motherContactNo: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Mother's contact number is required" }),
});
// Local Guardian Schema
const localGuardianValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Local guardian's name is required" }),
    occupation: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Local guardian's occupation is required" }),
    contactNo: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Local guardian's contact number is required" }),
    address: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Local guardian's address is required" }),
});
// Main Student Schema
const createStudentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string()
            .trim()
            .max(20, { message: 'Password cannot more than 20' })
            .optional(),
        student: zod_1.z.object({
            name: userNameValidationSchema,
            gender: zod_1.z.enum(['Male', 'Female', 'Others'], {
                errorMap: () => ({ message: 'Gender must be Male, Female, or Others' }),
            }),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z
                .string()
                .email({ message: 'Email must be a valid email address' }),
            contactNo: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Contact number is required' }),
            emergencyContactNo: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Emergency contact number is required' }),
            bloodGroup: zod_1.z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
                .optional(),
            presentAddress: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Present address is required' }),
            permanentAddress: zod_1.z
                .string()
                .trim()
                .min(1, { message: 'Permanent address is required' }),
            guardian: guardianValidationSchema,
            localGuardian: localGuardianValidationSchema,
            admissionSemester: zod_1.z.string(),
            academicDepartment: zod_1.z.string(),
        }),
    }),
});
const updateUserNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(20).optional(),
    middleName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
});
const updateGuardianValidationSchema = zod_1.z.object({
    fatherName: zod_1.z.string().optional(),
    fatherOccupation: zod_1.z.string().optional(),
    fatherContactNo: zod_1.z.string().optional(),
    motherName: zod_1.z.string().optional(),
    motherOccupation: zod_1.z.string().optional(),
    motherContactNo: zod_1.z.string().optional(),
});
const updateLocalGuardianValidationSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    occupation: zod_1.z.string().optional(),
    contactNo: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
exports.updateStudentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        student: zod_1.z.object({
            name: updateUserNameValidationSchema,
            gender: zod_1.z.enum(['male', 'female', 'other']).optional(),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            contactNo: zod_1.z.string().optional(),
            emergencyContactNo: zod_1.z.string().optional(),
            bloodGroup: zod_1.z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
                .optional(),
            presentAddress: zod_1.z.string().optional(),
            permanentAddress: zod_1.z.string().optional(),
            guardian: updateGuardianValidationSchema.optional(),
            localGuardian: updateLocalGuardianValidationSchema.optional(),
            admissionSemester: zod_1.z.string().optional(),
            academicDepartment: zod_1.z.string().optional(),
        }),
    }),
});
exports.studentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema: exports.updateStudentValidationSchema,
};
