import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: NextRequest) {
	try {
		const { name, email, password } = await req.json();

		// Validate fields
		if (!email || !password || !name) {
			return NextResponse.json(
				{ message: "Please fill all the fields" },
				{ status: 400 }
			);
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});

		const token = jwt.sign(
			{ userId: newUser.id, email: newUser.email },
			JWT_SECRET,
			{ expiresIn: "10h" }
		);

		return NextResponse.json(
			{
				message: "User created successfully",
				token,
				user: {
					id: newUser.id,
					email: newUser.email,
					name: newUser.name,
				},
			},
			{ status: 200 }
		);
	} catch (error: unknown) {
		// Use 'unknown' to enforce type checking
		if (error instanceof Error) {
			// Type is now 'Error' so you can safely access 'message'
			console.error(error);
			return NextResponse.json(
				{ message: "Internal server error", error: error.message },
				{ status: 500 }
			);
		} else {
			// Handle case where error is not an instance of Error
			console.error("Unexpected error:", error);
			return NextResponse.json(
				{
					message: "Internal server error",
					error: "An unexpected error occurred",
				},
				{ status: 500 }
			);
		}
	}
}
