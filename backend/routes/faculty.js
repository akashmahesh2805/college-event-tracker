const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    createClassSchedule,
    getExcusedStudents,
    createAttendanceException,
    getClassSchedules
} = require('../controllers/facultyController');

// Protected routes
router.use(auth);
router.use(checkRole(['faculty']));

router.post('/schedule', createClassSchedule);
router.get('/excused-students', getExcusedStudents);
router.post('/attendance-exception', createAttendanceException);
router.get('/schedule', getClassSchedules);

module.exports = router; 