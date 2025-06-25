import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login_user } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login_user(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Side Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Login to Your Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Right Side Image */}
        <div className="hidden md:flex w-full md:w-1/2 bg-blue-100 items-center justify-center">
          <img
            src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
            alt="Login Visual"
            className="w-3/4 h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
