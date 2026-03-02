import axios from 'axios'

// Default to port 3001 (server/.env PORT=3001). Override via VITE_API_URL in .env.local for prod.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
    const userData = localStorage.getItem('summitUser')
    if (userData) {
        try {
            const user = JSON.parse(userData)
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`
            }
            // Note: _id-as-token fallback removed — JWT is always required (security)
        } catch (e) {
            // Invalid JSON in storage — ignore
        }
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// Response interceptor for auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear stored user
            const currentPath = window.location.pathname
            if (currentPath.startsWith('/dashboard')) {
                localStorage.removeItem('summitUser')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

// Auth API
export const authAPI = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    },

    validateToken: async (token) => {
        const response = await api.get('/auth/validate', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    }
}

// Participants API (for Faculty dashboard)
export const participantsAPI = {
    getAll: async () => {
        const response = await api.get('/participants')
        return response.data
    },

    getByEvent: async (eventName) => {
        const response = await api.get(`/participants?event=${encodeURIComponent(eventName)}`)
        return response.data
    },

    exportToCSV: async () => {
        const response = await api.get('/participants/export', { responseType: 'blob' })
        return response.data
    }
}

// Announcements API
export const announcementsAPI = {
    getAll: async () => {
        const response = await api.get('/announcements')
        return response.data
    },

    create: async (announcement) => {
        const response = await api.post('/announcements', announcement)
        return response.data
    },

    delete: async (id) => {
        const response = await api.delete(`/announcements/${id}`)
        return response.data
    }
}

// Uploads API (for Coordinator dashboard)
export const uploadsAPI = {
    uploadPhoto: async (file) => {
        const formData = new FormData()
        formData.append('photos', file)
        const response = await api.post('/uploads/photos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    },

    uploadDocument: async (file) => {
        const formData = new FormData()
        formData.append('documents', file)
        const response = await api.post('/uploads/documents', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    },

    getPhotos: async () => {
        const response = await api.get('/uploads/photos')
        return response.data
    },

    getDocuments: async () => {
        const response = await api.get('/uploads/documents')
        return response.data
    },

    delete: async (type, id) => {
        const response = await api.delete(`/uploads/${type}/${id}`)
        return response.data
    }
}

export default api
