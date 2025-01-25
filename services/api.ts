// api.ts
import axios from "axios"

interface LoginCredentials {
  username: string;
  password: string;
}

interface UserData {
  email: string;
  username: string;
  // Add other user fields
}

interface PasswordUpdate {
    currentPassword: string;
    newPassword: string;
}

export interface UserProfile {
    email: string;
    username: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const refreshToken = localStorage.getItem("refreshToken")
          const response = await api.post<{token: string}>("/users/refresh", { refreshToken })
          localStorage.setItem("token", response.data.token)
          originalRequest.headers["Authorization"] = `Bearer ${response.data.token}`
          return api(originalRequest)
        } catch {
          window.location.href = "/login"
        }
      }
      return Promise.reject(error)
    }
)

const authService = {
  login: (credentials: LoginCredentials) => api.post("/users/login", credentials),
  register: (userData: UserData) => api.post("/users/register", userData),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get('/users/me')
}

const userService = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (userData: UserData) => api.put("/users/me", userData),
  uploadAvatar: (formData: FormData) => api.post("/upload/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  updatePassword: (passwordData: PasswordUpdate) =>
        api.put("/users/me/password", passwordData),
}

const courseService = {
  getCourses: () => api.get("/courses"),
  getCourseById: (id: string) => api.get(`/courses/${id}`),
  enrollCourse: (courseId: string) => api.post(`/courses/${courseId}/enroll`)
}

const forumService = {
  getPosts: () => api.get("/forum/posts"),
  getPostById: (id: string) => api.get(`/forum/posts/${id}`),
  createPost: (postData: any) => api.post("/forum/posts", postData),
  updatePost: (id: string, postData: any) => api.put(`/forum/posts/${id}`, postData),
  deletePost: (id: string) => api.delete(`/forum/posts/${id}`)
}

export { authService, userService, courseService, forumService }
export default api