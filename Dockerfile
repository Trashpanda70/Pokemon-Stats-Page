FROM ubuntu:22.04
# Expose API Port
EXPOSE 8080/tcp
# Install necessary apt packages and nodejs
RUN apt-get update
RUN apt-get install -y curl sqlite3
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && apt-get install -y nodejs
# Set up directory for app
RUN mkdir app
COPY package.json /app/
COPY *.sql /app/
COPY *.js /app/
COPY .eslintrc.json /app/
WORKDIR /app
# create sqlite3 (test) database
RUN mkdir db
RUN sqlite3 db/todos.db < test-init.sql
# install dependencies and start program
RUN npm install
CMD npm start
