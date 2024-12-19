"use strict";
//creating a student validation using JOI
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
// User name schema
const userNameValidationSchema = joi_1.default.object({
    firstName: joi_1.default.string()
        .trim()
        .required()
        .max(10)
        .pattern(/^[A-Z][a-z]*$/)
        .messages({
        'string.base': 'First name must be a string',
        'string.empty': 'First name is required',
        'string.max': 'First name cannot be more than 10 characters',
        'string.pattern.base': 'First name must start with a capital letter',
    }),
    middleName: joi_1.default.string().trim().optional(),
    lastName: joi_1.default.string()
        .trim()
        .required()
        .pattern(/^[A-Za-z]+$/)
        .messages({
        'string.base': 'Last name must be a string',
        'string.empty': 'Last name is required',
        'string.pattern.base': 'Last name must only contain letters',
    }),
});
// Guardian schema
const guardianSchema = joi_1.default.object({
    fatherName: joi_1.default.string().trim().required().messages({
        'string.empty': "Father's name is required",
    }),
    fatherOccupation: joi_1.default.string().trim().required().messages({
        'string.empty': "Father's occupation is required",
    }),
    fatherContactNo: joi_1.default.string().trim().required().messages({
        'string.empty': "Father's contact number is required",
    }),
    motherName: joi_1.default.string().trim().required().messages({
        'string.empty': "Mother's name is required",
    }),
    motherOccupation: joi_1.default.string().trim().required().messages({
        'string.empty': "Mother's occupation is required",
    }),
    motherContactNo: joi_1.default.string().trim().required().messages({
        'string.empty': "Mother's contact number is required",
    }),
});
// Local Guardian schema
const localGuardianSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required().messages({
        'string.empty': "Local guardian's name is required",
    }),
    occupation: joi_1.default.string().trim().required().messages({
        'string.empty': "Local guardian's occupation is required",
    }),
    contactNo: joi_1.default.string().trim().required().messages({
        'string.empty': "Local guardian's contact number is required",
    }),
    address: joi_1.default.string().trim().required().messages({
        'string.empty': "Local guardian's address is required",
    }),
});
// Main student schema
const studentValidationSchema = joi_1.default.object({
    id: joi_1.default.string().trim().required().messages({
        'string.empty': 'Student ID is required',
    }),
    name: userNameValidationSchema.required().messages({
        'any.required': 'Student name is required',
    }),
    gender: joi_1.default.string().valid('Male', 'Female', 'Others').required().messages({
        'any.only': '{#value} is not a valid gender',
        'string.empty': 'Gender is required',
    }),
    dateOfBirth: joi_1.default.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .messages({
        'string.pattern.base': 'Date of birth must be in YYYY-MM-DD format',
    }),
    email: joi_1.default.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please enter a valid email address',
    }),
    contactNo: joi_1.default.string().trim().required().messages({
        'string.empty': 'Contact number is required',
    }),
    emergencyContactNo: joi_1.default.string().trim().required().messages({
        'string.empty': 'Emergency contact number is required',
    }),
    bloodGroup: joi_1.default.string()
        .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
        .messages({
        'any.only': '{#value} is not a valid blood group',
    }),
    presentAddress: joi_1.default.string().trim().required().messages({
        'string.empty': 'Present address is required',
    }),
    permanentAddress: joi_1.default.string().trim().required().messages({
        'string.empty': 'Permanent address is required',
    }),
    guardian: guardianSchema.required().messages({
        'any.required': 'Guardian details are required',
    }),
    localGuardian: localGuardianSchema.required().messages({
        'any.required': 'Local guardian details are required',
    }),
    profileImg: joi_1.default.string()
        .pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp)$/i)
        .messages({
        'string.pattern.base': 'Profile image must be a valid URL linking to an image file',
    }),
    isActive: joi_1.default.string().valid('active', 'blocked').default('active').messages({
        'any.only': '{#value} is not a valid status',
    }),
});
exports.default = studentValidationSchema;
