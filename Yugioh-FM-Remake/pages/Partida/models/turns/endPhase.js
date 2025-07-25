import { TurnTemplate } from "./turnTemplate.js";

// Fase Final
export class EndPhase extends TurnTemplate {
    constructor(game) {
        super(game);
        this.name = "end";
        this.displayName = "Final";
    }

    onEnter() {
        this.game.log(`${this.game.turnSystem.currentPlayer.name} - Fase Final`);
        
        // Executar lógica de fim de turno automaticamente
        setTimeout(() => {
            this.game.turnSystem.nextTurn();
        }, 1000);
    }

    setupBehaviors() {
        // Nenhum comportamento especial na fase final
    }

    setupButtons() {
        // Nenhum botão ativo na fase final
        this.removeButtons();
    }
}