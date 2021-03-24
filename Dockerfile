# Refer to the following regarding this image: 
# Put Your Containers on a Diet with Oracle Linux: https://blogs.oracle.com/developers/put-your-containers-on-a-diet-with-oracle-linux
# Docker Official Images: https://hub.docker.com/_/oraclelinux/
# GitHub OralceLinux Quick Ref: https://github.com/docker-library/docs/tree/master/oraclelinux
FROM oraclelinux:7-slim
MAINTAINER Kevin A. Baroni <kevin.baroni@cdcr.ca.gov>
 
# Params passed in
ARG APP_PORT
ARG APP_ENV
ARG NPM_RUN

RUN  yum -y install oracle-release-el7 oracle-nodejs-release-el7 && \
     yum-config-manager --disable ol7_developer_EPEL && \
     yum -y install oracle-instantclient19.3-basiclite nodejs && \
     rm -rf /var/cache/yum

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
RUN rm -rf .git; rm -rf .vscode; rm -rf test; rm -rf testdata; rm -rf scripts; rm -rf env.sample; rm -rf .env
# RUN ls -al

# Expose server port
EXPOSE ${APP_PORT}

# Commands to start the Node.js server app
CMD npm run ${NPM_RUN}
