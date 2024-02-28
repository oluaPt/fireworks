export default class Fountain {
    constructor(container, fireworkConfig) {
        if (!container || !fireworkConfig) {
            throw new Error("Both 'container' and 'fireworkConfig' are required parameters.");
        }

        if (typeof PIXI === 'undefined' || typeof PIXI.particles === 'undefined' || typeof PIXI.particles.Emitter === 'undefined') {
            throw new Error("PIXI and PIXI.particles.Emitter must be available.");
        }

        this.container = container;
        this.fireworkConfig = fireworkConfig;
    }

    static validateNumericValue(value, paramName) {
        if (isNaN(value)) {
            throw new Error(`Invalid value for ${paramName}. Please provide a valid numeric value.`);
        }
    }

    create() {
        try {
            const begin = this.fireworkConfig.begin || 0;
            const duration = this.fireworkConfig.duration || 1000;
            const initialX = this.fireworkConfig.position.x;
            const initialY = this.fireworkConfig.position.y;

            Fountain.validateNumericValue(begin, 'begin');
            Fountain.validateNumericValue(duration, 'duration');
            Fountain.validateNumericValue(initialX, 'position.x');
            Fountain.validateNumericValue(initialY, 'position.y');

            this.startParticleEffect(begin, duration, initialX, initialY);
        } catch (error) {
            console.error("Error creating firework:", error.message);
        }
    }

    startParticleEffect(begin, duration, posX, posY) {
        var emitter = new PIXI.particles.Emitter(
            this.container,
            {
                lifetime: { min: 0, max: 0.4 },
                frequency: 0.001,
                spawnChance: 0.8,
                particlesPerWave: 1,
                maxParticles: 200,
                pos: { x: posX, y: posY },
                addAtBack: true,
                behaviors: [
                    { type: 'alpha', config: { alpha: { list: [{ value: 0.8, time: 0 }, { value: 0.5, time: 1 }] } } },
                    { type: 'scale', config: { scale: { list: [{ value: 0.1, time: 0 }, { value: 0.6, time: 1 }] } } },
                    { type: 'color', config: { color: { list: [{ value: '#ffffff', time: 0 }, { value: this.fireworkConfig.colour, time: 1 }] } } },
                    { type: 'moveSpeed', config: { speed: { list: [{ value: 500, time: 0 }, { value: 300, time: 1 }], isStepped: false } } },
                    { type: 'rotationStatic', config: { min: -120, max: -60 } },
                    { type: 'spawnShape', config: { type: 'circle', data: { x: 0, y: 0, radius: 5 } } },
                    { type: 'textureSingle', config: { texture: PIXI.Texture.from('./assets/particle.png') } }
                ],
            }
        );

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
}
