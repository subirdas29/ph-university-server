import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { AcademicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is Created successfully',
    data: result,
  });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Departments are retrieved successfully',
    data: result,
  });
});

const getOneAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentServices.getOneAcademicDepartmentIntoDB(
      departmentId,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is retrieved successfully',
    data: result,
  });
});

const updateAcademicDepartmentController = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
      departmentId,
      req.body,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is updated successfully',
    data: result,
  });
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getOneAcademicDepartment,
  updateAcademicDepartmentController,
};
