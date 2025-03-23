import { NextResponse } from 'next/server';
import * as fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Path to the JSON file
const dataFilePath = path.join(process.cwd(), 'app/data/success-stories.json');

// GET handler to retrieve the JSON data
export async function GET() {
  try {
    // Check if the file exists
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json(
        { error: 'Success Stories data file not found' },
        { status: 404 }
      );
    }

    // Read the file
    const fileContents = await fsPromises.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading success-stories data:', error);
    return NextResponse.json(
      { error: 'Failed to read success-stories data' },
      { status: 500 }
    );
  }
}

// POST handler to update the JSON data
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate data structure
    if (!data.hero || !data.featuredStory || !Array.isArray(data.stories)) {
      return NextResponse.json(
        { error: 'Invalid data structure' },
        { status: 400 }
      );
    }

    // Create directory if it doesn't exist
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      await fsPromises.mkdir(dir, { recursive: true });
    }

    // Write the updated data to the file
    await fsPromises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating success-stories data:', error);
    return NextResponse.json(
      { error: 'Failed to update success-stories data' },
      { status: 500 }
    );
  }
} 