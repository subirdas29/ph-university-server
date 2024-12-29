import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validationRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

// ekhane client side theke jkn /create-student route e hit hbe tkn StudentController.studentController ae controller function e route call hbe

router.post(
  '/create-student',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin),

  upload.single('file'), //ekhane multer middleware ti img file k json file e parse kore and temporary ekta file create kore uploads folder rakbe

  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudentController,
);

router.post(
  '/create-faculty',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFacultyController,
);

router.post(
  '/create-admin',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.get(
  '/me',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.student, USER_ROLES.faculty),
  UserControllers.getMe,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  auth(USER_ROLES.admin),
  validationRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

export const UserRoutes = router; // eta nijei ekta object tai alada kore object create korar drkr nai.
