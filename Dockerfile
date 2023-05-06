FROM ubuntu:20.04
EXPOSE 2222
ARG DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8
RUN apt-get update
RUN apt-get install -y curl git sqlite3 nano openjdk-17-jdk openjdk-17-jre
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs
RUN git clone https://github.com/Trashpanda70/Pokemon-Stats-Page.git app
WORKDIR /app
RUN mkdir database/db-files io/output-files
RUN sqlite3 database/db-files/moves.db <init/moves.sql
RUN sqlite3 database/db-files/pokemon.db <init/pokemon.sql
RUN FIRSTRUN=yes node readData.js
RUN npm install
CMD npm run start
# docker build -t pokemon-stats-page .
# docker run -d -p 8080:2222 -v data:/app/database/db-files --name poke-stats pokemon-stats-page
