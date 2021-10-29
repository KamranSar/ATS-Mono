# Refer to the following regarding this image: 
# Nodejs.org LTS Downloads: https://nodejs.org/en/download/
# Docker Official Images: https://hub.docker.com/_/node/
# GitHub Node Quick Ref: https://github.com/docker-library/docs/tree/master/node
FROM node:14.16.0-alpine3.13
MAINTAINER Tim Gaither <dallas.weinrich@cdcr.ca.gov>

# Params passed in
ARG APP_PORT
ARG APP_ENV
ARG NPM_RUN

# The latest alpine images don't have a lot of necessary tools
# Install bash and some other network tools
RUN apk add --no-cache bash net-tools

# Create working directory and go into it
RUN mkdir -p /app &&  \
    chmod a=rwx -R /app
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH and set other impostant variables
ENV PATH=/app/node_modules/.bin:$PATH \
    NODE_ENV=${APP_ENV} \
    NODE_PATH=/app \
    NPM_RUN=${NPM_RUN}

# Copy everything into the image
COPY  . .

# Install Packages
# --unsafe-perm option allows preinstall script to be run during Docker build
RUN cd /app  &&  npm install --unsafe-perm
# RUN ls -al

# Remove unnecessary files & folders to reduce image size & improve security
RUN rm -rf .git .vscode test testdata scripts env.sample .env /usr/bin/cat
# RUN ls -al

# Expose server port
EXPOSE ${APP_PORT}

# Commands to start the Node.js server app
CMD npm run ${NPM_RUN}
