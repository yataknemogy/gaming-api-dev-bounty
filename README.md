# Catoff on Blinks API: Quick Guide

The Catoff on Blinks API allows developers to create and manage mini-games within the Catoff ecosystem. Here is the essential information to effectively use the API.

## Base URL
All requests are made to:
```
https://api.catoff.xyz/v1
```

## Authentication
An API key is required and should be included in the headers of each request.

**Headers:**
- `x-api-key`: Your API key.

## Main Endpoints

The endpoints described below can be used depending on the goals and requirements of the developer.

### 1. Create Challenge
**POST** `/challenges`

Creates a new game challenge. The request body should include the challenge parameters.

```javascript
import axios from 'axios';

const createChallenge = async (challengeData) => {
  try {
    const response = await axios.post('https://api.catoff.xyz/v1/challenges', challengeData, {
      headers: { 'x-api-key': 'YOUR_API_KEY', 'Content-Type': 'application/json' },
    });
    console.log('Challenge created:', response.data);
  } catch (error) {
    console.error('Error creating challenge:', error);
  }
};
```

### 2. Place Bet
**POST** `/bets`

Places a bet on a challenge. The response contains the bet ID and transaction signature.

```javascript
import axios from 'axios';

const placeBet = async (betData) => {
  try {
    const response = await axios.post('https://api.catoff.xyz/v1/bets', betData, {
      headers: { 'x-api-key': 'YOUR_API_KEY', 'Content-Type': 'application/json' },
    });
    console.log('Bet placed:', response.data);
  } catch (error) {
    console.error('Error placing bet:', error);
  }
};
```

### 3. Create Transaction
**POST** `/transactions`

Creates a transaction to transfer funds. You need to specify the sender and recipient public keys, currency, and amount.

```javascript
import axios from 'axios';

const createTransaction = async (transactionData) => {
  try {
    const response = await axios.post('https://api.catoff.xyz/v1/transactions', transactionData, {
      headers: { 'x-api-key': 'YOUR_API_KEY', 'Content-Type': 'application/json' },
    });
    console.log('Transaction created:', response.data);
  } catch (error) {
    console.error('Error creating transaction:', error);
  }
};
```

### 4. Get Notifications
**GET** `/notifications/:userId`

Returns notifications for a specific user, including type, content, and read status.

```javascript
import axios from 'axios';

const getNotifications = async (userId) => {
  try {
    const response = await axios.get(`https://api.catoff.xyz/v1/notifications/${userId}`, {
      headers: { 'x-api-key': 'YOUR_API_KEY' },
    });
    console.log('User notifications:', response.data);
  } catch (error) {
    console.error('Error getting notifications:', error);
  }
};
```

### 5. Create Tournament
**POST** `/tournament`

Creates a new tournament with the specified data.

```javascript
import axios from 'axios';

const createTournament = async (tournamentData) => {
  try {
    const response = await axios.post('https://api.catoff.xyz/v1/tournament', tournamentData, {
      headers: { 'x-api-key': 'YOUR_API_KEY', 'Content-Type': 'application/json' },
    });
    console.log('Tournament created:', response.data);
  } catch (error) {
    console.error('Error creating tournament:', error);
  }
};
```

### 6. Get Tournament by ID
**GET** `/tournament/:id`

Returns information about a tournament by its ID.

```javascript
import axios from 'axios';

const getTournamentById = async (tournamentId) => {
  try {
    const response = await axios.get(`https://api.catoff.xyz/v1/tournament/${tournamentId}`, {
      headers: { 'x-api-key': 'YOUR_API_KEY' },
    });
    console.log('Tournament details:', response.data);
  } catch (error) {
    console.error('Error getting tournament by ID:', error);
  }
};
```

### 7. Generate AI Description
**POST** `/generate-description-x-api-key/`

Generates a description using AI based on the provided data.

```javascript
import axios from 'axios';

const generateAIDescription = async (name, participationType) => {
  try {
    const response = await axios.post('https://api.catoff.xyz/v1/generate-description-x-api-key/', {
      prompt: name,
      participation_type: participationType,
      result_type: 'voting',
    }, {
      headers: { 'x-api-key': 'YOUR_API_KEY', 'Content-Type': 'application/json' },
    });
    console.log('AI Description generated:', response.data);
  } catch (error) {
    console.error('Error generating AI description:', error);
  }
};
```

### 8. Create Challenge
**POST** `/challenge`

Creates a new challenge.

```javascript
import axios from 'axios';

const createChallenge = async (challengeData) => {
  try {
    const response = await axios.post('https://api.catoff.xyz/v1/challenge', challengeData, {
      headers: { 'x-api-key': 'YOUR_API_KEY', 'Content-Type': 'application/json' },
    });
    console.log('Challenge created:', response.data);
  } catch (error) {
    console.error('Error creating challenge:', error);
  }
};
```

### 9. Get Challenge by ID
**GET** `/challenge/:id`

Returns information about a challenge by its ID.

```javascript
import axios from 'axios';

const getChallengeById = async (challengeId) => {
  try {
    const response = await axios.get(`https://api.catoff.xyz/v1/challenge/${challengeId}`, {
      headers: { 'x-api-key': 'YOUR_API_KEY' },
    });
    console.log('Challenge details:', response.data);
  } catch (error) {
    console.error('Error getting challenge by ID:', error);
  }
};
```

### 10. Create Bet
**POST** `/bets`

Allows creating a bet on an existing challenge.

```javascript
import axios from 'axios';

const createBet = async (betData) => {
  try {
    const response = await axios.post('https://api.catoff.xyz/v1/bets', betData, {
      headers: { 'x-api-key': 'YOUR_API_KEY', 'Content-Type': 'application/json' },
    });
    console.log('Bet created:', response.data);
  } catch (error) {
    console.error('Error creating bet:', error);
  }
};
```

## Error Handling
All errors contain:
- `data`: Always null.
- `error`: Error message describing the issue.

## Conclusion
This API allows developers to integrate exciting mini-games, tournaments, and other features into the Catoff ecosystem. For more details, contact the Catoff team.

