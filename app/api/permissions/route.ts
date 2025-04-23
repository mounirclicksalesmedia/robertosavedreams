import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import prisma from '@/app/lib/prisma/client';

// Get all permissions
export async function GET() {
  try {
    // Check if user is authenticated and is an admin
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Define available permission types
    const AVAILABLE_PERMISSIONS = [
      { id: 'website', name: 'Website Content', description: 'Access to website content management' },
      { id: 'loans', name: 'Loans', description: 'Access to loan applications' },
      { id: 'grants', name: 'Grants', description: 'Access to grant applications' },
      { id: 'investments', name: 'Investments', description: 'Access to investment applications' },
      { id: 'contact', name: 'Contact Messages', description: 'Access to contact messages' },
      { id: 'overview', name: 'Dashboard Overview', description: 'Access to dashboard overview' },
    ];

    return NextResponse.json({ permissions: AVAILABLE_PERMISSIONS });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching permissions' },
      { status: 500 }
    );
  }
}

// Create a new permission (admin only)
export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Validate request body
    const createPermissionSchema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      description: z.string().min(5, 'Description must be at least 5 characters'),
    });

    const body = await request.json();
    const result = createPermissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: result.error.errors },
        { status: 400 }
      );
    }

    const { name, description } = result.data;

    // Check if permission already exists
    const existingPermission = await prisma.permission.findUnique({
      where: { name },
    });

    if (existingPermission) {
      return NextResponse.json(
        { message: 'Permission with this name already exists' },
        { status: 409 }
      );
    }

    // Create new permission
    const permission = await prisma.permission.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(
      {
        message: 'Permission created successfully',
        permission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating permission:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the permission' },
      { status: 500 }
    );
  }
} 