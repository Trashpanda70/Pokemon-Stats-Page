const { execSync } = require("child_process");
const { readMoves, readPokemon } = require('./io/readYAML');
// read data in
(async () => {
  let str = execSync("git pull"); //pull possible changes
  if (!str.includes("Already up to date.")) {
    execSync("cd io && javac -d bin java_src/*.java");
    execSync("cd io && java -cp bin FileToYaml");
    await readMoves();
    await readPokemon();
  }
})();
