const { ApiError, sendAccountVerificationEmail } = require('../../utils');
const {
  findAllStudents,
  findStudentDetail,
  findStudentToSetStatus,
  addOrUpdateStudent,
  findStudentToDelete
} = require('./students-repository');
const { findUserById, findUserByEmail } = require('../../shared/repository');
const { StudentSchema, UpdateStudentSchema, StatusStudentSchema } = require('./students-schema');
const { ZodError, z } = require('zod');

const checkStudentId = async (id) => {
  const isStudentFound = await findUserById(id);
  if (!isStudentFound) {
    throw new ApiError(404, 'Student not found');
  }
};

const getStudentByEmail = async (email) => {
  const student = await findUserByEmail(email);
  return student || null;
};

const getAllStudents = async (payload) => {
  const students = await findAllStudents(payload);
  if (students.length <= 0) {
    throw new ApiError(404, 'Students not found');
  }

  return students;
};

const getStudentDetail = async (id) => {
  await checkStudentId(id);

  const student = await findStudentDetail(id);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  return student;
};

const addNewStudent = async (input) => {
  const ADD_STUDENT_AND_EMAIL_SEND_SUCCESS =
    'Student added and verification email sent successfully.';
  const ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL =
    'Student added, but failed to send verification email.';

  try {
    const payload = await StudentSchema.parseAsync(input);
    const studentEmailExists = await getStudentByEmail(payload.email);

    if (studentEmailExists) {
      throw { validationError: 'Email already exists' };
    }

    const result = await addOrUpdateStudent(payload);

    if (!result.status) {
      throw new ApiError(400, result.message);
    }

    try {
      await sendAccountVerificationEmail({
        userId: result.userId,
        userEmail: payload.email
      });
      return { message: ADD_STUDENT_AND_EMAIL_SEND_SUCCESS };
    } catch (error) {
      return { message: ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL };
    }
  } catch (e) {
    if (e instanceof ZodError) {
      throw new ApiError(
        400,
        e.errors.map((e) => e.message)
      );
    }

    if (e?.validationError) {
      throw new ApiError(400, e?.validationError);
    }

    console.error(e);
    throw new ApiError(500, 'Unable to add student');
  }
};

const updateStudent = async (input) => {
  try {
    const payload = await UpdateStudentSchema.parseAsync(input);
    const student = await findStudentDetail(payload.userId);

    if (!student) {
      throw { validationError: 'Student not found.', code: 404 };
    }

    const studentEmailExists = await getStudentByEmail(payload.email);

    if (studentEmailExists && studentEmailExists.id !== payload.userId) {
      throw { validationError: 'Email already exists' };
    }

    const result = await addOrUpdateStudent(payload);

    if (!result.status) {
      throw new ApiError(400, result.message);
    }

    return { message: result.message };
  } catch (e) {
    if (e instanceof ZodError) {
      throw new ApiError(
        400,
        e.errors.map((e) => e.message)
      );
    }

    if (e?.validationError) {
      throw new ApiError(e?.code || 400, e?.validationError);
    }

    console.error(e);
    throw new ApiError(500, 'Unable to update student');
  }
};

const setStudentStatus = async ({ userId, reviewerId, status }) => {
  try {
    const payload = await StatusStudentSchema.parseAsync({
      userId,
      reviewerId,
      status
    });
    const student = await findStudentDetail(payload.userId);

    if (!student) {
      throw { validationError: 'Student not found.', code: 404 };
    }

    const affectedRow = await findStudentToSetStatus(payload);

    if (affectedRow <= 0) {
      throw new ApiError(400, 'Unable to disable student');
    }

    return { message: 'Student status changed successfully' };
  } catch (e) {
    if (e instanceof ZodError) {
      throw new ApiError(
        400,
        e.errors.map((e) => e.message)
      );
    }

    if (e?.validationError) {
      throw new ApiError(e?.code || 400, e?.validationError);
    }

    console.error(e);
    throw new ApiError(500, 'Internal Server Error');
  }
};

const deleteStudent = async (id) => {
  try {
    const userId = await z.coerce
      .number({
        required_error: 'User ID is required',
        invalid_type_error: 'User ID must be a number'
      })
      .refine((val) => !isNaN(val), {
        message: 'User ID must be a valid number'
      })
      .parseAsync(id);

    const student = await findStudentDetail(userId);

    if (!student) {
      throw { validationError: 'Student not found.', code: 404 };
    }

    const affectedRow = await findStudentToDelete(userId);

    if (affectedRow <= 0) {
      throw new ApiError(400, 'Unable to delete student');
    }

    return { message: 'Student deleted successfully' };
  } catch (e) {
    if (e instanceof ZodError) {
      throw new ApiError(
        400,
        e.errors.map((e) => e.message)
      );
    }

    if (e?.validationError) {
      throw new ApiError(e?.code || 400, e?.validationError);
    }

    console.error(e);
    throw new ApiError(500, 'Internal Server Error');
  }
};

module.exports = {
  getAllStudents,
  getStudentDetail,
  addNewStudent,
  setStudentStatus,
  updateStudent,
  deleteStudent
};
