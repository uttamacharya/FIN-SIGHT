import React from 'react'
import { useState } from 'react'
import { signUpApi } from '../api/auth.api'
import { useAuth } from '../hooks/UseAuth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { User, UserPlus, Mail, Lock } from "lucide-react"

function Signup() {
    const { signup } = useAuth()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState([]);
    const [showLoginOption, setShowLoginOption] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        const { name, email, password, confirmPassword } = form;
        if (password !== confirmPassword) {
            toast.error("Password does not match");
            return;
        }
        setShowLoginOption(false)
        setLoading(true);
        try {
            const res = await signUpApi({ name, email, password })
            signUp({
                user: res.data.user,
                accessToken: res.data.accessToken
            })
            toast.success("Signup successful ")
            navigate("/login")
        } catch (error) {
            const backendMessage = error.response?.data?.message || "signup failed"
            toast.error(backendMessage)
            setFieldErrors(error.response?.data?.errors || []);
            const status = error.response?.status
            if (status === 409 || backendMessage.toLowerCase().includes("exists")) {
                setShowLoginOption(true);
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
                <div className="card width-full max-w-sm shadow-lg bg-white  rounded-2xl">
                    <div className="card-body">
                        <h2 className='text-3xl font-bold text-center  mb-4 text-gray-950'><UserPlus /> SIGNUP</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    name='name'
                                    placeholder='Enter your name'
                                    value={form.name}
                                    onChange={handleChange}
                                    className="input input-bordered w-full pl-10"
                                    required />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="exemple@gmail.com"
                                    className="input input-bordered w-full pl-10"
                                    required
                                />
                            </div>


                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="......"
                                    className="input input-bordered w-full pl-10"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="......."
                                    className="input input-bordered w-full pl-10"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full flex items-center gap-2"
                                disabled={loading}
                            >
                                <UserPlus size={18} />
                                {loading ? "Creating Account..." : "Signup"}
                            </button>
                        </form>
                        {fieldErrors.length > 0 && (
                            <ul className="mt-4 space-y-2">
                                {fieldErrors.map((e, i) => (
                                    <li key={i} className="alert alert-error">
                                        {e.field} : {e.message}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {showLoginOption && (
                            <p className="text-center mt-4 text-sm">
                                Account already exists?
                                <span
                                    className="text-blue-600 cursor-pointer ml-1 hover:underline"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </span>
                            </p>
                        )}


                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup