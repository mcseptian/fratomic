#!/usr/bin/env sh
#
# Usage
# ---------------
# 1. Clone second version of this repo in sibling directory named `dist`.
# 2. Within `those` copy, switch to `develop` branch.
# 3. Pull latest, re-bundle, re-npm-run.
# 4. Run script.
# 5. git tag -d tagName or git push --delete origin tagName if accidentally release dev. env.

red=$'\e[1;31m'
green=$'\e[1;32m'
blue=$'\e[1;34m'
magenta=$'\e[1;35m'
cyan=$'\e[1;36m'
end=$'\e[0m'

# Get current version from package.json
current_version=$(node -p "require('./package.json').version")

if [[ $# -lt 1 ]]; then
  printf "\n%s⚠️  Shipping aborted. You must specify a version.\n%s" $red $end
  exit 1
fi

# Pulling latest changes, just to be sure this is the latest stream
printf "\n%s=======================================================%s" $blue $end
printf "\n%sPulling latest changes...%s" $blue $end
printf "\n%s=======================================================\n\n%s" $blue $end
git pull origin master
printf "\nDone!\n" $green $end

printf "\n%s=======================================================%s" $cyan $end
printf "\n%sInstalling dependencies...%s" $cyan $end
printf "\n%s=======================================================\n\n%s" $cyan $end
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | sh
source ~/.nvm/nvm.sh
nvm install v10.17.0
nvm exec v10.17.0 npm i
printf "\nDone!\n" $green $end

# Copy the contents of the source folder to `dist` folder, it would be used as assets
printf "\n%s=======================================================%s" $magenta $end
printf "\n%sCopying assets...%s" $magenta $end
printf "\n%s=======================================================\n%s" $magenta $end
cp -vrf ./src/favicons ./dist/
cp -vrf ./src/fonts ./dist/
cp -vrf ./src/img ./dist/
cp -vf ./src/webui-overrides/overrides.css ./dist/webui-overrides/
cp -vf ./src/js/copy.js ./dist/js/
cp -vf ./src/js/search.js ./dist/js/
cp -vf ./src/js/sidebar.js ./dist/js/
cp -vf ./src/js/textarea.js ./dist/js/
cp -vf ./src/js/popper.js ./dist/js/
printf "\nDone!\n" $green $end

# Build release
printf "\n%s=======================================================%s" $magenta $end
printf "\n%sBuilding release...%s" $magenta $end
printf "\n%s=======================================================\n%s" $magenta $end
npm run build
printf "\nDone!\n" $green $end

printf "\n%s=======================================================%s" $green $end
printf "\n%sSuccess, $1 is ready to review and publish.%s" $green $end
printf "\n%s=======================================================\n\n%s" $green $end

# Update version number
printf "\n%s=======================================================%s" $blue $end
printf "\n%sUpdating version number...%s" $blue $end
printf "\n%s=======================================================\n%s" $blue $end
npm run release
printf "\nDone!\n" $green $end
