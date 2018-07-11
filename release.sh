#!/bin/sh

# Version number of package
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
# The commit message for the release
COMMIT_MSG="Update cloudless-dependencies to v${PACKAGE_VERSION}"

# Staging and committing new files, create version tag and release
git add lib/ index.* package* gulpfile.js licenses_and_attributions/**
git commit -m "$COMMIT_MSG"
git tag "$PACKAGE_VERSION"
git push origin master --tags