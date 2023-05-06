# About

Reads Pokemon stats from a file formatted for Pokemon Essentials v19 (v20 support might come idk) and displays the data on a webpage via a self hosted web server. The application runs in Docker, so you need to have Docker installed. It will save the data into a SQLite Database (stored via a Docker Volume).

All of this is being done locally because:

- I do not want to pay for hosting
- I do not know how to handle security stuff for the API and Database
- I want to practice using Docker
- Are enough people really gonna use this to warrant hosting?

Note that because it runs in Docker, you do not need to have NodeJS, SQLite3, or any other dependencies installed, just Docker.

Support might soon come for having executable file since NodeJS v20 supports [making executable files that can run on machines without NodeJS](https://nodejs.org/api/single-executable-applications.html). But this would be something for the future.

To check for updates you can follow [these instructions](#how-do-i-check-for-updates)

## **Installing Docker**

### Windows

- Check to make sure virtualization is enabled on your machine. You can do that by following the instructions [here](https://support.bluestacks.com/hc/en-us/articles/360058102252-How-to-enable-Virtualization-VT-on-Windows-10-for-BlueStacks-5#:~:text=A.%20To%20check%20if%20Virtualization,then%20Virtualization%20is%20turned%20on.). This is referred to as "BIOS-level hardware virtualization support" in the install instructions on Docker's website.
- You need either WSL or Hyper-V activated/installed.
  - I could not get Hyper-V working on my machine personally, but you can try the steps [here](https://techcommunity.microsoft.com/t5/itops-talk-blog/step-by-step-enabling-hyper-v-for-use-on-windows-10/ba-p/267945) to see if you can get it to work.
  - For WSL, if you do not already have it, follow steps 1-6 [here](https://learn.microsoft.com/en-us/windows/wsl/install-manual). For your distribution of choice I would suggest Ubuntu but that is up to you.
- Then follow [these instructions](https://docs.docker.com/desktop/install/windows-install/#install-docker-desktop-on-windows) from Docker's website.
  - If you need to add your account to the _docker-users_ group, do the following instead of following the directions in the instructions:
  1. In the search bar, type "Command Prompt" and run it as an administrator.
  2. Type `net localgroup docker-users {USER} /add` where {USER} is the name of your account.

### Mac

- Follow [these instructions](https://docs.docker.com/desktop/install/mac-install/) from Docker's website.
- Or you can install it using [Homebrew](https://brew.sh/) which is a very useful package manager for MacOS. Instructions are [Here](https://www.cprime.com/resources/blog/docker-for-mac-with-homebrew-a-step-by-step-tutorial/).

### Linux

- Follow [these instructions](https://docs.docker.com/desktop/install/linux-install/) from Docker's website.

## **Running the App**

To run the app you need to open a shell/terminal on your machine and run the following command:

`docker run -d -p 8080:2222 -v data:/app/database/db-files --name poke-stats mdwelker/pokemon-stats-page`

- Then simply open your browser and type `localhost:8080` and the page should be loaded.

### **Extra Info**

If you are curious about what this command is doing, here is an explanation of the individual parts:

- **docker run** - This is the command used to start a new docker container.
  - Think of it as a container because all the code and dependencies and stuff for the program are "contained" separate from the rest of the stuff on your computer
- **-d** - Option that says to run the container as a [background process](https://en.wikipedia.org/wiki/Background_process)
- **-p 8080:2222** - Option that exposes a port on your machine to the container, this is necessary to show the app in your browser.
  - What this is actually doing is saying _"link port 8080 on my machine to port 2222 in the container"_. The code uses port 2222, so this cannot be changed. But what you can change is the first port number. If you change this number to something else, like _6969_, then you would access the app by typing `localhost:6969` in your browser rather than `localhost:8080`.
  - If you want to be able to just type `localhost` in the browser and access the app, then use port _80_.
- **-v data:/app/database/db-files** - Option that specified to create/use a Docker Volume for data storage. This means that you can stop the app and start it again, and all data is saved.
  - The only data that really needs to be saved is the database files that have the information for Pokemon and Moves, but more could be added if I upgrade the app.
  - The volume created is called "data" and "/app/database/db-files" is the file path in the container where the database files are located.
- **--name poke-stats** - Specifies the name of the container. This is useful if you want to start/stop the container using the instructions [here](#how-do-i-stop-this-thing-from-running-and-start-it-again-later), as you only need to type the name.
  - This is completely optional, and removing it will not effect the app itself.
- **mdwelker/pokemon-stats-page** - The name of the Docker Image to use. Think of the Image as the environment the app runs in. It has all the dependencies and files the app needs to function. I created this image and uploaded it to [Docker Hub](https://hub.docker.com/repository/docker/mdwelker/pokemon-stats-page/general), and the command will download the image so that the app can run in the environment I configured for it.
- If you do not believe my explanations go read up on it yourself [here](https://docs.docker.com/engine/reference/commandline/run/)

## **Help**

### **How do I open a Terminal/Shell?**

If you are unsure of what "open a shell/terminal" means, you can find your shell/terminal on your operating system as follows:

#### Windows:

- Using the search function on your task bar, search for either "Powershell" or "Command Prompt" and open the app when it appears in search
- Alternatively you can download [Git Bash](https://git-scm.com/download/win), and then right click on your desktop (or inside any folder really) and click the "Git Bash Here" option.

#### Mac:

- Open Spotlight Search by clicking the magnifying glass in the top right or pressing the command key and spacebar at the same time. Then type "terminal" and open the terminal application. You also might be able to find it in launchpad.

#### Linux:

- I would be shocked if you used Linux and did not know how to open your terminal/shell.
- That said, you can most likely either search for "terminal" in your search bar/function, or press Control+Alt+T.

### **How do I stop this thing from running and start it again later?**

If you want to stop the container from running, you can use the following command (in a terminal):

`docker stop poke-stats`

- If you modified the name of the container (changing what comes after _--name_ in the run command), then use that name instead of _poke-stats_
- If you deleted the _--name_ option from the run command, then you need to use the random string of numbers and letters that was printed to the terminal instead of the name when you first ran the container. If you do not remember this string, or did not save it, then just use `docker stop $(docker ps -a -q)`, which will stop all running containers.
  - Alternatively, you could open the Docker Desktop application and manually look for and stop the container.

To start the container again, use the following command:

`docker start {name}`

- Here, _{name}_ is the name of the container (_poke-stats_ by default). If you had to stop the container using a different name, use that name to start it again.
  - Alternatively you could open the Docker Desktop application and manually look for and start the container

### **How do I check for updates?**

If you want to check the app for updates you can follow the following steps:

1. Make sure the container is running (i.e. not stopped). You can do this by running `docker ps --filter "status=running" --format "{{.Names}}" --quiet` in a terminal. This command will output the name of all running containers. If you do not see _poke-stats_ (or the name of the container if you changed it), then make sure to [start the container](#how-do-i-stop-this-thing-from-running-and-start-it-again-later) again.

2. Run the following command in a terminal, which will run the update script for the app, again replacing _poke-stats_ with the name of the container if you changed it: `docker exec poke-stats npm run update`
