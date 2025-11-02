/**
 * Create Super Admin User Script
 * This script creates a super admin user in the database
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');

async function createSuperAdmin() {
  try {
    console.log('🔐 Creating super admin user...\n');

    const email = 'admin@skyber.dev';
    const password = 'Ajays8268#';
    const name = 'Ajayt Singh';
    const role = 'super-admin';

    // Check if super admin already exists (standalone check)
    const existingSuperAdmin = await prisma.superAdmin.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingSuperAdmin) {
      console.log('⚠️  Super admin already exists with this email');
      console.log(`   Super Admin ID: ${existingSuperAdmin.id}`);
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      return new Promise((resolve) => {
        readline.question('\nDo you want to update the password? (y/n): ', async (answer) => {
          if (answer.toLowerCase() === 'y') {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.superAdmin.update({
              where: { email: email.toLowerCase() },
              data: {
                password: hashedPassword,
                name: name
              }
            });
            console.log('✅ Super admin password updated successfully');
          } else {
            console.log('ℹ️  Super admin update skipped');
          }
          readline.close();
          await prisma.$disconnect();
          resolve();
        });
      });
    }

    // Hash password
    console.log('⏳ Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed');

    // Create super admin directly (standalone - no relation to users table)
    console.log('⏳ Creating super admin in database...');
    const superAdmin = await prisma.superAdmin.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword, // Password stored in super_admins table
        name: name,
        provider: 'local',
        planTier: 'enterprise',
        permissions: ['*'], // Full permissions
        accessLevel: 'full',
        isActive: true,
        notes: 'Super administrator account'
      }
    });

    console.log('\n✅ Super admin created successfully!');
    console.log('\nSuper Admin Details (Standalone):');
    console.log(`   SuperAdmin ID: ${superAdmin.id}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Name: ${superAdmin.name}`);
    console.log(`   Password: [Hashed]`);
    console.log(`   Provider: ${superAdmin.provider}`);
    console.log(`   Plan Tier: ${superAdmin.planTier}`);
    console.log(`   Access Level: ${superAdmin.accessLevel}`);
    console.log(`   Permissions: ${superAdmin.permissions.join(', ')}`);
    console.log(`   Active: ${superAdmin.isActive ? 'Yes' : 'No'}`);
    console.log(`   Created At: ${superAdmin.createdAt}`);
    console.log('\n📝 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  Save these credentials securely!');
    console.log('⚠️  Change the password after first login in production.\n');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating super admin user:');
    console.error(error.message);
    
    if (error.code === 'P2002') {
      console.error('\n⚠️  User with this email already exists');
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run the script
createSuperAdmin();

