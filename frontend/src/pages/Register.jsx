import { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const Register = () => {
  const { register_user } = useContext(UserContext);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = form;
    const trimmed = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      confirmPassword: confirmPassword.trim(),
    };

    if (!trimmed.username || !trimmed.email || !trimmed.password || !trimmed.confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (trimmed.password !== trimmed.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    register_user(trimmed.username, trimmed.email, trimmed.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-screen-xl bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
            >
              Register
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* Image Section - Enlarged */}
        <div className="hidden md:flex w-full md:w-1/2 bg-blue-100 items-center justify-center p-4">
          <img
            src="data:image/jpeg;base64,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"
            alt="Register Visual"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
