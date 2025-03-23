import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create a buffer from the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Ensure the gallery directory exists
    const galleryDir = join(process.cwd(), 'public', 'images', 'gallery');
    if (!existsSync(galleryDir)) {
      await mkdir(galleryDir, { recursive: true });
    }
    
    // Generate a unique filename
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const timestamp = Date.now();
    const filename = `uploaded-${timestamp}.${extension}`;
    
    // Save the file
    const filePath = join(galleryDir, filename);
    await writeFile(filePath, buffer);
    
    // Return the path to be used in the image src
    const imagePath = `/images/gallery/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      path: imagePath 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 