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

                emitter.update(elapsedTime * 0.001);

                if (elapsedTime >= duration) {
                    emitter.emit = false;
                }
            }
        };

        update();
    }

    createEmitterConfig(x, y, colour) {
        return {
            lifetime: { min: 0, max: 0.4 },
            frequency: 0.001,
            spawnChance: 0.8,
            particlesPerWave: 1,
            maxParticles: 200,
            pos: { x, y },
            addAtBack: true,
            behaviors: [
                { type: 'alpha', config: { alpha: { list: [{ value: 0.8, time: 0 }, { value: 0.5, time: 1 }] } } },
                { type: 'scale', config: { scale: { list: [{ value: 0.1, time: 0 }, { value: 0.6, time: 1 }] } } },
                { type: 'color', config: { color: { list: [{ value: '#ffffff', time: 0 }, { value: colour, time: 1 }] } } },
                { type: 'moveSpeed', config: { speed: { list: [{ value: 500, time: 0 }, { value: 300, time: 1 }], isStepped: false } } },
                { type: 'rotationStatic', config: { min: -120, max: -60 } },
                { type: 'spawnShape', config: { type: 'circle', data: { x: 0, y: 0, radius: 5 } } },
                { type: 'textureSingle', config: { texture: PIXI.Texture.from('./assets/particle.png') } }
            ]
        };
    }
}
