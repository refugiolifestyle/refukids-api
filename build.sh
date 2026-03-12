#!/bin/sh
set -e

# =========================
# Config
# =========================
VERSION_FILE="VERSION"
DOCKER_USER="refugiolifestyle"

APP_NAME="refukids-api"
MIGRATOR_NAME="$APP_NAME-migrator"

SSH_USER="luis"
SSH_HOST="refugio.vps"
SSH_PORT="2222"
SSH_COMMAND="docker pull $DOCKER_USER/$APP_NAME:latest && docker compose up -d $APP_NAME"
SSH_COMMAND_MIGRATOR="docker pull $DOCKER_USER/$MIGRATOR_NAME:latest && docker compose up -d $MIGRATOR_NAME"

# =========================
# Flags
# =========================
DEPLOY_PROD=false
MIGRATOR=false

for arg in "$@"; do
  case $arg in
    --prod)
      DEPLOY_PROD=true
      ;;
    --migrator)
      MIGRATOR=true
      ;;
  esac
done

# =========================
# Read & bump version (semver)
# =========================
if [ ! -f "$VERSION_FILE" ]; then
  echo "1.0.0" > $VERSION_FILE
fi

VERSION=$(cat $VERSION_FILE)

IFS='.' read -r MAJOR MINOR PATCH <<EOF
$VERSION
EOF

PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$PATCH"

echo "🔖 Bumping version: $VERSION → $NEW_VERSION"
echo "$NEW_VERSION" > $VERSION_FILE

# =========================
# Build APP image
# =========================
echo "🐳 Building APP image ($NEW_VERSION)..."
docker build \
  -t $DOCKER_USER/$APP_NAME:$NEW_VERSION \
  .

if [ "$DEPLOY_PROD" = true ]; then
  docker tag $DOCKER_USER/$APP_NAME:$NEW_VERSION $DOCKER_USER/$APP_NAME:latest
fi

# =========================
# Build MIGRATOR image
# =========================
if [ "$MIGRATOR" = true ]; then
  echo "🐳 Building MIGRATOR image ($NEW_VERSION)..."
  docker build \
    --target migrator \
    -t $DOCKER_USER/$MIGRATOR_NAME:$NEW_VERSION \
    .
  
  if [ "$DEPLOY_PROD" = true ]; then
    docker tag $DOCKER_USER/$MIGRATOR_NAME:$NEW_VERSION $DOCKER_USER/$MIGRATOR_NAME:latest
  fi
fi

# =========================
# Push images
# =========================
echo "📤 Pushing versioned images..."
docker push $DOCKER_USER/$APP_NAME:$NEW_VERSION

if [ "$DEPLOY_PROD" = true ]; then
  docker push $DOCKER_USER/$APP_NAME:latest
fi

if [ "$MIGRATOR" = true ]; then
  docker push $DOCKER_USER/$MIGRATOR_NAME:$NEW_VERSION

  if [ "$DEPLOY_PROD" = true ]; then
    docker push $DOCKER_USER/$MIGRATOR_NAME:latest
  fi
fi

# =========================
# Git commit & push
# =========================
echo "📦 Git commit & push..."
git add $VERSION_FILE build.sh
git commit -m "chore: bump version to v$NEW_VERSION"
git push

# =========================
# Deploy to production
# =========================
if [ "$DEPLOY_PROD" = true ]; then
  echo "🚀 Deploying to production..."
  ssh $SSH_USER@$SSH_HOST -p $SSH_PORT "$SSH_COMMAND"  
fi

if [ "$MIGRATOR" = true ]; then
  ssh $SSH_USER@$SSH_HOST -p $SSH_PORT "$SSH_COMMAND_MIGRATOR" 
fi

echo "✅ Done! Version v$NEW_VERSION built and pushed."
