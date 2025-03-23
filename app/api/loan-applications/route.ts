import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma/client';

// POST endpoint to create a new loan application
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received application data:', body);
    
    // Extract data from the request body
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      dateOfBirth,
      employmentStatus,
      monthlyIncome,
      loanPurpose,
      businessDescription,
      loanAmount,
      loanTerm,
      interestRate,
      monthlyPayment,
      totalRepayment
    } = body;

    // Create a new user or find existing user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a new user if doesn't exist
      user = await prisma.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          email,
          password: '', // This should be properly handled in a real auth system
          role: 'USER',
        },
      });
    }

    // Create the loan application
    const loanApplication = await prisma.loanApplication.create({
      data: {
        amount: parseFloat(loanAmount.toString()),
        purpose: loanPurpose,
        businessPlan: businessDescription || 'No description provided',
        status: 'PENDING',
        applicantId: user.id,
        // Store additional data as JSON in a metadata field or create additional fields in the schema
        // Since current schema is limited, we'll adapt the existing fields
      },
    });

    console.log('Created loan application:', loanApplication);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Loan application submitted successfully',
      applicationId: loanApplication.id,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating loan application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit loan application', error: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all loan applications
export async function GET() {
  try {
    // Get all loan applications with applicant data
    const applications = await prisma.loanApplication.findMany({
      include: {
        applicant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format and return the applications
    const formattedApplications = applications.map(app => {
      return {
        id: app.id,
        firstName: app.applicant.name.split(' ')[0],
        lastName: app.applicant.name.split(' ').slice(1).join(' '),
        email: app.applicant.email,
        phone: '', // This would need to be added to the user schema
        address: '', // These fields would need to be added to the schema
        city: '',
        state: '',
        zipCode: '',
        dateOfBirth: '',
        employmentStatus: '',
        monthlyIncome: '',
        loanPurpose: app.purpose,
        businessDescription: app.businessPlan,
        loanAmount: app.amount,
        loanTerm: 12, // Default, would need to be added to schema
        interestRate: 4.68, // Fixed rate
        monthlyPayment: 0, // Would need to be calculated or stored
        totalRepayment: 0, // Would need to be calculated or stored
        status: app.status.toLowerCase(),
        submittedAt: app.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      applications: formattedApplications,
    });
  } catch (error) {
    console.error('Error fetching loan applications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch loan applications' },
      { status: 500 }
    );
  }
} 