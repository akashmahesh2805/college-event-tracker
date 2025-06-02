// API URL
const API_URL = 'http://localhost:3000/api';

// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user || user.role !== 'coordinator') {
    window.location.href = 'index.html';
}

// DOM Elements
const createEventForm = document.getElementById('createEventForm');
const eventsList = document.getElementById('eventsList');
const eventSelect = document.getElementById('eventSelect');
const markParticipantBtn = document.getElementById('markParticipantBtn');
const logoutBtn = document.getElementById('logoutBtn');
const studentSelect = document.getElementById('studentSelect');

// Fetch and display events
async function fetchEvents() {
    try {
        const response = await fetch(`${API_URL}/events`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const events = await response.json();
            displayEvents(events);
            populateEventSelect(events);
        } else {
            throw new Error('Failed to fetch events');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load events');
    }
}

// Display events in the list
function displayEvents(events) {
    eventsList.innerHTML = events.length ? '' : '<p>No events created yet.</p>';
    
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.innerHTML = `
            <h3>${event.title}</h3>
            <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
            <p>Points: ${event.points}</p>
            <p>Description: ${event.description}</p>
        `;
        eventsList.appendChild(eventElement);
    });
}

// Populate event select dropdown
function populateEventSelect(events) {
    eventSelect.innerHTML = '<option value="">Select an event</option>';
    events.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = event.title;
        eventSelect.appendChild(option);
    });
}

// Fetch registered students for selected event
async function fetchRegisteredStudents(eventId) {
    if (!eventId) {
        studentSelect.innerHTML = '<option value="">Select a student</option>';
        return;
    }
    try {
        const response = await fetch(`${API_URL}/events/registered-students?event_id=${eventId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const students = await response.json();
            studentSelect.innerHTML = '<option value="">Select a student</option>';
            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.email;
                option.textContent = `${student.name} (${student.email})`;
                studentSelect.appendChild(option);
            });
        } else {
            studentSelect.innerHTML = '<option value="">Select a student</option>';
        }
    } catch (error) {
        studentSelect.innerHTML = '<option value="">Select a student</option>';
    }
}

eventSelect.addEventListener('change', () => {
    fetchRegisteredStudents(eventSelect.value);
});

// Create new event
createEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const eventData = {
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        date: document.getElementById('eventDate').value,
        points: parseInt(document.getElementById('eventPoints').value)
    };

    try {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        if (response.ok) {
            alert('Event created successfully!');
            createEventForm.reset();
            fetchEvents();
        } else {
            const data = await response.json();
            throw new Error(data.message || 'Failed to create event');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to create event');
    }
});

// Mark participant
markParticipantBtn.addEventListener('click', async () => {
    const eventId = eventSelect.value;
    const studentEmail = studentSelect.value;

    if (!eventId || !studentEmail) {
        alert('Please select an event and a student');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/events/mark-participant`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_id: eventId,
                student_email: studentEmail
            })
        });

        if (response.ok) {
            alert('Student marked as participant successfully!');
            fetchRegisteredStudents(eventId);
        } else {
            const data = await response.json();
            throw new Error(data.message || 'Failed to mark participant');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to mark participant');
    }
});

// Logout handler
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Initial load
fetchEvents(); 