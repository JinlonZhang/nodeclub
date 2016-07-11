#!/bin/bash

# This script builds a docker image for console-web.

set -o nounset
set -o pipefail

CONSOLE_WEB_ROOT="$(dirname "${BASH_SOURCE}")/.."

function usage {
  echo -e "Usage:"
  echo -e "  ./build-image.sh [tag]"
  echo -e ""
  echo -e "Parameter:"
  echo -e " tag\tDocker image tag, treated as portal ui release version. If provided, the tag must be"
  echo -e "    \tthe form of vA.B.C, where A, B, C are digits, e.g. v1.0.1. If not provided, current"
  echo -e "    \tdate/time will be used, i.e. YYYY-mm-DD-HH-MM-SS, where YYY is year, mm is month, DD"
  echo -e "    \tis day, HH is hour, MM is minute and SS is second, e.g. 2015-09-10-18-15-30. The second"
  echo -e "    \tcase is used for development."
  echo -e ""
  echo -e "Environment variable:"
  echo -e " PUSH_TO_REGISTRY\tSet to Y if the scripts needs to push new images to dockerhub, default value: N"
  echo -e " SYNC_CDN(not implemented)\tSet to Y if the scripts needs to publish static resources (images, JS, css) to CDN, default value: N"
}

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
  else
    # Tag used for the new image; the tag is also considered as release version.
    IMAGE_TAG=${1}
  fi
else
  IMAGE_TAG="latest"
fi

# build static resources with all the npm dependencies.
cd ${CONSOLE_WEB_ROOT}
docker run --rm \
       -v `readlink -f ${CONSOLE_WEB_ROOT}`:/app \
       index.caicloud.io/caicloud/node:4.4-interm \
       sh -c "npm install && make run"
cd -

# TODO: transform reference to CDN based path & upload all static resource to CDN

# build & push image
echo "+++++ Start building kubecon image"
cd ${CONSOLE_WEB_ROOT}
docker build -t index.caicloud.io/caicloud/console-web:${IMAGE_TAG} .
echo "Successfully built docker image index.caicloud.io/caicloud/kubecon:${IMAGE_TAG}"
cd -

# Decide if we need to push image to docker hub.
if [[ "$PUSH_TO_REGISTRY" == "Y" ]]; then
  echo ""
  echo "+++++ Start pushing kubecon image"
  docker push index.caicloud.io/caicloud/kubecon:${IMAGE_TAG}
fi
