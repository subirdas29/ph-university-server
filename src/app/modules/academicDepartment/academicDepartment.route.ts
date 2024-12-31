import express from 'express';

import validationRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-department',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validationRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);
router.get('/',auth(
  USER_ROLES.superAdmin,
  USER_ROLES.admin,
  USER_ROLES.faculty,
  USER_ROLES.student,
),  AcademicDepartmentControllers.getAllAcademicDepartments);
router.get(
  '/:departmentId',auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin,
    USER_ROLES.faculty,
    USER_ROLES.student,
  ),
  AcademicDepartmentControllers.getOneAcademicDepartment,
);
router.patch(
  '/:departmentId',auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin),
  validationRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartmentController,
);

export const AcademicDepartmentRoutes = router;
