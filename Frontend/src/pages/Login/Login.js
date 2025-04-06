import { NavLink } from 'react-router-dom';
import { useState } from "react"
import "../../static/Auth.css"
import { useNavigate } from 'react-router-dom';



const Login = ({ onSwitchToSignup, onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        })

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formData)
        if (validateForm()) {
            setIsLoading(true)

            const response = await fetch('http://localhost:4000/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(response)
            console.log(data)
            if (response.ok && data.token) {
                // Optional: Store token in localStorage if needed
                if (formData.rememberMe) {
                    localStorage.setItem('authToken', data.token);
                }

                setTimeout(() => {
                    setIsLoading(false)

                    if (onLogin) {
                        onLogin(formData)
                    }

                    // NAVIGATION OPTION 1: If using React Router
                    // Import and use navigate from your component
                    navigate('/'); // Navigate to home page

                    // NAVIGATION OPTION 2: Plain JavaScript redirect
                    // window.location.href = '/'; // Navigate to base URL

                    // NAVIGATION OPTION 3: If you have a custom navigation function
                    // navigateTo('/');
                }, 1500)
            } else {
                setIsLoading(false);
                // Handle login failure
                console.error("Login failed:", data.error);
                // Show error message to user
            }
            setTimeout(() => {
                setIsLoading(false)
                if (onLogin) {
                    onLogin(formData)
                }
            }, 1500)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <div className="badge-icon">CW</div>
                    </div>
                    <h1>CrimeWatch</h1>
                    <p>Sign in to your account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? "error" : ""}
                            placeholder="example@gmail.com"
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? "error" : ""}
                            placeholder="••••••••"
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <div className="form-options">
                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <a href="#forgot-password" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className={`auth-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{" "}
                        <NavLink to="/user-signup" className="nav-link">Sign Up</NavLink>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login

