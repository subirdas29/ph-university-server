import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { OfferedCourseServices } from './OfferedCourse.service';

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is created successfully !',
    data: result,
  });
});

const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourse updated successfully',
    data: result,
  });
});
const getAllOfferedCoursesFromDB = catchAsync(async (req: Request, res: Response)=>{

 const query = req.query
   const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(query)
   sendResponse(res, {
     statusCode: httpStatus.OK,
     success: true,
     message: 'OfferedCourse updated successfully',
     meta: result.meta,
     data: result.result,
   });
 })

const getMyOfferedCoursesFromDB = catchAsync(async (req: Request, res: Response)=>{
 const userId = req.user.userId
const query = req.query

  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(userId,query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My OfferedCourse retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
})

const getSingleOfferedCourses = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OfferedCourse fetched successfully',
      data: result,
    });
  },
);

const deleteOfferedCourseFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OfferedCourse deleted successfully',
      data: result,
    });
  },
);

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCoursesFromDB ,
  getSingleOfferedCourses,
  getMyOfferedCoursesFromDB,
  updateOfferedCourse,
  deleteOfferedCourseFromDB,
};
