import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = () => {

  console.log(process.env.VITE_CLIENT);
  console.log("hello your process env is above");
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Content Section */}
      <div className="text-center p-6 max-w-md w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">
          Welcome to Our Application
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          Please log in to access the content.
        </p>

        {/* If user is not authenticated, show Google login button */}
        {!isAuthenticated ? (
          <div>
            <button
              onClick={() => loginWithRedirect({ connection: "google" })}
              className="w-full flex justify-center items-center bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Log in with Google
            </button>
          </div>
        ) : (
          // If authenticated, show message
          <p className="text-lg text-green-500 mt-4">You are already logged in!</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
