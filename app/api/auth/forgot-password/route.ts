import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import nodemailer from "nodemailer";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json(
				{ message: "Email is required" },
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

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: "10m" }
		);

		// send email with a link to /reset-password/token={}

		const transporter = nodemailer.createTransport({
			service: "Gmail",
			secure: true,
			auth: {
				user: process.env.USER_EMAIL,
				pass: process.env.USER_PASSWORD,
			},
		});

		const resetLink = `${
			process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
		}/reset-password/${token}`;

		const mailOptions = {
			from: "treeview-uday@interiit.com",
			to: email,
			subject: "Reset Password",
			text: `Click on the link to reset your password: ${resetLink}`,
		};

		await transporter.sendMail(mailOptions);

		return NextResponse.json({ message: "Email sent" }, { status: 200 });
	} catch (error) {
		console.error("Error during login:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
