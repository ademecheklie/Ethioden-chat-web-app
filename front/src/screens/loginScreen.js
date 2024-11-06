import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import axiosInstance from '../config/axiosConfig';
import { setToken, getToken } from '../config/tokenManager';
import { currentUser } from '../model/currentUserData';

function Login(props) {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth', formValues);

      if (response.data.success) {
        const token = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;
        setToken(token);
        console.log(getToken());
        console.log(refreshToken);
        var userData = response.data.data;
        console.log(userData);
        currentUser.userId = userData.id;
        currentUser.department = userData.department;
        currentUser.role = userData.role;
        currentUser.email = userData.email;
        currentUser.profileImage = userData.profileImage;
        currentUser.password = userData.password;
        currentUser.username = userData.first_name;
        currentUser.phone = userData.phone_num;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        navigate('/');
      } else {
        setLoginError(true);
      }
    } catch (err) {
      console.log(err);
      setLoginError(true);
    }
  };

  const showPasswordHandler = () => setShowPassword((show) => !show);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-4xl mb-4 text-white">Welcome back!</h1>
      <form className="flex flex-col items-center justify-center w-full max-w-md p-8 rounded-lg bg-white" onSubmit={submitHandler}>
        <label htmlFor="email" className="text-lg mt-4 text-gray-800">
          Email
        </label>
        <TextField
          autoFocus
          type="email"
          name="email"
          label="Email"
          variant="outlined"
          className="w-full mb-4"
          value={formValues.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: <EmailOutlined className="icon" />,
          }}
        />
        <label htmlFor="password" className="text-lg mt-4 text-gray-800">
          Password
        </label>
        <TextField
          type={showPassword ? 'text' : 'password'}
          name="password"
          label="Password"
          variant="outlined"
          className="w-full mb-4"
          value={formValues.password}
          onChange={handleChange}
          InputProps={{
            startAdornment: <LockOutlined className="icon" />,
            endAdornment: (
              <IconButton aria-label="toggle password visibility" onClick={showPasswordHandler} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <button type="submit" className="w-full py-2 mt-4 rounded-lg bg-gray-900 text-white font-bold transition duration-300 ease-in-out hover:bg-gray-700">
          Login
        </button>
        {loginError && <p className="text-red-600 mt-4 rounded-lg">Incorrect email or password. Please try again.</p>}
      </form>
    </div>
  );
}

export default Login;
