import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";
import queryString from "query-string";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongodb from "mongodb";
import mongoose, { connect } from "mongoose";

const config = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  redirectUrl: process.env.REDIRECT_URL,
  clientUrl: process.env.CLIENT_URL,
  tokenSecret: process.env.TOKEN_SECRET,
  tokenExpiration: 36000,
  postUrl: "https://jsonplaceholder.typicode.com/posts",
};

const authParams = queryString.stringify({
  client_id: config.clientId,
  redirect_uri: config.redirectUrl,
  response_type: "code",
  scope: "openid profile email",
  access_type: "offline",
  state: "standard_oauth",
  prompt: "consent",
});

const getTokenParams = (code) =>
  queryString.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: config.redirectUrl,
  });

const app = express();

app.use(
  cors({
    origin: [config.clientUrl],
    credentials: true,
  })
);

// Parse Cookie
app.use(cookieParser());
// Middleware
app.use(express.json())

// Verify auth
const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    jwt.verify(token, config.tokenSecret);
    return next();
  } catch (err) {
    console.error("Error: ", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const MongoClient = mongodb.MongoClient;
const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-human";

app.get("/auth/url", (_, res) => {
  res.json({
    url: `${config.authUrl}?${authParams}`,
  });
});

app.get("/auth/token", async (req, res) => {
  const { code } = req.query;
  if (!code)
    return res
      .status(400)
      .json({ message: "Authorization code must be provided" });
  try {
    // Get all parameters needed to hit authorization server
    const tokenParam = getTokenParams(code);
    // Exchange authorization code for access token (id token is returned here too)
    const {
      data: { id_token },
    } = await axios.post(`${config.tokenUrl}?${tokenParam}`);
    if (!id_token) return res.status(400).json({ message: "Auth error" });
    // Get user info from id token
    const { email, name, picture } = jwt.decode(id_token);
    const user = { name, email, picture };
    // Sign a new token
    const token = jwt.sign({ user }, config.tokenSecret, {
      expiresIn: config.tokenExpiration,
    });
    // Set cookies for user
    res.cookie("token", token, {
      maxAge: config.tokenExpiration,
      httpOnly: true,
    });
    // You can choose to store user in a DB instead
    res.json({
      user
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

app.get("/auth/logged_in", (req, res) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    if (!token) return res.json({ loggedIn: false });
    const { user } = jwt.verify(token, config.tokenSecret);
    const newToken = jwt.sign({ user }, config.tokenSecret, {
      expiresIn: config.tokenExpiration,
    });
    // Reset token in cookie
    res.cookie("token", newToken, {
      maxAge: config.tokenExpiration,
      httpOnly: true,
    });
    res.json({ loggedIn: true, user });
  } catch (err) {
    res.json({ loggedIn: false });
  }
});

app.post("/auth/logout", (_, res) => {
  // clear cookie
  res.clearCookie("token").json({ message: "Logged out" });
});

app.get("/user/posts", auth, async (_, res) => {
  try {
    const { data } = await axios.get(config.postUrl);
    res.json({ posts: data?.slice(0, 5) });
  } catch (err) {
    console.error("Error fetching posts: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  get all chats
app.get("/api/chats", auth, async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json({ chats });
  } catch (err) {
    console.error("Error fetching chats: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// post a chat
app.post("/api/chats/", auth, async (req, res) => {
  try {
    // Get the chatText from the request body
    const chatText = req.body.chatPlusRandomString;
    // Check if chatText is provided
    if (!chatText) {
      return res.status(400).json({ error: "Chat text is required" });
    }

    // Create a new chat with the provided chatText
    const chat = await Chat.create({
      chatContent: chatText,
      userID: req.cookies.token, // Assuming you have a user object attached to the request by your auth middleware
      sharedUsers: [], // Add any other necessary fields
    });

    res.json({ chat });
  } catch (err) {
    console.error("Error creating chat: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//update chat with ID
app.put("/api/chats/:chatId", auth, async (req, res) => {
  try {

    const chatId = req.params.chatId;
    const chatText = req.body.chatPlusRandomString;
    // Check if chatText is provided
    if (!chatText) {
      return res.status(400).json({ error: "Chat text is required" });
    }

    // Find the chat by chatId and userID
    const chat = await Chat.findOne({
      _id: chatId
    });
    // Check if the chat exists
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Push up the chat content
    chat.chatContent.push(...chatText);
    await chat.save();

    res.json({ chat });
  } catch (error) {
    console.error("Error updating chat: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get chats that are shareable
app.get("/api/chats/share", auth, async (req, res) => {
  try {
    const chats = await Chat.find({shareChat: true});
    res.json({ chats });
  } catch (err) {
    console.error("Error fetching chats: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT request to toggle shareChat for a specific chat
app.put("/api/chats/share/:id", auth, async (req, res) => {
  try {
    const chatId = req.params.id;
    
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    // Check if the chat exists
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Toggle the value of shareChat
    chat.shareChat = !chat.shareChat;

    // Save the updated chat
    await chat.save();

    res.json({ chat });
  } catch (err) {
    console.error("Error updating chat: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Get chats for the user
app.post("/api/chats/user/:email", auth, async (req, res) => {
  try {
    const userId = req.params.email;
    const user = req.body.email;

    // Compare the decoded user ID with the provided userId
    if (user !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only access your own chats" });
    }

    const chats = await Chat.find({ userEmail: user });
    res.json({ chats });
  } catch (err) {
    console.error("Error fetching chats: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const PORT = process.env.PORT || 8080;


// Seed the chats -- TODO move later
const chatSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  userEmail: {type: String},
  chatContent: { type: [String], required: true },
  shareChat: { type: Boolean, default: false,},
  collabUsers: { type: [String], default: [] },
});


const Chat = mongoose.model("Chat", chatSchema);

// Seed two chats
const chat1 = new Chat({
  userID: "2",
  userEmail: "merel.burleigh@gmail.com",
  chatContent: "What did the anarchist bring to the party?",
  shareChat: true,
});

const chat2 = new Chat({
  userID: "2",
  userEmail: "matt@anarchy.io",
  chatContent: "What do you call a cow with no legs?",
  shareChat: true,
});

// Save both chats
Promise.all([chat1.save(), chat2.save()])
  .then((results) => {
    console.log("Seeded chats:", results);
  })
  .catch((err) => {
    console.error("Error seeding chats:", err);
  });
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
};


connectToMongoDB()
  .then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error starting the server:", err);
  });
