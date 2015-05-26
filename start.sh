#!/bin/bash

# Variables
LOG_DIR='log' #log folder, located in same level as this script

# Check if log directory exists, if not, then created
if [ ! -d "$LOG_DIR" ]; then
  # Control will enter here if $LOG_DIR exists.
  echo "NOTE: $LOG_DIR folder not detected, creating..."
  mkdir -pv "$LOG_DIR"
fi

# Invoke the Forever module (to START our Node.js server).
# NOTE: if log folder doesn't exist, this script will break, TODO: add folder check and if not exist, create
export NODE_ENV=production \
export PORT=9000 \
forever \
start \
-al log/forever.log \
-ao log/out.log \
-ae log/err.log \
forever stop ~/www/crm-dashboard/dist/server/app.js