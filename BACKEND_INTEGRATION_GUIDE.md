# Backend Integration Guide

## 🚀 How to Make Your Dashboard Data Live

This guide explains how to integrate your dashboard with a real backend API to make all data dynamic and live.

---

## 📋 Current Architecture

Currently, the dashboard uses:

- **React Context API** for state management
- **localStorage** for data persistence
- **Hardcoded sample data** for demonstration

---

## 🔄 Future Backend Architecture

### 1. **API Service Layer**

Create API service files to handle all backend communication:

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add authentication token to requests
apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem('authToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default apiClient;
```

### 2. **Client Service**

```typescript
// src/services/clientService.ts
import apiClient from './api';
import { Client } from '../contexts/ClientContext';

export const clientService = {
	// Get all clients
	getAllClients: async (): Promise<Client[]> => {
		const response = await apiClient.get('/clients');
		return response.data;
	},

	// Get client by ID
	getClientById: async (id: number): Promise<Client> => {
		const response = await apiClient.get(`/clients/${id}`);
		return response.data;
	},

	// Create new client
	createClient: async (client: Omit<Client, 'id'>): Promise<Client> => {
		const response = await apiClient.post('/clients', client);
		return response.data;
	},

	// Update client
	updateClient: async (id: number, client: Partial<Client>): Promise<Client> => {
		const response = await apiClient.put(`/clients/${id}`, client);
		return response.data;
	},

	// Delete client
	deleteClient: async (id: number): Promise<void> => {
		await apiClient.delete(`/clients/${id}`);
	},

	// Filter clients by date range
	getClientsByDateRange: async (startDate: string, endDate: string): Promise<Client[]> => {
		const response = await apiClient.get('/clients/filter', {
			params: { startDate, endDate },
		});
		return response.data;
	},
};
```

### 3. **Update Client Context to Use API**

```typescript
// src/contexts/ClientContext.tsx (Updated)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { clientService } from '../services/clientService';

export interface Client {
  id: number;
  clientName: string;
  projectName: string;
  // ... other fields
}

interface ClientContextType {
  clients: Client[];
  loading: boolean;
  error: string | null;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: number, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
  refreshClients: () => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients from API on mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch clients');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newClient = await clientService.createClient(clientData);
      setClients(prev => [...prev, newClient]);
    } catch (err: any) {
      setError(err.message || 'Failed to add client');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: number, clientData: Partial<Client>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedClient = await clientService.updateClient(id, clientData);
      setClients(prev => prev.map(client =>
        client.id === id ? updatedClient : client
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update client');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await clientService.deleteClient(id);
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete client');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    refreshClients: fetchClients,
  };

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};
```

### 4. **Payment Service with Installment Management**

```typescript
// src/services/paymentService.ts
import apiClient from './api';
import { Payment } from '../contexts/PaymentContext';

export const paymentService = {
	// Get all payments
	getAllPayments: async (): Promise<Payment[]> => {
		const response = await apiClient.get('/payments');
		return response.data;
	},

	// Create new payment
	createPayment: async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
		const response = await apiClient.post('/payments', payment);
		return response.data;
	},

	// Update payment (for installment tracking)
	updatePayment: async (id: number, payment: Partial<Payment>): Promise<Payment> => {
		const response = await apiClient.put(`/payments/${id}`, payment);
		return response.data;
	},

	// Record new installment payment
	recordInstallment: async (
		paymentId: number,
		installmentData: {
			amount: number;
			date: string;
			description?: string;
		},
	): Promise<Payment> => {
		const response = await apiClient.post(`/payments/${paymentId}/installments`, installmentData);
		return response.data;
	},

	// Get payment history for a client
	getClientPayments: async (clientId: number): Promise<Payment[]> => {
		const response = await apiClient.get(`/payments/client/${clientId}`);
		return response.data;
	},

	// Get payment analytics
	getPaymentAnalytics: async (timeRange: 'monthly' | 'yearly'): Promise<any> => {
		const response = await apiClient.get('/payments/analytics', {
			params: { timeRange },
		});
		return response.data;
	},
};
```

### 5. **Dashboard Service for Analytics**

```typescript
// src/services/dashboardService.ts
import apiClient from './api';

export const dashboardService = {
	// Get dashboard statistics
	getStats: async (timeFilter: 'monthly' | 'yearly') => {
		const response = await apiClient.get('/dashboard/stats', {
			params: { timeFilter },
		});
		return response.data;
	},

	// Get client acquisition data
	getClientData: async (timeFilter: 'monthly' | 'yearly') => {
		const response = await apiClient.get('/dashboard/clients', {
			params: { timeFilter },
		});
		return response.data;
	},

	// Get project completion data
	getProjectData: async (timeFilter: 'monthly' | 'yearly') => {
		const response = await apiClient.get('/dashboard/projects', {
			params: { timeFilter },
		});
		return response.data;
	},

	// Get project status distribution
	getProjectStatus: async () => {
		const response = await apiClient.get('/dashboard/project-status');
		return response.data;
	},
};
```

### 6. **Real-time Updates with WebSocket**

```typescript
// src/services/websocket.ts
import { io, Socket } from 'socket.io-client';

class WebSocketService {
	private socket: Socket | null = null;

	connect() {
		this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:3000', {
			auth: {
				token: localStorage.getItem('authToken'),
			},
		});

		this.socket.on('connect', () => {
			console.log('WebSocket connected');
		});

		this.socket.on('disconnect', () => {
			console.log('WebSocket disconnected');
		});
	}

	// Listen for client updates
	onClientUpdate(callback: (client: any) => void) {
		this.socket?.on('client:updated', callback);
	}

	// Listen for payment updates
	onPaymentUpdate(callback: (payment: any) => void) {
		this.socket?.on('payment:updated', callback);
	}

	// Listen for team updates
	onTeamUpdate(callback: (member: any) => void) {
		this.socket?.on('team:updated', callback);
	}

	disconnect() {
		this.socket?.disconnect();
	}
}

