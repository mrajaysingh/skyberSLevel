/**
 * Complete Migration: Move Super Admin from Users Table to SuperAdmins Table
 * This script removes the user from users table and moves ALL data to super_admins table
 */

require('dotenv').config();
const { prisma } = require('../config/database');

async function migrateSuperAdminComplete() {
  try {
    console.log('🔄 Complete Migration: Moving super admin from users to super_admins table...\n');

    const email = 'admin@skyber.dev';

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Find existing super admin (if any)
    const existingSuperAdmin = await prisma.superAdmin.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      console.log('❌ User not found:', email);
      console.log('   Please create the user first or use create-superadmin.js\n');
      await prisma.$disconnect();
      process.exit(1);
    }

    console.log('📋 Found user to migrate:');
    console.log(`   User ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Plan Tier: ${user.planTier}`);
    console.log(`   Provider: ${user.provider}`);
    console.log(`   Has SuperAdmin Entry: ${existingSuperAdmin ? 'Yes' : 'No'}\n`);

    // Check if super admin entry already exists (update it with user data)
    let superAdmin;
    if (existingSuperAdmin) {
      console.log('⏳ Super admin entry exists, updating with all user data...');
      // First, we need to manually update the password field using raw SQL since it may not exist in schema yet
      console.log('   Note: Using raw SQL to add password field...');
      
      // Use raw SQL to update/add password field
      await prisma.$executeRaw`
        UPDATE super_admins 
        SET 
          password = ${user.password},
          name = ${user.name},
          avatar = ${user.avatar},
          "googleId" = ${user.googleId},
          "githubId" = ${user.githubId},
          provider = ${user.provider || 'local'},
          "planTier" = ${user.planTier || 'enterprise'},
          "subscriptionId" = ${user.subscriptionId},
          permissions = ${JSON.stringify(existingSuperAdmin.permissions.length > 0 ? existingSuperAdmin.permissions : ['*'])}::text[],
          "accessLevel" = ${existingSuperAdmin.accessLevel || 'full'},
          "isActive" = ${existingSuperAdmin.isActive !== undefined ? existingSuperAdmin.isActive : true},
          notes = ${existingSuperAdmin.notes || 'Migrated from users table - complete migration'}
        WHERE id = ${existingSuperAdmin.id}
      `;
      
      // Then fetch updated super admin
      superAdmin = await prisma.superAdmin.findUnique({
        where: { id: existingSuperAdmin.id }
      });
      console.log('✅ Super admin entry updated with all user data');
    } else {
      console.log('⏳ Creating new super admin entry with all user data...');
      superAdmin = await prisma.superAdmin.create({
        data: {
          email: user.email.toLowerCase(),
          password: user.password, // Move password
          name: user.name,
          avatar: user.avatar,
          googleId: user.googleId,
          githubId: user.githubId,
          provider: user.provider || 'local',
          planTier: user.planTier || 'enterprise',
          subscriptionId: user.subscriptionId,
          permissions: ['*'], // Full permissions
          accessLevel: 'full',
          isActive: true,
          notes: 'Migrated from users table - complete migration',
          createdAt: user.createdAt, // Preserve original creation date
          lastLogin: user.lastLogin // Preserve last login
        }
      });
      console.log('✅ Super admin entry created with all user data');
    }

    // Update all sessions to point to superAdminId instead of userId
    console.log('⏳ Updating sessions to reference super admin...');
    const sessionUpdate = await prisma.session.updateMany({
      where: { userId: user.id },
      data: {
        userId: null,
        superAdminId: superAdmin.id
      }
    });
    console.log(`✅ Updated ${sessionUpdate.count} session(s)`);

    // Delete the user from users table
    console.log('⏳ Removing user from users table...');
    await prisma.user.delete({
      where: { id: user.id }
    });
    console.log('✅ User removed from users table');

    console.log('\n✅ Complete migration successful!\n');
    console.log('Super Admin Details (Standalone):');
    console.log(`   SuperAdmin ID: ${superAdmin.id}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Name: ${superAdmin.name}`);
    console.log(`   Password: [Hashed - ${superAdmin.password.substring(0, 20)}...]`);
    console.log(`   Provider: ${superAdmin.provider}`);
    console.log(`   Plan Tier: ${superAdmin.planTier}`);
    console.log(`   Access Level: ${superAdmin.accessLevel}`);
    console.log(`   Permissions: ${superAdmin.permissions.join(', ')}`);
    console.log(`   Active: ${superAdmin.isActive ? 'Yes' : 'No'}`);
    console.log(`   Created At: ${superAdmin.createdAt}`);
    console.log(`   Last Login: ${superAdmin.lastLogin || 'Never'}`);
    console.log('\n📝 Important:');
    console.log('   ✅ User completely removed from users table');
    console.log('   ✅ All user data moved to super_admins table');
    console.log('   ✅ Sessions now reference superAdminId only');
    console.log('   ✅ Super admin is now standalone (no relation to users table)');
    console.log('\n📝 Next Steps:');
    console.log('   1. Update authentication code to check super_admins table directly');
    console.log('   2. Test login with super admin credentials');
    console.log('   3. Verify dashboard access works correctly\n');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration error:');
    console.error(error.message);
    console.error(error.stack);
    
    if (error.code === 'P2002') {
      console.error('\n⚠️  Unique constraint violation');
      console.error('   Email or ID might already exist in super_admins table');
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run the migration
migrateSuperAdminComplete();

