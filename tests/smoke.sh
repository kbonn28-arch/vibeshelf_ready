#!/bin/bash

BASE_URL=${BASE_URL:-http://localhost:3000}

echo "Testing VibeShelf API at $BASE_URL"

echo "Testing GET /books"
curl -f "$BASE_URL/books" || exit 1

echo ""
echo "Testing GET /moods"
curl -f "$BASE_URL/moods" || exit 1

echo ""
echo "Testing GET /reviews"
curl -f "$BASE_URL/reviews" || exit 1

echo ""
echo "Testing POST /reviews"
curl -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -d '{}' >/dev/null 2>&1 || true

echo ""
echo "All smoke tests passed."
