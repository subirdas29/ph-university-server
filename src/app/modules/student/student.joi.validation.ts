//creating a student validation using JOI

import Joi from 'joi';

// User name schema
const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
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
  middleName: Joi.string().trim().optional(),
  lastName: Joi.string()
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
const guardianSchema = Joi.object({
  fatherName: Joi.string().trim().required().messages({
    'string.empty': "Father's name is required",
  }),
  fatherOccupation: Joi.string().trim().required().messages({
    'string.empty': "Father's occupation is required",
  }),
  fatherContactNo: Joi.string().trim().required().messages({
    'string.empty': "Father's contact number is required",
  }),
  motherName: Joi.string().trim().required().messages({
    'string.empty': "Mother's name is required",
  }),
  motherOccupation: Joi.string().trim().required().messages({
    'string.empty': "Mother's occupation is required",
  }),
  motherContactNo: Joi.string().trim().required().messages({
    'string.empty': "Mother's contact number is required",
  }),
});

// Local Guardian schema
const localGuardianSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': "Local guardian's name is required",
  }),
  occupation: Joi.string().trim().required().messages({
    'string.empty': "Local guardian's occupation is required",
  }),
  contactNo: Joi.string().trim().required().messages({
    'string.empty': "Local guardian's contact number is required",
  }),
  address: Joi.string().trim().required().messages({
    'string.empty': "Local guardian's address is required",
  }),
});

// Main student schema
const studentValidationSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    'string.empty': 'Student ID is required',
  }),
  name: userNameValidationSchema.required().messages({
    'any.required': 'Student name is required',
  }),
  gender: Joi.string().valid('Male', 'Female', 'Others').required().messages({
    'any.only': '{#value} is not a valid gender',
    'string.empty': 'Gender is required',
  }),
  dateOfBirth: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      'string.pattern.base': 'Date of birth must be in YYYY-MM-DD format',
    }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
  }),
  contactNo: Joi.string().trim().required().messages({
    'string.empty': 'Contact number is required',
  }),
  emergencyContactNo: Joi.string().trim().required().messages({
    'string.empty': 'Emergency contact number is required',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .messages({
      'any.only': '{#value} is not a valid blood group',
    }),
  presentAddress: Joi.string().trim().required().messages({
    'string.empty': 'Present address is required',
  }),
  permanentAddress: Joi.string().trim().required().messages({
    'string.empty': 'Permanent address is required',
  }),
  guardian: guardianSchema.required().messages({
    'any.required': 'Guardian details are required',
  }),
  localGuardian: localGuardianSchema.required().messages({
    'any.required': 'Local guardian details are required',
  }),
  profileImg: Joi.string()
    .pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp)$/i)
    .messages({
      'string.pattern.base':
        'Profile image must be a valid URL linking to an image file',
    }),
  isActive: Joi.string().valid('active', 'blocked').default('active').messages({
    'any.only': '{#value} is not a valid status',
  }),
});

export default studentValidationSchema;
