# Use an official Node.js LTS image as a base image
FROM node:lts

# Set the working directory to /backend/
WORKDIR /backend/

# Copy the script into the container
COPY entrypoint.sh /script/entrypoint.sh

# Make the script executable
RUN chmod 777 /script/entrypoint.sh

# Set the script as the entry point
ENTRYPOINT ["/script/entrypoint.sh"]