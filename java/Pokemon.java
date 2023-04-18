public record Pokemon(String name, String types, String baseStats, String evs, String abilities, String hiddenAbilities,
                      String moveLevels, String moves, String tutorMoves, String eggMoves, String eggGroups) {
    @Override
    public String toString() {
        //using stringbuilder because this will be looped
        String space = "    ";
        StringBuilder sb = new StringBuilder();
        sb.append("  ").append(name).append(":").append("\n");
        sb.append(space).append("types: ").append(types).append("\n");
        sb.append(space).append("base_stats: \"").append(baseStats).append("\"\n");
        sb.append(space).append("evs: \"").append(evs).append("\"\n");
        sb.append(space).append("abilities: ").append(abilities).append("\n");
        sb.append(space).append("hidden_abilities: ").append(types).append("\n");
        sb.append(space).append("move_levels: \"").append(moveLevels).append("\"\n");
        sb.append(space).append("moves: ").append(moves).append("\n");
        sb.append(space).append("tutor_moves: ").append(tutorMoves).append("\n");
        sb.append(space).append("egg_moves: ").append(eggMoves).append("\n");
        sb.append(space).append("egg_groups: ").append(eggGroups);
        return sb.toString();
    }
}
