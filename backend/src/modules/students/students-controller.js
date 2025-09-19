const asyncHandler = require('express-async-handler');
const {
  getAllStudents,
  addNewStudent,
  getStudentDetail,
  setStudentStatus,
  updateStudent,
  deleteStudent
} = require('./students-service');

const handleGetAllStudents = asyncHandler(async (req, res) => {
  const { name, className, section, roll } = req.query;
  const students = await getAllStudents({ name, className, section, roll });
  res.json({ students });
});

const handleAddStudent = asyncHandler(async (req, res) => {
  const input = req.body;
  const response = await addNewStudent(input);
  res.json(response);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
  const input = req.body;
  const { id: userId } = req.params;
  const response = await updateStudent({ ...input, userId });
  res.json(response);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await getStudentDetail(id);
  res.json(student);
});

const handleStudentStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.params || {};
  const { id: reviewerId } = req.user || {};
  const { status } = req.body || {};
  const response = await setStudentStatus({ userId, status, reviewerId });
  res.json(response);
});

const handleDeleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params || {};
  const response = await deleteStudent(id);
  res.json(response);
});

module.exports = {
  handleGetAllStudents,
  handleGetStudentDetail,
  handleAddStudent,
  handleStudentStatus,
  handleUpdateStudent,
  handleDeleteStudent
};
