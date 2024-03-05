export default class Firework {
    constructor(container, fireworkConfig) {
        this.container = container;
        this.fireworkConfig = fireworkConfig;
        this.validateParameters(container, fireworkConfig);
        this.checkPixiAvailability();
        this.validateNumericValues();
        this.startTime = Date.now() + fireworkConfig.begin;
        this.emitter = null;
    }

    validateNumericValue(value, paramName) {
        if (isNaN(value)) {
            throw new Error(`Invalid value for ${paramName}. Please provide a valid numeric value.`);
        }
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

    checkTickerAvailability() {
        if (!this.ticker || typeof this.ticker.start !== 'function') {
            throw new Error("Ticker is not available or does not have a start function.");
        }
    }

    validateNumericValues() {
        // Implement this method in the subclasses
    }

    create() {
        // Implement this method in the subclasses
    }

    createEmitterConfig() {
        // Implement this method in the subclasses
    }

    restart() {
        try {
            this.startTime = Date.now() + this.fireworkConfig.begin;
        } catch (error) {
            console.error("Error restarting firework:", error.message);
        }
    }
}
