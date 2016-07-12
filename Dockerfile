FROM index.caicloud.io/caicloud/node:4.4-slim

EXPOSE 8000

WORKDIR /app
ADD . /app/

# only install the necessary run time dependencies
RUN npm install --production

# Set the default timezone to Shanghai
RUN echo "Asia/Shanghai" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

CMD ["node", "app.js"]
