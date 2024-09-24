import axios from "axios";

const API_URL = "http://localhost:8080/tasks";

// 작업 추가
export const addTask = async (taskDto) => {
  try {
    const response = await axios.post(API_URL, taskDto);
    return response.data;
  } catch (error) {
    console.error("작업 추가 실패:", error);
    throw error;
  }
};

// 특정 유저의 작업 목록 조회
export const getTasksByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("작업 목록 조회 실패:", error);
    throw error;
  }
};

// 작업 수정
export const updateTask = async (taskId, taskDto) => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}`, taskDto);
    return response.data;
  } catch (error) {
    console.error("작업 수정 실패:", error);
    throw error;
  }
};

// 작업 삭제
export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_URL}/${taskId}`);
  } catch (error) {
    console.error("작업 삭제 실패:", error);
    throw error;
  }
};
