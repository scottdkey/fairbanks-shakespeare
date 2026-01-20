#!/bin/bash

# Init script for fairbanks-shakespeare
# Installs all required dependencies before running npm install

set -e

echo "🚀 Setting up development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

info "Detected OS: $MACHINE"

# Install Homebrew (macOS only)
if [ "$MACHINE" = "Mac" ]; then
    if ! command_exists brew; then
        info "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

        # Add Homebrew to PATH for Apple Silicon Macs
        if [ -f "/opt/homebrew/bin/brew" ]; then
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
    else
        info "Homebrew already installed ✓"
    fi
fi

# Install Node.js
if ! command_exists node; then
    info "Installing Node.js..."
    if [ "$MACHINE" = "Mac" ]; then
        brew install node
    elif [ "$MACHINE" = "Linux" ]; then
        # Install via NodeSource
        curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
else
    NODE_VERSION=$(node --version)
    info "Node.js already installed: $NODE_VERSION ✓"

    # Check if Node version is sufficient (need at least v18 for modern features)
    MAJOR_VERSION=$(echo "$NODE_VERSION" | sed 's/v//' | cut -d. -f1)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        warn "Node.js version $NODE_VERSION is too old. Please upgrade to v18 or later."
        if [ "$MACHINE" = "Mac" ]; then
            info "Run: brew upgrade node"
        fi
    fi
fi

# Install npm (comes with Node, but verify)
if ! command_exists npm; then
    error "npm not found. Please reinstall Node.js"
    exit 1
else
    NPM_VERSION=$(npm --version)
    info "npm already installed: $NPM_VERSION ✓"
fi

# Install Cloudflare Wrangler globally (optional, also in devDependencies)
if ! command_exists wrangler; then
    info "Installing Cloudflare Wrangler globally..."
    npm install -g wrangler
else
    WRANGLER_VERSION=$(wrangler --version 2>/dev/null | head -n1)
    info "Wrangler already installed: $WRANGLER_VERSION ✓"
fi

# Create .nvmrc file for Node version management
if [ ! -f ".nvmrc" ]; then
    info "Creating .nvmrc file..."
    echo "22" > .nvmrc
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Environment setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Run: npm install"
echo "  2. Run: npm run dev"
echo ""
echo "For Cloudflare deployment:"
echo "  1. Run: wrangler login"
echo "  2. Run: npm run deploy"
echo ""
