public record Pokemon(String name, String types, String baseStats, String evs, String abilities, String hiddenAbilities,
                      String moveLevels, String moves, String tutorMoves, String eggMoves, String eggGroups) {
    @Override
    public String toString() {
        String space = "    ";
        return "  " + name + ":" + "\n" +
                space + "types: " + types + "\n" +
                space + "base_stats: \"" + baseStats + "\"\n" +
                space + "evs: \"" + evs + "\"\n" +
                space + "abilities: " + abilities + "\n" +
                space + "hidden_abilities: " + types + "\n" +
                space + "move_levels: \"" + moveLevels + "\"\n" +
                space + "moves: " + moves + "\n" +
                space + "tutor_moves: " + tutorMoves + "\n" +
                space + "egg_moves: " + eggMoves + "\n" +
                space + "egg_groups: " + eggGroups;
    }
}
