import QueryBuilder from '../../builder/QueryBuilder';
import { AcademicFacultySearchableFields } from './academicFaculty.constant';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);

  return result;
};

const getAllAcademicFacultyIntoDB = async (query:Record<string,unknown>) => {
  const facultyQuery = new QueryBuilder(AcademicFaculty.find(),query).filter()
  .sort()
  .paginate()
  .fields()
  .search(AcademicFacultySearchableFields);

  const result = await facultyQuery.modelQuery;
  const meta = await facultyQuery.countTotal()
  return {
    result,
    meta
  };
};

const getOneAcademicFacultyIntoDB = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  return result;
};

const updateAcademicFacultyIntoDB = async (
  id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultyIntoDB,
  getOneAcademicFacultyIntoDB,
  updateAcademicFacultyIntoDB,
};
