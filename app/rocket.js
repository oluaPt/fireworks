import Firework from './firework.js';

export default class Rocket extends Firework {
    constructor(container, fireworkConfig) {
        super(container, fireworkConfig);
        this.ticker = new PIXI.Ticker();
        this.checkTickerAvailability();
        this.firstAnimation = true;
    }

    validateNumericValues() {
        const { begin, duration, position: { x, y }, velocity: { x:velX, y:velY } } = this.fireworkConfig;

        this.validateNumericValue(begin, 'begin');
        this.validateNumericValue(duration, 'duration');
        this.validateNumericValue(x, 'position.x');
        this.validateNumericValue(y, 'position.y');
        this.validateNumericValue(velX, 'velocity.x');
        this.validateNumericValue(velY, 'velocity.y');
    }

    create() {
        try {
            const { duration, position, velocity } = this.fireworkConfig;
            const { x: initialX, y: initialY } = position;
            const { x: velocityX, y: velocityY } = velocity;
            const finalX = initialX + (velocityX * (duration * 0.001));
            const finalY = initialY + (velocityY * (duration * 0.001));

            const particle = this.createRocketParticle(initialX, initialY);
            this.container.addChild(particle);

            const emitterConfig = this.createEmitterConfig(finalX, finalY);
            this.emitter = new PIXI.particles.Emitter(this.container, emitterConfig);

            this.startAnimation(particle, duration, velocityX, velocityY);
        } catch (error) {
            console.error("Error creating rocket:", error.message);
        }
    }

    createRocketParticle(x, y) {
        const particle = PIXI.Sprite.from('./assets/rocket.png');
        particle.anchor.set(0.5);
        particle.position.set(x, y);
        particle.initialX = x;
        particle.initialY = y;
        particle.height = 50;
        particle.width = 50;
        particle.tint = this.fireworkConfig.colour;
        particle.alpha = 0;
        particle.blur = 0;

        return particle;
    }

    startAnimation(particle, duration, velocityX, velocityY) {
        this.ticker.add(() => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - this.startTime;

            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                const distanceX = velocityX * progress * (elapsedTime / 1000);
                const distanceY = velocityY * progress * (elapsedTime / 1000);

                particle.position.set(particle.initialX + distanceX, particle.initialY + distanceY);
                particle.alpha = progress;
                particle.blur = progress;
            } else {
                if(this.firstAnimation) {
                    this.startParticleEffect();
                    this.firstAnimation = false;
                } else {
                    this.emitter.playOnce();
                }
                particle.alpha = 0;
                this.ticker.stop();
            }
        });

        this.ticker.start();
    }

    startParticleEffect() {
        let startTimeEffect = Date.now();
        const update = () => {
            requestAnimationFrame(update);
            const now = Date.now();
            this.emitter.update((now - startTimeEffect) * 0.001);
            startTimeEffect = now;
        };

        update();
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
}