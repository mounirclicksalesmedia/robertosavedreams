import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET endpoint to retrieve a specific contact message by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const contact = await prisma.contact.findUnique({
      where: { id }
    });
    
    if (!contact) {
      return NextResponse.json(
        { success: false, message: 'Contact message not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: contact
    });
    
  } catch (error) {
    console.error('Error fetching contact message:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contact message' },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update contact message status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;
    
    // Validate the status
    const validStatuses = ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Check if contact exists
    const existingContact = await prisma.contact.findUnique({
      where: { id }
    });
    
    if (!existingContact) {
      return NextResponse.json(
        { success: false, message: 'Contact message not found' },
        { status: 404 }
      );
    }
    
    // Update the contact message
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { status }
    });
    
    return NextResponse.json({
      success: true,
      data: updatedContact
    });
    
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update contact message' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a contact message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if contact exists
    const existingContact = await prisma.contact.findUnique({
      where: { id }
    });
    
    if (!existingContact) {
      return NextResponse.json(
        { success: false, message: 'Contact message not found' },
        { status: 404 }
      );
    }
    
    // Delete the contact message
    await prisma.contact.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete contact message' },
      { status: 500 }
    );
  }
} 