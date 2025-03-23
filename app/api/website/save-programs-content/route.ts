import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const content = await req.json();
    
    // Validate content structure
    if (!content || !content.title || !content.description || !Array.isArray(content.programs)) {
      return NextResponse.json({ success: false, error: 'Invalid content format' }, { status: 400 });
    }
    
    // Ensure each program has the required fields
    for (const program of content.programs) {
      if (!program.title || !program.description || !program.image || 
          !Array.isArray(program.benefits) || !Array.isArray(program.eligibility) || 
          !program.cta || !program.cta.text || !program.cta.link) {
        return NextResponse.json({ success: false, error: 'Invalid program format' }, { status: 400 });
      }
    }
    
    // Define the path to the JSON file
    const filePath = path.join(process.cwd(), 'public', 'data', 'programs-content.json');
    
    // Convert content to JSON string with formatting
    const jsonContent = JSON.stringify(content, null, 2);
    
    // Write the content to the file
    await writeFile(filePath, jsonContent, 'utf8');
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving programs content:', error);
    return NextResponse.json({ success: false, error: 'Failed to save content' }, { status: 500 });
  }
} 