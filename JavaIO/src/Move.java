public record Move(String name, String type, String category, int power, int accuracy, int pp, String description) {
    //category is physical, special, or status
    @Override
    public String toString() {
        String space = "    ";
        return "  - m_name: " + name + "\n" +
                space + "m_type: " + type + "\n" +
                space + "m_category: " + category + "\n" +
                space + "m_power: " + power + "\n" +
                space + "m_accuracy: " + accuracy + "\n" +
                space + "m_pp: " + pp + "\n" +
                space + "m_description: " + description;
    }
}
