import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set,get)=>({
    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    isCheckingAuth : true,
    isResendingOtp: false,
    isSearching : false,
    onlineUsers : [],

    step : 1,
    email : "",
    otp : "",
    timeleft : 30,
    formData: {
      fullName: "",
      username: "", // Unique user ID
      password: "",
      profilePic: "",
    },

    searchTerm: "",
    searchResults: [],
    setSearchTerm: (query) => set({ searchTerm: query }),
    clearSearch: () => set({ searchTerm: "", searchResults: [] }),

    //these are here to rightfully take the input event from the frontend
    setEmail: (email) => set({ email }),
    setOtp: (otp) => set({ otp }),
    setFormData: (newData) => set((state) => ({ formData: { ...state.formData, ...newData } })),
    setStep: (step) => set({ step }),

    // Start OTP resend cooldown
    startTimer: () => {
        set({ timeLeft: 30 });
        const timer = setInterval(() => {
            set((state) => {
                if (state.timeLeft <= 1) {
                    clearInterval(timer);
                    return { timeLeft: 0 };
                }
                return { timeLeft: state.timeLeft - 1 };
            });
        }, 1000);
    },

    // Step 1: Send OTP to Email
    sendOtp: async () => {
        const { email, startTimer } = get();
        if (!email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");

        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/send-otp", { email });
            toast.success(res.data.message);
            set({ step: 2 }); // Move to OTP verification step
            startTimer(); // Start cooldown timer
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending OTP");
        } finally {
            set({ isSigningUp: false });
        }
    },

    // Step 2: Verify OTP
    verifyOtp: async () => {
        const { email, otp } = get();
        if (!otp.trim()) return toast.error("OTP is required");
        if (otp.length < 6) return toast.error("OTP must have least 6 characters");
        if (otp.length > 6) return toast.error("OTP can only have 6 characters");

        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
            toast.success(res.data.message);
            set({ step: 3 }); // Move to signup form step
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            set({ isSigningUp: false });
        }
    },

    // Resend OTP
    resendOtp: async () => {
        const { email, timeLeft, startTimer } = get();
        if (timeLeft > 0) return;

        set({ isResendingOtp: true });
        try {
            await axiosInstance.post("/auth/send-otp", { email });
            toast.success("OTP resent successfully!");
            // startTimer();
            set({ timeLeft: 30 });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error resending OTP");
        } finally {
            set({ isResendingOtp: false });
        }
    },

    // Step 3: Complete Signup
    signUp: async () => {
        const { email, formData } = get();
        if (!formData.fullName.trim()) return toast.error("Full Name is required");
        if (!formData.username.trim()) return toast.error("Username is required");
        if (formData.password.length < 8) return toast.error("Password must be at least 8 characters");

        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", { ...formData, email });
            set({ authUser: res.data, step: 1 }); // Reset state after successful signup
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    checkAuth : async() => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
        } catch (error) {
            console.log("Error in checkAuth Function", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth:false});
        }
    },
    
    fetchSearchResults: async () => {
        const { searchTerm,authUser } = get();
        if (!searchTerm.trim()) {
            set({ searchResults: [] });
            return;
        }
    
        set({ isSearching: true });
        try {
            const res = await axiosInstance.get(`/auth/search?query=${encodeURIComponent(searchTerm)}`);
            const filteredUsers = res.data.filter(user => user._id !== authUser._id);
            set({ searchResults: filteredUsers});
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Error fetching users");
        } finally {
            set({ isSearching: false });
        }
    },

    login : async (data) => {
      set({isLoggingIn : true});
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({authUser : res.data});
        toast.success("Logged In Successfully");
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      } finally {
        set({isLoggingIn : false});
      }
    },

    logout: async () => {
      try {
        await axiosInstance.post("/auth/logout");
        set({authUser : null});
        toast.success("Logged Out Successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },

    updateProfile: async (data) =>{
      set({isUpdatingProfile : true});
      try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({authUser : res.data});
        toast.success("Profile Updated Successfully");
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      } finally {
        set({isUpdatingProfile : false});
      }
    },
}))