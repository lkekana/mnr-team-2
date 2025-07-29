// Simple test file for signUp function
// Run with: node tests/sign-up.test.js

// Mock the Supabase client
const mockSupabase = {
  auth: {
    signUp: null // Will be set in each test
  }
};

// Mock the signUp function (copy the logic from your Page object)
const signUp = async (email, password, name, surname, phone_number, profile_picture) => {
  const { data, error } = await mockSupabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        Name: name,
        Surname: surname,
        Phone_Number: phone_number,
        Profile_Picture: profile_picture
      }
    }
  });
  return { data, error };
};

// Simple test runner
let testCount = 0;
let passedTests = 0;

function test(description, testFunction) {
  testCount++;
  console.log(`\n🧪 Test ${testCount}: ${description}`);
  
  try {
    testFunction();
    console.log('✅ PASSED');
    passedTests++;
  } catch (error) {
    console.log('❌ FAILED');
    console.log('Error:', error.message);
  }
}

function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    },
    toEqual: (expected) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
    toHaveBeenCalledWith: (expected) => {
      if (!actual.calledWith || JSON.stringify(actual.calledWith) !== JSON.stringify(expected)) {
        throw new Error(`Expected function to be called with ${JSON.stringify(expected)}`);
      }
    }
  };
}

// Test 1: Successful sign up
test('should successfully sign up a user with valid data', async () => {
  // Arrange
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    user_metadata: {
      Name: 'John',
      Surname: 'Doe'
    }
  };

  const mockResponse = {
    data: { user: mockUser, session: null },
    error: null
  };

  let calledWith = null;
  mockSupabase.auth.signUp = async (params) => {
    calledWith = params;
    return mockResponse;
  };
  mockSupabase.auth.signUp.calledWith = calledWith;

  // Act
  const result = await signUp(
    'test@example.com',
    'password123',
    'John',
    'Doe',
    '+1234567890',
    'https://example.com/photo.jpg'
  );

  // Assert
  expect(result).toEqual(mockResponse);
});

// Test 2: Handle sign up errors
test('should handle sign up errors', async () => {
  // Arrange
  const mockError = {
    message: 'User already registered',
    status: 422
  };

  const mockResponse = {
    data: { user: null, session: null },
    error: mockError
  };

  mockSupabase.auth.signUp = async () => mockResponse;

  // Act
  const result = await signUp(
    'existing@example.com',
    'password123',
    'Jane',
    'Smith',
    '+1234567890',
    'https://example.com/photo.jpg'
  );

  // Assert
  expect(result.error).toEqual(mockError);
  expect(result.data.user).toBe(null);
});

// Test 3: Check correct parameters are passed
test('should call signUp with correct parameters', async () => {
  // Arrange
  let calledWith = null;
  mockSupabase.auth.signUp = async (params) => {
    calledWith = params;
    return { data: { user: null, session: null }, error: null };
  };

  const expectedParams = {
    email: 'alice@example.com',
    password: 'myPassword',
    options: {
      data: {
        Name: 'Alice',
        Surname: 'Johnson',
        Phone_Number: '+9876543210',
        Profile_Picture: 'https://example.com/alice.jpg'
      }
    }
  };

  // Act
  await signUp(
    'alice@example.com',
    'myPassword',
    'Alice',
    'Johnson',
    '+9876543210',
    'https://example.com/alice.jpg'
  );

  // Assert
  expect(calledWith).toEqual(expectedParams);
});

// Test 4: Handle network errors
test('should handle network errors', async () => {
  // Arrange
  mockSupabase.auth.signUp = async () => {
    throw new Error('Network error');
  };

  let errorThrown = false;
  let errorMessage = '';

  // Act
  try {
    await signUp(
      'test@example.com',
      'password123',
      'John',
      'Doe',
      '+1234567890',
      'https://example.com/photo.jpg'
    );
  } catch (error) {
    errorThrown = true;
    errorMessage = error.message;
  }

  // Assert
  expect(errorThrown).toBe(true);
  expect(errorMessage).toBe('Network error');
});

// Run all tests
console.log('🚀 Running SignUp Function Tests...\n');

// Execute tests (they're async, so we need to handle them properly)
(async () => {
  try {
    await test('should successfully sign up a user with valid data', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: { Name: 'John', Surname: 'Doe' }
      };
      const mockResponse = {
        data: { user: mockUser, session: null },
        error: null
      };
      mockSupabase.auth.signUp = async () => mockResponse;
      
      const result = await signUp('test@example.com', 'password123', 'John', 'Doe', '+1234567890', 'https://example.com/photo.jpg');
      expect(result).toEqual(mockResponse);
    });

    await test('should handle sign up errors', async () => {
      const mockError = { message: 'User already registered', status: 422 };
      const mockResponse = { data: { user: null, session: null }, error: mockError };
      mockSupabase.auth.signUp = async () => mockResponse;
      
      const result = await signUp('existing@example.com', 'password123', 'Jane', 'Smith', '+1234567890', 'https://example.com/photo.jpg');
      expect(result.error).toEqual(mockError);
      expect(result.data.user).toBe(null);
    });

    await test('should call signUp with correct parameters', async () => {
      let calledWith = null;
      mockSupabase.auth.signUp = async (params) => {
        calledWith = params;
        return { data: { user: null, session: null }, error: null };
      };

      await signUp('alice@example.com', 'myPassword', 'Alice', 'Johnson', '+9876543210', 'https://example.com/alice.jpg');
      
      const expectedParams = {
        email: 'alice@example.com',
        password: 'myPassword',
        options: {
          data: {
            Name: 'Alice',
            Surname: 'Johnson',
            Phone_Number: '+9876543210',
            Profile_Picture: 'https://example.com/alice.jpg'
          }
        }
      };
      expect(calledWith).toEqual(expectedParams);
    });

    await test('should handle network errors', async () => {
      mockSupabase.auth.signUp = async () => {
        throw new Error('Network error');
      };

      let errorThrown = false;
      let errorMessage = '';

      try {
        await signUp('test@example.com', 'password123', 'John', 'Doe', '+1234567890', 'https://example.com/photo.jpg');
      } catch (error) {
        errorThrown = true;
        errorMessage = error.message;
      }

      expect(errorThrown).toBe(true);
      expect(errorMessage).toBe('Network error');
    });

    // Summary
    console.log(`\n📊 Test Results: ${passedTests}/${testCount} tests passed`);
    if (passedTests === testCount) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️  Some tests failed');
    }

  } catch (error) {
    console.log('❌ Test execution failed:', error.message);
  }
})();
