import NavBar from "./components/NavBar";
import Home from "./pages/HomePage";
import SignUp from "./pages/SignUpPage";
import Login from "./pages/LoginPage";
import Profile from "./pages/ProfilePage";
import Settings from "./pages/SettingsPage";
import Search from "./pages/SearchPage.jsx";
import {Routes,Route, Navigate} from "react-router-dom"
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { useEffect } from "react";
import {Loader} from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const {authUser, checkAuth ,isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  console.log({authUser});

  if(isCheckingAuth && !authUser) return(
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  );
  return (
    <>
    <div data-theme={theme}>
    <NavBar/>
    <Routes>
      <Route path="/" element={authUser ? <Home/> : <Navigate to="/login"/>}/>
      <Route path="/signup" element={!authUser ? <SignUp/> : <Navigate to="/"/>}/>
      <Route path="/login" element={!authUser ? <Login/> : <Navigate to="/"/>}/>
      <Route path="/settings" element={authUser ? <Settings/> : <Navigate to="/login"/>}/>
      <Route path="/profile" element={authUser ? <Profile/> : <Navigate to="/login"/>}/>
      <Route path="/search" element={authUser ? <Search/> : <Navigate to="/login"/>}/>
    </Routes>
    <Toaster/>
    </div>
    </>
  )
};

export default App;