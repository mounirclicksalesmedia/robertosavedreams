import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const content = await req.json();
    
    // Validate content structure
    if (!content || !content.title || !content.description || 
        !Array.isArray(content.categories) || !Array.isArray(content.images)) {
      return NextResponse.json({ success: false, error: 'Invalid content format' }, { status: 400 });
    }
    
    // Ensure All category exists
    if (!content.categories.includes('All')) {
      content.categories.unshift('All');
    }
    
    // Ensure each image has the required fields
    for (const image of content.images) {
      if (!image.id || !image.src || !image.alt || !image.category) {
        return NextResponse.json({ success: false, error: 'Invalid image format' }, { status: 400 });
      }
    }
    
    // Define the path to the JSON file
    const filePath = path.join(process.cwd(), 'public', 'data', 'gallery-content.json');
    
    // Convert content to JSON string with formatting
    const jsonContent = JSON.stringify(content, null, 2);
    
    // Write the content to the file
    await writeFile(filePath, jsonContent, 'utf8');
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving gallery content:', error);
    return NextResponse.json({ success: false, error: 'Failed to save content' }, { status: 500 });
  }
} 