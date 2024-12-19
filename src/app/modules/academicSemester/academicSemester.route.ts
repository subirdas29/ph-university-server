import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validationRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validationRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);
router.get('/', AcademicSemesterControllers.getAllAcademicSemester);
router.get('/:semesterId', AcademicSemesterControllers.getOneAcademicSemester);
router.patch(
  '/:semesterId',
  validationRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemesterController,
);

export const AcademicSemesterRoutes = router;
