#!/bin/bash

echo "🌍 ORBIT iOS App - Installation Script"
echo "======================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm found: $(npm -v)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
echo ""

npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "🚀 To start the app, run:"
    echo "   npm start"
    echo ""
    echo "📱 Then:"
    echo "   - Press 'i' for iOS simulator"
    echo "   - Scan QR code with Expo Go app on iPhone"
    echo ""
    echo "📖 Documentation:"
    echo "   - README.md - Full documentation"
    echo "   - QUICKSTART.md - Quick reference"
    echo "   - IMPLEMENTATION_SUMMARY.md - Technical details"
    echo "   - SCREEN_FLOW.md - Navigation guide"
    echo ""
    echo "🌍✨ Welcome to ORBIT! ✨🌍"
else
    echo ""
    echo "❌ Installation failed. Please check the errors above."
    exit 1
fi
