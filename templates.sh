#!/bin/bash
set -e
git checkout jhipster-generator
TEMPLATE_FILES=$(cat templates.txt)
for _TEMPLATE_FILE in $TEMPLATE_FILES
do
  _SOURCE="$(echo $_TEMPLATE_FILE | cut -d'|' -f1)"
  _DESTINATION="$(echo $_TEMPLATE_FILE | cut -d'|' -f2)"
  echo "Copy file $_SOURCE to $_DESTINATION"
  mkdir -p `dirname ${_DESTINATION}` && cp "./node_modules/generator-jhipster/${_SOURCE}" "./${_DESTINATION}"
  git add "./${_DESTINATION}"
done
git add templates.txt templates.sh
[ ! -z "`git status --porcelain | tail -n 1`" ] && git commit -m "copy templates" && git push origin jhipster-generator
git checkout main
git merge -m "Merge branch 'jhipster-generator' into main" jhipster-generator
