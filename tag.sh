#!/bin/bash

set -e

NEW_VERSION=$1
VERSION_REGEXP='[0-9]+\.[0-9]+\.[0-9]+'
FULL_VERSION_REGEXP="^${VERSION_REGEXP}$"

if [[ ! $NEW_VERSION =~ $FULL_VERSION_REGEXP ]]; then
  echo "First param should be a version like X.X.X"
  exit 1
fi

echo "[Scratch::GUI] Updating version..."
sed -i -r "s/\"version\": \"${VERSION_REGEXP}/\"version\": \"${NEW_VERSION}/" package.json
sed -i -r "s/\"version\": \"${VERSION_REGEXP}/\"version\": \"${NEW_VERSION}/" bower.json
sed -i -r "s/VERSION = \"${VERSION_REGEXP}/VERSION = \"${NEW_VERSION}/" gem/lib/gobstones/board/version.rb

echo "[Scratch::GUI] Generating dist..."
npm run build

echo "[Scratch::GUI] Commiting files..."
git commit build package.json gem/lib/scratch/gui/version.rb -m "Welcome ${NEW_VERSION}!"

echo "[Scratch::GUI] Tagging $NEW_VERSION..."
git tag "${NEW_VERSION}"

echo "[Scratch::GUI] Pushing..."
git push origin HEAD --tags

echo "[Scratch::GUI] Pushed. Travis will do the rest"
