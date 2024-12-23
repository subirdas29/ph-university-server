import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

import { User } from './user.model';

const findLastStudentId = async () => {
  const latestStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();

  return latestStudent?.id ? latestStudent.id : undefined;
};

export const generatedStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();

  const latestStudentDetails = await findLastStudentId();

  //2030010001
  const latestStudentSemesterYear = latestStudentDetails?.substring(0, 4);
  const latestStudentSemesterCode = latestStudentDetails?.substring(4, 6);

  if (
    latestStudentDetails &&
    latestStudentSemesterCode === payload.code &&
    latestStudentSemesterYear === payload.year
  ) {
    currentId = latestStudentDetails?.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

const findLastFacultyId = async () => {
  const latestFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
  return latestFaculty?.id ? latestFaculty?.id : undefined;
};

export const generatedFacultyId = async () => {
  let currentId = (0).toString();

  const latestFacultyDetails = await findLastFacultyId();

  if (latestFacultyDetails) {
    currentId = latestFacultyDetails.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `F-${incrementId}`;
  return incrementId;
};

// Admin ID
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `A-${incrementId}`;
  return incrementId;
};
