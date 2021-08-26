FROM node:alpine
WORKDIR /www

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# RUN npm install nodemon -g
RUN npm install pm2 -g
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
ENV NODE_ENV production
# CMD nodemon app.js
CMD pm2-runtime app.js