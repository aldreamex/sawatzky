FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /home/app/front
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /home/app/front
USER node
CMD ["npm", "start"]