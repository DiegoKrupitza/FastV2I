#!/bin/sh
set -e

service=$1

echo "Dockerizing $service"

cd $service

repo=deryeger/dse-$service

docker build -t $repo .
docker push $repo
