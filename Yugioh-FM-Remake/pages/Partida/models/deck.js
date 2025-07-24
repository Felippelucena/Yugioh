// Sistema de Deck
export class Deck {
    constructor(cardDatabase, isOpponent = false) {
        this.cards = [];
        this.cardDatabase = cardDatabase;
        this.buildDeck(isOpponent);
        this.shuffle();
    }
    
    buildDeck(isOpponent) {
        // Deck básico com repetições permitidas
        const basicCards = isOpponent ? 
            [[3,3], [4,3], [5,3], [8,3], [9,3], [10,3], [11,3], [12,3], [13,3], [14,3], [15,2], [17,2], [18,2], [19,2], [20,2]] : // IA
            [[1,3], [2,3], [3,3], [4,3], [5,3], [6,3], [7,3], [8,3], [9,3], [10,3], [11,2], [12,2], [13,2], [16,2], [17,2]]; // Jogador

        for (let i = 0; i < basicCards.length; i++) {
            const [cardId, quantity] = basicCards[i];
            for (let j = 0; j < quantity; j++) {
                const originalCard = this.cardDatabase.getCard(cardId);
                this.cards.push(originalCard.clone());
            }
        }
    }
    
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    draw() {
        return this.cards.pop();
    }
    
    isEmpty() {
        return this.cards.length === 0;
    }
    
    size() {
        return this.cards.length;
    }
}