import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// --- Token Management ---
let accessToken = null;
let tokenExpiry = null;
let isRefreshing = false;
let failedQueue = [];

// Simple JWT parser to avoid external dependencies
const parseJwt = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const setTokenData = (token) => {
  if (!token) return;
  accessToken = token;
  const decoded = parseJwt(token);
  if (decoded && decoded.exp) {
    tokenExpiry = decoded.exp * 1000; // Convert to ms
  }
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// --- Request Interceptor (Proactive Refresh) ---
axiosInstance.interceptors.request.use(
  async (config) => {
    // Check if token is about to expire (e.g., within 2 minutes)
    // and we are not already refreshing.
    const now = Date.now();
    const isExpiringSoon = tokenExpiry && (tokenExpiry - now < 2 * 60 * 1000); // 2 minutes

    // Skip refresh for auth endpoints to avoid loops
    const isAuthRequest = config.url.includes('/auth/refresh') || config.url.includes('/auth/login') || config.url.includes('/auth/verify-otp');

    if (isExpiringSoon && !isRefreshing && !isAuthRequest) {
      isRefreshing = true;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data && response.data.accessToken) {
          setTokenData(response.data.accessToken);
          processQueue(null, response.data.accessToken);
        }
      } catch (error) {
        // If proactive refresh fails, we consume the error silently here.
        // The actual request will try to proceed. If it fails with 401, 
        // the response interceptor will handle the retry logic.
        //  console.warn("Proactive refresh failed:", error);
      } finally {
        isRefreshing = false;
      }
    } else if (isRefreshing && !isAuthRequest) {
      // If already refreshing, wait for it to finish
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(config),
          reject: (err) => reject(err)
        });
      });
    }

    if (accessToken && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// --- Response Interceptor (Token Capture & 401 Handling) ---
axiosInstance.interceptors.response.use(
  (response) => {
    // Capture token from responses if present
    // 1. Standard auth response (login, verify-otp, refresh) -> response.data.accessToken
    // 2. GetCurrentUser response -> response.data.data.accessToken
    if (response.data?.accessToken) {
      setTokenData(response.data.accessToken);
    } else if (response.data?.data?.accessToken) {
      setTokenData(response.data.data.accessToken);
    }

    return response;
  },

  async (error) => {
    const originalReq = error.config;

    // If token is expired and request hasn't been retried yet
    if (error.response?.status === 401 && !originalReq._retry) {

      // Prevent infinite loops and unwanted retries for auth endpoints
      // When login/send-otp fails with 401, it means invalid credentials, not expired token
      if (
        originalReq.url.includes('/auth/refresh') ||
        originalReq.url.includes('/auth/login') ||
        originalReq.url.includes('/auth/verify-otp') ||
        originalReq.url.includes('/auth/send-otp')
      ) {
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalReq)),
            reject
          });
        });
      }

      originalReq._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (refreshRes.data?.success && refreshRes.data.accessToken) {
          setTokenData(refreshRes.data.accessToken);

          processQueue(null, refreshRes.data.accessToken);

          // Retry the original request
          return axiosInstance(originalReq);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear any stored data
        window.localStorage.clear();
        window.sessionStorage.clear();
        accessToken = null;
        tokenExpiry = null;

        // Redirect logic
        const currentPath = window.location.pathname;
        const publicRoutes = ['/', '/events', '/events/', '/events/:id'];
        const isPublic = publicRoutes.some(path =>
          currentPath.startsWith(path.replace('/:id', ''))
        );

        if (!isPublic && currentPath !== '/sign-in' && currentPath !== '/sign-up') {
          window.location.href = '/sign-in';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;










