const { z } = require('zod');
const { emptyToNullTransform } = require('../../utils/zod-transform');

const StudentSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string'
    })
    .min(1, { message: 'Name cannot be empty' }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string'
    })
    .email({ message: 'Invalid email address' }),
  gender: z
    .enum(['Male', 'Female'], {
      message: 'Gender must be male, female'
    })
    .nullish(),
  phone: z
    .string({ invalid_type_error: 'Phone number must be a string' })
    .max(20, { message: 'Phone number cannot exceed 20 characters' })
    .transform(emptyToNullTransform)
    .nullish(),
  dob: z
    .string({
      invalid_type_error: 'Date of birth must be a string in format YYYY-MM-DD'
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date of birth must be in format YYYY-MM-DD (e.g. 2025-09-19)'
    })
    .transform((dateString) => new Date(dateString)),
  currentAddress: z
    .string()
    .max(50, { message: 'Current address cannot exceed 50 characters' })
    .transform(emptyToNullTransform)
    .nullish(),
  permanentAddress: z
    .string()
    .max(50, { message: 'Permanent address cannot exceed 50 characters' })
    .transform(emptyToNullTransform)
    .nullish(),
  fatherName: z
    .string()
    .max(50, { message: "Father's name cannot exceed 50 characters" })
    .transform(emptyToNullTransform)
    .nullish(),
  fatherPhone: z
    .string()
    .max(20, { message: "Father's phone cannot exceed 20 characters" })
    .transform(emptyToNullTransform)
    .nullish(),
  motherName: z
    .string()
    .max(50, { message: "Mother's name cannot exceed 50 characters" })
    .transform(emptyToNullTransform)
    .nullish(),
  motherPhone: z
    .string()
    .max(20, { message: "Mother's phone cannot exceed 20 characters" })
    .transform(emptyToNullTransform)
    .nullish(),
  guardianName: z
    .string()
    .max(50, { message: "Guardian's name cannot exceed 50 characters" })
    .transform(emptyToNullTransform)
    .nullish(),
  guardianPhone: z
    .string()
    .max(20, { message: "Guardian's phone cannot exceed 20 characters" })
    .transform(emptyToNullTransform)
    .nullish(),
  relationOfGuardian: z
    .string()
    .max(30, { message: 'Relation of guardian cannot exceed 30 characters' })
    .transform(emptyToNullTransform)
    .nullish(),
  systemAccess: z.boolean({ invalid_type_error: 'System access must be true or false' }).nullish(),
  class: z
    .string()
    .max(50, { message: 'Class cannot exceed 50 characters' })
    .transform(emptyToNullTransform)
    .nullish(),
  section: z
    .string()
    .max(50, { message: 'Section cannot exceed 50 characters' })
    .transform(emptyToNullTransform)
    .nullish(),
  admissionDate: z
    .string({
      invalid_type_error: 'Admission date must be a string in format YYYY-MM-DD'
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Admission date must be in format YYYY-MM-DD (e.g. 2025-09-19)'
    })
    .transform((dateString) => new Date(dateString))
    .nullish(),
  roll: z.coerce.number({ invalid_type_error: 'Roll must be a number' }).nullish()
});

const UpdateStudentSchema = StudentSchema.extend({
  userId: z.coerce
    .number({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a number'
    })
    .refine((val) => !isNaN(val), {
      message: 'User ID must be a valid number'
    })
});

const StatusStudentSchema = z.object({
  userId: z.coerce
    .number({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a number'
    })
    .refine((val) => !isNaN(val), {
      message: 'User ID must be a valid number'
    }),
  reviewerId: z.coerce
    .number({
      required_error: 'Reviewer ID is required',
      invalid_type_error: 'Reviewer ID must be a number'
    })
    .refine((val) => !isNaN(val), {
      message: 'User ID must be a valid number'
    }),
  status: z.boolean({
    message: 'Status is required',
    invalid_type_error: 'Status must be true or false'
  })
});

module.exports = {
  StudentSchema,
  UpdateStudentSchema,
  StatusStudentSchema
};
