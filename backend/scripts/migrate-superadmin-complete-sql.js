/**
 * Complete Migration: Move Super Admin from Users Table to SuperAdmins Table
 * Uses raw SQL to handle schema changes
 */

require('dotenv').config();
const { prisma } = require('../config/database');

async function migrateSuperAdminComplete() {
  try {
    console.log('🔄 Complete Migration: Moving super admin from users to super_admins table...\n');

    const email = 'admin@skyber.dev';

    // Step 1: Add missing columns to super_admins table using raw SQL
    console.log('⏳ Step 1: Adding missing columns to super_admins table...');
    
    await prisma.$executeRaw`
      ALTER TABLE super_admins 
      ADD COLUMN IF NOT EXISTS password TEXT,
      ADD COLUMN IF NOT EXISTS avatar TEXT,
      ADD COLUMN IF NOT EXISTS "googleId" TEXT UNIQUE,
      ADD COLUMN IF NOT EXISTS "githubId" TEXT UNIQUE,
      ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'local',
      ADD COLUMN IF NOT EXISTS "planTier" TEXT DEFAULT 'enterprise',
      ADD COLUMN IF NOT EXISTS "subscriptionId" TEXT;
    `;
    console.log('✅ Columns added to super_admins table');

    // Step 2: Find the user
    console.log('\n⏳ Step 2: Finding user in users table...');
    const user = await prisma.$queryRaw`
      SELECT * FROM users WHERE email = ${email.toLowerCase()}
    `;
    
    if (!user || user.length === 0) {
      console.log('❌ User not found:', email);
      await prisma.$disconnect();
      process.exit(1);
    }

    const userData = user[0];
    console.log('✅ User found:');
    console.log(`   User ID: ${userData.id}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Name: ${userData.name || 'N/A'}`);

    // Step 3: Find existing super admin
    console.log('\n⏳ Step 3: Finding existing super admin entry...');
    const existingSuperAdmin = await prisma.$queryRaw`
      SELECT * FROM super_admins WHERE email = ${email.toLowerCase()}
    `;

    let superAdminId;
    if (existingSuperAdmin && existingSuperAdmin.length > 0) {
      console.log('✅ Found existing super admin entry');
      superAdminId = existingSuperAdmin[0].id;
      
      // Step 4: Update super admin with all user data
      console.log('\n⏳ Step 4: Updating super admin with all user data...');
      await prisma.$executeRaw`
        UPDATE super_admins 
        SET 
          password = ${userData.password},
          name = ${userData.name || null},
          avatar = ${userData.avatar || null},
          "googleId" = ${userData.googleId || null},
          "githubId" = ${userData.githubId || null},
          provider = ${userData.provider || 'local'},
          "planTier" = ${userData.planTier || 'enterprise'},
          "subscriptionId" = ${userData.subscriptionId || null}
        WHERE id = ${superAdminId}
      `;
      console.log('✅ Super admin updated with all user data');
    } else {
      // Create new super admin entry
      console.log('\n⏳ Step 4: Creating new super admin entry...');
      const result = await prisma.$executeRaw`
        INSERT INTO super_admins (
          id, email, password, name, avatar, "googleId", "githubId", provider, 
          "planTier", "subscriptionId", permissions, "accessLevel", "isActive", 
          notes, "createdAt", "updatedAt", "lastLogin"
        )
        VALUES (
          gen_random_uuid(),
          ${email.toLowerCase()},
          ${userData.password},
          ${userData.name || null},
          ${userData.avatar || null},
          ${userData.googleId || null},
          ${userData.githubId || null},
          ${userData.provider || 'local'},
          ${userData.planTier || 'enterprise'},
          ${userData.subscriptionId || null},
          ARRAY['*']::text[],
          'full',
          true,
          'Migrated from users table - complete migration',
          ${userData.createdAt || new Date()},
          NOW(),
          ${userData.lastLogin || null}
        )
        RETURNING id
      `;
      superAdminId = result[0]?.id || (await prisma.$queryRaw`SELECT id FROM super_admins WHERE email = ${email.toLowerCase()}`)[0].id;
      console.log('✅ Super admin entry created');
    }

    // Step 5: Update sessions to point to superAdminId
    console.log('\n⏳ Step 5: Updating sessions to reference super admin...');
    const sessionResult = await prisma.$executeRaw`
      UPDATE sessions 
      SET 
        "userId" = NULL,
        "superAdminId" = ${superAdminId}
      WHERE "userId" = ${userData.id}
    `;
    console.log(`✅ Sessions updated`);

    // Step 6: Remove user from users table
    console.log('\n⏳ Step 6: Removing user from users table...');
    await prisma.$executeRaw`
      DELETE FROM users WHERE id = ${userData.id}
    `;
    console.log('✅ User removed from users table');

    // Step 7: Remove userId column from super_admins if it exists
    console.log('\n⏳ Step 7: Cleaning up old userId column...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE super_admins DROP COLUMN IF EXISTS "userId"
      `;
      console.log('✅ Old userId column removed');
    } catch (e) {
      console.log('ℹ️  userId column already removed or does not exist');
    }

    console.log('\n✅ Complete migration successful!\n');
    console.log('Super Admin Details (Standalone):');
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${userData.name || 'N/A'}`);
    console.log(`   Password: [Hashed - migrated]`);
    console.log(`   Provider: ${userData.provider || 'local'}`);
    console.log(`   Plan Tier: ${userData.planTier || 'enterprise'}`);
    console.log('\n📝 Important:');
    console.log('   ✅ User completely removed from users table');
    console.log('   ✅ All user data moved to super_admins table');
    console.log('   ✅ Sessions now reference superAdminId only');
    console.log('   ✅ Super admin is now standalone (no relation to users table)');
    console.log('\n📝 Next Step: Run `npx prisma db push` to sync schema\n');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration error:');
    console.error(error.message);
    console.error(error.stack);
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run the migration
migrateSuperAdminComplete();

