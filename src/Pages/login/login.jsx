import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUser } from "../../components/redux/slices/login-data/login-data";
import { useNavigate } from "react-router-dom";
import UserPool from "../../UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleError = (err) => {
    const errorMessage = err.message || "An unexpected error occurred. Please try again.";
    toast.error(errorMessage);
  };

  const authenticateUser = async () => {
    const { email, password } = login;
  
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });
  
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
  
    setLoading(true);

    user.authenticateUser(authDetails, {
      onSuccess: async (data) => {
        try {
          window.localStorage.setItem("token", data.getIdToken().getJwtToken());

          const cognitoUser = UserPool.getCurrentUser();

          if (cognitoUser) {
            const session = await new Promise((resolve, reject) => {
              cognitoUser.getSession((err, session) => {
                if (err) return reject(err);
                resolve(session);
              });
            });

            const attributes = await new Promise((resolve, reject) => {
              cognitoUser.getUserAttributes((err, attrs) => {
                if (err) return reject(err);
                resolve(attrs);
              });
            });

            let user_ = {};
            attributes.forEach(attribute => {
              user_[attribute.Name] = attribute.Value;
            });

            const isAdminAttr = attributes.find(attribute => attribute.Name === 'custom:isAdmin');
            user_["isAdmin"] = isAdminAttr ? isAdminAttr.Value === "1" : false;

            dispatch(loginUser(user_));

            const token =  data.getIdToken().getJwtToken();
            const Axios = axios.create({
              baseURL: "https://n55tyhknxc.execute-api.us-west-2.amazonaws.com/dev/", // Replace with your API's base URL
              // baseURL: "http://localhost:3000/dev/",
              timeout: 20000, // Timeout in milliseconds
              headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`,
                // You can add any custom headers here
              },
            });
            const getUserApi = async (id, headers) => {
              const res = await Axios.get(`/users/${id}`, {
                headers,
              });
              return res;
            };

            const userSignupApi = (data) => {
              const res = Axios.post("/users/", data);
              return res;
            };
            
            const res = await getUserApi(user_.sub);

            if (!res.data.user) {
              const user = await userSignupApi({ user: user_ });
              if (user) {
                console.log("User saved to the DB successfully");
              } else {
                console.log("Failed to save user");
              }
            } else {
              console.log("User already exists in the DB");
            }

            window.localStorage.setItem("user", JSON.stringify(user_));

            navigate(user_.isAdmin ? "/dashboard" : "/home");
          }
        } catch (err) {
          console.error("Error during authentication:", err);
          handleError(err);
        } finally {
          setLoading(false);
        }
      },
  
      onFailure: (err) => {
        setLoading(false);
        console.error("Failed to authenticate:", err);
        handleError(err);
      },
    });
  };

  const submitLogin = (e) => {
    e.preventDefault();
    if (!login.email || !login.password) {
      toast.error("Please enter both email and password.");
      return;
    }
    authenticateUser();
  };

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
            <ClipLoader color={"#4f46e5"} loading={loading} size={50} />
          </div>
        )}
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Login to Your Account
        </h2>
        <form className="space-y-6" onSubmit={submitLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={login.email}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={login.password}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-800">
                Remember me
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{' '}
          <button onClick={handleSignupRedirect} className="text-indigo-600 hover:text-indigo-500">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
