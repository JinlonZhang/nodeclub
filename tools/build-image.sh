#!/bin/bash


UI_ROOT="$(dirname "${BASH_SOURCE}")/.."


# -----------------------------------------------------------------------------
# Parameters for building docker image, see usage.
# -----------------------------------------------------------------------------
# Decide if we need to push the new images to docker hub.
PUSH_TO_REGISTRY=${PUSH_TO_REGISTRY:-"N"}

# Decide if we need to publish static resources to CDN.
SYNC_CDN=${SYNC_CDN:-"N"}

# Find image tag version.
if [[ "$#" == "1" ]]; then
  if [[ "$1" == "help" ]]; then
    echo -e ""
    usage
    exit 0
  elif [[ ! $1 =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ && ! $1 =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}$ ]]; then
    # We also allow passing date/time directly, this is usually used internally.
    echo -e "Error: image tag format error, see usage."
    echo -e ""
    usage
    exit 1
  else
    # Tag used for the new image; the tag is also considered as release version.
    IMAGE_TAG=${1}
  fi
else
  IMAGE_TAG="`TZ=Asia/Shanghai date +%Y-%m-%d-%H-%M-%S`"
fi

# build static resources with all the npm dependencies.

cd ${UI_ROOT}
npm install
make publish
cd -

# TODO: transform reference to CDN based path & upload all static resource to CDN

# build & push image
echo "+++++ Start building kubecon image"
cd ${UI_ROOT}
docker build -t index.caicloud.io/caicloud/kubecon:${IMAGE_TAG} .
echo "Successfully built docker image index.caicloud.io/caicloud/kubecon:${IMAGE_TAG}"
cd -

# Decide if we need to push image to docker hub.
if [[ "$PUSH_TO_REGISTRY" == "Y" ]]; then
  echo ""
  echo "+++++ Start pushing kubecon image"
  docker push index.caicloud.io/caicloud/kubecon:${IMAGE_TAG}
fi
