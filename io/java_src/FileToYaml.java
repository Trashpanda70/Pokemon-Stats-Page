import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Scanner;

/**
 * Reads the pokemon.txt PBS file and converts it to YAML format which is easier to process in nodeJS
 * I am more comfortable with IO in Java than Node and can parse the file easier here to convert to YAML for
 * easy use in Node
 */
public class FileToYaml {
    public static void outputPokemon(String infile, String outfile) {
        ArrayList<String> names = new ArrayList<>();
        ArrayList<Pokemon> pokemon = new ArrayList<>();
        try(Scanner fileScan = new Scanner(new FileInputStream(infile))) {
            Files.deleteIfExists(Path.of(outfile));
            PrintWriter yamlWriter = new PrintWriter(new FileOutputStream(outfile));
            fileScan.nextLine();
            fileScan.useDelimiter("#-------------------------------");
            while (fileScan.hasNext()) {
                Scanner sc = new Scanner(fileScan.next());
                String name = null, type1 = null, type2 = "", stats = null, evs = null, abils = null, hiddenAbils = null;
                String movesString = null, tutorMoves = null, eggMoves = null, eggGroups = null;
                while (sc.hasNextLine()) {
                    String[] line = sc.nextLine().split(" = ");
                    switch (line[0]) {
                        case "Name" -> name = line[1];
                        case "Type1" -> type1 = line[1].toLowerCase();
                        case "Type2" -> type2 = line[1].toLowerCase();
                        case "BaseStats" -> stats = line[1];
                        case "EffortPoints" -> evs = line[1];
                        case "Abilities" -> abils = line[1].toLowerCase();
                        case "HiddenAbility" -> hiddenAbils = line[1].toLowerCase();
                        case "Moves" -> movesString = line[1];
                        case "TutorMoves" -> tutorMoves = line[1].toLowerCase();
                        case "EggMoves" -> eggMoves = line[1].toLowerCase();
                        case "Compatibility" -> eggGroups = line[1];
                    }
                }
                //get moves strings for levels and names separated
                assert movesString != null;
                String[] movesArr = movesString.split(",");
                StringBuilder moveLevels = new StringBuilder();
                StringBuilder moveNames = new StringBuilder();
                for (int i = 0; i < movesArr.length; i++) {
                    if (i % 2 == 0)
                        moveLevels.append(movesArr[i]).append(",");
                    else
                        moveNames.append(movesArr[i].toLowerCase()).append(",");
                }
                moveNames.delete(moveNames.length() - 1, moveNames.length());
                moveLevels.delete(moveLevels.length() - 1, moveLevels.length());
                //join types together
                String types = "".equals(type2) ? type1 : type1 + "," + type2;
                names.add(name);
                pokemon.add(new Pokemon(name, types, stats, evs, abils, hiddenAbils, moveLevels.toString(),
                        moveNames.toString(), tutorMoves, eggMoves, eggGroups));
            }
            yamlWriter.println("---\nNames:");
            names.forEach((name) -> yamlWriter.println("  - " + name));
            yamlWriter.println("\nPokemon:");
            pokemon.forEach((poke) -> yamlWriter.println(poke.toString()));
            yamlWriter.close();
        } catch (IOException e) {
            System.out.println("IOException occurred.");
            e.printStackTrace();
            System.exit(1);
        }
    }

    public static void outputMoves(String infile, String outfile) {
        try(Scanner fileScan = new Scanner(new FileInputStream(infile))) {
            Files.deleteIfExists(Path.of(outfile));
            PrintWriter yamlWriter = new PrintWriter(new FileOutputStream(outfile));
            ArrayList<String> names = new ArrayList<>();
            ArrayList<Move> moves = new ArrayList<>();
            while (fileScan.hasNextLine()) {
                String name, type, category, description;
                int power, accuracy, pp;
                String str = fileScan.nextLine();
                //skip BOM and #
                if (!Character.isDigit(str.charAt(0)))
                    continue;
                Scanner lineScan = new Scanner(str);
                lineScan.useDelimiter(",");
                //need to skip some values
                lineScan.next();
                name = lineScan.next().toLowerCase();
                lineScan.next();
                lineScan.next();
                power = lineScan.nextInt();
                type = lineScan.next().toLowerCase();
                category = lineScan.next();
                accuracy = lineScan.nextInt();
                pp = lineScan.nextInt();
                lineScan.next(); lineScan.next(); lineScan.next(); lineScan.next();
                description = lineScan.nextLine().substring(1);
                names.add(name);
                //change 0 accuracy to 999 to represent infinite
                if (accuracy == 0)
                    accuracy = 999;
                moves.add(new Move(name, type, category, power, accuracy, pp, description));
                lineScan.close();
            }
            yamlWriter.println("---\nNames:");
            names.forEach((name) -> yamlWriter.println("  - " + name));
            yamlWriter.println("\nMoves:");
            moves.forEach((move) -> yamlWriter.println(move.toString()));
            yamlWriter.close();
        } catch (IOException e) {
            System.out.println("IOException occurred.");
            e.printStackTrace();
            System.exit(1);
        }
    }

    public static void main(String[] args) {
        outputPokemon("./input-files/pokemon.txt", "./output-files/pokemon.yml");
        outputMoves("./input-files/moves.txt", "./output-files/moves.yml");
    }
}
