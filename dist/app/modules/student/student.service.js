"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const student_model_1 = require("./student.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const student_constant_1 = require("./student.constant");
const getAllStudentFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const queryObj = {...query} //delete krbo tai copy niya rakte hbe
    // let searchTerm = ''   // SET DEFAULT VALUE
    // IF searchTerm  IS GIVEN SET IT
    // if(query?.searchTerm){
    //   searchTerm = query?.searchTerm as string
    // }
    // HOW OUR FORMAT SHOULD BE FOR PARTIAL MATCH  :
    // { email: { $regex : query.searchTerm , $options: i}}
    // { presentAddress: { $regex : query.searchTerm , $options: i}}
    // { 'name.firstName': { $regex : query.searchTerm , $options: i}}
    // WE ARE DYNAMICALLY DOING IT USING LOOP
    //partial match
    // const searchQuery = Student.find({  //ekhane await soho anbo na karon ekhane promise resolve korbo na..chaining kore porer ta te await diya promise resolve korbo
    //   $or:studentSearchableFields.map((field)=>({
    //     [field] : {$regex:searchTerm, $options:'i'} //partial match er maddhome purata pabo
    //   }))
    // })
    //filtering
    // const excludeFields:string[] = ['searchTerm','sort','limit','page','fields']
    // excludeFields.forEach((el)=> delete queryObj[el]) // filtering er jonno partial match er jinis bad dite hbe
    //exact match kore
    // const filterQuery = searchQuery.find(queryObj) // uporer searchQuery te partial match er query tar maddhome pura data nibe kintu abr sei uporer query ta ae line e await diya execution er moddhe abr jkn object query ta calano hoi tkn exact match khuje mane filtering kaj krte cai partial match ta na.karon ae query te jei data object hisabe ashe sei data exact match kore.ekhane eta chaning system e kaj kore
    // .populate('admissionSemester')
    // .populate({
    //   path: 'admissionDepartment',
    //   populate: {
    //     path: 'academicFaculty',
    //   },
    // });
    //sort
    // let sort= '-createdAt'
    // if(query?.sort){
    //   sort = query?.sort as string
    // }
    // const sortQuery = filterQuery.sort(sort)
    // //limit & page
    // let limit = 1
    // let page = 1
    // let skip = 0
    // if(query?.limit){
    //   limit = Number(query?.limit)
    // }
    // if(query?.page){
    //   page = Number(query?.page)
    //   skip = (page - 1) * limit
    // }
    // const paginateQuery = sortQuery.skip(skip)
    // const limitQuery = paginateQuery.limit(limit)
    // // field limiting
    // let fields = '-__v'; // SET DEFAULT VALUE
    // if(query?.fields){
    //   fields = (query?.fields as string).split(',').join(' ')
    // }
    // const fieldsQuery = await limitQuery.select(fields)
    // return fieldsQuery;
    const studentQuery = new QueryBuilder_1.default(student_model_1.Student.find()
        .populate('user')
        .populate('admissionSemester')
        .populate({
        path: 'admissionDepartment',
        populate: {
            path: 'academicFaculty',
        },
    }), query)
        .search(student_constant_1.studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield studentQuery.modelQuery;
    const meta = yield studentQuery.countTotal();
    return {
        meta,
        result
    };
});
const getOneStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield student_model_1.Student.findById(id)
        .populate('admissionSemester')
        .populate({
        path: 'admissionDepartment',
        populate: {
            path: 'academicFaculty',
        },
    });
    // const result = await Student.aggregate([{ $match: { id: id } }]);
    return result;
});
const updateStudentFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, guardian, localGuardian } = payload, remainingData = __rest(payload, ["name", "guardian", "localGuardian"]);
    const modifiedUpdatedData = Object.assign({}, remainingData);
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            //ekhane Object.entries dara object theke key,value data array akare pair kore sajai dibe
            modifiedUpdatedData[`name.${key}`] = value; //name.firstName = 'joy'
        }
    }
    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value;
        }
    }
    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value;
        }
    }
    const result = yield student_model_1.Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deletedStudent = yield student_model_1.Student.findOneAndUpdate({ id }, // jehetu ekhane data ekta tai transaction eta object e rakha jai
        { isDeleted: true }, { new: true, session }); // delete use korle ae data er 7e reference kora onno data inconsistancy hbe, tai reallife project update kora hoi.
        if (!deletedStudent) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete student');
        }
        const deletedUser = yield user_model_1.User.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });
        if (!deletedUser) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete user');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deletedStudent;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error('Failed to delete data');
    }
});
// export e use object ta controller theke data ante help korbe
exports.StudentServices = {
    getAllStudentFromDB,
    getOneStudentFromDB,
    updateStudentFromDB,
    deleteStudentFromDB,
};
