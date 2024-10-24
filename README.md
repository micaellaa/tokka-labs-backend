# Backend Service for Uniswap V3 Tracker

## Overview
This backend service is part of the Tokka Labs Engineering Challenge. It tracks transactions in the Uniswap V3 WETH-USDC pool and calculates the transaction fee in USDT.

## Features
- Fetches transaction details by hash
- Supports fetching historical transactions
- Calculates transaction fees in ETH and USDT
- Provides RESTful endpoints for frontend integration

## Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a .env file in the root directory with the following variables:

```
POOL_ADDRESS="0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640"

# ETHERSCAN
ETHERSCAN_API_KEY=<enter_your_etherscan_api_key_here>
ETHERSCAN_URL="https://api.etherscan.io"

# INFURA
INFURA_API_KEY=<enter_your_infura_api_key_here>
INFURA_API_KEY_SECRET=<enter_your_infura_api_key_secret_here>

# PORT
PORT=3333
```

### 4. Run the backend locally
```bash
npm start
```

## Testing
### 1. Run Unit Tests
```bash
npm test
```

## Architectural Principles

This backend is designed using several key architectural principles to ensure maintainability, scalability, and clean code structure:

### 1. Separation of Concerns (SoC)
   - The backend is organized to separate **controllers**, **routes**, **services**, and **utilities** into distinct directories.
   - Each component is responsible for a specific part of the application:
     - **Controllers**: Handle incoming HTTP requests and delegate logic to the services.
     - **Routes**: Define API endpoints and connect them to controllers.
     - **Services**: Contain the core business logic and handle interactions with external APIs or databases.
     - **Utils**: Include API providers used across the application.
   - This separation improves code readability, testability, and ease of maintenance.

## Design Considerations for Tools

### 1. Real-Time Communication with WebSockets
   - WebSockets are used to support real-time updates, particularly for streaming Uniswap transactions like swaps and transfers.
   - This approach enables faster and more efficient updates to the frontend, providing users with near real-time transaction data.

### 2. API Providers
   - External API communication is managed through a dedicated utility (`apiProviders.js`), which abstracts the details of interacting with third-party APIs like Etherscan API and Infura API.
   - This modular design allows for easy swapping or modification of API providers, making the code more flexible and adaptable to changes in external dependencies.


