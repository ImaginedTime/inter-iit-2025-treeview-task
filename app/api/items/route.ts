import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import authenticateJWT from "../middleware/authenticateJWT";
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
	try {
		// let authResponse = authenticateJWT(req);

		// if (authResponse instanceof NextResponse) {
		// 	return authResponse;
		// }

		// authResponse = authResponse as JwtPayload;

		const items = await prisma.item.findMany({});

		if (!items || items.length === 0) {
			return NextResponse.json(
				{ message: "No items found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(items, { status: 200 });
	} catch (error) {
		console.error("Error fetching items:", error);

		if (error instanceof Error) {
			return NextResponse.json(
				{ message: "Internal server error", error: error.message },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: "Unexpected error occurred" },
			{ status: 500 }
		);
	}
}
