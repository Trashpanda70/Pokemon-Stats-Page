public record Move(String name, String type, String category, int power, int accuracy, int pp, String description) {
    //category is physical, special, or status
    @Override
    public String toString() {
        String space = "    ";
        return "  " + name + ":" + "\n" +
                space + "type: " + type + "\n" +
                space + "category: " + category + "\n" +
                space + "power: " + power + "\n" +
                space + "accuracy: " + accuracy + "\n" +
                space + "pp: " + pp + "\n" +
                space + "description: " + description;
    }
}
