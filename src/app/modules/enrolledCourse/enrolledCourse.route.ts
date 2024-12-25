import express from 'express'
import validationRequest from '../../middlewares/validateRequest'
import { EnrolledCourseValidation } from './enrolledCourse.validation'
import { EnrolledCourseControllers } from './enrolledCourse.controller'

const router = express.Router()

router.post('/create-enrolled-course',validationRequest(EnrolledCourseValidation.createEnrolledCourseValidationZodSchema),EnrolledCourseControllers.createEnrolledCourse)

export const EnrolledCourseRoutes = router