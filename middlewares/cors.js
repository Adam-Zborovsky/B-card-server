const cors = require("cors");

const corsMiddleware = cors({
  origin: [
    "http://127.0.0.1:5500",
    "www.cardsproject.co.il",
    "http://localhost:5173",
    "http://localhost:3000",
    "https://cards-project-front-end.onrender.com",
  ],
});

module.exports = corsMiddleware;
