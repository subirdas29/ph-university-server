"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledCourseValidation = void 0;
const zod_1 = require("zod");
const createEnrolledCourseValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        offeredCourse: zod_1.z.string(),
    }),
});
exports.EnrolledCourseValidation = {
    createEnrolledCourseValidationZodSchema
};
