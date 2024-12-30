import express from 'express';

import { OfferedCourseControllers } from './OfferedCourse.controller';
import { OfferedCourseValidations } from './OfferedCourse.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-offered-course',
  auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin
  ),
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);
router.get('/',auth(
  USER_ROLES.superAdmin,
  USER_ROLES.admin,
  USER_ROLES.faculty,
),
OfferedCourseControllers.getAllOfferedCoursesFromDB
)

router.get(
  '/my-offered-courses',
  auth(USER_ROLES.student),
  OfferedCourseControllers.getMyOfferedCoursesFromDB,
);

router.get(
  '/:id',
  auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin,
    USER_ROLES.faculty,
    USER_ROLES.student,
  ),
  OfferedCourseControllers.getSingleOfferedCourses,
);



router.patch(
  '/:id',
  auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin
  ),
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
  '/:id',
  auth(
    USER_ROLES.superAdmin, 
    USER_ROLES.admin
  ),
  OfferedCourseControllers.deleteOfferedCourseFromDB,
);

export const offeredCourseRoutes = router;
