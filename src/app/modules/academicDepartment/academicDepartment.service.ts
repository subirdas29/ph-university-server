import QueryBuilder from '../../builder/QueryBuilder';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';
import { AcademicDepartmentSearchableFields } from './academicDepartmets.constant';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);

  return result;
};

const getAllAcademicDepartmentIntoDB =async(query:Record<string,unknown>) =>{
const academicQuery = new QueryBuilder(AcademicDepartment.find().populate('academicFaculty'),query)
.search(AcademicDepartmentSearchableFields)
.filter()
.sort()
.paginate()
.fields();

  const result = await academicQuery.modelQuery
  const meta = await academicQuery.countTotal()
  return {
    meta,
    result
  };
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
