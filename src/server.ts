import app from "./app.js"
import { prisma } from "./lib/prisma.js"

const PORT = process.env.PORT || 5000

async function main() {
    try {
        await prisma.$connect()
        console.log("Connected to database successfully")

        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`)
        })
    }
    catch (error) {
        console.log(error)
        await prisma.$disconnect()
        process.exit(1)
    }
}

main();