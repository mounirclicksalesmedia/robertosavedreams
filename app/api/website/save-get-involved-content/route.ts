import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const content = await request.json();

    // Validate content structure
    if (!content.hero || !content.partnerSection || !content.ambassadorSection || !content.fundraisingSection) {
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

    // Validate partner section
    if (
      !content.partnerSection.title ||
      !Array.isArray(content.partnerSection.description) ||
      !Array.isArray(content.partnerSection.partnershipTypes) ||
      !Array.isArray(content.partnerSection.benefits)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid partner section' },
        { status: 400 }
      );
    }

    // Validate ambassador section
    if (
      !content.ambassadorSection.title ||
      !content.ambassadorSection.description ||
      !Array.isArray(content.ambassadorSection.roles) ||
      !Array.isArray(content.ambassadorSection.requirements)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid ambassador section' },
        { status: 400 }
      );
    }

    // Validate fundraising section
    if (!content.fundraisingSection.title || !content.fundraisingSection.description) {
      return NextResponse.json(
        { success: false, error: 'Invalid fundraising section' },
        { status: 400 }
      );
    }

    // Save the content to the JSON file
    const filePath = join(process.cwd(), 'public', 'data', 'get-involved-content.json');
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