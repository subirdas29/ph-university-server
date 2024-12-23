import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';

//controller request and response k controll korbe.eta sudu handle korbe application logic
const createStudentController = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  // data validation using zod

  //   const zodParseData = studentValidationSchema.parse(studentData);

  //data validation using joi
  // const { error,value } = studentValidationSchema.validate(studentData);//3rd party joi schema diya validation kora hyse
  //route theke call hoi asar por controller e asbe, then service function e call hbe.service business logic er kaj korbe

  const result = await UserServices.createStudentIntoDB(password, studentData);

  // if(error){ // Joi validation error message
  //   res.status(500).json({
  //     success: false,
  //     message: 'something went wrong',
  //     // ae data direct client er kase pathabe
  //     error: error.details,
  //   });
  // }

  //send response
  // res.status(200).json({
  //   success: true,
  //   message: 'data added successfully',
  //   // ae data direct client er kase pathabe
  //   data: result,
  // });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'data added successfully',
    data: result,
  });
});

const createFacultyController = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'data added successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;

  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});


const changeStatus = catchAsync(async (req, res) => {

  const {id} = req.params

  const result = await UserServices.changeStatus(id,req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
})

export const UserControllers = {
  createStudentController,
  createFacultyController,
  createAdmin,
  getMe,
  changeStatus,
};
