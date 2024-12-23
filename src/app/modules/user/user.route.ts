import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validationRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from './user.constant';

const router = express.Router();

// ekhane client side theke jkn /create-student route e hit hbe tkn StudentController.studentController ae controller function e route call hbe

router.post(
  '/create-student',
  auth(USER_ROLES.admin),
  validationRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudentController,
);

router.post(
  '/create-faculty',
  validationRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFacultyController,
);

router.post(
  '/create-admin',
  validationRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.get(
  '/me',
  auth(USER_ROLES.admin, USER_ROLES.student, USER_ROLES.faculty),
  UserControllers.getMe,
);

export const UserRoutes = router; // eta nijei ekta object tai alada kore object create korar drkr nai.
