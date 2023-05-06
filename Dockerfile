FROM node:18-buster
EXPOSE 2222
RUN echo "INSTALL SYSTEM DEPENDENCIES"
RUN apt-get update
RUN apt-get install -y curl git sqlite3 nano openjdk-17-jdk openjdk-17-jre
RUN echo "PULL CODE FROM GITHUB"
RUN git clone https://github.com/Trashpanda70/Pokemon-Stats-Page.git app
WORKDIR /app
RUN echo "CREATE DATABASE FILES"
RUN mkdir database/db-files
RUN sqlite3 database/db-files/moves.db <init/moves.sql
RUN sqlite3 database/db-files/pokemon.db <init/pokemon.sql
RUN echo "READ DATA INTO DATABASE FILES"
RUN npm run update
RUN echo "INSTALL PROGRAM DEPENDENCIES AND START PROGRAM"
RUN npm install
CMD npm run start
