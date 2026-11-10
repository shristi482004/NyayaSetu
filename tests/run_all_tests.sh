#!/bin/bash
set -e

echo "================================================="
echo "NyayaSetu Automated Test Suite Execution"
echo "================================================="

echo ""
echo "[1/2] Running Python AI Microservice Tests (Pytest)..."
cd src/ai_service
source .venv/bin/activate
PYTHONPATH=. pytest -v
cd ../..

echo ""
echo "[2/2] Running Node.js Backend Gateway Tests (Jest)..."
cd src/backend
npm test
cd ../..

echo ""
echo "================================================="
echo "All NyayaSetu Test Suites Completed Successfully!"
echo "================================================="

