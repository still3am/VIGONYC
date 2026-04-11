# VIGONYC Setup Instructions

This document outlines the steps necessary to set up the VIGONYC clothing brand website for development.

## Installation

1. **Clone the Repository**  
   Run the following command in your terminal:
   ```bash
   git clone https://github.com/still3am/VIGONYC.git
   cd VIGONYC
   ```

2. **Install Dependencies**  
   Make sure you have Node.js (version 14 or later) installed. You can verify your installation with:
   ```bash
   node -v
   npm -v
   ```  
   Then, install the project dependencies:
   ```bash
   npm install
   ```

## Configuration

1. **Environment Variables**  
   Create a `.env` file in the root of the project. You can use the provided `.env.example` as a template:  
   ```bash
   cp .env.example .env
   ```
   Ensure that all necessary environment variables are correctly set in your `.env` file.

2. **Configure Database**  
   Ensure your database is running and update the connection settings in your `.env` file.

## Running the Development Server

To start the development server, run:
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser to view the website locally.

## Deployment

For deployment, follow these steps:

1. **Build the Application**  
   Run the following command to create the production build:  
   ```bash
   npm run build
   ```

2. **Deploy to Server**  
   You can use services like Vercel, Heroku, or your preferred hosting provider. Follow their documentation for deployment instructions specific to Node.js applications.  

3. **Set Up CI/CD**  
   Consider setting up continuous integration and deployment pipelines to automate the deployment process using GitHub Actions or another CI/CD tool.

## Additional Information  
For further details, consult the project documentation or reach out to the development team.