FROM node:latest

# make the 'asrcpp' folder the current working directory
WORKDIR /frontend/

# install project dependencies
RUN npm install -g @vue/cli

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

CMD [ "npm", "run", "serve" ]
