const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

const dbUrl = process.env.DATABASE_URL || '';
const useAccelerate = dbUrl.startsWith('prisma+postgres://');

let prisma;
if (useAccelerate) {
  console.log('⚡ Prisma Accelerate mode enabled');
  prisma = new PrismaClient().$extends(withAccelerate());
} else {
  console.log('🔌 Direct database connection mode');
  prisma = new PrismaClient();
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;

