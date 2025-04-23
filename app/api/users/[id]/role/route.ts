import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import prisma from '@/app/lib/prisma/client';

interface Params {
  params: {
    id: string;
  };
}

// Update user role
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    
    // Check if user is authenticated and is an admin
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Validate request body
    const updateRoleSchema = z.object({
      role: z.enum(['ADMIN', 'MANAGER', 'STAFF', 'USER', 'INVESTOR']),
    });

    const body = await request.json();
    const result = updateRoleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: result.error.errors },
        { status: 400 }
      );
    }

    const { role } = result.data;

    // Prevent an admin from changing their own role to prevent accidental lockout
    if (id === session.user.id && role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'You cannot change your own admin role' },
        { status: 403 }
      );
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!userExists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update the user's role
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Role updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating user role' },
      { status: 500 }
    );
  }
} 