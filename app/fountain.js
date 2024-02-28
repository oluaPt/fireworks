export default class Fountain {
    constructor(container, fireworkConfig) {
        this.validateParameters(container, fireworkConfig);
        this.checkPixiAvailability();
        this.container = container;
        this.fireworkConfig = fireworkConfig;
    }

    static validateNumericValue(value, paramName) {
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

    validateNumericValues(begin, duration, x, y) {
        Fountain.validateNumericValue(begin, 'begin');
        Fountain.validateNumericValue(duration, 'duration');
        Fountain.validateNumericValue(x, 'position.x');
        Fountain.validateNumericValue(y, 'velocity.y');
    }

    create() {
        try {
            const { begin = 0, duration = 1000, position, colour } = this.fireworkConfig;
            const { x, y } = position;

            this.validateNumericValues(begin, duration, x, y);

            const emitterConfig = this.createEmitterConfig(x, y, colour);
            const emitter = new PIXI.particles.Emitter(this.container, emitterConfig);

            this.startParticleEffect(emitter, begin, duration);
        } catch (error) {
            console.error("Error creating firework:", error.message);
        }
    }

    startParticleEffect(emitter, begin, duration) {
        const startTime = Date.now() + begin;

        const update = () => {
            requestAnimationFrame(update);

            const currentTime = Date.now();
            
            if (currentTime >= startTime) {

                const elapsedTime = currentTime - startTime;
                emitter.update((1 - (elapsedTime * 0.0001)) > 0.5 ? (1 - (elapsedTime * 0.0001)) : 0.5);

                if (elapsedTime >= duration) {
                    emitter.emit = false;
                }
            }
        };

        update();
    }

    createEmitterConfig(x, y, colour) {
        return {
            lifetime: { min: 3, max: 18 },
            frequency: 0.005,
            spawnChance: 5,
            particlesPerWave: 10,
            maxParticles: 150,
            pos: { x, y },
            addAtBack: false,
            behaviors: [
                { type: 'alpha', config: { alpha: { list: [{ value: 1, time: 0 }, { value: 0.8, time: 0.5 }, { value: 0.3, time: 1 }] } } },
                { type: 'scale', config: { scale: { list: [{ value: 0.3, time: 0 }, { value: 1, time: 1 }] } } },
                { type: 'color', config: { color: { list: [{ value: '#ffffff', time: 0.3 }, { value: colour, time: 1 }] } } },
                { type: 'moveSpeed', config: { speed: { list: [{ value: 10, time: 0 }, { value: 15, time: 1 }], isStepped: false }, minMult: 0.2 } },
                { type: 'rotationStatic', config: { min: -110, max: -70 } },
                { type: 'spawnShape', config: { type: 'circle', data: { x: 0, y: 0, radius: 0 } } },
                { type: 'textureSingle', config: { texture: PIXI.Texture.from('./assets/particle.png') } },
            ]
        };
    }
}
