// Sistema de Turnos
export class TurnSystem {
    constructor() {
        this.currentPhase = "draw"; // draw, main1, battle, main2, end
        this.currentPlayer = null;
        this.turnCount = 1;
    }
    
    nextPhase() {
        const phases = ["draw", "main1", "battle", "main2", "end"];
        const currentIndex = phases.indexOf(this.currentPhase);
        
        if (currentIndex < phases.length - 1) {
            this.currentPhase = phases[currentIndex + 1];
        } else {
            this.currentPhase = "draw";
            this.turnCount++;
            return true; // Indica mudança de turno
        }
        return false;
    }
    
    getPhaseDisplay() {
        const phaseNames = {
            "draw": "Compra",
            "main1": "Principal",
            "battle": "Batalha",
            "main2": "Principal 2",
            "end": "Final"
        };
        return phaseNames[this.currentPhase];
    }
}
