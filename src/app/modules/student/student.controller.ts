import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
// import studentValidationSchema from './student.validation';
// import { z } from "zod";

const getAllStudent = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await StudentServices.getAllStudentFromDB(query);
  // res.status(200).json({
  //   success: true,
  //   message: 'data receive successfully',
  //   // ae data route hoi direct client er kase pathabe
  //   data: result,
  // });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is receive successfully ',
    data: result,
  });
});

const getOneStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentServices.getOneStudentFromDB(id);
  // res.status(200).json({
  //   success: true,
  //   message: 'One Student data receive successfully',
  //   // ae data route hoi direct client er kase pathabe
  //   data: result,
  // });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'One Student data receive successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentServices.updateStudentFromDB(id, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'One Student data updated',
    data: result,
  });
});

const deleteOneStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentServices.deleteStudentFromDB(id);
  // res.status(200).json({
  //   success: true,
  //   message: 'One Student data Deleted successfully',
  //   // ae data route hoi direct client er kase pathabe
  //   data: result,
  // });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'One Student data Deleted successfully',
    data: result,
  });
});

// export e use object ta route theke data ante help korbe
export const StudentController = {
  getAllStudent,
  getOneStudent,
  updateStudent,
  deleteOneStudent,
};
