/* eslint-disable @typescript-eslint/no-unused-vars */

import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCourseFaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
  };

  const getAllCoursesFromDB = async(query:Record<string,unknown>)=>{
    const courseQuery = new QueryBuilder(Course.find().populate(
        'preRequisiteCourses.course',
      ),query).search(CourseSearchableFields).filter().sort().paginate().fields()

    const result = await courseQuery.modelQuery
    return result;
  }

  const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );
    return result;
  };

  const updateSingleCourseIntoDB = async (id:string, payload:Partial<TCourse>)=>{
    const {preRequisiteCourses,...remainingCourseData} = payload;

   const session = await mongoose.startSession()

   try{
    session.startTransaction()
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(id,
      remainingCourseData,{
        new:true, runValidators:true,session
      }
    )

    if(!updateBasicCourseInfo){
      throw new AppError(httpStatus.BAD_REQUEST,'Failed to updated basic course')
    }

   if(preRequisiteCourses && preRequisiteCourses.length>0){
    const deletePreRequisite = preRequisiteCourses?.filter(el=>el.course&&el.isDeleted).map(el=>el.course)
    const deletePreRequisiteCourses = await Course.findByIdAndUpdate(id,{
      $pull:{preRequisiteCourses:{course:{$in:deletePreRequisite}}}
    },{
      new:true,runValidators:true,session
    })

    if(!deletePreRequisiteCourses){
      throw new AppError(httpStatus.BAD_REQUEST,'Failed to deleted PreRequisite course')
    }
    
    const newPreRequisite = preRequisiteCourses?.filter(el=>el.course && !el.isDeleted)
    const newPreRequisiteCourses = await Course.findByIdAndUpdate(id,{
      $addToSet:{preRequisiteCourses:{$each:newPreRequisite}}
    },{
      new:true,runValidators:true, session
    })

    if(!newPreRequisiteCourses){
      throw new AppError(httpStatus.BAD_REQUEST,'Failed to add PreRequisite course')
    }
  }
    await session.commitTransaction()
    await session.endSession()

    const result = await Course.findById(id).populate('preRequisiteCourses.course')
    return result
   
  
   }
   catch(err){
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to updated data')
   }
  }

  const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
      id,
      { isDeleted: true },
      {
        new: true,
      },
    );
    return result;
  };


  const assignFacultiesWithCourseIntoDB = async(id:string,payload:Partial<TCourseFaculty>)=>{ //ekhane id ta theke course ta pabo, ar payload theke faculties data gula array hisabe pabo.

    const result = await CourseFaculty.findByIdAndUpdate(id,{
      course:id,
      $addToSet:{faculties:{$each:payload}}
    },
  {
    upsert: true,//course & er under ag e theke faculty na thkle ta create korte hbe.erpr new kono faculty asle ta create na kore faculties array te add korte hbe tai upsert use hyse
    new: true,
  }
  )
    
    return result
  }

  const removeFacultiesWithCourseIntoDB = async(id:string, payload:Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(id,{
      $pull:{faculties:{$in:payload}}
    },{
      new: true,
    })
    return result
  }

  export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    updateSingleCourseIntoDB,
    deleteCourseFromDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesWithCourseIntoDB
  };