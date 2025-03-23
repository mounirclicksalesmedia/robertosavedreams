import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    // Get content from request body
    const content = await req.json();
    
    // Define the path to the JSON file
    const filePath = path.join(process.cwd(), 'public', 'data', 'about-content.json');
    
    // Write content to the file
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'About page content saved successfully' 
    });
  } catch (error) {
    console.error('Error saving about page content:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to save about page content',
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 