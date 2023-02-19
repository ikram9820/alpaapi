FROM node:19
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ] \
        then npm insatll; \
        else npm isntall --only=production; \
        fi
COPY . . 
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]