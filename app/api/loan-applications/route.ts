import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Path to store applications data
const dataDir = path.join(process.cwd(), 'data');
const applicationsFilePath = path.join(dataDir, 'loan-applications.json');

// Initialize data directory and file if they don't exist
try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(applicationsFilePath)) {
    fs.writeFileSync(applicationsFilePath, JSON.stringify([
      // Initial example data
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        dateOfBirth: '1985-06-15',
        employmentStatus: 'employed',
        monthlyIncome: '5000',
        loanPurpose: 'business',
        businessDescription: 'Small retail shop',
        loanAmount: 10000,
        loanTerm: 24,
        interestRate: 5.5,
        monthlyPayment: 440.42,
        totalRepayment: 10570.08,
        status: 'Pending',
        createdAt: '2023-05-10T14:30:00Z',
        updatedAt: '2023-05-10T14:30:00Z',
        applicantType: 'Entrepreneurs',
        documents: {
          businessPlan: '/uploads/loan-applications/example/business-plan.pdf',
          registration: '/uploads/loan-applications/example/registration.pdf',
          identification: '/uploads/loan-applications/example/id.pdf',
          financialStatements: '/uploads/loan-applications/example/financials.pdf',
          proofOfIncome: '/uploads/loan-applications/example/income.pdf'
        }
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '555-987-6543',
        address: '456 Oak Ave',
        city: 'Metropolis',
        state: 'NY',
        zipCode: '10001',
        dateOfBirth: '1990-03-22',
        employmentStatus: 'self-employed',
        monthlyIncome: '7000',
        loanPurpose: 'education',
        businessDescription: '',
        loanAmount: 15000,
        loanTerm: 36,
        interestRate: 4.5,
        monthlyPayment: 447.45,
        totalRepayment: 16108.20,
        status: 'Approved',
        createdAt: '2023-05-05T09:15:00Z',
        updatedAt: '2023-05-07T10:30:00Z',
        applicantType: 'Students',
        documents: {
          identification: '/uploads/loan-applications/example/id2.pdf',
          financialStatements: '/uploads/loan-applications/example/financials2.pdf',
          proofOfIncome: '/uploads/loan-applications/example/income2.pdf',
          proofOfEnrollment: '/uploads/loan-applications/example/enrollment.pdf'
        }
      }
    ], null, 2));
  }
} catch (error) {
  console.error('Error initializing data storage:', error);
}

// Helper function to read applications
function getApplications() {
  try {
    const data = fs.readFileSync(applicationsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading applications data:', error);
    return [];
  }
}

// Helper function to save applications
function saveApplications(applications: any[]) {
  try {
    fs.writeFileSync(applicationsFilePath, JSON.stringify(applications, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving applications data:', error);
    return false;
  }
}

// POST endpoint to create a new loan application
export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Generate a unique ID for the application
    const applicationId = uuidv4();
    
    // Extract form fields
    const applicationData: Record<string, any> = {};
    
    // First, handle all text fields
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        applicationData[key] = value;
      }
    }
    
    // Handle file uploads to public directory
    const documentUrls: { [key: string]: string } = {};
    
    // List of expected document keys
    const documentKeys = [
      'businessPlan',
      'registration',
      'identification',
      'financialStatements',
      'proofOfIncome',
      'proofOfLandOwnership',
      'proofOfEnrollment',
      'proofOfEmployment'
    ];
    
    // Create directory for this application if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'loan-applications', applicationId);
    
    try {
      // Create directory structure if it doesn't exist
      fs.mkdirSync(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
    }
    
    // Process each potential file upload
    for (const key of documentKeys) {
      const file = formData.get(key) as File;
      
      if (file && file instanceof File) {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${key}.${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);
        
        // Convert file to array buffer and save locally
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Write file to disk
        fs.writeFileSync(filePath, buffer);
        
        // Generate URL for the file (relative to /public)
        const fileUrl = `/uploads/loan-applications/${applicationId}/${fileName}`;
        documentUrls[key] = fileUrl;
      }
    }
    
    // Add document URLs to application data
    applicationData.documents = documentUrls;
    applicationData.id = applicationId;
    applicationData.createdAt = new Date().toISOString();
    applicationData.updatedAt = new Date().toISOString();
    applicationData.status = 'Pending';
    
    // Save the application to our JSON file
    const applications = getApplications();
    applications.push(applicationData);
    saveApplications(applications);
    
    console.log('Loan application received and saved:', applicationData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: applicationId
    });
    
  } catch (error) {
    console.error('Error processing loan application:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to process application'
    }, { status: 500 });
  }
}

// GET endpoint to retrieve all loan applications
export async function GET() {
  const applications = getApplications();
  return NextResponse.json(applications);
}

// PUT endpoint to update an application status
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: id and status'
      }, { status: 400 });
    }
    
    const applications = getApplications();
    const applicationIndex = applications.findIndex((app: any) => app.id === id);
    
    if (applicationIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        message: 'Application not found'
      }, { status: 404 });
    }
    
    // Update the status and updatedAt time
    applications[applicationIndex].status = status;
    applications[applicationIndex].updatedAt = new Date().toISOString();
    
    // Save the updated applications
    const success = saveApplications(applications);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Application status updated successfully'
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to update application status'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update application status'
    }, { status: 500 });
  }
} 