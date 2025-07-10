/**
 * Simple API testing script for Node.js Docker app
 * Run this after starting the server to test all endpoints
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Test all endpoints
async function runTests() {
  console.log('🧪 Starting API Tests for Node.js Docker App\n');
  
  const tests = [
    { name: 'Root endpoint', path: '/' },
    { name: 'Health check', path: '/health' },
    { name: 'All users', path: '/api/users' },
    { name: 'Users with role filter', path: '/api/users?role=admin' },
    { name: 'Users with limit', path: '/api/users?limit=2' },
    { name: 'Single user', path: '/api/users/1' },
    { name: 'Non-existent user', path: '/api/users/999' },
    { name: 'All posts', path: '/api/posts' },
    { name: 'Posts by user', path: '/api/posts?userId=1' },
    { name: 'Single post', path: '/api/posts/1' },
    { name: 'Application stats', path: '/api/stats' }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`📡 Testing: ${test.name}`);
      console.log(`   URL: ${BASE_URL}${test.path}`);
      
      const result = await makeRequest(test.path);
      
      if (result.status >= 200 && result.status < 300) {
        console.log(`   ✅ Status: ${result.status}`);
        
        // Show some response data
        if (typeof result.data === 'object') {
          if (result.data.data && Array.isArray(result.data.data)) {
            console.log(`   📊 Records: ${result.data.data.length}`);
          } else if (result.data.message) {
            console.log(`   💬 Message: ${result.data.message}`);
          }
        }
        passed++;
      } else {
        console.log(`   ❌ Status: ${result.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`   💥 Error: ${error.message}`);
      failed++;
    }
    
    console.log(''); // Empty line for readability
  }

  // Summary
  console.log('📋 Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Total: ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the server logs for details.');
  }
}

// Performance test
async function performanceTest() {
  console.log('\n⚡ Performance Test - Making 10 concurrent requests to /api/users');
  
  const startTime = Date.now();
  const promises = [];
  
  for (let i = 0; i < 10; i++) {
    promises.push(makeRequest('/api/users'));
  }
  
  try {
    await Promise.all(promises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`   ⏱️  Total time: ${totalTime}ms`);
    console.log(`   📈 Average per request: ${(totalTime / 10).toFixed(2)}ms`);
    console.log(`   🚀 Requests per second: ${(10000 / totalTime).toFixed(2)}`);
  } catch (error) {
    console.log(`   💥 Performance test failed: ${error.message}`);
  }
}

// Main execution
if (require.main === module) {
  console.log('🚀 Node.js API Test Suite');
  console.log('Make sure your server is running on port 3000\n');
  
  setTimeout(async () => {
    try {
      await runTests();
      await performanceTest();
    } catch (error) {
      console.error('Test suite failed:', error);
    }
  }, 1000); // Wait a second to ensure server is ready
}

module.exports = { makeRequest, runTests, performanceTest }; 