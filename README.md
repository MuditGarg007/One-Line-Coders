# NexFlow

NexFlow is an AI-powered platform designed to integrate all developer tools and platforms like GitHub, Jira, Postman, and more into a single place. With NexFlow, you can access your accounts and perform tasks directly using our AI Chatbot, streamlining your workflow and boosting productivity.

## Features

- **Unified Platform**: Access and manage multiple developer tools from a single interface.
- **AI Chatbot**: Perform tasks and automate workflows using natural language commands.
- **Integrations**: Supports popular tools like GitHub, Jira, Postman, and more.
- **Customizable Sidebar**: Manage chats and tasks with an intuitive sidebar.
- **Interactive 3D Background**: Enhance user experience with a visually appealing 3D scene.

## Getting Started

Follow these steps to set up and run NexFlow on your local machine.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Veyrax API key and OpenAI API key (for backend functionality)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/nexflow.git
   cd nexflow
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add the following:
   ```
   VEYRAX_API_KEY=your_veyrax_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:

   ```bash
   cd ../frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`.

## Usage

### Landing Page

- The landing page introduces NexFlow and allows users to input commands for the AI Chatbot.

### Integrations Page

- Browse and search for available integrations.
- Connect to tools like GitHub, Jira, and Postman.

### Chat Page

- Interact with the AI Chatbot to perform tasks such as creating repositories, sending emails, or managing projects.

## Project Structure

```
NexFlow/
├── frontend/          # React-based frontend application
│   ├── src/           # Source code for the frontend
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # Express-based backend server
│   ├── index.js       # Main server file
│   ├── package.json   # Backend dependencies
│   └── .env           # Environment variables
└── README.md          # Project documentation
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.
