"use client";
import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import ReactSwitch from "react-switch";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Login() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const { isLoggedIn, setIsLoggedIn, setUser } = useUserContext();

	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const response = await axios.post("/api/auth/login", {
				email,
				password,
				rememberMe,
			});
			console.log(response.data);

			if (response.status === 200 && response.data.token) {
				localStorage.setItem("token", response.data.token);
				localStorage.setItem(
					"user",
					JSON.stringify(response.data.user)
				);
				setIsLoggedIn(true);
				setUser(response.data.user);

				router.push("/");
				toast.success("Logged in successfully");
			}
		} catch (error) {
			console.error("Error logging in", error);
			if (isAxiosError(error)) {
				toast.error(
					"Error logging in: " + error.response?.data.message
				);
			} else {
				toast.error("Error logging in");
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isLoggedIn) {
			router.push("/");
		}
	}, [isLoggedIn]);

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="p-8 rounded-lg w-full max-w-2xl">
				<h1 className="text-4xl font-bold text-center mb-2">
					Welcome back!
				</h1>
				<p className="text-gray-600 text-2xl text-center mb-10">
					Please login to your account
				</p>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Email Input */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="text"
							className="mt-1 block w-full px-6 py-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="Email or phone number"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					{/* Password Input */}

					<div className="relative">
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type={showPassword ? "text" : "password"}
							className="mt-1 block w-full px-6 py-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<button
							type="button"
							className="absolute top-10 right-0 px-3 flex items-center"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<VisibilityIcon className="h-5 w-5 text-gray-600" />
							) : (
								<VisibilityOffIcon className="h-5 w-5 text-gray-600" />
							)}
						</button>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<ReactSwitch
								checked={rememberMe}
								onChange={() => setRememberMe((prev) => !prev)}
								onColor="#261A57"
								offColor="#D1D5DB"
								// checkedIcon={false}
								// uncheckedIcon={false}
							/>
							<span className="text-sm text-gray-600">
								Remember me
							</span>
						</div>
						<Link
							href="/forgot-password"
							className="text-sm text-[#261A57] hover:underline"
						>
							Forgot your password?
						</Link>
					</div>

					{/* Sign in Button */}
					<div>
						{!loading && (
							<button
								type="submit"
								className="w-full py-3 px-6 bg-[#261A57] text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								Sign in
							</button>
						)}

						{loading && (
							<button
								type="submit"
								className="w-full py-3 px-6 bg-[#261A57] text-white font-semibold rounded-md shadow-sm cursor-not-allowed"
								disabled
							>
								Signing In...
							</button>
						)}
					</div>

					<div className="flex items-center justify-center">
						<Link
							href="/signup"
							className="text-sm text-[#261A57] hover:underline"
						>
							Don't have an account? Sign up
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
