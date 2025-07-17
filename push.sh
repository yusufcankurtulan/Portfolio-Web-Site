#!/bin/bash

# Get commit message from command line argument, or use default
if [ $# -eq 0 ]; then
    commit_message="Update portfolio website"
else
    commit_message="$*"
fi

# Git operations
git add .
git commit -m "$commit_message"
git push

echo "✅ Successfully pushed to GitHub!"
echo "Commit message: $commit_message" 