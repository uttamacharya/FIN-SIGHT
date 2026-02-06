import { useState } from "react";
import { requestOtp, verifyOtp } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function OtpReset() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSendOtp = async () => {
        if (!email) {
            toast.error("Email is required ");
            return
        }
        try {
            await requestOtp({ email });
            setOtpSent(true)
            toast.success("OTP Sent to your email")
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to send otp"
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error("OTP is required")
            return
        }
        setLoading(true);
        try {
            const res = await verifyOtp({ email, otp });
            const resetToken = res.data.resetToken;
            toast.success("OTP verified")
            navigate(`/reset-password?token=${resetToken}`)
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Invalid OTP"
            )
        } finally {
            setLoading(false)
        }
    }
    return(
    <>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="card w-full max-w-sm bg-white shadow-lg rounded-xl">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-gray-900  text-center mb-4">Reset with otp</h2>

                    <input
                        type="email"
                        placeholder='Enter Your Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={otpSent}
                        className="input input-bordered w-full" />
                        {!otpSent ?(
                            <button className="btn btn-primary w-full"
                            onClick={handleSendOtp}
                            disabled={loading}>
                                {loading ? "sending..." :"Send OTP"}
                            </button>
                        ):(
                            <>
                            <input
                             type="text"
                             placeholder="Enter OTP"
                             value={otp}
                             className="input input-bordered w-full"
                             onChange={(e)=>setOtp(e.target.value)}
                              />

                              <button
                              className="btn btn-primary"
                              onClick={handleVerifyOtp}
                              disabled={loading} >
                                {loading? "verifying...": "verify OTP"}
                              </button>
                            </>
                        )}
                </div>
            </div>
        </div>
    </>
    )
}


export default OtpReset