import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../services/api";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.username.trim()) {
            toast.error("Username is required");
            return;
        }

        if (!formData.password.trim()) {
            toast.error("Password is required");
            return;
        }

        try {

            const response = await axiosInstance.post(
                "/auth/login/",
                formData
            );

            login(
                response.data.user,
                response.data.access
            );

            toast.success("Login successful");

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            toast.error("Invalid credentials");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-lg border bg-white p-8 shadow"
            >

                <h1 className="mb-6 text-3xl font-bold">
                    Login
                </h1>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mb-4 w-full rounded border p-3"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mb-4 w-full rounded border p-3"
                />

                <button
                    type="submit"
                    className="w-full rounded bg-black py-3 text-white transition hover:opacity-90"
                >
                    Login
                </button>

            </form>

        </div>
    );
}

export default LoginPage;