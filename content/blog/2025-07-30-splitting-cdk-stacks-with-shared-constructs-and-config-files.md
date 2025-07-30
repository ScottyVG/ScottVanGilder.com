---
title: "Splitting CDK Stacks with Shared Constructs and Config Files: From Monolith to Modular"
excerpt: "After growing frustrated with bloated stacks and hardcoded values in my AWS CDK projects, I decided to refactor everything. What followed was a practical journey into stack modularization, reusability, and configuration management that fundamentally changed how I approach CDK design."
date: "2025-07-30"
readTime: "8 min read"
tags: ["AWS", "CDK", "Infrastructure as Code", "DevOps", "Architecture", "TypeScript"]
author: "Scott Van Gilder"
---

## From Monolithic Stacks to Modular Architecture

When you first dive into AWS CDK, there's a seductive simplicity to throwing everything into a single stack. One file, one deployment, one place to look—what could go wrong? But as your infrastructure grows beyond a handful of resources, that monolithic approach becomes a maintenance nightmare. Resource dependencies tangle together, deployments slow to a crawl, and testing individual components becomes nearly impossible.

I learned this lesson the hard way after watching my CDK projects evolve from elegant proof-of-concepts into unwieldy beasts that nobody wanted to touch. The breaking point came when a simple Lambda function update required redeploying an entire stack with dozens of unrelated resources. That's when I decided to completely rethink my approach to CDK architecture.

## The Problems with Monolithic CDK Stacks

Before diving into solutions, let's acknowledge what makes monolithic stacks so problematic:

**Deployment Risk**: Every change, no matter how small, affects the entire stack. A typo in one resource can bring down unrelated services.

**Testing Complexity**: Unit testing becomes nearly impossible when everything is interconnected. You can't test your DynamoDB table logic without also spinning up your API Gateway, Lambda functions, and IAM roles.

**Team Collaboration**: Multiple developers working on the same monolithic stack leads to constant merge conflicts and coordination headaches.

**Environment Management**: Hardcoded values scattered throughout your stack make it painful to deploy across different environments or regions.

The solution? Break everything apart into purpose-driven stacks and reusable constructs, then tie it all together with configuration files.

## Building Reusable Constructs

The first step in my refactoring journey was identifying the "atomic" infrastructure units in my applications. These are the building blocks that appear repeatedly across projects—things like a Lambda function with its IAM role and CloudWatch log group, or a DynamoDB table with its associated indexes and streams.

Each of these units became a custom construct in a dedicated `/lib/constructs/` directory. Here's a simple example of a DynamoDB table construct:

```typescript
// lib/constructs/dynamo-table.ts
import { Construct } from 'constructs';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface DynamoTableProps {
  tableName: string;
  enablePointInTimeRecovery?: boolean;
  removalPolicy?: RemovalPolicy;
}

export class DynamoTable extends Construct {
  public readonly table: Table;

  constructor(scope: Construct, id: string, props: DynamoTableProps) {
    super(scope, id);

    this.table = new Table(this, 'Table', {
      tableName: props.tableName,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      pointInTimeRecovery: props.enablePointInTimeRecovery ?? true,
      removalPolicy: props.removalPolicy ?? RemovalPolicy.RETAIN,
    });
  }
}
```

The beauty of this approach is reusability. Instead of copy-pasting DynamoDB table definitions across multiple stacks, I can now instantiate this construct anywhere with consistent defaults and customizable options.

## Configuration-Driven Architecture

Hardcoded values are the enemy of maintainable infrastructure. To solve this, I created environment-specific configuration files using TypeScript modules that export typed values:

```typescript
// config/database-config.ts
export interface DatabaseConfig {
  tableName: string;
  enableBackups: boolean;
  ttlEnabled: boolean;
}

export const databaseConfig: Record<string, DatabaseConfig> = {
  dev: {
    tableName: 'my-app-dev-table',
    enableBackups: false,
    ttlEnabled: true,
  },
  staging: {
    tableName: 'my-app-staging-table',
    enableBackups: true,
    ttlEnabled: true,
  },
  prod: {
    tableName: 'my-app-prod-table',
    enableBackups: true,
    ttlEnabled: false,
  },
};
```

These configuration files live in a `/config/` directory and get imported into stacks as needed. The environment is determined dynamically using CDK context (`this.node.tryGetContext('stage')`), making deployments environment-aware without hardcoding anything.

## Purpose-Driven Stack Architecture

