import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define constants - match the ones in create-order
const PESAPAL_CONSUMER_KEY = 'qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW';
const PESAPAL_CONSUMER_SECRET = 'osGQ364R49cXKeOYSpaOnT++rHs=';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Use the correct base URLs for sandbox (testing) and production environments
const PESAPAL_API_URL = IS_PRODUCTION 
  ? 'https://pay.pesapal.com/pesapalv3/api'
  : 'https://cybqa.pesapal.com/pesapalv3/api';

// Define data directory for saving transactions
const dataDir = path.join(process.cwd(), 'data');
const transactionsFile = path.join(dataDir, 'pesapal-transactions.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure transactions file exists
if (!fs.existsSync(transactionsFile)) {
  fs.writeFileSync(transactionsFile, '[]', 'utf8');
}

// Function to log IPN notifications for debugging
const logIpnNotification = async (data: any) => {
  try {
    // Create logs directory if it doesn't exist
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Write to log file
    const logFile = path.join(logDir, 'pesapal-ipn.log');
    const logData = JSON.stringify({
      timestamp: new Date().toISOString(),
      data
    }, null, 2);
    
    fs.appendFileSync(logFile, logData + '\n---\n');
  } catch (error) {
    console.error('Error logging IPN notification:', error);
  }
};

// Handle GET requests from PesaPal IPN
export async function GET(request: Request) {
  try {
    // Extract query parameters 
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    
    console.log('Received PesaPal IPN notification:', params);
    await logIpnNotification(params);
    
    // Process the notification (update order status, etc.)
    // This will depend on your application requirements
    
    // Return a successful response to PesaPal
    return NextResponse.json({ 
      success: true, 
      message: 'IPN notification received' 
    });
  } catch (error) {
    console.error('Error processing PesaPal IPN notification:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Handle POST requests from PesaPal IPN
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    console.log('Received PesaPal IPN notification (POST):', body);
    await logIpnNotification(body);
    
    // Process the notification (update order status, etc.)
    // This will depend on your application requirements
    
    // Return a successful response to PesaPal
    return NextResponse.json({ 
      success: true, 
      message: 'IPN notification received' 
    });
  } catch (error) {
    console.error('Error processing PesaPal IPN notification:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 