import QueryBuilder from '../../builder/QueryBuilder';
import { academicSemesterNameCodeMapper, AcademicSemesterSearchableFields } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    //eta common logic er kaj na business common mane sudu academicSemester er khtre client data theke check hbe tai service validation check hyse. jodi common logic hyto thle model e use kortm
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemesterFromDB = async (query:Record<string,unknown>) => {

  const semesterQuery = new QueryBuilder(AcademicSemester.find(),query).filter()
  .sort()
  .paginate()
  .fields()
  .search(AcademicSemesterSearchableFields)

  const result = await semesterQuery.modelQuery
  const meta = await semesterQuery.countTotal()
  return {
    result,
    meta
  };
};

const getOneAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

const updateAcademicSemester = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code');
  }
  const result = await AcademicSemester.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getOneAcademicSemesterFromDB,
  updateAcademicSemester,
};
