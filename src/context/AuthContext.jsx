import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('summitUser')
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                // Use only the real JWT token — never fall back to _id (security: prevents auth bypass)
                const token = parsedUser.token
                if (!token) {
                    // No valid JWT stored — clear and force re-login
                    localStorage.removeItem('summitUser')
                    setLoading(false)
                    return
                }
                authAPI.validateToken(token)
                    .then(validatedUser => {
                        // Preserve the JWT token from stored data
                        validatedUser.token = parsedUser.token
                        setUser(validatedUser)
                    })
                    .catch(() => {
                        localStorage.removeItem('summitUser')
                        setUser(null)
                    })
                    .finally(() => setLoading(false))
            } catch {
                localStorage.removeItem('summitUser')
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        try {
            const userData = await authAPI.login(email, password)
            // userData now includes a JWT token from the backend
            localStorage.setItem('summitUser', JSON.stringify(userData))
            setUser(userData)
            return { success: true, user: userData }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Invalid email or password'
            return { success: false, error: errorMessage }
        }
    }

    const logout = () => {
        localStorage.removeItem('summitUser')
        setUser(null)
    }

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
