#!/bin/bash
# extract-demos.sh
set -e

SERVER_PID=""
PNPM_PID=""

cleanup() {
    echo "Cleaning up processes..."

    # Kill any server running on port 3000
    local server_pids=$(lsof -ti:3000 2>/dev/null || true)
    if [[ -n "$server_pids" ]]; then
        echo "Shutting down server(s) on port 3000: $server_pids"
        echo "$server_pids" | xargs -r kill -TERM 2>/dev/null || true

        # Wait up to 10 seconds for graceful shutdown
        local timeout=10
        while [[ $timeout -gt 0 ]] && lsof -ti:3000 >/dev/null 2>&1; do
            sleep 1
            ((timeout--))
        done

        # Force kill if still running
        server_pids=$(lsof -ti:3000 2>/dev/null || true)
        if [[ -n "$server_pids" ]]; then
            echo "Forcing server shutdown..."
            echo "$server_pids" | xargs -r kill -KILL 2>/dev/null || true
        fi

        echo "Server stopped"
    fi

    # Clean up pnpm process if it's still running
    if [[ -n "$PNPM_PID" ]] && kill -0 "$PNPM_PID" 2>/dev/null; then
        kill -TERM "$PNPM_PID" 2>/dev/null || true
    fi
}

# Trap multiple signals to ensure cleanup runs
trap cleanup EXIT INT TERM

echo "Cleaning up old demo html..."
rm -f ./angular-demo-module/generated/demo-elements.json

echo "Extracting site data"

mkdir -p ./scripts/temp

pnpm generate-page-map

echo "Building application..."
cross-env SKIP_LARGE_QUERIES=true pnpm build

echo "Starting server for demo extraction..."
pnpm start > /dev/null 2>&1 &
PNPM_PID=$!

echo "Waiting for server to start..."
sleep 8

echo "Checking if server is ready..."
for i in {1..15}; do
    if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
        echo "Server is ready!"
        # Now capture the actual server PID
        SERVER_PID=$(lsof -ti:3000 2>/dev/null || true)
        if [[ -n "$SERVER_PID" ]]; then
            echo "Server PID: $SERVER_PID"
        fi
        break
    fi
    echo "Attempt $i/15 - waiting 2 seconds..."
    sleep 2
    if [[ $i -eq 15 ]]; then
        echo "Server failed to start after 30 seconds"
        exit 1
    fi
done

echo "Running web crawler..."
pnpm tsx scripts/build-demo-html.ts --prod

echo "Demo extraction completed successfully!"

cleanup

echo "Building final production bundle..."

pnpm build
