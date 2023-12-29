const router = require("express").Router();

const chatRoutes = require("./chat-routes");

router.use("/chat-routes", chatRoutes);

module.exports = router;
