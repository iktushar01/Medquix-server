import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";
import crypto from "crypto";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const adminEmail = "admin@medistore.com";

    const existingAdmin = await prisma.user.findFirst({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log("Admin already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash("Admin123", 10);
    const userId = crypto.randomUUID();

    // Create user
    await prisma.user.create({
        data: {
            id: userId,
            name: "Super Admin",
            email: adminEmail,
            role: "admin",
            status: "active",
        },
    });

    // Create corresponding account for better-auth
    await prisma.account.create({
        data: {
            id: crypto.randomUUID(),
            userId: userId,
            accountId: adminEmail,
            providerId: "credential",
            password: hashedPassword,
        },
    });

    console.log("Admin seeded successfully");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:");
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });





