import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import authenticateJWT from "../../middleware/authenticateJWT";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	try {
        console.log("reached the resetting");
        
		let authResponse = authenticateJWT(req);

		// Check if authenticateJWT has sent a response (redirect or error)
		if (authResponse instanceof NextResponse) {
			return authResponse; // Return the response if authentication failed
		}

		authResponse = authResponse as JwtPayload;

		const { password } = await req.json();

		if (!password) {
			return NextResponse.json(
				{ message: "Password is required" },
				{ status: 400 }
			);
		}

		// Find the user by email
		const user = await prisma.user.findUnique({
			where: { id: authResponse.userId },
		});

		// Check if user exists
		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

        console.log("changing password for user:", user);

		// check if the password is the same as the current password
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (passwordMatch) {
			return NextResponse.json(
				{ message: "New password cannot be the same as the current password" },
				{ status: 400 }
			);
		}

		// reset the password
		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.update({
			where: { id: authResponse.userId },
			data: { password: hashedPassword },
		});

		return NextResponse.json({ message: "Password reset successfully" });
	} catch (error) {
		console.error("Error during login:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
