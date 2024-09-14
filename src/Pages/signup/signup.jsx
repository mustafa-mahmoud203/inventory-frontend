import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserPool from "../../UserPool";
import ClipLoader from "react-spinners/ClipLoader";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    password: "",
    isAdmin: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let { email, password, phone_number, address, name, isAdmin } = formData;

    if (isAdmin) isAdmin = 'a';
    else isAdmin = '';

    const attributes = [
      { Name: "email", Value: email },
      { Name: "phone_number", Value: phone_number },
      { Name: "address", Value: address },
      { Name: "name", Value: name },
      { Name: "custom:isAdmin", Value: isAdmin },
    ];

    UserPool.signUp(email, password, attributes, null, (err, data) => {
      setLoading(false);
      if (err) {
        setError(err.message || "Something went wrong. Please try again.");
        setSuccess("");
      } else {
        setSuccess("Sign-up successful! Please check your email for verification.");
        setError("");
        setFormData({
          name: "",
          email: "",
          phone_number: "",
          address: "",
          password: "",
          isAdmin: false,
        });
      }
    });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 bg-gray-100">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
          <ClipLoader color={"#4f46e5"} loading={loading} size={50} />
        </div>
      )}
      <div className="w-full max-w-md px-4 py-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 sm:text-3xl">
          Create Your Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              placeholder="must be 11 characters like this +20123456789"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
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
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isAdmin" className="block ml-2 text-sm font-medium text-gray-700">
              Admin Account
            </label>
          </div>
          <button
            type="submit"
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
        {error && (
          <p className="p-3 mt-4 text-sm text-center text-red-600 border border-red-300 rounded-lg bg-red-50 sm:text-base">
            {error}
          </p>
        )}
        {success && (
          <p className="p-3 mt-4 text-sm text-center text-green-600 border border-green-300 rounded-lg bg-green-50 sm:text-base">
            {success}
          </p>
        )}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
