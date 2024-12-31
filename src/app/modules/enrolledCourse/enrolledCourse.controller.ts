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

const getMyEnrolledCourses = catchAsync(async(req,res)=>{
    const userId = req.user.userId
    const query = req.query

    const result = await EnrolledCourseService.getEnrolledCourses(userId,query)

    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "YOur Course retrieved successfully",
        meta: result.meta,
        data: result.result
    })
})

const updateEnrolledCourseMarks = catchAsync(async(req,res)=>{

    const userId = req.user.userId

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
    getMyEnrolledCourses,
    updateEnrolledCourseMarks,
  };