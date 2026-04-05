import axios from 'axios';

const API_URL = 'http://localhost:5000/api/otp-auth';

export interface OTPAuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        email: string;
    };
    expiresIn?: string;
}

// Request OTP
export const requestOTP = async (email: string): Promise<OTPAuthResponse> => {
    try {
        const response = await axios.post(`${API_URL}/request-otp`, { email });
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            message: 'Network error. Please check your connection.'
        };
    }
};

// Verify OTP
export const verifyOTP = async (email: string, otp: string): Promise<OTPAuthResponse> => {
    try {
        const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            message: 'Network error. Please check your connection.'
        };
    }
};

// Verify token
export const verifyToken = async (token: string): Promise<OTPAuthResponse> => {
    try {
        const response = await axios.get(`${API_URL}/verify-token`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            message: 'Invalid or expired token'
        };
    }
};

// Get allowed emails
export const getAllowedEmails = async (): Promise<string[]> => {
    try {
        const response = await axios.get(`${API_URL}/allowed-emails`);
        return response.data.emails || [];
    } catch (error) {
        return [];
    }
};
