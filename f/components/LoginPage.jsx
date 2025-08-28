import { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../providers/UserProvider";

const LoginPage = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    if (!token) return;

    const decodedUser = jwtDecode(token); // decode JWT
    setUser(decodedUser); // set in context
    console.log("Login Success:", decodedUser.name);
    localStorage.setItem("googleToken", token); // optional persist
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("googleToken");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center p-6 max-w-sm w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Welcome</h1>

        {!user ? (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            text="continue_with"
            width="100%"
          />
        ) : (
          <div>
            <img
              src={user.picture}
              alt="avatar"
              className="w-20 h-20 mx-auto rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {user.name}
            </h2>
            <p className="text-gray-500 mb-4">{user.email}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;