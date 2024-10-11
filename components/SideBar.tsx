"use client";

import React, { useEffect, useState } from "react";
import GodownTree from "./GodownTree";

import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function SideBar() {
	const { user, isLoggedIn, setIsLoggedIn, setUser } = useUserContext();

	const [sidebarWidth, setSidebarWidth] = useState(
		window.innerWidth > 400 ? 400 : window.innerWidth - 50
	);
	const [isDragging, setIsDragging] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	const router = useRouter();

	const logout = () => {
		setIsLoggedIn(false);
		setUser(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		router.push("/login");
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (isDragging) {
			const newWidth = e.clientX;
			// set a max width of 700px and a min width of 250px
			let width = newWidth < 300 ? 300 : newWidth;
			width = width > 600 ? 600 : width;
			setSidebarWidth(width);
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		if (isDragging) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
		} else {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		}
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	useEffect(() => {
		setSidebarWidth(window.innerWidth > 400 ? 400 : window.innerWidth - 50);
	}, [window.innerWidth]);

	return (
		<>
			<div
				className={`fixed bg-white z-30 h-[calc(100vh-2.5rem)] overflow-y-scroll md:sticky md:h-screen top-0 shadow-2xl select-none transition-transform duration-300 ease-in-out translate-y-10 md:translate-y-0 ${
					menuOpen ? "translate-x-0" : "-translate-x-full"
				} md:block md:translate-x-0`}
				style={{ width: sidebarWidth }}
			>
				{isLoggedIn && (
					<div>
						<div className="bg-white z-30 sticky top-0 p-4 pb-0">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 flex items-center justify-center text-2xl text-white bg-[#261A57] rounded-full">
										{user?.name[0].toUpperCase()}
									</div>
									<p className="text-lg font-semibold">
										{user?.name}
									</p>
								</div>
								<div>
									<button
										className="text-white bg-[#261A57] px-4 py-2 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
										onClick={logout}
									>
										Logout
									</button>
								</div>
							</div>
							<hr className="mt-4 border-t border-gray-300" />
						</div>

						<GodownTree closeMenu={() => setMenuOpen(false)} />
					</div>
				)}
			</div>

			<div
				className="md:hidden w-12 h-12 flex items-center justify-center sticky top-0"
				onClick={() => setMenuOpen(!menuOpen)}
			>
				{menuOpen ? (
					<MenuOpenIcon className="text-gray-700 text-3xl" />
				) : (
					<MenuIcon className="text-gray-700 text-3xl" />
				)}
			</div>

			{/* Sidebar Resizer */}
			<div
				className="hidden md:block w-1 cursor-col-resize bg-gray-300 md:h-screen md:max-h-screen"
				onMouseDown={handleMouseDown}
			></div>
		</>
	);
}
