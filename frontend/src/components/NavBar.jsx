import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, MessageSquare, Settings, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const {logout, authUser} = useAuthStore();
  
    return (
      <>
      <div className="bg-base-100 border-b border-base-300 fixed w-full h-16 top-0 z-40 
    backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                {/* <MessageCircle className="w-5 h-5 text-primary" /> */}
                <img src="/images/309666.png" className="size-8" alt="Logo" />
              </div>
              <h1 className="text-lg font-bold">KS Chat App</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {authUser && (
              <>
                <Link to={"/settings"} className={`btn btn-sm gap-2 transition-colors bg-transparent border-none shadow-none outline-none focus:ring-0`}>
                <Settings className="size-6 hover:opacity-80 transition-all" />
                {/* <span className="hidden sm:inline">Settings</span> */}
                </Link>
                <Link to={"/profile"} className={`btn btn-sm gap-2 bg-transparent border-none shadow-none outline-none focus:ring-0`}>
                  {/* <User className="size-5" /> */}
                  <img
                    src={authUser.profilePic || "images/avatar.png"}
                    alt="Profile"
                    className="size-7 rounded-full object-cover border-1 hover:opacity-80 transition-all"
                  />
                  {/* <span className="hidden sm:inline">Profile</span> */}
                </Link>

                {/* <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-6" />
                  <span className="hidden sm:inline">Logout</span>
                </button> */}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
      </>
    )
  };
  
  export default NavBar;