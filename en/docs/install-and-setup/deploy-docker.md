# Deploy on Docker

## Prerequisites

* [Docker](https://www.docker.com/get-docker) v17.09.0 or above
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) client

## WSO2 Healthcare Solution API Manager

This section defines the step-by-step instructions to build an [Alpine](https://hub.docker.com/_/alpine)
Linux based Docker image for WSO2 Healthcare Solution API Manager version `4.0.0`.

### How to build an image and run

##### 1. Checkout this repository into your local machine using the following Git client command.

  ```
  git clone https://github.com/wso2-enterprise/open-healthcare-docker.git
  ```

> The local copy of the `apim` directory will be referred to as `AM_DOCKERFILE_HOME` from this point onwards.

##### 2. Place the chosen Open Healthcare accelerators and custom artifacts in the image build context.

- Place the chosen version of the [Open Healthcare API Manager accelerator artifact](https://github.com/wso2-enterprise/open-healthcare-apim/releases)
  in the `<AM_DOCKERFILE_HOME>/resources/accelerator` directory.

- [Optional] Place any customer specific Open Healthcare artifacts in the `<AM_DOCKERFILE_HOME>/resources/healthcare`
  directory. The artifacts need to be placed in the aforementioned directory in such a way that, they resemble the
  directory structure within the product pack.

##### 3. Build the Docker image.

- Navigate to `<AM_DOCKERFILE_HOME>` directory.
  
- Execute `docker build` command. An example is provided below.

  ```
  docker build \
  --build-arg BASE_DOCKER_IMAGE_REGISTRY=<CONTAINER_REGISTRY_IDENTIFIER> \
  --build-arg BASE_PRODUCT_VERSION=<BASE_PRODUCT_VERSION> \
  --build-arg OH_ACCELERATOR_VERSION=<OH_APIM_ACCELERATOR_VERSION> \
  -t wso2open-healthcare-am:4.0.0 .
  ```

The aforementioned Dockerfile build arguments are explained below.

- `BASE_DOCKER_IMAGE_REGISTRY`: `Hostname:Port` identifier of the Docker image registry hosting the base product image.


  For example, if you are referencing the [official WSO2 Private Docker registry image](https://docker.wso2.com/tags.php?repo=wso2am)
  you may set this parameter to `docker.wso2.com`.
  
  By default, this is set to `docker.wso2.com`.
  
- `BASE_PRODUCT_VERSION`: The API Manager product version and optionally the update level.


  For example, if you are referencing the [official WSO2 Private Docker registry image](https://docker.wso2.com/tags.php?repo=wso2am),
  the tag `4.0.0.0` references the latest [WSO2 U2](https://updates.docs.wso2.com/en/latest/) Update level (fourth digit `0`) whereas
  if you want to refer to a particular Update level, the pattern would be `4.0.0.<upate_level>`.

  By default, this is set to the latest U2 Update level tag `4.0.0.0`.

- `OH_ACCELERATOR_VERSION`: Open Healthcare API Manager accelerator release version deployed in step [2].

##### 4. Running the Docker image.

- `docker run -it -p 9443:9443 wso2open-healthcare-am:4.0.0`

> Here, only port 9443 (HTTPS servlet transport) has been mapped to a Docker host port.
You may map other container service ports, which have been exposed to Docker host ports, as desired.

##### 5. Accessing management console.

- To access the management console, use the docker host IP and port 9443.
    + `https://<DOCKER_HOST>:9443/carbon`

> In here, <DOCKER_HOST> refers to hostname or IP of the host machine on top of which containers are spawned.

## WSO2 Healthcare Solution Micro Integrator

This section defines the step-by-step instructions to build an [Alpine](https://hub.docker.com/_/alpine)
Linux based Docker image for WSO2 Healthcare Solution Micro Integrator version `4.0.0`.

### How to build an image and run

##### 1. Checkout this repository into your local machine using the following Git client command.

  ```
  git clone https://github.com/wso2-enterprise/open-healthcare-docker.git
  ```

> The local copy of the `micro-integrator` directory will be referred to as `MI_DOCKERFILE_HOME` from this point onwards.

##### 2. Place the chosen Open Healthcare accelerators and custom artifacts in the image build context.

- Place the chosen version of the [Open Healthcare Micro Integrator accelerator artifact](https://github.com/wso2-enterprise/open-healthcare-integration/releases)
  in the `<MI_DOCKERFILE_HOME>/resources/accelerator` directory.

- [Optional] Place any customer specific Open Healthcare artifacts in the `<MI_DOCKERFILE_HOME>/resources/healthcare`
  directory. The artifacts need to be placed in the aforementioned directory in such a way that, they resemble the
  directory structure within the product pack.

##### 3. Build the Docker image.

- Navigate to `<MI_DOCKERFILE_HOME>` directory.

- Execute `docker build` command. An example is provided below.

  ```
  docker build \
  --build-arg BASE_DOCKER_IMAGE_REGISTRY=<CONTAINER_REGISTRY_IDENTIFIER> \
  --build-arg BASE_PRODUCT_VERSION=<BASE_PRODUCT_VERSION> \
  --build-arg OH_ACCELERATOR_VERSION=<OH_MI_ACCELERATOR_VERSION> \
  -t wso2open-healthcare-mi:4.0.0 .
  ```

The aforementioned Dockerfile build arguments are explained below.

- `BASE_DOCKER_IMAGE_REGISTRY`: `Hostname:Port` identifier of the Docker image registry hosting the base product image.


For example, if you are referencing the [official WSO2 Private Docker registry image](https://docker.wso2.com/tags.php?repo=wso2mi)
you may set this parameter to `docker.wso2.com`.

By default, this build argument set to `docker.wso2.com`.

- `BASE_PRODUCT_VERSION`: The Micro Integrator product version and optionally the update level.


For example, if you are referencing the [official WSO2 Private Docker registry image](https://docker.wso2.com/tags.php?repo=wso2mi),
the tag `4.0.0.0` references the latest [WSO2 U2](https://updates.docs.wso2.com/en/latest/) Update level (fourth digit `0`) whereas
if you want to refer to a particular Update level, the pattern would be `4.0.0.<upate_level>`.

By default, this is set to the latest U2 Update level tag `4.0.0.0`.

- `OH_ACCELERATOR_VERSION`: Open Healthcare Micro Integrator accelerator release version deployed in step [2].

##### 4. Running the Docker image.

- `docker run -it -p 8253:8253 -p 8290:8290 wso2open-healthcare-mi:4.0.0`

## Docker command usage references

* [Docker build command reference](https://docs.docker.com/engine/reference/commandline/build/)
* [Docker run command reference](https://docs.docker.com/engine/reference/run/)
* [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)