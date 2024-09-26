// src/App.js
import { Container } from "@mui/material";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import PrivateRoute from "./components/PrivateRoute";
import Auth from "./pages/Auth";
import TodoList from "./pages/TodoList";

function App() {
  return (
    <RecoilRoot>
      <Container sx={{ p: 5 }} maxWidth="lg">
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/todos/:userId"
              element={<PrivateRoute component={TodoList} />}
            />
          </Routes>
        </Router>
      </Container>
    </RecoilRoot>
  );
}

export default App;
