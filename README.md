# ai-human Chat Application

## Overview

The ai-human chat application serves as a pilot for a shared AI chatbot, allowing users to engage in conversations securely. The application utilizes Google OAuth for user authentication and authorization, ensuring a safe and seamless user experience.

## Features

- **User Authentication:** Securely authenticate and authorize users using Google OAuth.
  
- **Chatting:** Users can engage in individual chats, creating a personalized conversational space.

- **Chat Sharing:** Choose to share your chats with others, fostering collaborative interactions.

## Future Developments

- **Polished UI:** Enhancements to the user interface for a more intuitive and visually appealing experience.

- **Shared Chat Pool:** Explore a pool of shared chats from other users, offering the ability to join and participate in broader conversations.

- **Additional Sign Ons:** Enable users to sign on with other platforms like GitHub. 


## Technologies

The ai-human application is built on the MERN (MongoDB, Express.js, React.js, Node.js) stack, leveraging the strengths of each technology for a robust and scalable solution.

## Getting Started

1. **Clone the Repository:**
   ```
   git clone https://github.com/your-username/ai-human.git
   cd ai-human
   ```

2. **Install Dependencies:**
   ```
   cd client && npm install
   cd ../server && npm install
   ```

3. **Set Up Environment Variables:**
   - Create a `.env` file in the `server` directory and configure necessary variables (e.g., MongoDB URI, Google OAuth credentials).

4. **Run the Application:**
   ```
   cd server && npm start
   cd ../client && npm start
   ```

5. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000` to start using ai-human.

## Contributing

Contributions are welcome! If you have ideas for improvements or find issues, please open an [issue](https://github.com/your-username/ai-human/issues) or submit a [pull request](https://github.com/your-username/ai-human/pulls).

## License

This project is licensed under the [MIT License](LICENSE).