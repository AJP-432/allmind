#!/bin/bash

# Set variables
PROJECT_ID=""
SERVICE_NAME=""
REGION=""
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Build and push the Docker image
echo "Building backend Docker image..."
cd backend
docker build -t $IMAGE_NAME .
docker push $IMAGE_NAME

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  # Add gemini API key
  --set-env-vars GEMINI_API_KEY="" \
  --port 8080

# Get the backend URL
BACKEND_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format "value(status.url)")
echo "Backend deployed at: $BACKEND_URL"