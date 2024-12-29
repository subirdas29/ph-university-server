import express from 'express';

import { CourseControllers } from './course.controller';

import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { USER_ROLES } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLES.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);
router.patch(
  '/:id',
  auth('admin'),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateSingleCourse,
);
router.get(
  '/',
  // auth('admin', 'faculty', 'student'),
  CourseControllers.getAllCourses,
);
router.get(
  '/:id',
  auth('admin', 'faculty', 'student'),
  CourseControllers.getSingleCourse,
);
router.delete('/:id', auth('admin'), CourseControllers.deleteCourse);
router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);
router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesWithCourse,
);

export const CourseRoutes = router;
