const pool = require('../config/db');

const createClassSchedule = async (req, res) => {
    try {
        const { class_name, date } = req.body;
        const faculty_id = req.user.id;

        const [result] = await pool.query(
            'INSERT INTO class_schedule (class_name, date, faculty_id) VALUES (?, ?, ?)',
            [class_name, date, faculty_id]
        );

        res.status(201).json({
            message: 'Class schedule created successfully',
            scheduleId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getExcusedStudents = async (req, res) => {
    try {
        const { date } = req.query;

        const [students] = await pool.query(
            `SELECT u.id, u.name, u.email, e.title as event_title, e.points
             FROM users u
             JOIN attendance_exceptions ae ON u.id = ae.student_id
             JOIN events e ON ae.event_id = e.id
             JOIN class_schedule cs ON ae.class_schedule_id = cs.id
             WHERE DATE(cs.date) = ?
             AND u.role = 'student'`,
            [date]
        );

        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createAttendanceException = async (req, res) => {
    try {
        const { student_id, class_schedule_id, event_id } = req.body;

        // Check if exception already exists
        const [existing] = await pool.query(
            'SELECT * FROM attendance_exceptions WHERE student_id = ? AND class_schedule_id = ?',
            [student_id, class_schedule_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Attendance exception already exists' });
        }

        await pool.query(
            'INSERT INTO attendance_exceptions (student_id, class_schedule_id, event_id) VALUES (?, ?, ?)',
            [student_id, class_schedule_id, event_id]
        );

        res.json({ message: 'Attendance exception created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getClassSchedules = async (req, res) => {
    try {
        const faculty_id = req.user.id;
        const [schedules] = await pool.query(
            'SELECT * FROM class_schedule WHERE faculty_id = ? ORDER BY date DESC',
            [faculty_id]
        );
        res.json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createClassSchedule,
    getExcusedStudents,
    createAttendanceException,
    getClassSchedules
}; 