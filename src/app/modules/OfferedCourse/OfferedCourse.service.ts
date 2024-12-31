import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './OfferedCourse.interface';
import { OfferedCourse } from './OfferedCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { hasTimeConflict } from './OfferedCourse.utils';
import { Student } from '../student/student.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;

  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the academic faculty id is exists!
   * Step 3: check if the academic department id is exists!
   * Step 4: check if the course id is exists!
   * Step 5: check if the faculty id is exists!
   * Step 6: check if the department is belong to the  faculty
   * Step 7: check if the same offered course same section in same registered semester exists
   * Step 8: get the schedules of the faculties
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */

  //check if the semester registration id is exists!
  const isSemesterRegistrationExits =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExits) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration not found !',
    );
  }

  const academicSemester = isSemesterRegistrationExits.academicSemester;

  const isAcademicFacultyExits =
    await AcademicFaculty.findById(academicFaculty);

  if (!isAcademicFacultyExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found !');
  }

  const isAcademicDepartmentExits =
    await AcademicDepartment.findById(academicDepartment);

  if (!isAcademicDepartmentExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found !');
  }

  const isCourseExits = await Course.findById(course);

  if (!isCourseExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found !');
  }

  const isFacultyExits = await Faculty.findById(faculty);

  if (!isFacultyExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  // check if the department is belong to the  faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExits.name} is not  belong to this ${isAcademicFacultyExits.name}`,
    );
  }

  // check if the same offered course same section in same registered semester exists

  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course with same section is already exist!`,
    );
  }

  // get the schedules of the faculties

  //ekhane sei day te faculty mane sir er time schedule ta bair kore milaite hbe.jei sir er same day te time slot book oi time slot ar niya jabe na.

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days }, // days er upor depend kore time gula compare korbo
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time ! Choose other time or day`,
    );
  }

  const result = await OfferedCourse.create({
    ...payload,
    academicSemester,
  });
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  const meta = await offeredCourseQuery.countTotal();

  return {
    meta,
    result,
  };

};


const getMyOfferedCoursesFromDB = async (userId: string,query:Record<string,unknown>) => {
  const student = await Student.findOne({id:userId});

  if(!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found");
  }

  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne({status:"ONGOING"})

  if(!currentOngoingRegistrationSemester){
    throw new AppError(httpStatus.NOT_FOUND,"There is no ongoing semester registration")
  }


  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

//ekhane sei course gula kei show korbo jeigula preRequisiteCourses nai, trpr jeigula specific student er faculty,department and tar semesterregistration ongoing, ar jodi sei student already kno course enroll kore fele sei course ar dekhabo na.
  const aggregationQuery = [
    {
      $match:{
      semesterRegistration: currentOngoingRegistrationSemester._id,
      academicFaculty: student.academicFaculty,
      academicDepartment:student.academicDepartment  
     }
    },
    {
      $lookup:{
        from:"courses",
        localField:"course",
        foreignField:"_id",
        as:"course"
      }
    },
    {
      $unwind:'$course'
    },
    //ae stage e enrolled Course gula k filter out korte hbe
    {
      $lookup:{
        from:"enrolledcourses",
        let:{
          currentOngoingRegistrationSemester: currentOngoingRegistrationSemester._id,
          currentStudent: student._id
        },
        pipeline:[
          {
            $match:{
              $expr:{ //jehetu ek collection thaka obsthai abr onno collection e giya match korsi tai expr diya korte hbe
                $and:[
                  {
                    $eq:['$semesterRegistration',
                      '$$currentOngoingRegistrationSemester']
                  },
                  {
                    $eq:['$student','$$currentStudent']
                  },
                  {
                    $eq:['$isEnrolled',true]
                  }
                ]
              }
            }
          }
        ],
        as:"enrolledCourses"
      }
    },
    {
      $lookup:{
        from:"enrolledcourses",
        let:{
          currentStudent: student._id
        },
        pipeline:[
          {
            $match:{
              $expr:{ //jehetu ek collection thaka obsthai abr onno collection e giya match korsi tai expr diya korte hbe
                $and:[
                  {
                    $eq:['$student','$$currentStudent']
                  },
                  {
                    $eq:['$isCompleted',true]
                  }
                ]
              }
            }
          }
        ],
        as:"completedCourses"
      }
    },
    {
      $addFields:{
        completedCoursesIds:{
          $map:{
            input:'$completedCourses',
            as:'complete',
            in:'$$complete.course'
          }
        }
      }
    },
    {
      $addFields:{
      isPreRequisiteFulFilled:{
        $or:[
          {$eq:['$course.preRequisiteCourses',[]]},
          {$setIsSubset:['$course.preRequisiteCourses.course','$completedCoursesIds']} //ekhane sob course er 7e onno complete course er subset full check kore
        ]
      },
      isAlreadyEnrolled:{
        $in:['$course._id',{ //2ta er moddhe comparison er jonno $in use kora hoi,jeti true or false return kore
          $map:{ // eta hocce mongoDB er aggregation er map jeta array er ekadik maner 7e loop calai compare korte help kre
            input:'$enrolledCourses',
            as:'enroll', // enrollcourses array tar vitor thaka protita object k enroll nam diya holo loop er jonno
            in:'$$enroll.course' // ekn proti ta enroll er course er 7e course._id er compare hbe, enroll nam ta mainly exist kore na tai er data paite gele $$ dite hoi
          }
        }]
      }
      }
    },
    {
      $match:{
        isPreRequisiteFulFilled:true,
        isAlreadyEnrolled:false
      }
    }
  ]

  // pagination for OfferedCourse
  const paginationQuery = [
    {
      $skip:skip
    },
    {
      $limit:limit
    }
  ]

  const result = await OfferedCourse.aggregate([...aggregationQuery,...paginationQuery])
  const total = (await OfferedCourse.aggregate(aggregationQuery)).length //paginationQuery te sob data ashe na tai evabe alada kora holo
  const totalPage = Math.ceil(total/limit)

  return {
    meta:{
      page,
      limit,
      total,
      totalPage
    },
    result
  };
};


const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(404, 'Offered Course not found');
  }

  return offeredCourse;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;
  const isOfferCourseExists = await OfferedCourse.findById(id);

  if (!isOfferCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offer course not found');
  }

  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'faculty is not found');
  }

  const semesterRegistration = isOfferCourseExists?.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
    );
  }

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at that time ! Choose other time or day`,
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration).select('status');

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getMyOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
