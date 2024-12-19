import express from 'express';
import { StudentController } from './student.controller';
import validationRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.validation';

const router = express.Router();

// ekhane client side theke jkn /create-student route e hit hbe tkn StudentController.studentController ae controller function e route call hbe

router.get('/', StudentController.getAllStudent);
router.get('/:id', StudentController.getOneStudent);
router.patch('/:id',validationRequest(updateStudentValidationSchema), StudentController.updateStudent);
router.delete('/:id', StudentController.deleteOneStudent);

export const StudentRoutes = router; // eta nijei ekta object tai alada kore object create korar drkr nai.
