import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST endpoint to create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Create new contact message in database
    const contactMessage = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'UNREAD'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      data: {
        id: contactMessage.id
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send message' 
    }, { status: 500 });
  }
}

// GET endpoint to retrieve all contact messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as string;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build filter object based on query params
    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    
    // Get total count for pagination
    const total = await prisma.contact.count({
      where: filter
    });
    
    // Get paginated contacts
    const contacts = await prisma.contact.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });
    
    return NextResponse.json({
      success: true,
      data: {
        contacts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch contact messages' 
    }, { status: 500 });
  }
} 