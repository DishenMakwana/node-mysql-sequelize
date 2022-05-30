#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

COMMIT_MSG=`cat $1`
TEST=`head $INPUT_FILE`
PATTERN="((ENH|CHG|DEP|REM|FIX|SEC): .{5}(.|\n)*|Merge)"
echo "Checking commit message:" $COMMIT_MSG

if ![["$COMMIT_MSG" =~ $PATTERN]]; then

  echo "Git commit message must contain one of following keywords:
		ENH: For new features or enhancements.
		CHG: For changes in existing functionality.
		DEP: Or soon-to-be removed features.
		REM: For now removed features.
		FIX: For any bug fixes.
		SEC: In case of vulnerabilities.
	Eg: ('Added: minimum five characters in message')"
  exit 1
fi
