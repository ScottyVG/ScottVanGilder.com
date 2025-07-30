# Code Block Styling Test

This file tests the new code block styling with Tokyo Night theme and copy buttons.

## JavaScript Example

```javascript
function greetUser(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
  return {
    success: true,
    message: message,
    timestamp: new Date().toISOString()
  };
}

// Call the function
const result = greetUser("Scott");
```

## TypeScript Example

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];

  addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      id: this.users.length + 1,
      ...user
    };
    this.users.push(newUser);
    return newUser;
  }

  findUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}
```

## Bash/Shell Example

```bash
#!/bin/bash

# CDK deployment script
echo "Starting CDK deployment..."

# Install dependencies
npm install

# Build the project
npm run build

# Deploy infrastructure
cd infrastructure
cdk diff
cdk deploy --require-approval never

echo "Deployment complete!"
```

## JSON Example

```json
{
  "name": "scott-van-gilder-website",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "npm run sync-blog && next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.2.30",
    "react": "^18.3.1",
    "rehype-highlight": "^7.0.0"
  }
}
```

## Expected Styling

### Dark Mode (Tokyo Night)
- Background: Dark blue-gray (#1a1b26)
- Text: Light blue-gray (#a9b1d6)
- Keywords: Purple (#bb9af7)
- Strings: Green (#9ece6a)
- Numbers: Orange (#ff9e64)
- Comments: Muted gray (#565f89)

### Light Mode (GitHub Style)
- Background: Light gray (#f8f9fa)
- Text: Dark gray (#24292e)
- Keywords: Red (#d73a49)
- Strings: Dark blue (#032f62)
- Numbers: Blue (#005cc5)
- Comments: Gray (#6a737d)

### Copy Button
- Appears on hover in top-right corner
- Dark mode: Gray background with light text
- Light mode: Light gray background with dark text
- Shows checkmark when copied successfully