With reusable constructs and configuration in place, I could finally split my monolithic stacks into focused, single-purpose units. Each stack in `/lib/stacks/` serves a specific function:

```typescript
// lib/stacks/database-stack.ts
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoTable } from '../constructs/dynamo-table';
import { databaseConfig } from '../../config/database-config';

export class DatabaseStack extends Stack {
  public readonly table: Table;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const stage = this.node.tryGetContext('stage') || 'dev';
    const config = databaseConfig[stage];

    const dynamoConstruct = new DynamoTable(this, 'AppTable', {
      tableName: config.tableName,
      enablePointInTimeRecovery: config.enableBackups,
    });

    this.table = dynamoConstruct.table;
  }
}
```

This approach provides several key benefits:

- **Independent Deployments**: I can deploy just the database stack without touching API or frontend resources
- **Clear Boundaries**: Each stack has a well-defined responsibility
- **Easier Testing**: Unit tests can focus on individual stack logic
- **Better Collaboration**: Team members can work on different stacks without conflicts

## Orchestrating the Application

The final piece ties everything together in the main application file:

```typescript
// bin/app.ts
import { App } from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/stacks/database-stack';
import { ApiStack } from '../lib/stacks/api-stack';
import { FrontendStack } from '../lib/stacks/frontend-stack';

const app = new App();
const stage = app.node.tryGetContext('stage') || 'dev';
const region = app.node.tryGetContext('region') || 'us-east-1';

const env = { region };

// Deploy stacks with dependencies
const databaseStack = new DatabaseStack(app, `Database-${stage}`, { env });

const apiStack = new ApiStack(app, `Api-${stage}`, {
  env,
  table: databaseStack.table, // Pass resources between stacks
});

new FrontendStack(app, `Frontend-${stage}`, {
  env,
  apiUrl: apiStack.apiUrl,
});
```

Now I can deploy specific stacks individually:

```bash
# Deploy just the database
cdk deploy Database-dev

# Deploy everything
cdk deploy --all

# Deploy with a specific stage
cdk deploy --all --context stage=prod
```

## Lessons Learned

This refactoring taught me several important principles:

**Single Responsibility**: Each construct and stack should have one clear purpose. When a construct starts doing multiple things, it's time to split it up.

**Configuration Centralization**: Keep environment-specific values in typed configuration files, not scattered throughout your code. This makes deployments predictable and reduces errors.

**Consistent Naming**: Establish naming conventions early and stick to them. Appending `${stage}` to stack names prevents resource collisions across environments.

**Incremental Deployment**: The ability to deploy individual stacks is a game-changer for development velocity and risk management.

## Project Structure

Here's how the modular CDK project structure looks in practice:

```
my-cdk-app/
├── bin/
│   └── app.ts                    # Main application entry point
├── lib/
│   ├── constructs/               # Reusable infrastructure components
│   │   ├── dynamo-table.ts
│   │   ├── lambda-function.ts
│   │   ├── api-gateway.ts
│   │   └── s3-bucket.ts
│   └── stacks/                   # Purpose-driven stacks
│       ├── database-stack.ts
│       ├── api-stack.ts
│       ├── frontend-stack.ts
│       └── monitoring-stack.ts
├── config/                       # Environment configurations
│   ├── database-config.ts
│   ├── api-config.ts
│   └── frontend-config.ts
├── test/                         # Unit and integration tests
│   ├── constructs/
│   └── stacks/
├── cdk.json                      # CDK configuration
├── package.json
└── tsconfig.json
```

This structure makes it immediately clear where everything belongs and how the pieces fit together.

## Future Improvements

While this architecture has served me well, there are always opportunities for enhancement:

- **Automated Testing**: Implementing comprehensive unit and integration tests for constructs
- **Dynamic Configuration**: Supporting YAML or JSON configuration files for non-TypeScript users
- **Cross-Stack Dependencies**: Better handling of resource sharing between stacks using CDK's built-in export/import mechanisms
- **Configuration Validation**: Adding runtime checks to ensure configuration values are valid before deployment

## The Transformation

Moving from monolithic to modular CDK architecture was one of the best decisions I've made for long-term maintainability. The initial refactoring effort was significant, but the payoff has been enormous. New team members can understand and contribute to individual stacks without grasping the entire system. Deployments are faster and safer. Testing is actually possible.

Most importantly, the architecture scales with complexity instead of fighting against it. Whether you're working solo or with a team, taking the time to properly structure your CDK applications will pay dividends as your infrastructure grows.

The key is starting with the end in mind: build for the system you'll have in six months, not the one you have today.