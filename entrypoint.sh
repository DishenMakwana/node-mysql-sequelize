#!/bin/bash
set -eu


if [[ "$RUN_MIGRATION" =~ [Tt]rue ]]; then
    npm run db:migrations:run
fi


echo "Running: '$@'"
exec $@

node ./build/src/server.js
