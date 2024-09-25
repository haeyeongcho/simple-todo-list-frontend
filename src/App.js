// src/App.js
import { Container } from "@mui/material";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import TodoList from "./pages/TodoList";

function App() {
  return (
    <Container sx={{ p: 5 }} maxWidth="lg">
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/todos/:userId" element={<TodoList />} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;
