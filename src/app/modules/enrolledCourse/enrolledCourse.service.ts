import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.model";

const createEnrolledCourse = async(payload:TEnrolledCourse) =>{
    const result = await EnrolledCourse.create(payload)
    return result
}

export const EnrolledCourseService ={
    createEnrolledCourse
}