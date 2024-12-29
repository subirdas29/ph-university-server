import express from 'express';

import { CourseControllers } from './course.controller';

import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { USER_ROLES } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);
router.patch(
  '/:id',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateSingleCourse,
);
router.get(
  '/',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin,USER_ROLES.faculty,USER_ROLES.student),
  CourseControllers.getAllCourses,
);
router.get(
  '/:id',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin,USER_ROLES.faculty,USER_ROLES.student),
  CourseControllers.getSingleCourse,
);
router.delete('/:id',auth(USER_ROLES.superAdmin,USER_ROLES.admin), CourseControllers.deleteCourse);
router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);
router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesWithCourse,
);

export const CourseRoutes = router;
