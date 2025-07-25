
// Classe base para cartas
export class Card {
    constructor(id, name, type, attack, defense, attribute, monsterType) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.attack = attack;
        this.defense = defense;
        this.attribute = attribute;
        this.monsterType = monsterType;
        this.position = 'hand'; // hand, field, fusion
        this.owner = null;
    }
    
    clone() {
        return new Card(this.id, this.name, this.type, this.attack, this.defense, this.attribute, this.monsterType);
    }
}

// Sistema de Cartas - Banco de dados local
export class CardDatabase {
    constructor() {
        this.cards = [
            new Card(1, "Dragão Azul Olhos Brancos", "Monster", 3000, 2500, "Light", "Dragon"),
            new Card(2, "Mago Negro", "Monster", 2500, 2100, "Dark", "Spellcaster"),
            new Card(3, "Fissura", "Monster", 1000, 1200, "Earth", "Beast"),
            new Card(4, "Elfo Místico", "Monster", 800, 2000, "Light", "Spellcaster"),
            new Card(5, "Soldado da Pedra", "Monster", 1300, 2000, "Earth", "Rock"),
            new Card(6, "Dragão Vermelho", "Monster", 1400, 1200, "Fire", "Dragon"),
            new Card(7, "Bruxa Negra", "Monster", 1000, 1500, "Dark", "Spellcaster"),
            new Card(8, "Guerreiro Celta", "Monster", 1400, 1200, "Earth", "Warrior"),
            new Card(9, "Mammoth Graveyard", "Monster", 1200, 800, "Earth", "Dinosaur"),
            new Card(10, "Dragão de Duas Cabeças", "Monster", 1200, 1500, "Fire", "Dragon"),
            new Card(11, "Goblin de Ataque", "Monster", 2300, 0, "Earth", "Warrior"),
            new Card(12, "Uraby", "Monster", 1500, 800, "Earth", "Dinosaur"),
            new Card(13, "La Jinn", "Monster", 1800, 1000, "Dark", "Fiend"),
            new Card(14, "Ryu-Kishin", "Monster", 1000, 500, "Dark", "Fiend"),
            new Card(15, "Gaia Cavaleiro", "Monster", 2300, 2100, "Earth", "Warrior"),
            new Card(16, "Dragão de Prata", "Monster", 1800, 1700, "Light", "Dragon"),
            new Card(17, "Ansatsu", "Monster", 1700, 1200, "Earth", "Warrior"),
            new Card(18, "Orc de Batalha", "Monster", 1700, 1000, "Earth", "Beast-Warrior"),
            new Card(19, "Homem-Lobo", "Monster", 1200, 800, "Earth", "Beast-Warrior"),
            new Card(20, "Dragão Negro", "Monster", 1600, 1200, "Dark", "Dragon"),
            // Fusões
            new Card(21, "Dragão Flamejante", "Monster", 2400, 2000, "Fire", "Dragon"),
            new Card(22, "Mago Supremo", "Monster", 3500, 3000, "Dark", "Spellcaster"),
            new Card(23, "Gigante de Pedra", "Monster", 2200, 2800, "Earth", "Rock"),
            new Card(24, "Dragão Temporal", "Monster", 4000, 3500, "Light", "Dragon"),
            new Card(25, "Guerreiro Sombrio", "Monster", 2800, 2300, "Dark", "Warrior"),
            new Card(26, "Besta Feroz", "Monster", 2600, 1800, "Earth", "Beast"),
            new Card(27, "Dragão Místico", "Monster", 3200, 2800, "Light", "Dragon"),
            new Card(28, "Feiticeiro Negro", "Monster", 2800, 2500, "Dark", "Spellcaster"),
            new Card(29, "Titã de Ferro", "Monster", 2500, 3000, "Earth", "Machine"),
            new Card(30, "Imperador Dragão", "Monster", 4500, 4000, "Fire", "Dragon")
        ];
    }
    
    getCard(id) {
        return this.cards.find(card => card.id === id);
    }
    
    getAllCards() {
        return this.cards;
    }
}
