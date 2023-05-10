const { execSync } = require("child_process");
const { readMoves, readPokemon, readAbilities } = require('./io/readYAML');
// read data in
(async () => {
  let str = execSync("git pull"); //pull possible changes
  if (!str.includes("Already up to date.") || process.env.FIRSTRUN == "yes") { // eslint-disable-line no-undef
    execSync("cd io && javac -d bin java_src/*.java");
    execSync("cd io && java -cp bin FileToYaml");
    await readMoves();
    await readPokemon();
    await readAbilities();
  }
})();
