#!/bin/bash
echo "=========================================="
echo "  CyberNinja - Setup Script (Mac/Linux)"
echo "=========================================="
echo ""

echo "[1/3] Installing Backend dependencies..."
cd backend && npm install
echo "Backend dependencies installed!"
echo ""

echo "[2/3] Installing Frontend dependencies..."
cd ../frontend && npm install
echo "Frontend dependencies installed!"
echo ""

cd ..
echo "[3/3] Seeding database..."
cd backend && npm run seed
echo "Database seeded!"
echo ""

echo "=========================================="
echo "  SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "To start the project:"
echo "  Terminal 1 (Backend):  cd backend && npm run dev"
echo "  Terminal 2 (Frontend): cd frontend && npm run dev"
echo ""
echo "  Open: http://localhost:5173"
echo ""
echo "  Demo User:  demo@cyberninja.com / Demo@123"
echo "  Admin:      admin@cyberninja.com / Admin@123"
echo ""
