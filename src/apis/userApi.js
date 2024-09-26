import axios from "axios";

const API_URL = "http://localhost:8080/users";

// 회원가입 API
export const signup = async (userSignupDto) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userSignupDto);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 409) {
        throw new Error(
          "이미 존재하는 이메일입니다. 다른 이메일을 사용해주세요."
        );
      } else {
        throw new Error(
          data.message || "회원가입 중 알 수 없는 오류가 발생했습니다."
        );
      }
    } else {
      throw new Error(
        "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
      );
    }
  }
};

// 로그인 API
export const login = async (userLoginDto) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userLoginDto);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      console.log(status);
      if (status === 401) {
        throw new Error(
          "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요."
        );
      } else {
        throw new Error(
          data.message || "로그인 중 알 수 없는 오류가 발생했습니다."
        );
      }
    } else {
      throw new Error(
        "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
      );
    }
  }
};
