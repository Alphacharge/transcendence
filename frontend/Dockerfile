FROM node:lts

# install simple http server for serving static content
# RUN npm install -g http-server

# make the 'asrcpp' folder the current working directory
WORKDIR /frontend/

# copy both 'package.json' and 'package-lock.json' (if available)
# COPY package*.json ./

# install project dependencies
RUN npm install -g @vue/cli

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
# RUN npm run build

# CMD [ "http-server", "dist" ]
CMD [ "npm", "run", "serve" ]
