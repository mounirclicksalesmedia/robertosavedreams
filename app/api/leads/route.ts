import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      firstName,
      lastName,
      email,
      phone,
      country,
      message,
      donationAmount,
      donationFrequency,
      status
    } = body;

    // Create a new donation record
    const donation = await prisma.donation.create({
      data: {
        amount: donationAmount,
        currency: 'USD',
        status: 'pending',
        message: message,
        anonymous: false,
        donor: {
          create: {
            name: `${firstName} ${lastName}`,
            email: email,
            password: '', // This should be handled properly in a real authentication system
            role: 'USER'
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      donationId: donation.id 
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { donationId, status, paymentId } = body;

    // Update the donation status and payment ID
    const updatedDonation = await prisma.donation.update({
      where: {
        id: donationId
      },
      data: {
        status: status,
        paymentId: paymentId
      }
    });

    return NextResponse.json({ 
      success: true,
      donation: updatedDonation
    });
  } catch (error) {
    console.error('Error updating donation:', error);
    return NextResponse.json(
      { error: 'Failed to update donation' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 