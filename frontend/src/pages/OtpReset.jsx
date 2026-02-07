import { useState } from "react";
import { verifyOtp } from "../api/auth.api";
// import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function OtpReset() {
    const { state } = useLocation()
    const email = state?.email
    const [otp, setOtp] = useState("")
    // const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleVerifyOtp = async () => {
        if (!email) {
            toast.error("Email is required ");
            return
        }

        const startCooldown = () => {
            setCooldown(30);
            const interval = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        };
        if (!otp) {
            toast.error("otp required")
            return
        }
        setLoading(true)
        try {
            await verifyOtp({ email, otp });
            // setOtpSent(true)
            toast.success("OTP verified successfully. Reset link  sent to your Email")
        } catch (error) {
            const msg = error.response?.data?.message || "Invalid otp"
            toast.error(msg)
        }
        finally {
            setLoading(false)
        }
    }
    const handleResendOtp = async () => {
        setResendLoading(true);
        try {
            await requestOtp({ email });
            toast.success("OTP resent successfully");
            startCooldown();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to resend OTP"
            );
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="card w-full max-w-sm bg-white shadow-lg rounded-xl">
                    <div className="card-body">
                        <h2 className="text-2xl font-bold text-gray-900  text-center mb-4">verify otp</h2>
                        <>
                            <p className="text-sm text-gray-600 text-center">
                                OTP sent to <span className="font-medium">{email}</span>
                            </p>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                className="input input-bordered w-full"
                                onChange={(e) => setOtp(e.target.value)}
                            />

                            <button
                                className="btn btn-primary"
                                onClick={handleVerifyOtp}
                                disabled={loading} >
                                {loading ? "verifying..." : "verify OTP"}
                            </button>
                            <button
                                className="btn btn-link text-sm"
                                onClick={handleResendOtp}
                                disabled={cooldown > 0 || resendLoading}
                            >
                                {cooldown > 0
                                    ? `Resend OTP in ${cooldown}s`
                                    : resendLoading
                                        ? "Resending..."
                                        : "Resend OTP"}
                            </button>
                        </>
                    </div>
                </div>
            </div>
        </>
    )
}


export default OtpReset