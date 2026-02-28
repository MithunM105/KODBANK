#!/usr/bin/env bash
# exit on error
set -o errexit

echo "🚀 Starting High-Fidelity Build Sequence..."

# Install dependencies for both parts
echo "📦 Installing Server modules..."
npm install --prefix server

echo "📦 Installing Frontend modules..."
npm install --prefix frontend

# Build the frontend
echo "✨ Generating Visual Lightning Effects..."
npm run build --prefix frontend

echo "✅ Build Sequence Complete."
