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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentServices = void 0;
const student_model_1 = require("./student.model");
const getAllStudentFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield student_model_1.Student.find();
    return result;
});
const getOneStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await Student.findOne({ id });
    const result = yield student_model_1.Student.aggregate([{ $match: { id: id } }]);
    return result;
});
const deleteStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield student_model_1.Student.updateOne({ id }, { isDeleted: true }); // delete use korle ae data er 7e reference kora onno data inconsistancy hbe, tai reallife project update kora hoi.
    return result;
});
// export e use object ta controller theke data ante help korbe
exports.StudentServices = {
    getAllStudentFromDB,
    getOneStudentFromDB,
    deleteStudentFromDB,
};
