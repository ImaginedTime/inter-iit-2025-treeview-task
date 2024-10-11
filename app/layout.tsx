import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "TreeView - InterIIT 2025",
	description: "Task for the InterIIT Tech 2025 - Dev Team",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.className}`}>
				<UserProvider>
					{/* <Navbar /> */}
					{children}
					<Toaster position="bottom-center" reverseOrder={false} />
				</UserProvider>
			</body>
		</html>
	);
}
