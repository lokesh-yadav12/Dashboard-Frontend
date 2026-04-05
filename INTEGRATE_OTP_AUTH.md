# How to Integrate OTP Authentication

## Step 1: Update App.tsx

Add the OTPAuthProvider and update your routes. Here's what you need to do:

```typescript
import { OTPAuthProvider } from './contexts/OTPAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OTPLogin from './pages/OTPLogin';

// Wrap your entire app with OTPAuthProvider (after ToastProvider)
<ToastProvider>
  <OTPAuthProvider>
    {/* Your existing providers */}
  </OTPAuthProvider>
</ToastProvider>

// Add OTP login route
<Route path="/otp-login" element={<OTPLogin />} />

// Protect your existing routes
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

<Route path="/clients" element={
  <ProtectedRoute>
    <Clients />
  </ProtectedRoute>
} />

// ... protect all other routes similarly
```

## Step 2: Add Logout Button

Add a logout button to your Sidebar or Header:

```typescript
import { useOTPAuth } from '../contexts/OTPAuthContext';

const Sidebar = () => {
  const { logout, user } = useOTPAuth();

  return (
    <div>
      {/* Your existing sidebar content */}
      
      {/* Add at the bottom */}
      <div className="p-4 border-t">
        <p className="text-sm text-gray-600 mb-2">{user?.email}</p>
        <button
          onClick={logout}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};
```

## Step 3: Update Default Route

Change your default route to redirect to OTP login:

```typescript
<Route path="/" element={<Navigate to="/otp-login" replace />} />
```

## Step 4: Remove Old Login/Signup (Optional)

If you want to completely replace the old authentication:

1. Remove the old Login and Signup routes
2. Remove the old AuthContext if not needed
3. Keep only OTP-based authentication

## Complete App.tsx Example

```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { OTPAuthProvider } from './contexts/OTPAuthContext';
import { ClientProvider } from './contexts/ClientContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { TeamProvider } from './contexts/TeamContext';
import ProtectedRoute from './components/ProtectedRoute';
import OTPLogin from './pages/OTPLogin';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
// ... other imports

function App() {
  return (
    <Router>
      <ToastProvider>
        <OTPAuthProvider>
          <ClientProvider>
            <PaymentProvider>
              <TeamProvider>
                <Routes>
                  {/* Public Route */}
                  <Route path="/otp-login" element={<OTPLogin />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/clients" element={
                    <ProtectedRoute>
                      <Clients />
                    </ProtectedRoute>
                  } />
                  
                  {/* Add ProtectedRoute to all other routes */}
                  
                  {/* Default Route */}
                  <Route path="/" element={<Navigate to="/otp-login" replace />} />
                </Routes>
              </TeamProvider>
            </PaymentProvider>
          </ClientProvider>
        </OTPAuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
```

## Step 5: Test the Integration

1. Start backend: `cd "Dashboard backend" && npm run dev`
2. Start frontend: `cd "Dashboard frontend" && npm run dev`
3. Go to http://localhost:5173
4. You should be redirected to /otp-login
5. Enter jenasaisubham@gmail.com
6. Check email for OTP
7. Enter OTP and login
8. You should be redirected to dashboard

## Features

- ✅ Automatic redirect to login if not authenticated
- ✅ Token persists in localStorage (stays logged in)
- ✅ Logout functionality
- ✅ Protected routes
- ✅ Beautiful OTP login UI
- ✅ Email verification
- ✅ Secure JWT tokens
