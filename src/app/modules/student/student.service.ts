/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  // const queryObj = {...query} //delete krbo tai copy niya rakte hbe

  // let searchTerm = ''   // SET DEFAULT VALUE

  // IF searchTerm  IS GIVEN SET IT
  // if(query?.searchTerm){
  //   searchTerm = query?.searchTerm as string
  // }

  // HOW OUR FORMAT SHOULD BE FOR PARTIAL MATCH  :
  // { email: { $regex : query.searchTerm , $options: i}}
  // { presentAddress: { $regex : query.searchTerm , $options: i}}
  // { 'name.firstName': { $regex : query.searchTerm , $options: i}}

  // WE ARE DYNAMICALLY DOING IT USING LOOP

  //partial match
  // const searchQuery = Student.find({  //ekhane await soho anbo na karon ekhane promise resolve korbo na..chaining kore porer ta te await diya promise resolve korbo
  //   $or:studentSearchableFields.map((field)=>({
  //     [field] : {$regex:searchTerm, $options:'i'} //partial match er maddhome purata pabo
  //   }))
  // })

  //filtering
  // const excludeFields:string[] = ['searchTerm','sort','limit','page','fields']
  // excludeFields.forEach((el)=> delete queryObj[el]) // filtering er jonno partial match er jinis bad dite hbe

  //exact match kore
  // const filterQuery = searchQuery.find(queryObj) // uporer searchQuery te partial match er query tar maddhome pura data nibe kintu abr sei uporer query ta ae line e await diya execution er moddhe abr jkn object query ta calano hoi tkn exact match khuje mane filtering kaj krte cai partial match ta na.karon ae query te jei data object hisabe ashe sei data exact match kore.ekhane eta chaning system e kaj kore

  // .populate('admissionSemester')
  // .populate({
  //   path: 'admissionDepartment',
  //   populate: {
  //     path: 'academicFaculty',
  //   },
  // });

  //sort
  // let sort= '-createdAt'

  // if(query?.sort){
  //   sort = query?.sort as string
  // }

  // const sortQuery = filterQuery.sort(sort)

  // //limit & page
  // let limit = 1
  // let page = 1
  // let skip = 0

  // if(query?.limit){
  //   limit = Number(query?.limit)
  // }

  // if(query?.page){
  //   page = Number(query?.page)
  //   skip = (page - 1) * limit
  // }

  // const paginateQuery = sortQuery.skip(skip)
  // const limitQuery = paginateQuery.limit(limit)

  // // field limiting
  // let fields = '-__v'; // SET DEFAULT VALUE

  // if(query?.fields){
  //   fields = (query?.fields as string).split(',').join(' ')
  // }

  // const fieldsQuery = await limitQuery.select(fields)

  // return fieldsQuery;

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'admissionDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal()
  return {
    meta,
    result
  };
};

const getOneStudentFromDB = async (id: string) => {
  const result = await Student.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'admissionDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  // const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const updateStudentFromDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = { ...remainingData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      //ekhane Object.entries dara object theke key,value data array akare pair kore sajai dibe
      modifiedUpdatedData[`name.${key}`] = value; //name.firstName = 'joy'
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate(
      { id }, // jehetu ekhane data ekta tai transaction eta object e rakha jai
      { isDeleted: true },
      { new: true, session },
    ); // delete use korle ae data er 7e reference kora onno data inconsistancy hbe, tai reallife project update kora hoi.

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete data');
  }
};

// export e use object ta controller theke data ante help korbe
export const StudentServices = {
  getAllStudentFromDB,
  getOneStudentFromDB,
  updateStudentFromDB,
  deleteStudentFromDB,
};
