import { Eye, EyeOff, Loader2, Lock, Mail, UserRound, User, Camera } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [formData, setFormData] = useState({
  //   fullName : "",
  //   email : "",
  //   password : "",
  // });
  const [selectedImg, setSelectedImg] = useState(null);
  const {
    step,
    email,
    otp,
    formData,
    timeLeft,
    isSigningUp,
    set,
    sendOtp,
    verifyOtp,
    resendOtp,
    signUp,
    isResendingOtp,
    ...updateState
  } = useAuthStore();

  // const updateState = useAuthStore((state) => state.set);

  // const {signUp, isSigningUp} = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImg(URL.createObjectURL(file));
      set({ formData: { ...formData, profilePic: file } });
    }
  };

  const handleSubmit = (e) => {
    debugger;
    e.preventDefault();
    const success = validateForm();
    if (success === true) signUp(formData);
  };

  return (
    <>
    <div className="h-16 bg-primary/20"></div>
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 ">
      {/* Left Side */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <img src="/images/309666.png" className="size-12" alt="Logo" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">Get started with your free account</p>
                {step===2 ? <p className="text-base-content/60 text-red-400">If you don't recieve the mail Check the Spam Section of your mail or Retry</p> : ""}
              </div>
            </div>

            {/* Step 1: Enter Email */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="size-5 text-base-content/40 z-10" />
                    </div>
                    <input
                      type="email"
                      className="input input-bordered w-full pl-10 py-2 rounded-lg focus:border-primary focus:outline-none focus:ring-1 transition-all"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => updateState.setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button className="btn btn-primary w-full" onClick={sendOtp} disabled={isSigningUp}>
                  {isSigningUp ? <Loader2 className="size-5 animate-spin" /> : "Send OTP"}
                </button>
              </div>
            )}

            {/* Step 2: Enter OTP */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Enter OTP</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full py-2 rounded-lg focus:border-primary focus:outline-none focus:ring-1 transition-all"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => updateState.setOtp(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary w-full" onClick={verifyOtp} disabled={isSigningUp}>
                  {isSigningUp ? <Loader2 className="size-5 animate-spin" /> : "Verify OTP"}
                </button>

                <button className="btn btn-secondary w-full" onClick={resendOtp} disabled={timeLeft > 0 || isResendingOtp}>
                  {isResendingOtp ? (
                    <>
                      <Loader2 className="size-5 animate-spin" /> Resending...
                    </>
                  ) : timeLeft > 0 ? (
                    `Resend OTP in ${timeLeft}s`
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </div>
            )}

            {/* Step 3: Complete Signup */}
            {step === 3 && (
              <form className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img
                      src={selectedImg || "/images/avatar.png"}
                      alt="Profile"
                      className="size-32 rounded-full object-cover border-4"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
                    >
                      <Camera className="w-5 h-5 text-base-200" />
                      <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">You can change your profile image later if you want.</p>
                </div>

                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="size-5 text-base-content/40 z-10" />
                    </div>
                    <input
                      type="text"
                      className="input input-bordered w-full pl-10 py-2 rounded-lg focus:border-primary focus:outline-none focus:ring-1 transition-all"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => updateState.setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Username</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserRound className="size-5 text-base-content/40 z-10" />
                    </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 py-2 rounded-lg focus:border-primary focus:outline-none focus:ring-1 transition-all"
                    placeholder="@createyourusername"
                    value={formData.username}
                    onChange={(e) => updateState.setFormData({ ...formData, username: e.target.value })}
                  />
                  </div>
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-5 text-base-content/40 z-10" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input input-bordered w-full pl-10 py-2 rounded-lg focus:border-primary focus:outline-none focus:ring-1 transition-all"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => updateState.setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="size-5 text-base-content/40" /> : <Eye className="size-5 text-base-content/40" />}
                    </button>
                  </div>
                </div>

                <button type="button" className="btn btn-primary w-full" onClick={signUp} disabled={isSigningUp}>
                  {isSigningUp ? <Loader2 className="size-5 animate-spin" /> : "Complete Signup"}
                </button>
              </form>
            )}

            {/* Login Link */}
            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
    {/* right side */}
    <AuthImagePattern
        title="Join the community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
  </div>
  </>
)
};
  
  export default SignUp;