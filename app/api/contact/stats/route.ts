import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    // Get total count of contact messages
    const total = await prisma.contact.count();
    
    // Get count of contact messages by status
    const unread = await prisma.contact.count({
      where: { status: 'UNREAD' }
    });
    
    const read = await prisma.contact.count({
      where: { status: 'READ' }
    });
    
    const replied = await prisma.contact.count({
      where: { status: 'REPLIED' }
    });
    
    const archived = await prisma.contact.count({
      where: { status: 'ARCHIVED' }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        total,
        unread,
        read,
        replied,
        archived
      }
    });
    
  } catch (error) {
    console.error('Error fetching contact statistics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contact statistics' },
      { status: 500 }
    );
  }
} 