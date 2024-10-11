"use client";
import { useState } from "react";
import axios, { isAxiosError } from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const response = await axios.post("/api/auth/forgot-password", {
				email,
			});
			console.log(response.data);

			if (response.status === 200) {
				toast.success(
					"Reset Password Email has been sent successfully"
				);
			}
		} catch (error) {
			console.error("Error sending reset password email", error);
			if (isAxiosError(error)) {
				toast.error(
					"Error sending reset password email: " +
						error.response?.data.message
				);
			} else {
				toast.error("Error sending reset password email");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="p-8 rounded-lg w-full max-w-2xl">
				<h1 className="text-4xl font-bold text-center mb-2">
					Forgot Password
				</h1>
				<p className="text-gray-600 text-2xl text-center mb-10">
					Please enter your email
				</p>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="text"
							className="mt-1 block w-full px-6 py-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="Your Email Address for the account"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="flex items-center justify-end">
						<Link
							href="/admin"
							className="text-sm text-[#261A57] hover:underline"
						>
							Know your password? Login
						</Link>
					</div>

					<div>
						{!loading && (
							<button
								type="submit"
								className="w-full py-3 px-6 bg-[#261A57] text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								Send Reset Password Link
							</button>
						)}

						{loading && (
							<button
								type="submit"
								className="w-full py-3 px-6 bg-[#261A57] text-white font-semibold rounded-md shadow-sm cursor-not-allowed"
								disabled
							>
								Sending Email...
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
