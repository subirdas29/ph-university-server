import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseService } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async(req,res)=>{

    const userId = req.user.userId

    const result = await EnrolledCourseService.createEnrolledCourse(userId,req.body)

    sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "Enrolled Course created successfully",
        data: result
    })
})

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    // updateEnrolledCourseMarks,
  };