import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-semester-registration', auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);

router.patch(
  '/:id', auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);

router.get(
  '/:id', auth(USER_ROLES.superAdmin,USER_ROLES.admin,USER_ROLES.faculty,USER_ROLES.student),
  SemesterRegistrationController.getSingleSemesterRegistration,
);

router.delete(
  '/:id',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  SemesterRegistrationController.deleteSemesterRegistration,
);

router.get('/',auth(USER_ROLES.superAdmin,USER_ROLES.admin,USER_ROLES.faculty,USER_ROLES.student), SemesterRegistrationController.getAllSemesterRegistrations);

export const semesterRegistrationRoutes = router;
