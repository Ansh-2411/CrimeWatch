import { NavLink } from 'react-router-dom';
import { useState } from "react"
import "../../static/Auth.css"

const Signup = ({ onSwitchToLogin, onSignup }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        badgeNumber: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
        location: {
            coordinates: [],
            address: ""
        }
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        })

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }
    }


    const validateForm = () => {
        const newErrors = {}

        if (!formData.fullName) newErrors.fullName = "Full name is required"


        if (!formData.email) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"


        if (!formData.password) newErrors.password = "Password is required"
        else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"

        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

        if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validateForm()) {
            setIsLoading(true)
            setTimeout(() => {
                setIsLoading(false)
                if (onSignup) {
                    onSignup(formData)
                }
            }, 1500)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card signup-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <div className="badge-icon">CW</div>
                    </div>
                    <h1>CrimeWatch</h1>
                    <p>Create a new account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="fullName">FullName</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={errors.firstName ? "error" : ""}
                            placeholder="John doe"
                        />
                        {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                    </div>

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

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? "error" : ""}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                    </div>

                    <div className="form-options">
                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                            />
                            <label htmlFor="agreeToTerms">
                                I agree to the <a href="#terms">Terms and Conditions</a>
                            </label>
                        </div>
                    </div>
                    {errors.agreeToTerms && <div className="error-message terms-error">{errors.agreeToTerms}</div>}

                    <button type="submit" className={`auth-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                {/* <div className="auth-footer">
                    <p>
                        Already have an account?{" "}
                        <NavLink to="/user-login" className="nav-link">Login</NavLink>
                    </p>
                </div> */}
            </div>
        </div>
    )
}

export default Signup
