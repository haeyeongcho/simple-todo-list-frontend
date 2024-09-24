import axios from "axios";

const API_URL = "http://localhost:8080/users";

// 회원가입 API
export const signup = async (userSignupDto) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userSignupDto);
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};

// 로그인 API
export const login = async (userLoginDto) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userLoginDto);
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};
