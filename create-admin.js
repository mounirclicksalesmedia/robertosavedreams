const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting admin user creation...');
    
    const email = 'roberto@robertosavedreamsfoundation.org';
    const password = 'Roberto@Azerty@123123';
    
    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Admin user already exists:', existingUser.email);
      return;
    }

    // Hash the password
    console.log('Hashing password...');
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create the admin user
    console.log('Creating admin user...');
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Roberto Admin',
      },
    });

    console.log('Admin user created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
main()
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 