package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"cloud.google.com/go/firestore"
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

// Firestore constants
const (
	gcpProjectID   = "allmind-takehome"
	databaseID     = "chat-messages"
	collectionName = "chat-messages-prod"
)

// Global Firestore client
var firestoreClient *firestore.Client

func main() {
	// Load environment variables
	godotenv.Load(".env")
	geminiAPIKey := os.Getenv("GEMINI_API_KEY")
	if geminiAPIKey == "" {
		log.Fatal("GEMINI_API_KEY required")
	}

	// Initialize Firestore
	ctx := context.Background()
	var err error
	firestoreClient, err = firestore.NewClientWithDatabase(ctx, gcpProjectID, databaseID)
	if err != nil {
		log.Fatalf("Failed to create Firestore client: %v", err)
	}
	defer firestoreClient.Close()

	// Initialize Gemini
	genaiClient, err := genai.NewClient(ctx, option.WithAPIKey(geminiAPIKey))
	if err != nil {
		log.Fatal(err)
	}
	defer genaiClient.Close()
	model := genaiClient.GenerativeModel("gemini-1.5-flash")

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

			// Save user message to Firestore
			if err := saveMessageToFirestore(ctx, msg); err != nil {
				log.Printf("Failed to save user message to Firestore: %v", err)
			}

			// Log received user message (don't echo it back)
			log.Printf("Received user message: %s", msg.Content)

			// Only process messages from the user (fixes duplicate responses)
			if msg.Type != "user" {
				continue
			}

			cs := model.StartChat()
			resp, err := cs.SendMessage(ctx, genai.Text(msg.Content))
			if err != nil {
				log.Printf("Error generating AI response: %v", err)
				continue
			}

			// Check if response contains candidates and parts
			// ie if the AI has generated a response and send it back to the client
			// If the response is empty, we skip sending a message
			if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
				for _, cand := range resp.Candidates {
					if cand.Content != nil {
						for _, part := range cand.Content.Parts {
							if textPart, ok := part.(genai.Text); ok {
								aiMsg := Message{
									Type:      "copilot",
									Content:   string(textPart),
									Timestamp: time.Now().UTC().UnixMilli(), // Use UTC for consistency
								}
								// Save AI message to Firestore
								if err := saveMessageToFirestore(ctx, aiMsg); err != nil {
									log.Printf("Failed to save AI message to Firestore: %v", err)
								}
								log.Printf("Sending AI response: %s", aiMsg.Content)
								if err := conn.WriteJSON(aiMsg); err != nil {
									log.Println("write:", err)
									break
								}
							}
						}
					}
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

func saveMessageToFirestore(ctx context.Context, msg Message) error {
	_, _, err := firestoreClient.Collection(collectionName).Add(ctx, msg)
	if err != nil {
		log.Printf("Failed to add message to Firestore: %v", err)
		return err
	}
	log.Printf("Saved to Firestore: Type=%s", msg.Type)
	return nil
}
