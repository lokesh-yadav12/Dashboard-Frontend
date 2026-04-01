# Backend Integration Guide

## Overview
This guide explains how to connect the frontend to the backend API for live data synchronization.

## Current Status
- ✅ Backend models updated with all required fields
- ✅ API service layer created (`src/services/api.ts`)
- ⚠️ Frontend contexts still using localStorage (needs migration)

## Backend Models Updated

### Client Model
Added fields:
- `meetingNotes` - Array of meeting notes with date and note
- `maintenanceStartDate` - Date when maintenance started
- `document` - Document file path
- `signedDocument` - Signed document file path

### TeamMember Model
Added fields:
- `employeeId` - Unique employee identifier
- `bio` - Employee biography

### Payment Model
Added fields:
- `invoiceDocument` - Invoice document file path

## Setup Instructions

### 1. Backend Setup

```bash
cd "Dashboard backend"

# Install dependencies (if not already done)
npm install

# Create .env file with your MongoDB URI
cp .env.example .env
# Edit .env and add your MongoDB connection string

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd "Dashboard frontend"

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Install dependencies (if not already done)
npm install

# Start the frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Migration Steps (To Connect Frontend to Backend)

### Step 1: Update AuthContext to use API

Replace localStorage authentication with API calls:

```typescript
// In src/contexts/AuthContext.tsx
import { authAPI } from '../services/api';

// Replace login function
const login = async (email: string, password: string) => {
  try {
    const response = await authAPI.login(email, password);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};
```

### Step 2: Update ClientContext to use API

Replace localStorage with API calls:

```typescript
// In src/contexts/ClientContext.tsx
import { clientAPI } from '../services/api';

// Load clients from API
useEffect(() => {
  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll();
      setClients(response.data.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };
  
  if (isAuthenticated) {
    fetchClients();
  }
}, [isAuthenticated]);

// Add client via API
const addClient = async (clientData: Omit<Client, 'id'>) => {
  try {
    const response = await clientAPI.create(clientData);
    setClients([...clients, response.data.data]);
  } catch (error) {
    console.error('Failed to add client:', error);
  }
};
```

### Step 3: Update TeamContext to use API

```typescript
// In src/contexts/TeamContext.tsx
import { teamAPI } from '../services/api';

// Similar pattern as ClientContext
```

### Step 4: Update PaymentContext to use API

```typescript
// In src/contexts/PaymentContext.tsx
import { paymentAPI } from '../services/api';

// Similar pattern as ClientContext
```

## API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/search?q=query` - Search clients

### Team Members
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get team member by ID
- `POST /api/team` - Create new team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member
- `GET /api/team/search?q=query` - Search team members

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment
- `GET /api/payments/client/:clientId` - Get payments by client

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Get recent activity

## Testing the Integration

### 1. Test Backend API

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test Frontend Connection

1. Start both backend and frontend servers
2. Open browser to `http://localhost:5173`
3. Register/Login with credentials
4. Add a client - check if it appears in MongoDB
5. Add a team member - check if it appears in MongoDB
6. Add a payment - check if it appears in MongoDB

## File Upload Handling

For document uploads (invoices, client documents), you'll need to:

1. Install multer in backend (already done)
2. Create upload routes
3. Update frontend to use FormData for file uploads

Example:
```typescript
const formData = new FormData();
formData.append('invoiceDocument', file);
formData.append('amount', amount);
// ... other fields

await paymentAPI.create(formData);
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure backend has proper CORS configuration in `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Authentication Issues
- Check if token is being stored in localStorage
- Verify token is being sent in Authorization header
- Check backend JWT_SECRET matches

### Data Not Syncing
- Check browser console for API errors
- Verify backend is running on correct port
- Check MongoDB connection is successful

## Next Steps

1. Migrate AuthContext to use API
2. Migrate ClientContext to use API
3. Migrate TeamContext to use API
4. Migrate PaymentContext to use API
5. Test all CRUD operations
6. Implement file upload functionality
7. Add error handling and loading states
8. Add data validation

## Benefits of Backend Integration

✅ Real-time data synchronization across devices
✅ Data persistence in MongoDB
✅ User authentication and authorization
✅ Secure data storage
✅ Scalable architecture
✅ Multi-user support
✅ Data backup and recovery
✅ Advanced querying and filtering
