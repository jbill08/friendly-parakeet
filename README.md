Setup Instructions

Setting up the backend:

Create a new directory for your backend
Save the backend code as server.js
Save the package.json file
Run npm install to install dependencies
Start the server with npm start or npm run dev for development


Setting up the frontend:

Create a new React app using npx create-react-app odds-calculator-frontend
Replace the content of src/App.js with the provided React code
Add the CSS to src/App.css
Run npm start to start the development server



How the Calculator Works

The user enters their bet amount and odds in the selected format
The frontend sends the data to the backend API
The backend converts the odds format and calculates the potential payout
The result is returned to the frontend and displayed to the user

This implementation handles three common odds formats:

Decimal (e.g., 2.50)
American (e.g., +150, -200)
Fractional (e.g., 3/2, 1/2)

The calculator is simple but functional, providing the essential features needed for an odds calculator and payout system
