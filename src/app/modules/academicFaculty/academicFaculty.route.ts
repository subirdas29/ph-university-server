import express from 'express';

import validationRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-faculty',auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validationRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/', auth(
  USER_ROLES.superAdmin,
  USER_ROLES.admin,
  USER_ROLES.faculty,
  USER_ROLES.student,
), AcademicFacultyControllers.getAllAcademicFaculties);

router.get('/:facultyId',auth(
  USER_ROLES.superAdmin,
  USER_ROLES.admin,
  USER_ROLES.faculty,
  USER_ROLES.student,
), AcademicFacultyControllers.getOneAcademicFaculty);

router.patch(
  '/:facultyId',auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin),
  validationRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFacultyController,
);

export const AcademicFacultyRoutes = router;
