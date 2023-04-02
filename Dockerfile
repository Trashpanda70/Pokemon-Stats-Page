FROM ubuntu:22.04
EXPOSE 3306/tcp
EXPOSE 8080/tcp
RUN apt-get update
RUN apt-get install -y curl git systemctl mysql-server
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && apt-get install -y nodejs
RUN systemctl start mysql.service
RUN mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'pass';"
RUN mysql -u root -ppass -e < test-init.sql
RUN git clone https://github.com/Trashpanda70/Pokemon-Stats-Page.git app
WORKDIR /app
RUN npm install
CMD npm start