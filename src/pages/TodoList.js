import {
  Box,
  Button,
  Checkbox,
  Container,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addTask,
  deleteTask,
  getTasksByUser,
  updateTask,
} from "../apis/taskApi";

const TodoList = () => {
  const { userId } = useParams();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isEditing, setIsEditing] = useState("");
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar 상태 추가
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar 메시지 상태 추가
  const taskInputRef = useRef(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasksByUser(userId);
        setTodos(response);
      } catch (error) {
        console.error("작업 목록 불러오기 실패:", error);
      }
    };
    fetchTasks();
  }, [userId]);

  const handleLogout = () => {
    const isConfirmed = window.confirm("정말 로그아웃 하시겠습니까?");
    if (isConfirmed) {
      window.location.reload();
    }
  };

  const addTodo = async () => {
    if (!taskTitle) {
      setSnackbarMessage("할 일 제목을 입력해주세요."); // 메시지 설정
      setSnackbarOpen(true); // Snackbar 열기
      return;
    }

    const newTask = {
      userId: userId,
      title: taskTitle,
      description: taskDescription,
      isComplete: false,
    };

    try {
      const response = await addTask(newTask);
      setTodos([...todos, response]);
      setTaskTitle("");
      setTaskDescription("");
      taskInputRef.current.focus();
    } catch (error) {
      console.error("작업 추가 실패:", error);
    }
  };

  const toggleComplete = async (taskId) => {
    const updatedTodo = todos.find((todo) => todo.taskId === taskId);
    const updatedTask = { ...updatedTodo, isComplete: !updatedTodo.isComplete };

    setTimeout(async () => {
      try {
        await updateTask(taskId, updatedTask);
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.taskId === taskId ? updatedTask : todo))
        );
      } catch (error) {
        console.error("작업 상태 업데이트 실패:", error);
      }
    }, 500);
  };

  const handleUpdate = async (taskId) => {
    const updatedTask = {
      ...todos.find((todo) => todo.taskId === taskId),
      title: editTaskTitle,
      description: editTaskDescription,
    };

    try {
      await updateTask(taskId, updatedTask);
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.taskId === taskId ? updatedTask : todo))
      );
      setIsEditing(null); // 수정 완료 후 수정 상태 초기화
    } catch (error) {
      console.error("작업 수정 실패:", error);
    }
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("정말로 이 작업을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        await deleteTask(taskId);
        setTodos(todos.filter((todo) => todo.taskId !== taskId));
      } catch (error) {
        console.error("작업 삭제 실패:", error);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        투두 리스트
        <Button
          variant="text"
          color="error"
          onClick={handleLogout}
          sx={{ float: "right" }} // 버튼을 오른쪽 끝으로 배치
        >
          로그아웃
        </Button>
      </Typography>
      <TextField
        label="할 일 제목"
        variant="outlined"
        fullWidth
        margin="normal"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            addTodo();
          }
        }}
        inputRef={taskInputRef}
      />
      <TextField
        label="설명"
        variant="outlined"
        fullWidth
        margin="normal"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            addTodo();
          }
        }}
      />
      <Button variant="contained" color="primary" onClick={addTodo}>
        추가
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setShowCompleted(!showCompleted)}
        sx={{ ml: 2 }}
      >
        {showCompleted
          ? "완료된 작업 숨기기"
          : `완료된 작업 보기 (${
              todos.filter((todo) => todo.isComplete).length
            })`}
      </Button>
      <List>
        {/* 완료되지 않은 작업들을 먼저 렌더링 */}
        {todos
          .filter((todo) => !todo.isComplete)
          .map((todo) => (
            <React.Fragment key={todo.taskId}>
              <ListItem sx={{ mb: 1 }}>
                <Checkbox
                  checked={todo.isComplete}
                  onChange={() => toggleComplete(todo.taskId)}
                />
                <ListItemText
                  primary={todo.title}
                  secondary={todo.description}
                />
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => {
                    if (isEditing === todo.taskId) {
                      setIsEditing(null);
                    } else {
                      setIsEditing(todo.taskId);
                      setEditTaskTitle(todo.title);
                      setEditTaskDescription(todo.description);
                    }
                  }}
                >
                  {isEditing === todo.taskId ? "수정 취소" : "수정"}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(todo.taskId)}
                >
                  삭제
                </Button>
              </ListItem>

              {/* 수정폼 렌더링 */}
              {isEditing === todo.taskId && (
                <Box sx={{ mt: 1, display: "flex", flexDirection: "column" }}>
                  <TextField
                    label="수정 제목"
                    variant="outlined"
                    fullWidth
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    label="수정 설명"
                    variant="outlined"
                    fullWidth
                    value={editTaskDescription}
                    onChange={(e) => setEditTaskDescription(e.target.value)}
                    margin="normal"
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      mt: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdate(todo.taskId)}
                    >
                      저장
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setIsEditing(null)}
                      sx={{ ml: 2 }} // 두 버튼 사이의 간격
                    >
                      취소
                    </Button>
                  </Box>
                </Box>
              )}
            </React.Fragment>
          ))}

        {/* showCompleted가 true일 때 완료된 작업 렌더링 */}
        {showCompleted &&
          todos
            .filter((todo) => todo.isComplete)
            .map((todo) => (
              <ListItem
                key={todo.taskId}
                sx={{
                  backgroundColor: "lightgreen",
                  mb: 1,
                }}
              >
                <Checkbox
                  checked={todo.isComplete}
                  onChange={() => toggleComplete(todo.taskId)}
                />
                <ListItemText
                  primary={todo.title}
                  secondary={todo.description}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(todo.taskId)}
                >
                  삭제
                </Button>
              </ListItem>
            ))}
      </List>

      {/* Snackbar 컴포넌트 추가 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default TodoList;
