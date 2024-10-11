"use client";
import { useState } from "react";
import axios, { isAxiosError } from "axios";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetPassword() {
	const router = useRouter();

	const { token } = useParams();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (password !== confirmPassword) {
				toast.error("Passwords do not match");
				return;
			}

			setLoading(true);
			const response = await axios.post(
				"/api/auth/reset-password",
				{
					password,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(response.data);

			if (response.status === 200) {
				router.push("/login");
				toast.success("Password reset successfully");
			}
		} catch (error) {
			console.error("Error resetting password", error);
			if (isAxiosError(error)) {
				toast.error(
					"Error resetting password: " + error.response?.data.message
				);
			} else {
				toast.error("Error resetting password");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="p-8 rounded-lg w-full max-w-2xl">
				<h1 className="text-4xl font-bold text-center mb-2">
					Reset Password
				</h1>
				<p className="text-gray-600 text-2xl text-center mb-10">
					Please enter your new password
				</p>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700">
							New Password
						</label>
						<input
							type={showPassword ? "text" : "password"}
							className="mt-1 block w-full px-6 py-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="New Password"
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

					{/* Sign in Button */}
					<div>
						{!loading && (
							<button
								type="submit"
								className="w-full py-3 px-6 bg-[#261A57] text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								Reset Password
							</button>
						)}

						{loading && (
							<button
								type="submit"
								className="w-full py-3 px-6 bg-[#261A57] text-white font-semibold rounded-md shadow-sm cursor-not-allowed"
								disabled
							>
								Resetting Password...
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
