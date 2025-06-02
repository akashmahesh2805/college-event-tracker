const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    createEvent,
    getEvents,
    markParticipant,
    getStudentEvents,
    studentRegisterEvent,
    getRegisteredStudents
} = require('../controllers/eventController');

// Protected routes
router.use(auth);

// Get all events
router.get('/', getEvents);

// Student routes
router.get('/my-events', checkRole(['student']), getStudentEvents);
router.post('/register', checkRole(['student']), studentRegisterEvent);

// Coordinator routes
router.post('/', checkRole(['coordinator']), createEvent);
router.post('/mark-participant', checkRole(['coordinator']), markParticipant);
router.get('/registered-students', checkRole(['coordinator']), getRegisteredStudents);

module.exports = router; 