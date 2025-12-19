# PHIHub - Hướng dẫn kiểm thử (Testing guide)

## Tổng quan

Dự án PHIHub sử dụng các framework kiểm thử hiện đại để đảm bảo chất lượng code:
- **Backend**: Jest + Supertest + MongoDB Memory Server
- **Frontend**: Vitest + React Testing Library

## Cấu trúc tests

### Backend Tests (`src/server/tests/`)
```
tests/
├── setup.js                    # Cấu hình chung cho tests
├── db-handler.js              # Quản lý in-memory database
├── unit/
│   └── models/                # Unit tests cho models
│       ├── user.test.js
│       └── healthMetric.test.js
└── integration/               # Integration tests cho APIs
    ├── auth.test.js
    └── metrics.test.js
```

### Frontend Tests (`src/client/src/tests/`)
```
tests/
├── setup.js                   # Cấu hình chung
├── services/                  # Unit tests cho services
│   ├── authService.test.js
│   └── metricsService.test.js
├── components/                # Component tests
│   └── LoadingSpinner.test.jsx
└── pages/                     # Page tests
    └── LoginPage.test.jsx
```

## Cài đặt dependencies

### Backend
```bash
cd src/server
npm install
```

Dependencies được cài:
- `jest`: Framework kiểm thử
- `supertest`: HTTP assertions
- `mongodb-memory-server`: In-memory MongoDB cho tests
- `@types/jest`: Type definitions

### Frontend
```bash
cd src/client
npm install
```

Dependencies được cài:
- `vitest`: Fast unit test framework
- `@testing-library/react`: React testing utilities
- `@testing-library/jest-dom`: Custom matchers
- `@testing-library/user-event`: User interaction simulation
- `jsdom`: Browser environment simulation
- `@vitest/ui`: UI cho test runner
- `@vitest/coverage-v8`: Code coverage

## Chạy tests

### Backend Tests

```bash
cd src/server

# Chạy tất cả tests
npm test

# Chạy tests với watch mode
npm run test:watch

# Chạy chỉ unit tests
npm run test:unit

# Chạy chỉ integration tests
npm run test:integration

# Xem coverage report
npm test -- --coverage
```

### Frontend Tests

```bash
cd src/client

# Chạy tất cả tests
npm test

# Chạy tests với UI
npm run test:ui

# Chạy tests với coverage
npm run test:coverage

# Watch mode (tự động)
npm test -- --watch
```

## Loại Tests

### 1. Unit Tests

**Backend - Model Tests** (`user.test.js`, `healthMetric.test.js`)
- Kiểm tra validation
- Kiểm tra business logic
- Kiểm tra data transformation
- Kiểm tra password hashing

**Frontend - Service Tests** (`authService.test.js`, `metricsService.test.js`)
- Kiểm tra API calls
- Kiểm tra error handling
- Kiểm tra data transformation
- Mock axios requests

### 2. Integration Tests

**Backend - API Tests** (`auth.test.js`, `metrics.test.js`)
- Kiểm tra endpoints
- Kiểm tra authentication/authorization
- Kiểm tra request/response
- Kiểm tra database operations

**Frontend - Component Tests** (`LoadingSpinner.test.jsx`, `LoginPage.test.jsx`)
- Kiểm tra rendering
- Kiểm tra user interactions
- Kiểm tra form validation
- Kiểm tra navigation

## Ví Dụ Tests

### Backend Unit Test
```javascript
describe('User Model Test', () => {
  it('should create a valid user successfully', async () => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(user._id).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
```

### Backend Integration Test
```javascript
describe('POST /api/auth/login', () => {
  it('should login with correct credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Password123!' })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });
});
```

### Frontend Service Test
```javascript
describe('getMetrics', () => {
  it('should fetch metrics with params', async () => {
    axios.get.mockResolvedValue({ data: { success: true, data: [] } });

    const result = await getMetrics({ metricType: 'weight' });

    expect(axios.get).toHaveBeenCalledWith('/metrics', { 
      params: { metricType: 'weight' } 
    });
  });
});
```

### Frontend Component Test
```javascript
describe('LoginPage', () => {
  it('should submit form with valid credentials', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalled();
    });
  });
});
```

## Coverage Requirements

Mục tiêu coverage cho dự án:

### Backend
- **Branches**: ≥ 70%
- **Functions**: ≥ 70%
- **Lines**: ≥ 70%
- **Statements**: ≥ 70%

### Frontend
- **Branches**: ≥ 70%
- **Functions**: ≥ 70%
- **Lines**: ≥ 70%
- **Statements**: ≥ 70%

## Best Practices

### 1. Test Organization
- Một file test cho mỗi module/component
- Sử dụng `describe` blocks để nhóm tests liên quan
- Đặt tên tests rõ ràng, mô tả behavior

### 2. Test Independence
- Mỗi test phải độc lập
- Sử dụng `beforeEach`/`afterEach` để reset state
- Không phụ thuộc vào thứ tự chạy tests

### 3. Mocking
- Mock external dependencies (API, database)
- Sử dụng in-memory database cho integration tests
- Clear mocks sau mỗi test

### 4. Assertions
- Sử dụng specific matchers (`toBe`, `toEqual`, `toHaveBeenCalled`)
- Kiểm tra cả success và error cases
- Verify side effects (database changes, API calls)

### 5. Coverage
- Tập trung vào business logic quan trọng
- Không cần 100% coverage
- Ưu tiên quality hơn quantity

## Continuous Integration

### Local Development
```bash
# Chạy tất cả tests trước khi commit
cd src/server && npm test
cd src/client && npm test
```

### Pre-commit Hook (khuyến nghị)
```bash
# Thêm vào .git/hooks/pre-commit
#!/bin/sh
cd src/server && npm test
cd src/client && npm test
```

## Troubleshooting

### Backend Tests

**Lỗi: MongoMemoryServer timeout**
```bash
# Tăng timeout trong jest.config.js
testTimeout: 30000
```

**Lỗi: Port already in use**
```bash
# Clear database connections
afterAll(async () => {
  await mongoose.connection.close();
});
```

### Frontend Tests

**Lỗi: Cannot find module**
```bash
# Kiểm tra vitest.config.js
# Đảm bảo paths được resolve đúng
```

**Lỗi: window is not defined**
```bash
# Thêm vào setup.js
global.window = {};
```

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

### Tutorials
- [Testing Node.js Applications](https://nodejs.org/en/docs/guides/testing/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Kết Luận

Hệ thống test đã được thiết lập đầy đủ cho cả backend và frontend:

✅ **Backend**:
- Unit tests cho Models (User, HealthMetric)
- Integration tests cho APIs (Auth, Metrics)
- In-memory database cho testing
- Coverage reporting

✅ **Frontend**:
- Unit tests cho Services (Auth, Metrics)
- Component tests (LoadingSpinner, LoginPage)
- Mock setup cho axios và browser APIs
- UI test runner

**Để bắt đầu testing:**
```bash
# Backend
cd src/server && npm test

# Frontend
cd src/client && npm test
```

Hãy viết tests cho mọi tính năng mới và maintain coverage >= 70%!
