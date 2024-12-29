import { z } from 'zod';

// User Name Schema
const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name is required' })
    .max(10, { message: 'First name cannot exceed 10 characters' })
    .refine((value) => /^[A-Z][a-z]*$/.test(value), {
      message: 'First name must start with a capital letter',
    }),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' })
    .refine((value) => /^[A-Za-z]+$/.test(value), {
      message: 'Last name must contain only letters',
    }),
});

// Guardian Schema
const guardianValidationSchema = z.object({
  fatherName: z
    .string()
    .trim()
    .min(1, { message: "Father's name is required" }),
  fatherOccupation: z
    .string()
    .trim()
    .min(1, { message: "Father's occupation is required" }),
  fatherContactNo: z
    .string()
    .trim()
    .min(1, { message: "Father's contact number is required" }),
  motherName: z
    .string()
    .trim()
    .min(1, { message: "Mother's name is required" }),
  motherOccupation: z
    .string()
    .trim()
    .min(1, { message: "Mother's occupation is required" }),
  motherContactNo: z
    .string()
    .trim()
    .min(1, { message: "Mother's contact number is required" }),
});

// Local Guardian Schema
const localGuardianValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Local guardian's name is required" }),
  occupation: z
    .string()
    .trim()
    .min(1, { message: "Local guardian's occupation is required" }),
  contactNo: z
    .string()
    .trim()
    .min(1, { message: "Local guardian's contact number is required" }),
  address: z
    .string()
    .trim()
    .min(1, { message: "Local guardian's address is required" }),
});

// Main Student Schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .max(20, { message: 'Password cannot more than 20' })
      .optional(),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['Male', 'Female', 'Others'], {
        errorMap: () => ({ message: 'Gender must be Male, Female, or Others' }),
      }),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email({ message: 'Email must be a valid email address' }),
      contactNo: z
        .string()
        .trim()
        .min(1, { message: 'Contact number is required' }),
      emergencyContactNo: z
        .string()
        .trim()
        .min(1, { message: 'Emergency contact number is required' }),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z
        .string()
        .trim()
        .min(1, { message: 'Present address is required' }),
      permanentAddress: z
        .string()
        .trim()
        .min(1, { message: 'Permanent address is required' }),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

export const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
