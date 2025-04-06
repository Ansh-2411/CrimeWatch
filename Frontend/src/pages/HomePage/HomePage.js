// App.js
import React, { useEffect, useState } from 'react';
import { MapPin, Bell, MessageSquare, Shield } from 'lucide-react';
import '../../App.css'; // Import the CSS file

// Mock components that would need to be created separately
const Button = ({ variant = "default", size, className = "", children }) => {
    const variantClasses = {
        default: "bg-black text-white hover:bg-gray-800",
        outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100",
        ghost: "bg-transparent hover:bg-gray-100"
    };

    const sizeClasses = {
        default: "py-2 px-4",
        sm: "py-1 px-3 text-sm",
        lg: "py-3 px-6 text-lg",
        icon: "p-2"
    };

    return (
        <button
            className={`rounded transition-colors ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`}
        >
            {children}
        </button>
    );
};

const Link = ({ href, className = "", children }) => (
    <a href={href} className={className}>
        {children}
    </a>
);

const LanguageSwitcher = () => (
    <div className="language-switcher">
        <select className="border rounded p-1 bg-white">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
        </select>
    </div>
);

const CrimeMap = () => (
    <div className="crime-map bg-gray-100 h-full flex items-center justify-center">
        <div>Interactive Crime Map would be displayed here</div>
    </div>
);

function HomePage() {
    const [auth, setAuth] = useState(false)
    const checkAuthCookie = () => {
        // Log all cookies to see what's available
        console.log('All cookies:', document.cookie);

        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));

        // Log individual cookies for debugging
        cookies.forEach(cookie => console.log('Cookie found:', cookie.trim()));

        const localToken = localStorage.getItem('authToken');

        if (tokenCookie) {
            console.log('Auth cookie is available');
            return true;
        } else if (localToken) {
            console.log('Auth token found in localStorage');
            return true;
        } else {
            console.log('No authentication found');
            return false;
        }
    };
    useEffect(() => {
        if (checkAuthCookie())
            setAuth(true)
    }, [])


    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b border-gray-200">
                <div className="container mx-auto px-4 flex items-center justify-between py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-black-600" />
                        <span className="font-bold text-xl">CrimeWatch</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <Link href="/notifications">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/chat">
                            <Button variant="ghost" size="icon">
                                <MessageSquare className="h-5 w-5" />
                            </Button>
                        </Link>
                        {!auth && <Link href="/user-login">
                            <Button>Login/SignUp</Button>
                        </Link>}
                        {auth &&
                            <Link href="/status">
                                <Button>Status </Button>
                            </Link>
                        }
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <section className="py-12 bg-gradient-to-r bg-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl font-bold tracking-tight mb-4">Community-Powered Crime Reporting</h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Report incidents in real-time, stay informed about local safety concerns, and help make your community
                                safer.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/report">
                                    <Button size="lg" className="w-full sm:w-auto">
                                        Report an Incident
                                    </Button>
                                </Link>
                                <Link href="/map">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                        {/* <MapPin className="mr-2 h-4 w-4" /> */}
                                        View Crime Map
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">Recent Reports in Your Area</h2>
                        <div className="h-[500px] w-full rounded-lg overflow-hidden border border-gray-200">
                            <CrimeMap />
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="bg-gray-300 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <MessageSquare className="h-6 w-6 text-black-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Report Incidents</h3>
                                <p className="text-gray-600">
                                    Submit reports with photos, videos, or audio. Our AI chatbot will guide you through the process.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="bg-gray-300 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-black-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Police Verification</h3>
                                <p className="text-gray-600">
                                    Law enforcement reviews and verifies reports before they appear on the public map.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="bg-gray-300 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <Bell className="h-6 w-6 text-black-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Stay Informed</h3>
                                <p className="text-gray-600">
                                    Receive notifications about incidents within 10km of your location to stay aware of local safety
                                    concerns.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-gray-200 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-black-600" />
                            <span className="font-semibold">SafetyWatch</span>
                        </div>
                        <div className="text-sm text-gray-600">
                            © {new Date().getFullYear()} CrimeWatch. All rights reserved.
                        </div>
                        <div className="flex gap-4">
                            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                                About
                            </Link>
                            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;