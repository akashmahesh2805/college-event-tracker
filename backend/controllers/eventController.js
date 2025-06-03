const pool = require('../config/db');

const createEvent = async (req, res) => {
    try {
        const { title, description, date, points } = req.body;
        const coordinator_id = req.user.id;

        const [result] = await pool.query(
            'INSERT INTO events (title, description, date, points, coordinator_id) VALUES (?, ?, ?, ?, ?)',
            [title, description, date, points, coordinator_id]
        );

        res.status(201).json({
            message: 'Event created successfully',
            eventId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getEvents = async (req, res) => {
    try {
        const [events] = await pool.query(
            'SELECT e.*, u.name as coordinator_name FROM events e LEFT JOIN users u ON e.coordinator_id = u.id ORDER BY e.date DESC'
        );
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const markParticipant = async (req, res) => {
    try {
        const { event_id, student_email } = req.body;

        // Find student by email
        const [students] = await pool.query(
            'SELECT id FROM users WHERE email = ? AND role = ?',
            [student_email, 'student']
        );
        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const student_id = students[0].id;

        // Check if already registered
        const [existing] = await pool.query(
            'SELECT * FROM event_participants WHERE event_id = ? AND student_id = ?',
            [event_id, student_id]
        );
        if (existing.length > 0) {
            // Update attended to 1
            await pool.query(
                'UPDATE event_participants SET attended = 1 WHERE event_id = ? AND student_id = ?',
                [event_id, student_id]
            );
            return res.json({ message: 'Student marked as participant successfully (updated).' });
        }

        // Insert new row
        await pool.query(
            'INSERT INTO event_participants (event_id, student_id, attended) VALUES (?, ?, 1)',
            [event_id, student_id]
        );

        res.json({ message: 'Student marked as participant successfully (inserted).' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getStudentEvents = async (req, res) => {
    try {
        const student_id = req.user.id;

        const [events] = await pool.query(
            `SELECT e.id, e.title, e.date, e.points, ep.attended
             FROM events e
             JOIN event_participants ep ON e.id = ep.event_id
             WHERE ep.student_id = ?
             ORDER BY e.date DESC`,
            [student_id]
        );

        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Student registers for an event
const studentRegisterEvent = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { event_id } = req.body;

        // Check if already registered
        const [existing] = await pool.query(
            'SELECT * FROM event_participants WHERE event_id = ? AND student_id = ?',
            [event_id, student_id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        await pool.query(
            'INSERT INTO event_participants (event_id, student_id, attended) VALUES (?, ?, 0)',
            [event_id, student_id]
        );

        res.json({ message: 'Registered for event successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get students registered for an event (for coordinator)
const getRegisteredStudents = async (req, res) => {
    try {
        const { event_id } = req.query;
        const [students] = await pool.query(
            `SELECT u.id, u.name, u.email
             FROM event_participants ep
             JOIN users u ON ep.student_id = u.id
             WHERE ep.event_id = ? AND u.role = 'student'`,
            [event_id]
        );
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createEvent,
    getEvents,
    markParticipant,
    getStudentEvents,
    studentRegisterEvent,
    getRegisteredStudents
}; 