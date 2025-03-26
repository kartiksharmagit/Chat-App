const SearchSkeleton = () => {
    
  const skeletonSearch = Array(4).fill(null);
    return(
        <>
        <div className="overflow-y-auto w-full py-3 flex">
        {skeletonSearch.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center justify-center flex-col gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-24 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="flex flex-col items-center justify-center">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-8 w-24 mb-2" />
            </div>
          </div>
        ))}
      </div>
        {/* <div className="skeleton size-24 rounded-full"></div>    */}
        {/* <div className="skeleton size-24 rounded-full"></div> */}
        </>
    )
};

export default SearchSkeleton;