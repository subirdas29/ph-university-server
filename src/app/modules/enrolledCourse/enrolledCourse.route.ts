import express from 'express'
import validationRequest from '../../middlewares/validateRequest'
import { EnrolledCourseValidation } from './enrolledCourse.validation'
import { EnrolledCourseControllers } from './enrolledCourse.controller'
import { USER_ROLES } from '../user/user.constant'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post('/create-enrolled-course',auth(USER_ROLES.student),validationRequest(EnrolledCourseValidation.createEnrolledCourseValidationZodSchema),EnrolledCourseControllers.createEnrolledCourse)

export const EnrolledCourseRoutes = router