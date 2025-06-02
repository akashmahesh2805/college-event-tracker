# College Event Tracker

A web application to automate event participation tracking and attendance compensation in colleges.

## Features

- **Student Features**:

  - View events they've attended
  - Track activity points
  - View attendance exceptions

- **Event Coordinator Features**:

  - Create and manage events
  - Mark student participants
  - Assign activity points

- **Faculty Features**:
  - Create class schedules
  - View excused students
  - Create attendance exceptions

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: JWT

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd college-event-tracker
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Create a MySQL database and update the `.env` file:

   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=college_events
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Initialize the database:

   ```bash
   mysql -u your_mysql_username -p < database/schema.sql
   ```

5. Start the backend server:

   ```bash
   npm start
   ```

6. Open the frontend files in a web browser:
   - Open `frontend/index.html` in your browser
   - Or use a local server (e.g., Live Server VS Code extension)

## Usage

1. Register as a student, faculty member, or event coordinator
2. Log in with your credentials
3. Access your role-specific dashboard
4. Perform actions based on your role:
   - Students: View events and points
   - Coordinators: Create events and mark participants
   - Faculty: Manage attendance exceptions

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events

- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (coordinator only)
- `GET /api/events/my-events` - Get student's events
- `POST /api/events/mark-participant` - Mark student as participant

### Faculty

- `POST /api/faculty/schedule` - Create class schedule
- `GET /api/faculty/excused-students` - Get excused students
- `POST /api/faculty/attendance-exception` - Create attendance exception

## Security

- Passwords are hashed using bcrypt
- JWT authentication for protected routes
- Role-based access control
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
