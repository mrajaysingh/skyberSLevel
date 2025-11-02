/**
 * Migrate Super Admin from Users Table to SuperAdmin Table
 * This script moves existing super admin users to the new super_admins table
 */

require('dotenv').config();
const { prisma } = require('../config/database');

async function migrateSuperAdmin() {
  try {
    console.log('🔄 Migrating super admin from users table to super_admins table...\n');

    // Find the super admin user by email
    const email = 'admin@skyber.dev';

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { superAdmin: true }
    });

    if (!user) {
      console.log('❌ User not found:', email);
      console.log('   Please create the user first or use create-superadmin.js\n');
      await prisma.$disconnect();
      process.exit(1);
    }

    console.log('📋 Found user:');
    console.log(`   User ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Current Role: ${user.role}`);
    console.log(`   Has SuperAdmin Entry: ${user.superAdmin ? 'Yes' : 'No'}\n`);

    // Check if super admin entry already exists
    if (user.superAdmin) {
      console.log('✅ Super admin entry already exists in super_admins table');
      console.log(`   SuperAdmin ID: ${user.superAdmin.id}`);
      console.log(`   Email: ${user.superAdmin.email}`);
      console.log(`   Active: ${user.superAdmin.isActive}`);
      console.log('\n✅ Migration not needed - super admin already in separate table.\n');
      await prisma.$disconnect();
      process.exit(0);
    }

    // Create super admin entry
    console.log('⏳ Creating super admin entry...');
    const superAdmin = await prisma.superAdmin.create({
      data: {
        userId: user.id,
        email: user.email.toLowerCase(),
        name: user.name || 'Super Admin',
        permissions: ['*'], // Full permissions
        accessLevel: 'full',
        isActive: true,
        notes: 'Migrated from users table'
      }
    });

    console.log('✅ Super admin entry created');

    // Update user role if it was 'super-admin' (remove that role)
    if (user.role === 'super-admin') {
      console.log('⏳ Updating user role from "super-admin" to "admin"...');
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'admin' }
      });
      console.log('✅ User role updated');
    }

    console.log('\n✅ Migration completed successfully!\n');
    console.log('Super Admin Details:');
    console.log(`   SuperAdmin ID: ${superAdmin.id}`);
    console.log(`   User ID: ${superAdmin.userId}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Name: ${superAdmin.name}`);
    console.log(`   Access Level: ${superAdmin.accessLevel}`);
    console.log(`   Permissions: ${superAdmin.permissions.join(', ')}`);
    console.log(`   Active: ${superAdmin.isActive ? 'Yes' : 'No'}`);
    console.log(`   Created At: ${superAdmin.createdAt}`);
    console.log('\n📝 Next Steps:');
    console.log('   1. Test login with the super admin credentials');
    console.log('   2. Verify the role is detected correctly');
    console.log('   3. Check dashboard access\n');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration error:');
    console.error(error.message);
    
    if (error.code === 'P2002') {
      console.error('\n⚠️  Unique constraint violation');
      console.error('   Super admin entry might already exist for this user');
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run the migration
migrateSuperAdmin();

