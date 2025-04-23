import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import prisma from '@/app/lib/prisma/client';

interface Params {
  params: {
    id: string;
  };
}

// Get user permissions
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    
    // Check if user is authenticated and is an admin
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        permissions: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ permissions: user.permissions });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching user permissions' },
      { status: 500 }
    );
  }
}

// Update user permissions
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    
    // Check if user is authenticated and is an admin
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Validate request body
    const updatePermissionsSchema = z.object({
      permissions: z.array(z.string()),
    });

    const body = await request.json();
    const result = updatePermissionsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: result.error.errors },
        { status: 400 }
      );
    }

    const { permissions } = result.data;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!userExists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // First, disconnect all permissions for this user
    await prisma.user.update({
      where: { id },
      data: {
        permissions: {
          set: [],
        },
      },
    });

    // Then, connect the selected permissions
    const user = await prisma.user.update({
      where: { id },
      data: {
        permissions: {
          connect: permissions.map(permId => ({ id: permId })),
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        permissions: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Permissions updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating user permissions:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating user permissions' },
      { status: 500 }
    );
  }
} 