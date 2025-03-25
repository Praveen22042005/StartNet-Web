# Contributing to StartNet-Web

First off, thank you for considering contributing to StartNet-Web! It's people like you that make it such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Project Structure

```
StartNet-Web/
├── backend/           # Node.js/Express backend
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Database models
│   └── routes/       # API routes
└── frontend/         # React frontend (Coming Soon)
```

## Development Setup

### Prerequisites

- Node.js (v16+)
- MongoDB
- Azure Storage Account
- Git

### Backend Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/StartNet-Web.git
   ```
3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/original-owner/StartNet-Web.git
   ```
4. Install dependencies:
   ```bash
   cd StartNet-Web/backend
   npm install
   ```
5. Create a `.env` file based on `.env.example`
6. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup (Coming Soon)

The frontend implementation is currently in development. Watch this space for updates!

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript Style Guide

#### Backend
- Use 2 spaces for indentation
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPERCASE for constants
- Add JSDoc comments for functions and classes
- Implement proper error handling
- Follow the established response format:
  ```javascript
  {
    status: 'success' | 'error',
    message: 'Description message',
    code: 'ERROR_CODE',
    data: {} // Optional response data
  }
  ```

#### File Upload Guidelines
- Maximum file size: 2MB
- Supported formats: JPG, JPEG, PNG
- Use proper validation middleware
- Implement Azure Storage for production

## Testing (Coming Soon)

- Unit tests using Jest
- Integration tests for API endpoints
- Frontend testing with React Testing Library

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.