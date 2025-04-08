import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define paths
const dataDir = path.join(process.cwd(), 'data');
const uploadsDir = path.join(process.cwd(), 'public/uploads/grant-applications');
const dataFile = path.join(dataDir, 'grant-applications.json');

// Ensure directories exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ensure data file exists
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, '[]', 'utf8');
}

export async function GET() {
  try {
    // Read data from JSON file
    const fileData = fs.readFileSync(dataFile, 'utf8');
    const applications = JSON.parse(fileData);
    
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching grant applications:', error);
    return NextResponse.json({ error: 'Failed to fetch grant applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const applicationData: any = {};
    const uploadedFiles: { [key: string]: string } = {};
    
    // Process form fields
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const file = value as File;
        
        if (file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const fileName = `${uuidv4()}-${file.name}`;
          const filePath = path.join(uploadsDir, fileName);
          
          fs.writeFileSync(filePath, buffer);
          uploadedFiles[key] = `/uploads/grant-applications/${fileName}`;
        }
      } else {
        applicationData[key] = value;
      }
    }
    
    // Add uploaded files to application data
    applicationData.documents = uploadedFiles;
    
    // Add additional metadata
    applicationData.id = uuidv4();
    applicationData.status = 'pending';
    applicationData.createdAt = new Date().toISOString();
    
    // Read existing applications
    let applications = [];
    if (fs.existsSync(dataFile)) {
      const fileData = fs.readFileSync(dataFile, 'utf8');
      applications = JSON.parse(fileData);
    }
    
    // Add new application
    applications.push(applicationData);
    
    // Write back to file
    fs.writeFileSync(dataFile, JSON.stringify(applications, null, 2), 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Grant application submitted successfully',
      applicationId: applicationData.id 
    });
  } catch (error) {
    console.error('Error submitting grant application:', error);
    return NextResponse.json({ error: 'Failed to submit grant application' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Application ID and status are required' }, { status: 400 });
    }
    
    // Read existing applications
    const fileData = fs.readFileSync(dataFile, 'utf8');
    const applications = JSON.parse(fileData);
    
    // Find and update application
    const applicationIndex = applications.findIndex((app: any) => app.id === id);
    
    if (applicationIndex === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    applications[applicationIndex].status = status;
    applications[applicationIndex].updatedAt = new Date().toISOString();
    
    // Write back to file
    fs.writeFileSync(dataFile, JSON.stringify(applications, null, 2), 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Grant application updated successfully' 
    });
  } catch (error) {
    console.error('Error updating grant application:', error);
    return NextResponse.json({ error: 'Failed to update grant application' }, { status: 500 });
  }
} 