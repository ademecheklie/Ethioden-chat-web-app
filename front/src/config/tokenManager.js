
import { currentUser } from "../model/currentUserData";
import axiosInstance from "./axiosConfig";
let token = ''
export const setToken = (newToken) => {
   token = newToken;
  localStorage.setItem('token',token)
};

export const getToken = () => {
  token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user) {
    currentUser.userId = user.userId;
    currentUser.department = user.department;
    currentUser.role = user.role;
    currentUser.email = user.email;
    currentUser.username = user.username;
    currentUser.profileImage = user.profileImage
    currentUser.phone = user.phone;
  }
 
  return token;
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    try {
      const res = await axiosInstance.post('/refresh', { refreshToken });
      if (res.data.success) {
        const token = res.data.data.accessToken;
        setToken(token);
        console.log(getToken());
        var userData = res.data.data;
        console.log(userData);
        currentUser.userId = userData.id;
        currentUser.department = userData.department;
        currentUser.role = userData.role;
        currentUser.password = userData.password;
        currentUser.email = userData.email;
        currentUser.username = userData.first_name;
        currentUser.phone = userData.phone_num;
      } else{
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }
};
