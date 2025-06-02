// API URL
const API_URL = 'http://localhost:3000/api';

// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user || user.role !== 'student') {
    window.location.href = 'index.html';
}

// DOM Elements
const eventsList = document.getElementById('eventsList');
const totalPoints = document.getElementById('totalPoints');
const logoutBtn = document.getElementById('logoutBtn');
const allEventsList = document.getElementById('allEventsList');

// Fetch and display events
async function fetchEvents() {
    try {
        const response = await fetch(`${API_URL}/events/my-events`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const events = await response.json();
            displayEvents(events);
            calculateTotalPoints(events);
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
    eventsList.innerHTML = events.length ? '' : '<p>No events attended yet.</p>';
    
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.innerHTML = `
            <h3>${event.title}</h3>
            <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
            <p>Points: ${event.points}</p>
            <p>Status: ${event.attended ? 'Attended' : 'Registered'}</p>
        `;
        eventsList.appendChild(eventElement);
    });
}

// Calculate total points
function calculateTotalPoints(events) {
    const total = events.reduce((sum, event) => sum + (event.attended ? event.points : 0), 0);
    totalPoints.textContent = total;
}

// Logout handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

// Fetch and display all events for registration
async function fetchAllEvents() {
    try {
        const response = await fetch(`${API_URL}/events`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const allEvents = await response.json();
            // Fetch student's registered events to filter
            const myEventsResponse = await fetch(`${API_URL}/events/my-events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const myEvents = myEventsResponse.ok ? await myEventsResponse.json() : [];
            const registeredEventIds = new Set(myEvents.map(e => e.id));
            displayAllEvents(allEvents, registeredEventIds);
        } else {
            throw new Error('Failed to fetch all events');
        }
    } catch (error) {
        console.error('Error:', error);
        allEventsList.innerHTML = '<p>Failed to load events.</p>';
    }
}

function displayAllEvents(events, registeredEventIds) {
    allEventsList.innerHTML = events.length ? '' : '<p>No events available.</p>';
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.innerHTML = `
            <h3>${event.title}</h3>
            <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
            <p>Points: ${event.points}</p>
            <button class="primary-btn" data-event-id="${event.id}" ${registeredEventIds.has(event.id) ? 'disabled' : ''}>
                ${registeredEventIds.has(event.id) ? 'Registered' : 'Register'}
            </button>
        `;
        // Add click handler for register button
        const btn = eventElement.querySelector('button');
        if (!registeredEventIds.has(event.id)) {
            btn.addEventListener('click', () => registerForEvent(event.id));
        }
        allEventsList.appendChild(eventElement);
    });
}

async function registerForEvent(eventId) {
    try {
        const response = await fetch(`${API_URL}/events/register`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ event_id: eventId })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registered for event successfully!');
            fetchAllEvents();
            fetchEvents();
        } else {
            alert(data.message || 'Failed to register for event');
        }
    } catch (error) {
        alert('An error occurred while registering for the event');
    }
}

// Initial load
fetchAllEvents();
fetchEvents(); 