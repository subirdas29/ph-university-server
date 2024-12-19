import { Schema } from 'mongoose';
import { model } from 'mongoose';

import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

// academicDepartmentSchema.pre('save', async function (next) {
//   const isDepartmentExit = await AcademicDepartment.findOne({
//     name: this.name,
//   });
//   if (isDepartmentExit) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Department already Exits');
//   }
//   next();
// });

academicDepartmentSchema.pre('findOneAndUpdate', async function () {
  const query = this.getQuery();
  const isDepartmentExit = await AcademicDepartment.findOne(query);

  if (!isDepartmentExit) {
    throw new AppError(httpStatus.NOT_FOUND, "Department doesn't exit");
  }
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
