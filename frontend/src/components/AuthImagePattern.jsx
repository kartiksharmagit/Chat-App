const AuthImagePattern = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center bg-base-200">
        <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60 mb-4">{subtitle}</p>
            <div className="mb-8">
            {/* {[...Array(9)].map((_, i) => (
              <div
              key={i}
              className={`bg-indigo-800 aspect-square rounded-2xl ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
              ></div>
            // <div
            //     key={i}
            //     className="bg-sky-600 aspect-square bg-primary/10"
            //   ></div>
            // grid-class-name-grid grid-cols-3 gap-3 
            ))} */}
            <img src="src/assets/graphic-cartoon-character-online-chat-vector-35438166 Transparent.png" alt="" className="size-full aspect-square" />
          </div>
        </div>
      </div>
    );
  };
  
  export default AuthImagePattern;