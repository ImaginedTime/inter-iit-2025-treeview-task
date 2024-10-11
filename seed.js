const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

// Initialize Prisma Client
const prisma = new PrismaClient();

// Load data from JSON files
const godownData = JSON.parse(fs.readFileSync("./godowns.json", "utf-8"));
const itemData = JSON.parse(fs.readFileSync("./items.json", "utf-8"));

async function seedGodowns() {
	console.log("Seeding godowns...");

	for (const godown of godownData) {
		await prisma.godown.create({
			data: {
				id: godown.id,
				name: godown.name,
				parent_godown_id: godown.parent_godown, // Use parent_godown_id instead of parent_godown
			},
		});
	}

	console.log("Godowns seeding completed!");
}

async function seedItems() {
	console.log("Seeding items...");

	for (const item of itemData) {
		await prisma.item.create({
			data: {
				item_id: item.item_id,
				name: item.name,
				quantity: item.quantity,
				category: item.category,
				price: item.price,
				status: item.status,
				godown_id: item.godown_id, // Linking to existing godown
				brand: item.brand,
				attributes: item.attributes,
				image_url: item.image_url,
			},
		});
	}

	console.log("Items seeding completed!");
}

async function main() {
	await seedGodowns();
	await seedItems();
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
