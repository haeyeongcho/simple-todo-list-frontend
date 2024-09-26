import {
  Box,
  Button,
  Container,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { login, signup } from "../apis/userApi";
import { authState } from "../atoms/authState";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이메일과 비밀번호가 비어있는지 확인
    if (!email.trim() || !password.trim()) {
      setSnackbarMessage("이메일과 비밀번호를 입력해주세요.");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (isLogin) {
        // login
        const response = await login({ email, password });
        console.log("로그인 성공", response);
        setAuth({ isLoggedIn: true, userId: response.userId });
        navigate(`/todos/${response.userId}`);
      } else {
        // signup
        const response = await signup({ email, password });
        console.log("회원가입 성공", response);
        setIsLogin(true);
      }
    } catch (error) {
      setSnackbarMessage("요청 실패: " + error.message);
      setSnackbarOpen(true);
      console.error("요청 실패: ", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {isLogin ? "로그인" : "회원가입"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="이메일"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="비밀번호"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button type="submit" variant="contained" color="primary">
            {isLogin ? "로그인" : "회원가입"}
          </Button>
          <Button onClick={() => setIsLogin(!isLogin)} color="primary">
            {isLogin ? "회원가입 하세요" : "로그인 하세요"}
          </Button>
        </Box>
      </form>

      {/* Snackbar 컴포넌트 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Auth;
