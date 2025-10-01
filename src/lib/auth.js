
import { jwtDecode } from "jwt-decode";


export const getToken = () => {
  return localStorage.getItem("token");
};


export const isUserLoggedIn = () => {
  const token = getToken();
  if (!token) {
    return false; 
  }

  try {
    const decodedToken = jwtDecode(token);
    console.log("🚀 ~ isUserLoggedIn ~ decodedToken:", decodedToken)
    if (decodedToken.exp) {
      const currentTime = Date.now() / 1000; 
      return decodedToken.exp > currentTime;
    }
    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};


export const logout = () => {
  localStorage.removeItem("token");

};


export const getUserData = () => {
  const token = getToken();
  if (!isUserLoggedIn()) {
    return null;
  }

  try {
    const userData = jwtDecode(token);
    return userData;
  } catch (error) {
    console.error("Failed to decode user data from token:", error);
    return null;
  }
};
