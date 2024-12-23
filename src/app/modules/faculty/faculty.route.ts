import express from 'express';
import { FacultyController } from './faculty.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.faculty),
  FacultyController.getAllFaculty,
);
router.get('/:id', FacultyController.getOneFaculty);
router.patch('/:id', FacultyController.updateFaculty);
router.delete('/:id', FacultyController.deleteFaculty);

export const FacultyRoutes = router;
