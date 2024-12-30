/* eslint-disable @typescript-eslint/no-explicit-any */

import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.model";
import { Student } from "../student/student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { OfferedCourse } from "../OfferedCourse/OfferedCourse.model";
import mongoose from "mongoose";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { calculateGradeAndPoints } from "./enrolledCourse.utils";

const createEnrolledCourse = async(userId:string,payload:TEnrolledCourse) =>{

    const {offeredCourse} = payload

   
     /**
   * Step1: Check if the offered cousres is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max credits exceed
   * Step4: Create an enrolled course
   */


const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)

if(!isOfferedCourseExists){
    throw new AppError(httpStatus.NOT_FOUND,'Offered Course not found')
}

if(isOfferedCourseExists.maxCapacity <= 0){
    throw new AppError(httpStatus.BAD_REQUEST,"Room is full")
}

const course = await Course.findById(isOfferedCourseExists.course)

const credits = course?.credits

const isStudentExists = await Student.findOne({id:userId},{_id:1}) // performance vlo howar jonno field filtering kore sudu _id ta niya hyse

if(!isStudentExists){
    throw new AppError(httpStatus.NOT_FOUND,'Student not found')
}

const isAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration:isOfferedCourseExists.semesterRegistration,
    offeredCourse,
    student: isStudentExists._id
})


if(isAlreadyEnrolled){
    throw new AppError(httpStatus.CONFLICT,"You are already enrolled in this course")
}

// check total credits exceeds maxCredit

const semesterRegistration = await SemesterRegistration.findById(isOfferedCourseExists.semesterRegistration).select('maxCredit')

const maxCredit = semesterRegistration?.maxCredit

//total enrolled credits + new enrolled course credit > maxCredit


//Note: Complex logic er khtre aggregation use korbo. jmn ekta collection er reference data onno collection e refer kore thake and sekhane jodi kno calcultion lage tkn aggregation use krbo


const enrolledCourse = await EnrolledCourse.aggregate([
    {$match:{
        semesterRegistration:isOfferedCourseExists.semesterRegistration,
        student:isStudentExists._id
    }},
    {
        $lookup:{
            from:"courses",
            localField:"course",
            foreignField:"_id",
            as:"enrolledCourseData"
        }
    },
    {
        $unwind:"$enrolledCourseData"
    },
    {
        $group:{_id:null,totalEnrollCredits:{$sum:"$enrolledCourseData.credits"}}
    },
    {
        $project:{
            _id:0,
            totalEnrollCredits:1
        }
    }
])

const totalCredits = enrolledCourse.length>0 ? enrolledCourse[0].totalEnrollCredits : 0


if(totalCredits &&  maxCredit && totalCredits + credits > maxCredit ) {
    throw new AppError(httpStatus.BAD_REQUEST,"You have exceeds maximum number of credits")
}

const session = await mongoose.startSession()

try{
    session.startTransaction()
    const result = await EnrolledCourse.create([{
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
           academicSemester: isOfferedCourseExists.academicSemester,
           academicFaculty: isOfferedCourseExists.academicFaculty,
           academicDepartment: isOfferedCourseExists.academicDepartment,
           offeredCourse: offeredCourse,
           course: isOfferedCourseExists.course,
           student: isStudentExists._id,
           faculty: isOfferedCourseExists.faculty,
           isEnrolled:true
   }],{session})

   if(!result){
       throw new AppError(httpStatus.BAD_REQUEST,"Failed to enrolled course")
   }

   const maxCapacity = isOfferedCourseExists.maxCapacity
   await OfferedCourse.findByIdAndUpdate(offeredCourse,{
       maxCapacity : maxCapacity -1 // ekhane data ekta tai ekhane transaction er jonno array er moddhe object k rakha lagbe na
   },{new:true,session})

   if(!maxCapacity){
    throw new AppError(httpStatus.BAD_REQUEST,"maxCapacity cannot decrease")
}

    await session.commitTransaction()
    await session.endSession()

    return result
}
   catch(err:any){
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST,err)
   }
}

const updateEnrolledCourseMarks = async (
    facultyId: string,
    payload: Partial<TEnrolledCourse>,
  ) => {
    const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  
    const isSemesterRegistrationExists =
      await SemesterRegistration.findById(semesterRegistration);
  
    if (!isSemesterRegistrationExists) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Semester registration not found !',
      );
    }
  
    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  
    if (!isOfferedCourseExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
    }
    const isStudentExists = await Student.findById(student);
  
    if (!isStudentExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
    }
  
    const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });
  
    if (!faculty) {
      throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
    }
  
    const isCourseBelongToFaculty = await EnrolledCourse.findOne({
      semesterRegistration,
      offeredCourse,
      student,
      faculty: faculty._id,
    });
  
    if (!isCourseBelongToFaculty) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden! !');
    }
  
    const modifiedData: Record<string, unknown> = {
      ...courseMarks,
    };
  
    if (courseMarks?.finalTerm) {
      const { classTest1, classTest2, midTerm, finalTerm } =
        isCourseBelongToFaculty.courseMarks;
  
        console.log(classTest1)
        console.log(classTest2)
        console.log(midTerm)
        console.log(isCourseBelongToFaculty.courseMarks.finalTerm)


      const totalMarks =
        Math.ceil(classTest1) +
        Math.ceil(midTerm) +
        Math.ceil(classTest2) +
        Math.ceil(finalTerm);
  
      const result = calculateGradeAndPoints(totalMarks);
  
      modifiedData.grade = result.grade;
      modifiedData.gradePoints = result.gradePoints;
      modifiedData.isCompleted = true;
    }
  
    if (courseMarks && Object.keys(courseMarks).length) {
      for (const [key, value] of Object.entries(courseMarks)) {
        modifiedData[`courseMarks.${key}`] = value;
      }
    }
  
    const result = await EnrolledCourse.findByIdAndUpdate(
      isCourseBelongToFaculty._id,
      modifiedData,
      {
        new: true,
      },
    );
  
    return result;
  };
  

export const EnrolledCourseService ={
    createEnrolledCourse,
    updateEnrolledCourseMarks
}