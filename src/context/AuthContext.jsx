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

// Decode a JWT payload without any library (base64url → JSON)
const decodeJwt = (token) => {
    try {
        const payload = token.split('.')[1]
        return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    } catch {
        return null
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('summitUser')
        if (!storedUser) { setLoading(false); return }

        let parsedUser
        try { parsedUser = JSON.parse(storedUser) } catch {
            localStorage.removeItem('summitUser')
            setLoading(false)
            return
        }

        const token = parsedUser.token
        if (!token) {
            localStorage.removeItem('summitUser')
            setLoading(false)
            return
        }

        // Check JWT expiry client-side first (no network call needed)
        const payload = decodeJwt(token)
        const nowSec = Math.floor(Date.now() / 1000)
        if (payload && payload.exp && payload.exp < nowSec) {
            // Token is expired — clear and force re-login without hitting the server
            localStorage.removeItem('summitUser')
            setLoading(false)
            return
        }

        // OPTIMISTIC: immediately trust the cached user so the app renders instantly.
        // The background validate call below will silently fix any stale data.
        setUser(parsedUser)
        setLoading(false)

        // Background validation — refreshes user data and catches server-side revocation.
        // Does NOT block the UI; if it fails we log the user out quietly.
        authAPI.validateToken(token)
            .then(validatedUser => {
                validatedUser.token = token
                setUser(validatedUser)
                localStorage.setItem('summitUser', JSON.stringify(validatedUser))
            })
            .catch(() => {
                localStorage.removeItem('summitUser')
                setUser(null)
            })
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
