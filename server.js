const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.post("/api/v1/ai/chat/duckai", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const response = await axios.post(
            "https://duck.ai/duckchat/v1/chat",
            {
                model: "claude-haiku-4-5",
                metadata: {
                    toolChoice: {
                        NewsSearch: false,
                        VideosSearch: false,
                        LocalSearch: false,
                        WeatherForecast: false
                    }
                },
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ],
                canUseTools: true,
                reasoningEffort: "none"
            },
            {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Origin": "https://duck.ai",
                    "Referer": "https://duck.ai/"
                }
            }
        );

        res.json({
            success: true,
            message: response.data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            code: error.response?.status || 500
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
