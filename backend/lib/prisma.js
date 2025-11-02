const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

// Initialize Prisma Client with Accelerate extension
const prisma = new PrismaClient().$extends(withAccelerate());

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;

