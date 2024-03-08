export default class Firework {
    constructor(container, fireworkConfig, restartTime = false) {
        this.container = container;
        this.fireworkConfig = fireworkConfig;
        this.validateParameters(container, fireworkConfig);
        this.checkPixiAvailability();
        this.startTime = Date.now() + fireworkConfig.begin;

        restartTime && setTimeout(() => this.restart(restartTime), restartTime);
    }

    validateParameters(container, fireworkConfig) {
        if (!container || !fireworkConfig) {
            throw new Error("Both 'container' and 'fireworkConfig' are required parameters.");
        }
    }

    checkPixiAvailability() {
        if (!PIXI || !PIXI.particles || !PIXI.particles.Emitter) {
            throw new Error("PIXI and PIXI.particles.Emitter must be available.");
        }
    }

    update() {
        // Implement this method in the subclasses
    }

    restart(restartTime = false) {
        try {
            this.startTime = Date.now() + this.fireworkConfig.begin;
            this.emitter.playOnce()
            this.restartActions();
            
            restartTime && setTimeout(() => this.restart(restartTime), restartTime);
        } catch (error) {
            console.error("Error restarting firework:", error.message);
        }
    }

    restartActions() {
        // Implement this method in the subclasses
    }
}
