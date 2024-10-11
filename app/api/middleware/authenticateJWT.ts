import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Replace with your secret key

const authenticateJWT = (req: NextRequest) => {
	const authHeader = req.headers.get("authorization")?.split(" ")[1];
	if (!authHeader) {
		return NextResponse.json(
			{ message: "Authorization header missing" },
			{ status: 401 }
		);
	}
	console.log(authHeader);

	const token = authHeader;
	if (!token) {
		return NextResponse.json({ message: "Token missing" }, { status: 401 });
	}

	try {
		const user = jwt.verify(token, JWT_SECRET);
		console.log("user: ", user);
		return user;
	} catch (error) {
		return NextResponse.json(
			{ message: "Invalid or expired token" },
			{ status: 403 }
		);
	}
};

export default authenticateJWT;
