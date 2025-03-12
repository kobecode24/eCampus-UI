// api.ts
import { BlogDTO } from '@/app/types/blog';
import axios, { AxiosResponse } from 'axios'
import { User } from '@/app/types/user'

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
  avatar?: string;
}

interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

// Fix potential duplication of /api in URLs
// Remove trailing slash if present to ensure consistent URL joining
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api").replace(/\/$/, '')

// Create logger for debugging
const logRequest = (method: string, url: string, data?: any) => {
  console.log(`API ${method}:`, url, data || '')
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add response logger for debugging
api.interceptors.response.use(
  response => {
    // console.log('API Response:', response.config.url, response.status, response.data)
    return response
  },
  error => {
    console.error('API Error:', 
      error.config?.url, 
      error.response?.status, 
      error.response?.data || error.message
    )
    return Promise.reject(error)
  }
)

// Helper function to get auth header for requests
const getAuthHeader = () => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

const authService = {
  login: async (credentials: LoginCredentials) => {
    logRequest('POST', '/users/login', credentials)
    const response = await api.post("/users/login", credentials)
    // Set cookies with proper attributes
    document.cookie = `token=${response.data.data.token}; path=/; sameSite=lax${location.protocol === 'https:' ? '; secure' : ''}`
    document.cookie = `refreshToken=${response.data.data.refreshToken}; path=/; sameSite=lax${location.protocol === 'https:' ? '; secure' : ''}`
    return response
  },
  register: (userData: UserData): Promise<AxiosResponse<any>> => api.post("/users/register", userData),
  logout: async () => {
    await api.post("/auth/logout")
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  },
  getCurrentUser: (): Promise<AxiosResponse<any>> => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    return api.get('/users/me', {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });
  },
  updateProfile: (userData: UserProfile): Promise<AxiosResponse<any>> => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    return api.put("/users/me", userData, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });
  },
  updatePassword: (passwordData: PasswordUpdate) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    return api.put('/users/me/password', passwordData, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });
  },
  refreshToken: async () => {
    try {
      const refreshToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('refreshToken='))
        ?.split('=')[1];

      if (!refreshToken) return false;

      const response = await api.post("/users/refresh", { refreshToken });
      
      // Update cookies with new tokens
      document.cookie = `token=${response.data.data.token}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
      document.cookie = `refreshToken=${response.data.data.refreshToken}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
      
      return true;
    } catch (error) {
      // Clear invalid tokens
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return false;
    }
  }
}

const userService = {
  getProfile: () => api.get("/users/me", { headers: getAuthHeader() }),
  updateProfile: (userData: UserData) => api.put("/users/me", userData, { headers: getAuthHeader() }),
  uploadAvatar: (formData: FormData) => api.post("/upload/avatar", formData, {
    headers: { 
      "Content-Type": "multipart/form-data",
      ...getAuthHeader()
    }
  }),
  updatePassword: (passwordData: PasswordUpdate) =>
        api.put("/users/me/password", passwordData, { headers: getAuthHeader() }),
  getUsers: (page = 0, size = 10) => 
    api.get(`/users?page=${page}&size=${size}`, { headers: getAuthHeader() }),
  getUser: (id: string) => 
    api.get(`/users/${id}`, { headers: getAuthHeader() }),
  updateUser: (id: string, userData: Partial<User>) => 
    api.put(`/users/${id}`, userData, { headers: getAuthHeader() }),
  deleteUser: (id: string) => 
    api.delete(`/users/${id}`, { headers: getAuthHeader() }),
  addPoints: (id: string, points: number, description?: string) => 
    api.post(`/users/${id}/points/add`, { points, description }, { headers: getAuthHeader() }),
  getTopUsers: (limit = 10) => 
    api.get(`/users/stats/top?limit=${limit}`, { headers: getAuthHeader() }),
  getUserStatistics: () => 
    api.get('/users/statistics', { headers: getAuthHeader() }),
  getUserDetails: (userId: string) => 
    api.get(`/users/${userId}`, { headers: getAuthHeader() }),
  updateUserStatus: (userId: string, enabled: boolean) => 
    api.patch(`/users/${userId}/status`, { enabled }, { headers: getAuthHeader() }),
  register: (userData: { username: string; email: string; password: string; role: string }) =>
    api.post("/users/register", userData),
  getFilteredUsers: (params: URLSearchParams) => 
    api.get(`/users/filter?${params.toString()}`, { headers: getAuthHeader() }),
  updateUserRoles: (userId: string, roles: string[]) => 
    api.put(`/users/${userId}/roles`, { roles }, { headers: getAuthHeader() }),
}

const courseService = {
  getCourses: () => api.get("/courses", { headers: getAuthHeader() }),
  getCourseById: (id: string) => api.get(`/courses/${id}`, { headers: getAuthHeader() }),
  enrollCourse: (courseId: string) => api.post(`/courses/${courseId}/enroll`, {}, { headers: getAuthHeader() })
}

