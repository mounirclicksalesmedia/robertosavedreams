import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const content = await request.json();

    // Validate content structure
    if (!content.hero || !content.featuredStory || !content.impactNumbers || !content.stories) {
      return NextResponse.json(
        { success: false, error: 'Invalid content structure' },
        { status: 400 }
      );
    }

    // Validate hero section
    if (!content.hero.title || !content.hero.subtitle || !content.hero.description) {
      return NextResponse.json(
        { success: false, error: 'Invalid hero section' },
        { status: 400 }
      );
    }

    // Validate featured story
    if (
      !content.featuredStory.image ||
      !content.featuredStory.category ||
      !content.featuredStory.title ||
      !content.featuredStory.quote ||
      !content.featuredStory.author ||
      !content.featuredStory.author.name ||
      !content.featuredStory.author.location
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid featured story' },
        { status: 400 }
      );
    }

    // Validate impact numbers
    if (!Array.isArray(content.impactNumbers) || content.impactNumbers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid impact numbers' },
        { status: 400 }
      );
    }

    // Validate stories
    if (!Array.isArray(content.stories) || content.stories.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid stories' },
        { status: 400 }
      );
    }

    // Save the content to the JSON file
    const filePath = join(process.cwd(), 'public', 'data', 'success-stories-content.json');
    await writeFile(filePath, JSON.stringify(content, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save content' },
      { status: 500 }
    );
  }
} 