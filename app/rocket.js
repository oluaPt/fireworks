import Firework from './firework.js';

export default class Rocket extends Firework {
    constructor(container, fireworkConfig, totalDuration = false) {
        super(container, fireworkConfig, totalDuration);
        this.startTimeParticle = Date.now() + fireworkConfig.begin;

        try {
            const { duration, position, velocity, colour } = this.fireworkConfig;
            const { x: initialX, y: initialY } = position;
            const { x: velocityX, y: velocityY } = velocity;
            const finalX = initialX + (velocityX * (duration * 0.001));
            const finalY = initialY + (velocityY * (duration * 0.001));

            this.particle = this.createRocketParticle(initialX, initialY, colour);
            this.container.addChild(this.particle);

            const emitterConfig = this.createEmitterConfig(finalX, finalY);
            this.emitter = new PIXI.particles.Emitter(this.container, emitterConfig);
        } catch (error) {
            console.error("Error creating rocket:", error.message);
        }
    }   

    createEmitterConfig(x, y) {
        const colour = this.fireworkConfig.colour;

        return {
            lifetime: { min: 0.1, max: 0.5 },
            frequency: 0.0005,
            spawnChance: 1,
            particlesPerWave: 1,
            emitterLifetime: 0.2,
            maxParticles: 200,
            pos: { x, y },
            addAtBack: true,
            behaviors: [
                { type: 'alpha', config: { alpha: { list: [{ value: 0.8, time: 0 }, { value: 0.3, time: 1 }] } } },
                { type: 'scale', config: { scale: { list: [{ value: 0.2, time: 0 }, { value: 0.6, time: 1 }] } } },
                { type: 'color', config: { color: { list: [{ value: '#ffffff', time: 0 }, { value: colour, time: 1 }] } } },
                { type: 'moveSpeed', config: { speed: { list: [{ value: 500, time: 0 }, { value: 300, time: 1 }], isStepped: false } } },
                { type: 'rotationStatic', config: { min: 0, max: 360 } },
                { type: 'spawnShape', config: { type: 'torus', data: { x: 0, y: 0, radius: 30 } } },
                { type: 'textureSingle', config: { texture: PIXI.Texture.from('./assets/particle.png') } }
            ],
        };
    }

    createRocketParticle(x, y, colour) {
        const particle = PIXI.Sprite.from('./assets/rocket.png');
        particle.anchor.set(0.5);
        particle.position.set(x, y);
        particle.initialX = x;
        particle.initialY = y;
        particle.height = 50;
        particle.width = 50;
        particle.tint = colour;
        particle.alpha = 0;
        particle.blur = 0;

        return particle;
    }

    update(currentTime) {
        const { duration, velocity } = this.fireworkConfig;
        const elapsedTime = currentTime - this.startTimeParticle;
        if (elapsedTime < duration) {
            const { x: velocityX, y: velocityY } = velocity;
            const progress = elapsedTime / duration;
            const distanceX = velocityX * progress * (elapsedTime / 1000);
            const distanceY = velocityY * progress * (elapsedTime / 1000);

            this.particle.position.set(this.particle.initialX + distanceX, this.particle.initialY + distanceY);
            this.particle.alpha = progress;
            this.particle.blur = progress;
            this.startTime = currentTime;
        } else {
            this.particle.alpha = 0;
            this.emitter.update((currentTime - this.startTime) * 0.001);
            this.startTime = currentTime;
        }
    }

    restartActions() {
        this.startTimeParticle = Date.now() + this.fireworkConfig.begin;
    }
}