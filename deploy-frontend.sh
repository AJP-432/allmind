#!/bin/bash

# Get backend URL from previous deployment
PROJECT_ID=""
BACKEND_SERVICE=""
FRONTEND_SERVICE=""
REGION=""
WS_URL=""

IMAGE_NAME="gcr.io/$PROJECT_ID/$FRONTEND_SERVICE"

# Build and push the Docker image
echo "Building frontend Docker image..."
cd frontend
docker build -t $IMAGE_NAME .
docker push $IMAGE_NAME

# Deploy to Cloud Run
echo "Deploying frontend to Cloud Run..."
gcloud run deploy $FRONTEND_SERVICE \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  # Set environment variables
  --set-env-vars NEXT_PUBLIC_WS_URL="$WS_URL" \
  --set-env-vars NEXT_PUBLIC_FIREBASE_API_KEY="" \
  --set-env-vars NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="" \
  --set-env-vars NEXT_PUBLIC_FIREBASE_PROJECT_ID="" \
  --set-env-vars NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="" \
  --set-env-vars NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="" \
  --set-env-vars NEXT_PUBLIC_FIREBASE_APP_ID="" \
  --port 3000

# Get the frontend URL
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --platform managed --region $REGION --format "value(status.url)")
echo "Frontend deployed at: $FRONTEND_URL"