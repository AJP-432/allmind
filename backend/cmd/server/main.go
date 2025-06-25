package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/google/generative-ai-go/genai"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

// Upgrade the HTTP connection to a WebSocket connection
// This allows for real-time communication between the client and server
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// Message represents a chat message structure
type Message struct {
	Type      string `json:"type"`
	Content   string `json:"content"`
	Timestamp int64  `json:"timestamp"`
}

func main() {
	// Load environment variables
	godotenv.Load(".env")
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		log.Fatal("GEMINI_API_KEY required")
	}

	// Initialize Gemini
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-1.5-flash")

	// WebSocket handler
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		defer conn.Close()

		for {
			// Read message
			var msg Message
			err := conn.ReadJSON(&msg)
			if err != nil {
				log.Println(err)
				break
			}

			// Echo user message
			msg.Type = "user"
			msg.Timestamp = time.Now().Unix()
			conn.WriteJSON(msg)

			// Generate AI response
			resp, err := model.GenerateContent(ctx, genai.Text(msg.Content))
			if err != nil {
				log.Println(err)
				continue
			}

			// Check if response contains candidates and parts
			// ie if the AI has generated a response and send it back to the client
			// If the response is empty, we skip sending a message
			if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
				if textPart, ok := resp.Candidates[0].Content.Parts[0].(genai.Text); ok {
					aiMsg := Message{
						Type:      "assistant",
						Content:   string(textPart),
						Timestamp: time.Now().Unix(),
					}
					conn.WriteJSON(aiMsg)
				}
			}
		}
	})

	// Health check
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "OK")
	})

	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
