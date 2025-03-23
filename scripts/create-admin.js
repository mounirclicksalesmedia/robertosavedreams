const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const email = 'roberto@robertosavedreamsfoundation.org';
    const password = 'Roberto@Azerty@123123';
    
    // Delete existing user if exists
    await prisma.user.deleteMany({
      where: { email },
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Password:', password);
    console.log('Hashed password:', hashedPassword);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Roberto Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created successfully:', user.email);

    // Verify password
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification test:', isValid);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 