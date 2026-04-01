# Quick Test: Frontend-Backend Connection

## Prerequisites
- MongoDB running (local or Atlas)
- Backend `.env` file configured with MongoDB URI

## Step-by-Step Test

### 1. Start Backend
```bash
cd "Dashboard backend"
npm run dev
```

You should see:
```
🚀 Server running in development mode on port 5000
✅ MongoDB Connected Successfully
```

### 2. Start Frontend
```bash
cd "Dashboard frontend"
npm run dev
```

### 3. Test API Connection (Optional - Using curl or Postman)

#### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@businesshub.com",
    "password": "admin123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@businesshub.com",
    "password": "admin123"
  }'
```

Save the token from the response!

#### Get Clients (with token)
```bash
curl -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Current State

### ✅ What's Working
- Backend API is fully functional
- All models updated with new fields
- All routes configured
- Authentication system ready
- MongoDB integration ready

### ⚠️ What Needs Migration
The frontend is currently using localStorage for data storage. To enable live backend synchronization:

1. **AuthContext** - Needs to call `/api/auth/login` and `/api/auth/register`
2. **ClientContext** - Needs to call `/api/clients` endpoints
3. **TeamContext** - Needs to call `/api/team` endpoints
4. **PaymentContext** - Needs to call `/api/payments` endpoints

### 📝 Migration Priority

**Option 1: Quick Test (Recommended)**
Keep localStorage for now, test backend separately using Postman/curl to verify everything works.

**Option 2: Full Migration**
Update all contexts to use the API service (`src/services/api.ts`).

## Verify Backend Models

### Check Client Model Fields
```javascript
// Should include:
- clientName
- projectName
- email
- contact
- address
- startDate
- status
- lastPayment
- lastMeetNote
- meetingNotes (array)
- maintenanceStartDate
- document
- signedDocument
```

### Check TeamMember Model Fields
```javascript
// Should include:
- employeeId ✅ NEW
- name
- role
- email
- phone
- department
- status
- joinDate
- address
- salary
- projects
- skills
- avatar
- bio ✅ NEW
```

### Check Payment Model Fields
```javascript
// Should include:
- clientId
- clientName
- projectName
- amount
- date
- totalInstallments
- currentInstallment
- installment
- remaining
- invoiceNumber
- status
- description
- paymentMethod
- invoiceDocument ✅ NEW
```

## Testing Checklist

- [ ] Backend starts without errors
- [ ] MongoDB connects successfully
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Can create a client (with token)
- [ ] Can get all clients (with token)
- [ ] Can update a client (with token)
- [ ] Can delete a client (with token)
- [ ] Same tests for team members
- [ ] Same tests for payments

## Common Issues

### Backend won't start
- Check MongoDB URI in `.env`
- Ensure MongoDB is running
- Check port 5000 is not in use

### CORS errors
- Backend CORS is configured for `http://localhost:5173`
- If using different port, update in `server.js`

### 401 Unauthorized
- Token expired or invalid
- Login again to get new token
- Check Authorization header format: `Bearer <token>`

## Next Steps

Once backend is verified working:
1. Update frontend contexts to use API
2. Test full CRUD operations from UI
3. Implement file upload for documents
4. Add loading states and error handling
5. Deploy to production
