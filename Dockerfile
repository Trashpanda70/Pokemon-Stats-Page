FROM ubuntu:22.04
# Expose SQL port and API port
EXPOSE 3306/tcp
EXPOSE 8080/tcp
# Install necessary apt packages and nodejs
RUN apt-get update
RUN apt-get install -y curl systemctl mysql-server
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && apt-get install -y nodejs
# Set up directory for app
RUN mkdir app
COPY package.json /app/
COPY *.sql /app/
COPY *.js /app/
# start mysql service and set up (test for now) database
RUN systemctl start mysql.service
RUN mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'pass';"
RUN mysql -u root -ppass -e < test-init.sql
WORKDIR /app
# install dependencies and start program
RUN npm install
CMD npm start