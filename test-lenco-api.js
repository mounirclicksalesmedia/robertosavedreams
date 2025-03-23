// Test script for Lenco API endpoints
const fetch = require('node-fetch');

// Lenco API credentials
const LENCO_BASE_URL = 'https://api.lenco.co';
const LENCO_SECRET_KEY = '861945cc1a41ce0c48cf7755058cd49c72e30538d15ba338184638880221bdeb';
const LENCO_API_KEY = 'pub-8610c85908dfae3c88fea280d7936f7bd3755238d902bc34';

// Test payment data
const testPaymentData = {
  amount: 5000,
  currency: 'NGN',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  phone: '1234567890',
  reference: `test_payment_${Date.now()}`,
  callback_url: 'http://localhost:3000/donate/success',
  metadata: {
    donationFrequency: 'one-time',
    originalAmount: 50
  }
};

// Array of endpoints to test with the correct base URL
const endpointsToTest = [
  { 
    endpoint: '/api-access/v2/payments/initialize', 
    method: 'POST',
    description: 'Initialize payment endpoint'
  },
  { 
    endpoint: '/api-access/v2/payments', 
    method: 'POST',
    description: 'Create payment endpoint'
  },
  { 
    endpoint: '/api-access/v2/payments/initialize', 
    method: 'GET',
    description: 'Initialize payment endpoint (GET method)'
  },
  { 
    endpoint: '/access/v2/payments/initialize', 
    method: 'POST',
    description: 'Initialize payment (alternative path)'
  }
];

// Function to test each endpoint configuration
async function testEndpoint(config) {
  try {
    const fullUrl = `${LENCO_BASE_URL}${config.endpoint}`;
    console.log(`\nTesting: ${fullUrl} with ${config.method} (${config.description})`);
    
    const fetchOptions = {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LENCO_SECRET_KEY}`,
        'x-api-key': LENCO_API_KEY
      }
    };
    
    // Only add body for POST requests
    if (config.method === 'POST') {
      fetchOptions.body = JSON.stringify(testPaymentData);
    }
    
    const response = await fetch(fullUrl, fetchOptions);
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    // Try to get JSON response if possible
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log('Response text (first 200 chars):', text.substring(0, 200) + '...');
    }
    
    return {
      config,
      status: response.status,
      success: response.ok
    };
  } catch (error) {
    console.error(`Error testing ${LENCO_BASE_URL}${config.endpoint}:`, error.message);
    return {
      config,
      status: 'Error',
      success: false,
      error: error.message
    };
  }
}

// Run tests sequentially
async function runTests() {
  console.log('Starting Lenco API endpoint tests...');
  console.log('Using Lenco Base URL:', LENCO_BASE_URL);
  console.log('Test payment reference:', testPaymentData.reference);
  
  const results = [];
  
  for (const config of endpointsToTest) {
    const result = await testEndpoint(config);
    results.push(result);
  }
  
  console.log('\n--- SUMMARY OF RESULTS ---');
  results.forEach(result => {
    console.log(`${LENCO_BASE_URL}${result.config.endpoint} (${result.config.method}): ${result.status} - ${result.success ? 'SUCCESS' : 'FAILED'}`);
  });
  
  const successfulTests = results.filter(r => r.success);
  if (successfulTests.length > 0) {
    console.log('\n✅ WORKING ENDPOINTS:');
    successfulTests.forEach(result => {
      console.log(`${LENCO_BASE_URL}${result.config.endpoint} (${result.config.method}) - ${result.config.description}`);
    });
  } else {
    console.log('\n❌ No successful endpoints found. This could mean:');
    console.log('  1. The API credentials are incorrect or expired');
    console.log('  2. The API endpoint structure has changed');
    console.log('  3. There are additional requirements for authentication');
    console.log('  4. IP restrictions or other security measures are in place');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Test script failed:', error);
}); 