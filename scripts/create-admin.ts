import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'roberto@robertosavedreamsfoundation.org';
  const password = 'Roberto@Azerty@123123';
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email,
        hashedPassword,
        role: 'ADMIN',
        name: 'Roberto Admin',
      },
    });

    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 