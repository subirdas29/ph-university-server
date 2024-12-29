// import { Schema, model, connect } from 'mongoose';

import { Model, Types } from 'mongoose';

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  password: string;
  name: TUserName;
  gender: 'Male' | 'Female' | 'Others';
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted: boolean;
};

// for creating custom static

export interface StudentModel extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>;
}

//for creating custom instance

// export interface StudentMethods { // custom instance create korsi karon er theke kno user database e adueo ache kina seta check kore oi user er id er help niya.
//   isUserExists(id:string):Promise<TStudent | null> // ae isUserExits function ta asyncronous tai Promise e type pass hocce.
// }

// // Create a new Model type that knows about StudentMethods...
// export type StudentModel = Model<TStudent,Record<string,never>, StudentMethods> //eta holo jei custom instance banaisi "StudentMethods" etar new Model er type
