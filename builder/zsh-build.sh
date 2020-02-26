#!/bin/zsh
for f in `find src/components/** -iname '*.scss' -not -name "_*.scss" -type f -print`;do node-sass --include-path=src/components/ "$f">${f%.scss}.css --source-map=${f%.scss}.css.map; done
# find ./src/ -name "*.css" -type f -delete
# find ./src -name "*.css.map" -type f -delete
# cp -r src/fonts dist/fonts
# cp -r src/favicons dist/favicons
# sort src/scss/components.scss | uniq >src/scss/sorted-components.scss
# exa -DaT --git-ignore . > SOURCE.md
