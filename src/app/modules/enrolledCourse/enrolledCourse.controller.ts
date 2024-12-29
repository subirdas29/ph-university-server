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

const updateEnrolledCourseMarks = catchAsync(async(req,res)=>{

    const userId = req.user.userId

    console.log(userId)

    const result = await EnrolledCourseService.updateEnrolledCourseMarks(userId,req.body)

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Course Marks updated successfully",
        data: result
    })
})

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
  };