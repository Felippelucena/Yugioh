import { TurnTemplate } from "./turnTemplate.js";
// Fase de Compra
export class DrawPhase extends TurnTemplate {
    constructor(game) {
        super(game);
        this.name = "draw";
        this.displayName = "Compra";
    }

    onEnter() {
        
        // Executar compra automaticamente
        if (this.game.turnSystem.currentPlayer === this.game.player) {
            const card = this.game.player.drawCard();
            if (card) {
                this.game.log(`Você comprou: ${card.name}, atk: ${card.attack} def: ${card.defense}`);
            } else {
                this.game.endGame(this.game.opponent);
                return;
            }
        } else {
            const card = this.game.opponent.drawCard();
            if (card) {
                this.game.log(`Oponente comprou uma carta`);
            } else {
                this.game.endGame(this.game.player);
                return;
            }
        }

        // Avançar automaticamente após compra
        setTimeout(() => {
            this.game.turnSystem.nextPhase();
        }, 1000);
    }

    setupBehaviors() {
        // Nenhum comportamento especial durante a compra
    }

    setupButtons() {
    }
}