/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateAdminId, generatedFacultyId, generatedStudentId } from './user.utils';
import mongoose from 'mongoose';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';


//create Student
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // controller theke service e asar por service model er upor dbquery calai database e data insert korbe.

  // if (await Student.isUserExists(payload.id)) {
  //   throw new Error('User already Exists!');
  // }
  //create a user object
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  //set student role
  userData.role = 'student';
  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admission semester not found.');
  }

  // Transaction and Rollback:
  //eta kora hoi jkn 2ta bah tar bsi collection e ek7e data write kora lage, tkn ae process e data jate properly error bah properly database e write korte er dara properly handle kora jai.

  const session = await mongoose.startSession(); // isolated environment create kora hyse trasaction er jonno

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generatedStudentId(admissionSemester);
    //create a user
    //(Transaction-1)
    const newUser = await User.create([userData], { session }); //transaction e data array hisabe ashe. tai [useData] array hisabe diya hyse
    //create a student
    // if (Object.keys(newUser).length)

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    payload.id = newUser[0].id; //embedded id
    payload.user = newUser[0]._id; //reference id

    //(Transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Student');
    }

    await session.commitTransaction(); // etar maddhome transaction complete kore isolated environment theke data database e parmanently add hbe
    await session.endSession(); // create kora session ta end kortehbe
    return newStudent;
  } 
  catch (err: any) {
    await session.abortTransaction(); // eta diya rollback er maddhome abr session er surute pathano hoi and session ses kora hoi
    await session.endSession();
    throw new Error('Failed to create student');
  }
};
// ae return data controller er kase data pathabe

// const student = new Student(payload); //create an instance

// if(await student.isUserExists(payload.id)){ // isUserExists ekn db query korbe tai time lage er jonno await use korte hbe
//   throw new Error('User already Exists!')
// }
// const result = await student.save(); //built in instance method of mongoose


//Create Faculty 
const createFacultyIntoDB = async(password:string, payload:TFaculty)=>{

  const userData:Partial<TUser> ={}
  
  userData.role = 'faculty'
  userData.password = password || (config.default_password as string)

  const session = await mongoose.startSession()

  try{
    session.startTransaction()
    userData.id = await generatedFacultyId()

    const newUser = await User.create([userData],{session})

    if(!newUser.length){
      throw new AppError(httpStatus.BAD_REQUEST,'Failed to Create User')
    }

    payload.id = newUser[0].id
    payload.user = newUser[0]._id

    const newFaculty = await Faculty.create([payload],{session})
    if(!newFaculty.length){
      throw new AppError(httpStatus.BAD_REQUEST,'Failed to Create Faculty')
    }

    await session.commitTransaction()
    await session.endSession()
    
    return newFaculty

  }
  catch(err:any){
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to Create Faculty')
  }

}

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'admin';

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB
};
