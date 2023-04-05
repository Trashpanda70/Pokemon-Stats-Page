FROM ubuntu:22.04
# Expose API Port
EXPOSE 8080/tcp
# Install necessary apt packages and nodejs
RUN apt-get update
RUN apt-get install -y curl git sqlite3 nano
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && apt-get install -y nodejs
# Set up directory for app
RUN git clone https://github.com/Trashpanda70/Pokemon-Stats-Page.git app
WORKDIR /app
# create sqlite3 (test) database
RUN mkdir db-files
RUN sqlite3 db-files/todos.db < test-init.sql
# install dependencies and start program
RUN npm install
CMD /bin/bash
