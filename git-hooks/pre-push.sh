#!/bin/sh

# Copy this into the `.git/hooks/` folder to ensure the files built for
# production are committed to version control.

make build
git diff --stat --name-only | grep assets
if [ "$?" -eq "0" ]; then
   echo >&2 "Please commit the production files before pushing.";
   exit 1;
fi

exit 0