const forumService = {
  getPosts: () => api.get("/forum/posts", { headers: getAuthHeader() }),
  getPostById: (id: string) => api.get(`/forum/posts/${id}`, { headers: getAuthHeader() }),
  createPost: (postData: any) => api.post("/forum/posts", postData, { headers: getAuthHeader() }),
  updatePost: (id: string, postData: any) => api.put(`/forum/posts/${id}`, postData, { headers: getAuthHeader() }),
  deletePost: (id: string) => api.delete(`/forum/posts/${id}`, { headers: getAuthHeader() })
}

const blogService = {
  
  getAllBlogs: (page = 0, size = 10, sort = "createdAt,desc") => 
    api.get(`/blogs?page=${page}&size=${size}&sort=${sort}`, { headers: getAuthHeader() }),
  
  getPublishedBlogs: (page = 0, size = 10, sort = "createdAt,desc") => 
    api.get(`/blogs/published?page=${page}&size=${size}&sort=${sort}`, { headers: getAuthHeader() }),
  
  getTrendingBlogs: (page = 0, size = 10) => 
    api.get(`/blogs/popular?page=${page}&size=${size}`, { headers: getAuthHeader() }),
    
  getLatestBlogs: (page = 0, size = 10) => 
    api.get(`/blogs?page=${page}&size=${size}&sort=createdAt,desc`, { headers: getAuthHeader() }),
  
  createBlog: (blogData: {
    title: string;
    content: string;
    tags?: string[];
    pointsCost?: number;
  }) => api.post("/blogs", blogData, { headers: getAuthHeader() }),
  
  getBlogById: (id: string) => api.get(`/blogs/${id}`, { headers: getAuthHeader() }),
  
  async likeBlog(blogId: string): Promise<BlogDTO> {
    logRequest('POST', `/blogs/${blogId}/toggle-like`)
    try {
      // First try with direct toggle-like
      const response = await api.post(`/blogs/${blogId}/toggle-like`, {}, { headers: getAuthHeader() });
      return response.data.data;
    } catch (error) {
      console.warn('First toggle-like approach failed, trying alternative...')
      // Try alternative paths
      try {
        // Try without /api prefix (if it's duplicated)
        const altResponse = await axios.post(`${API_BASE_URL.replace('/api', '')}/blogs/${blogId}/toggle-like`, {}, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
          }
        });
        return altResponse.data.data;
      } catch (altError) {
        // Finally try with blog-likes (old format)
        console.warn('Second toggle-like approach failed, trying final alternative...')
        const fallbackResponse = await api.post(`/blogs/${blogId}/likes`, {}, { headers: getAuthHeader() });
        return fallbackResponse.data.data;
      }
    }
  },
  
  async unlikeBlog(blogId: string): Promise<BlogDTO> {
    return this.likeBlog(blogId); // Reuse the likeBlog implementation since it's a toggle
  },

  getComments: (blogId: string, page = 0, size = 10) =>
    api.get(`/blogs/${blogId}/comments?page=${page}&size=${size}`, { headers: getAuthHeader() }),
    
  createComment: (blogId: string, data: { content: string }) =>
    api.post(`/blogs/${blogId}/comments`, data, { headers: getAuthHeader() }),
    
  updateComment: (blogId: string, commentId: string, data: { content: string }) =>
    api.put(`/blogs/${blogId}/comments/${commentId}`, data, { headers: getAuthHeader() }),
    
  deleteComment: (blogId: string, commentId: string) =>
    api.delete(`/blogs/${blogId}/comments/${commentId}`, { headers: getAuthHeader() }),

  toggleLike: async (blogId: string) => {
    logRequest('POST', `/blogs/${blogId}/toggle-like`)
    
    // Try multiple potential endpoints in order until one works
    const attemptToggleLike = async () => {
      const endpoints = [
        // Standard endpoint from Java controller
        `/blogs/${blogId}/toggle-like`,
        // Alternative without API prefix if it's duplicated
        `/blogs/${blogId}/toggle-like`.replace('/api', ''),
        // Try with just a likes endpoint
        `/blogs/${blogId}/likes`,
        // Try without a blog ID in path
        `/blogs/like`
      ];
      
      let lastError;
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await api.post(endpoint, { blogId }, { headers: getAuthHeader() });
          console.log(`Success with endpoint: ${endpoint}`);
          return response.data;
        } catch (error) {
          console.warn(`Failed with endpoint: ${endpoint}`, error);
          lastError = error;
        }
      }
      
      // If all endpoints fail, throw the last error
      throw lastError;
    };
    
    return attemptToggleLike();
  },
}

export { blogService }

export { authService, userService, courseService, forumService }
export default api