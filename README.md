# HUMMUS

Hummus is a popular Middle Eastern dish that is made from ground chickpeas and a variety of spices and flavors. It suggests a mix of different elements working together to create a cohesive whole.

## About

```
.github
  └─ workflows
        └─ CI
.vscode
  └─ Recommended extensions and settings for VSCode users
packages
  ├─ manager
  |   └─ Web-based client for managing specifications
  ├─ runner
  |   └─ CLI client for executing specifications
  ├─ api
  |   └─ Facilitates the exchange of data between clients and the database
  ├─ db
  |   └─ Database schema and configuration for storing specifications
  └─ demo
      └─ An example todo app demonstrating the setup for executing specification via runner
```

## Quick Start

To get it running, follow the steps below:

### 1. Setup Node.js

Have at least Node v16+ installed.

```diff
# In case you don't have yarn installed, install it via npm
npm install -g yarn
# Using npm as package manager for this project might not work
```

### 2. Setup dependencies

```diff
# Install dependencies in the root directory
yarn

# In packages/db/prisma update schema.prisma provider to use sqlite
- provider = "mysql"
+ provider = "sqlite"

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the database schema to your database
yarn db:push

# Populate the database with seed data
yarn db:seed


```

### 3. Start everything locally

```diff
yarn dev
```

### When using Planetscale

```diff
# Authenticate using Planetscale CLI client
pscale auth login

# List databases
pscale branch list <database>

# Start Planetscale proxy
pscale connect <database> <branch> --port 3309

# Setup .env, to use the Planetscale proxy
+ DATABASE_URL = "mysql://127.0.0.1:3309/<database>"

# Push the Prisma schema to your database
yarn db:push
```