export const wsService = new WebSocketService();
```

---

## 🗄️ Backend API Endpoints Needed

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Clients

- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/filter` - Filter clients by date range

### Payments

- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `POST /api/payments/:id/installments` - Record installment
- `GET /api/payments/client/:clientId` - Get client payments
- `GET /api/payments/analytics` - Get payment analytics

### Team

- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get team member by ID
- `POST /api/team` - Add new team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/clients` - Get client acquisition data
- `GET /api/dashboard/projects` - Get project completion data
- `GET /api/dashboard/project-status` - Get project status distribution

---

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Clients Table

```sql
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  contact VARCHAR(50) NOT NULL,
  address TEXT,
  start_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  last_payment VARCHAR(255),
  last_meet_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Payments Table

```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id),
  project_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  total_installments INTEGER NOT NULL,
  current_installment INTEGER NOT NULL,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL,
  description TEXT,
  payment_method VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Team Members Table

```sql
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  department VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  join_date DATE NOT NULL,
  address TEXT,
  salary DECIMAL(10, 2),
  projects INTEGER DEFAULT 0,
  skills TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Implementation Steps

### Step 1: Set up Backend

1. Choose your backend framework (Node.js/Express, Python/Django, etc.)
2. Set up database (PostgreSQL, MySQL, MongoDB)
3. Create API endpoints as listed above
4. Implement authentication with JWT
5. Add validation and error handling

### Step 2: Update Frontend

1. Install axios: `npm install axios`
2. Create API service files in `src/services/`
3. Update Context files to use API services
4. Add loading states and error handling to components
5. Test all CRUD operations

### Step 3: Add Real-time Features (Optional)

1. Install socket.io-client: `npm install socket.io-client`
2. Set up WebSocket connection
3. Listen for real-time updates in contexts
4. Update UI when data changes

### Step 4: Deploy

1. Deploy backend to cloud (AWS, Heroku, DigitalOcean)
2. Deploy frontend to Vercel, Netlify, or similar
3. Set up environment variables
4. Configure CORS and security

---

## 🔐 Environment Variables

Create `.env` file:

```env
REACT_APP_API_URL=https://your-api.com/api
REACT_APP_WS_URL=https://your-api.com
```

---

## 📈 Payment Installment Update Flow

### Adding New Installment Payment

```typescript
// In PaymentHistory component
const handleRecordInstallment = async (paymentId: number) => {
	try {
		const installmentData = {
			amount: 5000,
			date: new Date().toISOString(),
			description: 'Monthly installment payment',
		};

		await paymentService.recordInstallment(paymentId, installmentData);

		// Refresh payments list
		await refreshPayments();

		alert('Installment recorded successfully!');
	} catch (error) {
		console.error('Error recording installment:', error);
		alert('Failed to record installment');
	}
};
```

---

## 🎯 Benefits of Backend Integration

1. **Real Data**: All data comes from database, not hardcoded
2. **Multi-user**: Multiple users can access and update data
3. **Persistence**: Data survives browser refresh and device changes
4. **Security**: Proper authentication and authorization
5. **Scalability**: Can handle thousands of records
6. **Real-time**: Live updates across all connected clients
7. **Analytics**: Complex queries and reporting
8. **Backup**: Automatic database backups

---

## 📝 Next Steps

1. Choose your backend technology stack
2. Set up development environment
3. Create database schema
4. Build API endpoints
5. Update frontend to use APIs
6. Test thoroughly
7. Deploy to production

---

For questions or help with implementation, refer to the documentation of your chosen backend framework.
