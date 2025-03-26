import { UserSearchIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect,useState } from "react";
import SearchSkeleton from "../components/skeletons/SearchSkeleton";
import ProfileModal from "../components/ProfileModal";
const Search = () => {
    const [show, setShow] = useState(false);
    const { searchTerm, searchResults, setSearchTerm, fetchSearchResults, isSearching } = useAuthStore();

  // Fetch users dynamically when the search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      fetchSearchResults();
    }
  }, [searchTerm, fetchSearchResults]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    return (
      <>
      <div className="h-16 bg-primary/20"></div>
      <div className="min-h-[calc(100vh-4rem)] bg-base-300 pt-9">
        <div className="flex items-center justify-center pt20 px-4 pb-5">
            <div className="bg-transparent rounded-lg shadow-cl w-full max-w-7xl h-10">
                <div className="form-control max-w-3xl h-10">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserSearchIcon className="size-5 text-base-content/40 z-10"/>
                        </div>
                        <input
                        type="search"
                        className={`input input-bordered w-full pl-10 py-2 rounded-3xl border
                        focus:border-primary focus:outline-none focus:ring-1 transition-all duration-150`}
                        placeholder="Search User"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>  
            </div>
        </div>

        {/* Result Container */}
        <div className="flex items-center justify-center pt20 px-4">
            <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-7xl h-[calc(100vh-16rem)] overflow-y-auto">
              {isSearching && <SearchSkeleton/>}
              {!isSearching && searchResults.length === 0 && searchTerm && (
                <p className="text-center text-gray-500">No users found.</p>
              )}
              {searchResults.map((user) => (
                <>
                <div key={user._id} className="size-fit py-8 px-10 m-8 border rounded-lg hover:bg-base-200 
                                    transition-all flex items-center justify-center flex-col gap-2 hover:cursor-pointer">
                  {/* <Link to={`/profile/${user.username}`} className="flex items-center gap-4"/> */}
                    <div className="avatar">
                      <div className="w-24 rounded-full ">
                        <img
                        src={user.profilePic || "/images/avatar.png"}
                        // className="size-10 rounded-full"
                        alt="Profile"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <p className="font-bold">{user.fullName}</p>
                      <p className="text-gray-500">@{user.username}</p>
                      <button className="btn btn-soft btn-primary">Follow</button>
                      <button className="btn btn-soft btn-primary" key={user._id} onClick={handleShow}>Show Profile</button>
                    </div>
                </div>
                </>
              ))}
            </div>
        </div>
      </div>
      {/* <ProfileModal show={show} handleClose={handleClose}/> */}
      </>
    )
  };
  
  export default Search;