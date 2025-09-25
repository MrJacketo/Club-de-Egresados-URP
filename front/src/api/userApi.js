import apiClient from './apiClient';

// API functions for user management
export const userApi = {
    // Update user academic data
    updateAcademicData: async (academicData) => {
        try {
            const response = await apiClient.put('/auth/update-academic-data', academicData);
            return response.data;
        } catch (error) {
            console.error('Error updating academic data:', error);
            throw error;
        }
    },

    // Get current user data
    getCurrentUser: async () => {
        try {
            const response = await apiClient.get('/auth/current-user');
            return response.data;
        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    },

    // Get user name
    getUserName: async () => {
        try {
            const response = await apiClient.get('/auth/user-name');
            return response.data;
        } catch (error) {
            console.error('Error getting user name:', error);
            throw error;
        }
    }
};

export default userApi;