import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isTokenExpired =
            error.response?.status === 401 &&
            !originalRequest._retry;

        if (isTokenExpired) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                localStorage.clear();
                window.location.href = "/";
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(
                    "http://127.0.0.1:8000/api/auth/token/refresh/",
                    { refresh: refreshToken }
                );

                localStorage.setItem("token", data.access);
                if (data.refresh) {
                    localStorage.setItem("refreshToken", data.refresh);
                }

                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                localStorage.clear();
                window.location.href = "/";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;