import Firework from './firework.js';

export default class Fountain extends Firework {
    constructor(container, fireworkConfig) {
        super(container, fireworkConfig);
    }

    validateNumericValues() {
        const { begin, duration, position: { x, y } } = this.fireworkConfig;

        this.validateNumericValue(begin, 'begin');
        this.validateNumericValue(duration, 'duration');
        this.validateNumericValue(x, 'position.x');
        this.validateNumericValue(y, 'position.y');
    }

    create() {
        try {
            const { colour, position: { x, y } } = this.fireworkConfig;

            const emitterConfig = this.createEmitterConfig(x, y, colour);
            this.emitter = new PIXI.particles.Emitter(this.container, emitterConfig);
            this.startParticleEffect();
        } catch (error) {
            console.error("Error creating firework:", error.message);
        }
    }

    startParticleEffect() {
        const update = () => {
            requestAnimationFrame(update);
            const currentTime = Date.now();
            if (currentTime >= this.startTime) {
                this.emitter.update((currentTime - this.startTime) * 0.001);
                this.startTime = currentTime;
            }
        };

        update();
    }

    createEmitterConfig(x, y, colour) {
        return {
            lifetime: { min: 0.5, max: 1.5 },
            frequency: 0.001,
            spawnChance: 1,
            particlesPerWave: 3,
            maxParticles: 150,
            emitterLifetime: this.fireworkConfig.duration * 0.001,
            pos: { x, y },
            addAtBack: false,
            behaviors: [
                { type: 'alpha', config: { alpha: { list: [{ value: 1, time: 0 }, { value: 0.5, time: 0.8 }, { value: 0.1, time: 1 }] } } },
                { type: 'scale', config: { scale: { list: [{ value: 0.1, time: 0 }, { value: 1, time: 1 }] } } },
                { type: 'color', config: { color: { list: [{ value: '#ffffff', time: 0.3 }, { value: colour, time: 1 }] } } },
                { type: 'moveSpeed', config: { speed: { list: [{ value: 20, time: 0 }, { value: 300, time: 1 }], isStepped: false }, minMult: 0.2 } },
                { type: 'rotationStatic', config: { min: -110, max: -70 } },
                { type: 'spawnShape', config: { type: 'circle', data: { x: 0, y: 0, radius: 0 } } },
                { type: 'textureSingle', config: { texture: PIXI.Texture.from('./assets/particle.png') } },
            ],
        };
    }

    restart() {
        try {
            super.restart();
            this.emitter.playOnce();
        } catch (error) {
            console.error("Error restarting fountain:", error.message);
        }
    }
}
