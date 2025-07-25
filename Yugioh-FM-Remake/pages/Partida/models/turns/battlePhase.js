import { TurnTemplate } from './turnTemplate.js';

// Fase de Batalha
export class BattlePhase extends TurnTemplate {
    constructor(game) {
        super(game);
        this.name = "battle";
        this.displayName = "Batalha";
    }

    onEnter() {
        if (this.game.turnSystem.turnCount === 1) this.game.turnSystem.nextPhase();

        this.game.log(`${this.game.turnSystem.currentPlayer.name} - Fase de Batalha`);
        if (this.game.turnSystem.currentPlayer === this.game.player) {
            this.game.log("Clique nos seus monstros para selecioná-los, depois clique nos monstros inimigos para atacar!");
        }
    }

    setupBehaviors() {
        if (this.game.turnSystem.currentPlayer === this.game.player) {
            this.setupBattleBehaviors();
        }
    }

    setupBattleBehaviors() {
        // Habilitar seleção de monstros próprios
        const playerMonsters = document.querySelectorAll('#player-field .yugioh-card');
        playerMonsters.forEach(cardElement => {
            cardElement.addEventListener('click', () => {
                const card = this.getCardFromField(cardElement, this.game.player.field);
                this.game.selectCard(card);
                this.game.updateUI();
            });
        });

        // Habilitar ataque aos monstros inimigos
        const opponentMonsters = document.querySelectorAll('#opponent-field .yugioh-card');
        opponentMonsters.forEach(cardElement => {
            cardElement.addEventListener('click', () => {
                if (this.game.selectedCard) {
                    const targetCard = this.getCardFromField(cardElement, this.game.opponent.field);
                    this.game.attackMonster(this.game.selectedCard, targetCard);
                    this.game.selectedCard = null;
                    this.game.updateUI();
                }
            });
        });

        // Permitir ataque direto se não houver monstros inimigos
        if (this.game.opponent.field.every(slot => slot === null)) {
            const opponentArea = document.getElementById('opponent-field');
            if (opponentArea) {
                opponentArea.addEventListener('click', () => {
                    if (this.game.selectedCard) {
                        this.game.directAttack(this.game.selectedCard, this.game.opponent);
                        this.game.selectedCard = null;
                        this.game.updateUI();
                    }
                });
            }
        }
    }

    setupButtons() {
        this.removeButtons();
        
    }


    getCardFromField(cardElement, field) {
        const cardName = cardElement.querySelector('.fw-bold').textContent;
        return field.find(card => card && card.name === cardName);
    }
}