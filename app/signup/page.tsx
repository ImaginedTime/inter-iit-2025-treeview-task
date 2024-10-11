"use client";
import { useState } from "react";
import axios, { isAxiosError } from "axios";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import ReactSwitch from "react-switch";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Signup() {
	const router = useRouter();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { setIsLoggedIn, setUser } = useUserContext();

	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		try {
			setLoading(true);
			const response = await axios.post("/api/auth/signup", {
				name,
				email,
				password,
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
				toast.success("Sign Up successfully");
			}
		} catch (error) {
			console.error("Error signing up", error);
			if (isAxiosError(error)) {
				toast.error(
					"Error signing up: " + error.response?.data.message
				);
			} else {
				toast.error("Error signing up");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="p-8 rounded-lg w-full max-w-2xl">
				<h1 className="text-4xl font-bold text-center mb-2">
					Hello there!
				</h1>
				<p className="text-gray-600 text-2xl text-center mb-10">
					Please create an account to continue
				</p>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							type="text"
							className="mt-1 block w-full px-6 py-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					{/* Email Input */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="text"
							className="mt-1 block w-full px-6 py-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="Email Address"
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

					<div className="relative">
						<label className="block text-sm font-medium text-gray-700">
							Confirm Password
						</label>
						<input
							type={showConfirmPassword ? "text" : "password"}
							className="mt-1 block w-full px-6 py-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
						<button
							type="button"
							className="absolute top-10 right-0 px-3 flex items-center"
							onClick={() =>
								setShowConfirmPassword(!showConfirmPassword)
							}
						>
							{showConfirmPassword ? (
								<VisibilityIcon className="h-5 w-5 text-gray-600" />
							) : (
								<VisibilityOffIcon className="h-5 w-5 text-gray-600" />
							)}
						</button>
					</div>

					<div className="flex items-center justify-between">
						<Link
							href="/forgot-password"
							className="text-sm text-[#261A57] hover:underline"
						>
							Forgot your password?
						</Link>

						<Link
							href="/login"
							className="text-sm text-[#261A57] hover:underline"
						>
							Already have an account? Sign in
						</Link>
					</div>

					<div>
						{!loading && (
							<button
								type="submit"
								className="w-full py-3 px-6 bg-[#261A57] text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								Sign Up
							</button>
						)}

						{loading && (
							<button
								type="submit"
								className="w-full py-3 px-6 bg-[#261A57] text-white font-semibold rounded-md shadow-sm cursor-not-allowed"
								disabled
							>
								Signing Up...
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
