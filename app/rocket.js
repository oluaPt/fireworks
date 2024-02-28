export default class Rocket {
    constructor(container, fireworkConfig) {
        this.validateParameters(container, fireworkConfig);
        this.checkPixiAvailability();
        this.container = container;
        this.fireworkConfig = fireworkConfig;
        this.ticker = new PIXI.Ticker();
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

    validateNumericValues(duration, initialX, initialY, velocityX, velocityY) {
        Rocket.validateNumericValue(duration, 'duration');
        Rocket.validateNumericValue(initialX, 'position.x');
        Rocket.validateNumericValue(initialY, 'position.y');
        Rocket.validateNumericValue(velocityX, 'velocity.x');
        Rocket.validateNumericValue(velocityY, 'velocity.y');
    }

    create() {
        try {
            const { duration, position, velocity, begin = 0 } = this.fireworkConfig;
            const { x: initialX, y: initialY } = position;
            const { x: velocityX, y: velocityY } = velocity;

            this.validateNumericValues(duration, initialX, initialY, velocityX, velocityY);

            const particle = this.createRocketParticle(initialX, initialY);
            const startAnimation = this.createStartAnimation(particle, duration, velocityX, velocityY);

            if (begin > 0) {
                setTimeout(startAnimation, begin);
            } else {
                startAnimation();
            }
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

    createStartAnimation(particle, duration, velocityX, velocityY) {
        return () => {
            this.container.addChild(particle);
            let startTime = Date.now();

            this.ticker.add(() => {
                const currentTime = Date.now();
                const elapsedTime = currentTime - startTime;

                if (elapsedTime < duration) {
                    const progress = elapsedTime / duration;
                    const distanceX = velocityX * progress * (elapsedTime / 1000);
                    const distanceY = velocityY * progress * (elapsedTime / 1000);

                    particle.position.set(particle.initialX + distanceX, particle.initialY + distanceY);
                    particle.alpha = progress;
                    particle.blur = progress;
                } else {
                    this.ticker.stop();

                    this.container.removeChild(particle);

                    this.startParticleEffect(particle.position.x, particle.position.y);
                }
            });

            this.ticker.start();
        };
    }

    startParticleEffect(x, y) {
        const emitterConfig = this.createEmitterConfig(x, y);
        const emitter = new PIXI.particles.Emitter(this.container, emitterConfig);

        let startTime = Date.now();

        const update = () => {
            requestAnimationFrame(update);

            const now = Date.now();

            emitter.update((now - startTime) * 0.001);
            startTime = now;
        };

        update();
    }

    createEmitterConfig(x, y) {
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
                { type: 'alpha', config: { alpha: { list: [{ value: 0.8, time: 0 }, { value: 0.5, time: 1 }] } } },
                { type: 'scale', config: { scale: { list: [{ value: 0.5, time: 0 }, { value: 0.6, time: 1 }] } } },
                { type: 'color', config: { color: { list: [{ value: '#ffffff', time: 0 }, { value: this.fireworkConfig.colour, time: 1 }] } } },
                { type: 'moveSpeed', config: { speed: { list: [{ value: 500, time: 0 }, { value: 300, time: 1 }], isStepped: false } } },
                { type: 'rotationStatic', config: { min: 0, max: 360 } },
                { type: 'spawnShape', config: { type: 'torus', data: { x: 0, y: 0, radius: 30 } } },
                { type: 'textureSingle', config: { texture: PIXI.Texture.from('./assets/particle.png') } }
            ],
        };
    }
}