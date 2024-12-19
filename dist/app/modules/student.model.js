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
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config"));
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
        required: [true, 'Student ID is required'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Student PASSWORD is required'],
        trim: true,
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
        type: String,
        validate: {
            validator: function (value) {
                // Simple date format validation (YYYY-MM-DD)
                return /^\d{4}-\d{2}-\d{2}$/.test(value);
            },
            message: 'Date of birth must be in YYYY-MM-DD format',
            trim: true,
        },
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        // validate:{ //3rd party validator
        //   validator: (value)=> validator.isEmail(value),
        //   message: '{VALUE} is not valid email'
        // }
    },
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
    profileImg: {
        type: String,
        validate: {
            validator: function (value) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp)$/i.test(value);
            },
            message: 'Profile image must be a valid URL linking to an image file',
        },
    },
    isActive: {
        type: String,
        enum: {
            values: ['active', 'blocked'],
            message: '{VALUE} is not a valid status',
        },
        default: 'active',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: {
        virtuals: true
    }
});
//mongoose virtual
studentSchema.virtual('FullName').get(function () {
    return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});
//pre save mongoose middleware/hook will work on create() save()
//document middleware of mongoose
studentSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // create()er upor kaj hoi
        const user = this; // this refer kore current processing e jaowa document k
        // hashing password and save into DB
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next(); // jehetu eta mongoose er middleware tai next call diya porer middleware e transfer korar jonno ae function use korte hbe
    });
});
studentSchema.post('save', function (doc, next) {
    doc.password = ''; // save howa document client er kase pathanor time e blank string akare pathabo
    next();
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
