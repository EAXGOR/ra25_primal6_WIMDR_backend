FROM node:12

# create app directory
WORKDIR /code

# copy package.json
COPY package.json /code

# install dependencies in production env
RUN yarn install --production

#copy src
COPY dist /code/dist

#expose the default port for now
EXPOSE 4000

CMD [ "node", "dist/server.js" ]
