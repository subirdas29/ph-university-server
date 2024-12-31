import express from 'express';
import { StudentController } from './student.controller';
import validationRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

// ekhane client side theke jkn /create-student route e hit hbe tkn StudentController.studentController ae controller function e route call hbe

router.get('/', auth(USER_ROLES.superAdmin,USER_ROLES.admin), StudentController.getAllStudent);
router.get(
  '/:id',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty),
  StudentController.getOneStudent,
);
router.patch(
  '/:id', auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validationRequest(updateStudentValidationSchema),
  StudentController.updateStudent,
);
router.delete('/:id', auth(USER_ROLES.superAdmin,USER_ROLES.admin),StudentController.deleteOneStudent);

export const StudentRoutes = router; // eta nijei ekta object tai alada kore object create korar drkr nai.
