#!/bin/bash
# This script prepares the web app for deployment by installing dependencies
cd "$(dirname "$0")"
npm ci
npm run build
