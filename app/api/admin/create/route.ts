import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/app/lib/prisma/client';

// This is a special admin creation endpoint
// In production, this should be properly secured or removed after initial setup
export async function POST(request: Request) {
  try {
    // Security check - this prevents the endpoint from being called again
    // once the admin has been created
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (adminExists) {
      return NextResponse.json(
        { message: 'Admin already exists. This endpoint is disabled.' },
        { status: 403 }
      );
    }

    // Define the admin credentials
    const adminEmail = 'roberto@robertosavedreamsfoundation.org';
    const adminPassword = 'Roberto@Azerty@123123';
    const adminName = 'Roberto Admin';

    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create new admin user
    const user = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN', // Admin role
      },
    });

    // Return success response (excluding password)
    return NextResponse.json(
      {
        message: 'Admin user created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { message: 'An error occurred during admin creation' },
      { status: 500 }
    );
  }
} 