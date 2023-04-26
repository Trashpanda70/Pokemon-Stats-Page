public record Pokemon(String name, String types, String baseStats, String evs, String abilities, String hiddenAbilities,
                      String moveLevels, String moves, String tutorMoves, String eggMoves, String eggGroups) {
    @Override
    public String toString() {
        String space = "    ";
        return "  - p_name: " + name + "\n" +
                space + "p_types: " + types + "\n" +
                space + "p_base_stats: \"" + baseStats + "\"\n" +
                space + "p_evs: \"" + evs + "\"\n" +
                space + "p_abilities: " + abilities + "\n" +
                space + "p_hidden_abilities: " + hiddenAbilities + "\n" +
                space + "p_move_levels: \"" + moveLevels + "\"\n" +
                space + "p_moves: " + moves + "\n" +
                space + "p_tutor_moves: " + tutorMoves + "\n" +
                space + "p_egg_moves: " + eggMoves + "\n" +
                space + "p_egg_groups: " + eggGroups;
    }
}
