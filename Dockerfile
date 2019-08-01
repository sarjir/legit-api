FROM node:latest
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app
RUN npm install -g nodemon
CMD [nodemon, app.js”]
EXPOSE 4000