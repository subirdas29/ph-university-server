import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';


const getAllStudent = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await StudentServices.getAllStudentFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is receive successfully ',
    meta:result.meta,
    data: result.result,
  });
});

const getOneStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentServices.getOneStudentFromDB(id);

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
