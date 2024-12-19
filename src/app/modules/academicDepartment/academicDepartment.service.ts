import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);

  return result;
};

const getAllAcademicDepartmentIntoDB = async () => {
  const result = await AcademicDepartment.find().populate('academicFaculty');
  return result;
};

const getOneAcademicDepartmentIntoDB = async (id: string) => {
  const result =
    await AcademicDepartment.findById(id).populate('academicFaculty');
  return result;
};

const updateAcademicDepartmentIntoDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentIntoDB,
  getOneAcademicDepartmentIntoDB,
  updateAcademicDepartmentIntoDB,
};
