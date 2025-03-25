import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma/client';

// POST endpoint to create a new investment application
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received investment application data:', body);
    
    // Extract data from the request body
    const {
      name,
      email,
      organization,
      phone,
      investmentAmount,
      investmentType,
      message,
      highlights,
      metrics
    } = body;

    // Create a new user or find existing user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a new user if doesn't exist
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: '', // This should be properly handled in a real auth system
          role: 'INVESTOR',
        },
      });
    }

    // Create the investment application
    const investmentApplication = await prisma.investmentApplication.create({
      data: {
        amount: parseFloat(investmentAmount.toString()),
        type: investmentType,
        organizationName: organization,
        message: message || 'No message provided',
        status: 'PENDING',
        investorId: user.id,
        metadata: {
          highlights,
          metrics
        }
      },
    });

    console.log('Created investment application:', investmentApplication);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Investment application submitted successfully',
      applicationId: investmentApplication.id,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating investment application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit investment application', error: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all investment applications
export async function GET() {
  try {
    // Get all investment applications with investor data
    const applications = await prisma.investmentApplication.findMany({
      include: {
        investor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format and return the applications
    const formattedApplications = applications.map(app => {
      return {
        id: app.id,
        name: app.investor.name,
        email: app.investor.email,
        organization: app.organizationName,
        phone: app.investor.phone || '',
        investmentAmount: app.amount,
        investmentType: app.type,
        message: app.message,
        status: app.status.toLowerCase(),
        submittedAt: app.createdAt.toISOString(),
        metadata: app.metadata
      };
    });

    return NextResponse.json({
      success: true,
      applications: formattedApplications,
    });
  } catch (error) {
    console.error('Error fetching investment applications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch investment applications' },
      { status: 500 }
    );
  }
} 