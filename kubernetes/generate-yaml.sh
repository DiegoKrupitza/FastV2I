#!/usr/bin/env bash

# rabbitmq
kubectl create deployment rabbitmq --image=rabbitmq:management-alpine --dry-run=client -o=yaml > rabbitmq-deployment.yaml
kubectl create service clusterip rabbitmq-service --tcp=5672:5672,15672:15672 --dry-run=client -o=yaml > rabbitmq-service.yaml

# entity-service
kubectl create deployment entity --image=deryeger/dse-entity-service --dry-run=client -o=yaml > entity-deployment.yaml
kubectl create service clusterip entity-service --tcp=8889:8889 --dry-run=client -o=yaml > entity-service.yaml


# flowcontrol-service
kubectl create deployment flowcontrol --image=deryeger/dse-flowcontrol-service --dry-run=client -o=yaml > flowcontrol-deployment.yaml
kubectl create service clusterip flowcontrol-service --tcp=8087:8087 --dry-run=client -o=yaml > flowcontrol-service.yaml

# gateway
kubectl create deployment gateway --image=deryeger/dse-gateway --dry-run=client -o=yaml > gateway-deployment.yaml
kubectl create service clusterip gateway-service --tcp=8080:8080 --dry-run=client -o=yaml > gateway-service.yaml

# simulator
kubectl create deployment simulator --image=deryeger/dse-simulator-service --dry-run=client -o=yaml > simulator-deployment.yaml
kubectl create service clusterip simulator-service --tcp=8081:8081 --dry-run=client -o=yaml > simulator-service.yaml

# tracking
kubectl create deployment tracking --image=deryeger/dse-tracking-service --dry-run=client -o=yaml > tracking-deployment.yaml
kubectl create service clusterip tracking-service --tcp=8081:8081 --dry-run=client -o=yaml > tracking-service.yaml