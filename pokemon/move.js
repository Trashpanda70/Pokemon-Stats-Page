class Move {
  constructor(name, type, category, power, accuracy, pp, description) {
    this.name = name; //string
    this.type = type; //string
    this.category = category; //string
    this.power = power; //int
    this.accuracy = accuracy; //int
    this.pp = pp; //int
    this.description = description; //string
  }
}

module.exports = Move;