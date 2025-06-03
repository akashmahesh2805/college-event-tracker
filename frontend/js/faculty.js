// API URL
const API_URL = 'http://localhost:3000/api';

// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user || user.role !== 'faculty') {
    window.location.href = 'index.html';
}

// DOM Elements
const createScheduleForm = document.getElementById('createScheduleForm');
const viewExcusedBtn = document.getElementById('viewExcusedBtn');
const createExceptionForm = document.getElementById('createExceptionForm');
const excusedStudentsList = document.getElementById('excusedStudentsList');
const exceptionClass = document.getElementById('exceptionClass');
const exceptionEvent = document.getElementById('exceptionEvent');
const logoutBtn = document.getElementById('logoutBtn');

// Fetch classes and events for dropdowns
async function fetchDropdownData() {
    try {
        // Fetch classes
        const classesResponse = await fetch(`${API_URL}/faculty/schedule`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (classesResponse.ok) {
            const classes = await classesResponse.json();
            populateClassSelect(classes);
        }

        // Fetch events
        const eventsResponse = await fetch(`${API_URL}/events`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (eventsResponse.ok) {
            const events = await eventsResponse.json();
            populateEventSelect(events);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load dropdown data');
    }
}

// Populate class select dropdown
function populateClassSelect(classes) {
    exceptionClass.innerHTML = '<option value="">Select a class</option>';
    if (!classes || classes.length === 0) {
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = 'No classes available';
        exceptionClass.appendChild(option);
        return;
    }
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.id;
        option.textContent = `${cls.class_name} (${new Date(cls.date).toLocaleDateString()})`;
        exceptionClass.appendChild(option);
    });
}

// Populate event select dropdown
function populateEventSelect(events) {
    exceptionEvent.innerHTML = '<option value="">Select an event</option>';
    events.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = event.title;
        exceptionEvent.appendChild(option);
    });
}

// Create class schedule
createScheduleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const scheduleData = {
        class_name: document.getElementById('className').value,
        date: document.getElementById('classDate').value
    };

    try {
        const response = await fetch(`${API_URL}/faculty/schedule`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scheduleData)
        });

        if (response.ok) {
            alert('Class schedule created successfully!');
            createScheduleForm.reset();
            fetchDropdownData();
        } else {
            const data = await response.json();
            throw new Error(data.message || 'Failed to create schedule');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to create schedule');
    }
});

// View excused students
viewExcusedBtn.addEventListener('click', async () => {
    const date = document.getElementById('viewDate').value;
    
    if (!date) {
        alert('Please select a date');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/faculty/excused-students?date=${date}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const students = await response.json();
            displayExcusedStudents(students);
        } else {
            throw new Error('Failed to fetch excused students');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load excused students');
    }
});

// Display excused students
function displayExcusedStudents(students) {
    excusedStudentsList.innerHTML = students.length ? '' : '<p>No excused students for this date.</p>';
    
    students.forEach(student => {
        const studentElement = document.createElement('div');
        studentElement.className = 'event-item';
        studentElement.innerHTML = `
            <h3>${student.name}</h3>
            <p>Email: ${student.email}</p>
            <p>Event: ${student.event_title}</p>
            <p>Points: ${student.points}</p>
        `;
        excusedStudentsList.appendChild(studentElement);
    });
}

// Create attendance exception
createExceptionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const exceptionData = {
        class_schedule_id: exceptionClass.value,
        event_id: exceptionEvent.value,
        student_email: document.getElementById('studentEmail').value
    };

    try {
        const response = await fetch(`${API_URL}/faculty/attendance-exception`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exceptionData)
        });

        if (response.ok) {
            alert('Attendance exception created successfully!');
            createExceptionForm.reset();
        } else {
            const data = await response.json();
            throw new Error(data.message || 'Failed to create exception');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to create exception');
    }
});

// Logout handler
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Initial load
fetchDropdownData(); 