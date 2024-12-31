import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validationRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import { USER_ROLES } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-academic-semester',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validationRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get('/', auth(USER_ROLES.superAdmin,USER_ROLES.admin,USER_ROLES.faculty,USER_ROLES.student), AcademicSemesterControllers.getAllAcademicSemester);

router.get('/:semesterId', auth(USER_ROLES.superAdmin,USER_ROLES.admin,USER_ROLES.faculty,USER_ROLES.student), AcademicSemesterControllers.getOneAcademicSemester);

router.patch(
  '/:semesterId', auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validationRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemesterController,
);

export const AcademicSemesterRoutes = router;
