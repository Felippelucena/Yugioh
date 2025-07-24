import {Player} from './player.js'

// IA Básica
export class AIPlayer extends Player {
    constructor(name) {
        super(name, true);
    }
    
    makeMove(game) {
        // IA coloca a carta de maior ataque disponível
        if (this.hand.length > 0 && this.hasEmptyFieldSlot()) {
            const strongestCard = this.hand.reduce((strongest, card) => 
                card.attack > strongest.attack ? card : strongest
            );
            
            const slotIndex = this.getEmptyFieldSlot();
            if (slotIndex !== -1) {
                this.summonMonster(strongestCard, slotIndex);
                game.log(`${this.name} invocou ${strongestCard.name} (ATK: ${strongestCard.attack})`);
            }
        }
    }
    
    makeAttacks(game) {
        // IA ataca automaticamente se possível
        const myMonsters = this.getFieldMonsters();
        const enemyMonsters = game.getOpponentOf(this).getFieldMonsters();
        
        for (let monster of myMonsters) {
            if (enemyMonsters.length === 0) {
                // Ataque direto
                game.directAttack(monster, game.getOpponentOf(this));
            } else {
                // Ataca o monstro mais fraco do oponente
                const weakestEnemy = enemyMonsters.reduce((weakest, enemy) => 
                    enemy.attack < weakest.attack ? enemy : weakest
                );
                if (monster.attack >= weakestEnemy.attack) {
                    game.battleMonsters(monster, weakestEnemy);
                }
            }
        }
    }
}