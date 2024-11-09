
# Gaming API

This API is designed for a gaming platform that enables users to register, place bets, participate in challenges and tournaments, and share achievements on social media.

## Technologies Used

- **Node.js**
- **Express**
- **MongoDB** with Mongoose
- **TypeScript**
- **dotenv** for environment variable management

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yataknemogy/gaming-api-dev-bounty.git
    ```
2. Navigate into the project directory:
    ```bash
    cd gaming-api-dev-bounty
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the root folder and add the following variables:
    ```plaintext
    PORT=4000
    MONGO_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    ```

## Usage

1. **Start the server**:
    ```bash
    npm run dev
    ```

2. **Available Routes**:

    ### User Routes
    - **POST** `/api/users/register` - Register a new user
    - **GET** `/api/users/:publicKey` - Get user by public key
    - **POST** `/api/users/:publicKey/deposit` - Deposit funds to user balance
    - **GET** `/api/users/top-users` - Get top users by total bet amount

    ### Bet Routes
    - **POST** `/api/bets` - Create a new bet
    - **POST** `/api/bets/:betId/status` - Update bet status (win/loss)
    - **GET** `/api/bets/user/:userId/statistics` - Get bet statistics for a user

    ### Challenge Routes
    - **POST** `/api/challenges` - Create a new challenge
    - **POST** `/api/challenges/:challengeId/join` - Join a challenge
    - **POST** `/api/challenges/:challengeId/complete` - Complete a challenge
    - **GET** `/api/challenges/public` - Get public challenges

    ### Tournament Routes
    - **POST** `/api/tournaments` - Create a new tournament
    - **POST** `/api/tournaments/:tournamentId/participants` - Add participant to a tournament
    - **POST** `/api/tournaments/:tournamentId/advance` - Advance to the next round
    - **POST** `/api/tournaments/:tournamentId/end` - End the tournament

    ### Social Share Routes
    - **POST** `/api/social-share/generate` - Generate social media content for achievements

3. **Testing**:
    Use a tool like Postman to send HTTP requests to the routes listed above.

## Project Structure

- `src/`
  - `controllers/`: Route handlers for the API endpoints
  - `models/`: Mongoose models for MongoDB collections
  - `services/`: Core business logic and database operations
  - `routes/`: API route definitions
  - `utils/`: Utility functions, such as error handling and logging
  - `config/`: Database connection and collection initialization

## License

This project is licensed under the MIT License.
