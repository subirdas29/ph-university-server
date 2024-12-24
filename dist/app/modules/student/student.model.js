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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
//creating schema
const userNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true, // buildin validation -> eta data value er age or pore kno space thakle ta trim kore dibe
        maxlength: [10, 'firstName can not be more than 10 Characters'], // maxlength is build in validation of mongoose
        validate: {
            // custom validation
            validator: function (value) {
                const firstNameValidation = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                return firstNameValidation === value;
                // console.log(firstNameValidation)
            },
            message: '{VALUE} is not in capitalize format',
        },
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        validate: {
            //mongoose e validation function likte validate propertise use kore
            validator: (value) => validator_1.default.isAlpha(value),
            message: '{VALUE} is not valid',
        },
    },
});
const guardianSchema = new mongoose_1.Schema({
    fatherName: {
        type: String,
        required: [true, "Father's name is required"],
        trim: true,
    },
    fatherOccupation: {
        type: String,
        required: [true, "Father's occupation is required"],
        trim: true,
    },
    fatherContactNo: {
        type: String,
        required: [true, "Father's contact number is required"],
        trim: true,
    },
    motherName: {
        type: String,
        required: [true, "Mother's name is required"],
        trim: true,
    },
    motherOccupation: {
        type: String,
        required: [true, "Mother's occupation is required"],
        trim: true,
    },
    motherContactNo: {
        type: String,
        required: [true, "Mother's contact number is required"],
        trim: true,
    },
});
const localGuardianSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Local guardian's name is required"],
        trim: true,
    },
    occupation: {
        type: String,
        required: [true, "Local guardian's occupation is required"],
        trim: true,
    },
    contactNo: {
        type: String,
        required: [true, "Local guardian's contact number is required"],
        trim: true,
    },
    address: {
        type: String,
        required: [true, "Local guardian's address is required"],
        trim: true,
    },
});
// Main student Schema
const studentSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, 'ID is required'],
        trim: true,
        unique: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User iD is required'],
        unique: true,
        ref: 'User', // jar 7e referencing hbe tar model call dite hbe
    },
    name: {
        type: userNameSchema,
        required: [true, 'Student name is required'],
        trim: true,
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female', 'Others'],
            message: '{VALUE} is not a valid gender',
        },
        required: [true, 'Gender is required'],
        trim: true,
    },
    dateOfBirth: {
        type: Date,
        // validate: {
        //   validator: function (value: string) {
        //     // Simple date format validation (YYYY-MM-DD)
        //     return /^\d{4}-\d{2}-\d{2}$/.test(value);
        //   },
        //   message: 'Date of birth must be in YYYY-MM-DD format',
        //   trim: true,
        // },
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    // validate:{ //3rd party validator
    //   validator: (value)=> validator.isEmail(value),
    //   message: '{VALUE} is not valid email'
    // }
    contactNo: {
        type: String,
        required: [true, 'Contact number is required'],
    },
    emergencyContactNo: {
        type: String,
        required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
        type: String,
        enum: {
            values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message: '{VALUE} is not a valid blood group',
        },
    },
    presentAddress: {
        type: String,
        required: [true, 'Present address is required'],
    },
    permanentAddress: {
        type: String,
        required: [true, 'Permanent address is required'],
    },
    guardian: {
        type: guardianSchema,
        required: [true, 'Guardian details are required'],
    },
    localGuardian: {
        type: localGuardianSchema,
        required: [true, 'Local guardian details are required'],
    },
    profileImg: { type: String },
    admissionDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicDepartment',
    },
    admissionSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicSemester',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: {
        virtuals: true,
    },
});
//mongoose virtual
studentSchema.virtual('FullName').get(function () {
    var _a, _b, _c;
    // virtual -> db te jkn kono field thake na but client er jkn lage emn field jeta nana field er value k niya create kore ekta new field kore pathai ja db exist kore na but onno field ek7e niya create
    return `${(_a = this === null || this === void 0 ? void 0 : this.name) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = this === null || this === void 0 ? void 0 : this.name) === null || _b === void 0 ? void 0 : _b.middleName} ${(_c = this === null || this === void 0 ? void 0 : this.name) === null || _c === void 0 ? void 0 : _c.lastName}`;
});
//query middleware of mongoose
studentSchema.pre('find', function (next) {
    //findOne() er upor kaj
    this.find({ isDeleted: { $ne: true } }); // service e thaka find() ta execute howar ag e ae find() ta execute hobe
    // ekn service er find er 7e eta chaining hoi jar fole ae find() er maddhome filter howa data er upor service er find() data kaj kore
    next();
});
studentSchema.pre('findOne', function (next) {
    //findOne() er upor kaj
    this.find({ isDeleted: { $ne: true } }); // service e thaka find() ta execute howar ag e ae find() ta execute hobe
    // ekn service er find er 7e eta chaining hoi jar fole ae find() er maddhome filter howa data er upor service er find() data kaj kore
    next();
});
//aggregate middleware of mongoose
studentSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } }); //pipeline asbe--> [{$match:{id:id}}] er surute ekn diya match condition soho add korle eta check kore trpr pipline asha tate jabe.
    next();
});
// creating a custom static method
studentSchema.statics.isUserExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield exports.Student.findOne({ id });
        return existingUser;
    });
};
//creating a custom instance method
// studentSchema.methods.isUserExists = async function (id:string){
//   const existingUser = await Student.findOne({id})
//   return existingUser
// }
// Creating model
exports.Student = (0, mongoose_1.model)('Student', studentSchema);
