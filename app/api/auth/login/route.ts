import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: NextRequest) {
	try {
		// Parse form data (use req.formData for multipart/form-data requests)
		const { email, password, rememberMe } = await req.json();

		// Validate email and password
		if (!email || !password) {
			return NextResponse.json(
				{ message: "Email and password are required" },
				{ status: 400 }
			);
		}

		// Find the user by email
		const user = await prisma.user.findUnique({
			where: { email },
		});

		// Check if user exists
		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		// Compare the password
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: rememberMe ? "7d" : "1h" }
		);

		return NextResponse.json(
			{
				message: "Login successful",
				token,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error during login:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
