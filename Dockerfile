FROM index.caicloud.io/caicloud/node:4.4-slim

EXPOSE 8000

RUN sed -i "s/httpredir.debian.org/mirrors.163.com/g" /etc/apt/sources.list && \
    apt-get update && apt-get install -y --no-install-recommends \
    git \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

# Avoid first connection host confirmation
RUN mkdir /root/.ssh
RUN ssh-keyscan github.com > /root/.ssh/known_hosts

WORKDIR /app
ADD . /app/

# only install the necessary run time dependencies
RUN npm install --production

# Set the default timezone to Shanghai
RUN echo "Asia/Shanghai" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

CMD ["make", "publish"]
