export default class Rocket {
    constructor(container, fireworkConfig) {
        if (!container || !fireworkConfig) {
            throw new Error("Both 'container' and 'fireworkConfig' are required parameters.");
        }

        if (typeof PIXI === 'undefined' || typeof PIXI.Ticker === 'undefined' || typeof PIXI.particles === 'undefined' || typeof PIXI.particles.Emitter === 'undefined') {
            throw new Error("PIXI, PIXI.Ticker, and PIXI.particles.Emitter must be available.");
        }

        this.container = container;
        this.fireworkConfig = fireworkConfig;
        this.ticker = new PIXI.Ticker();
        this.particleEmitter = null;
    }

    static validateNumericValue(value, paramName) {
        if (isNaN(value)) {
            throw new Error(`Invalid value for ${paramName}. Please provide a valid numeric value.`);
        }
    }

    create() {
        try {
            const duration = this.fireworkConfig.duration;
            const initialX = this.fireworkConfig.position.x;
            const initialY = this.fireworkConfig.position.y;
            const velocityX = this.fireworkConfig.velocity.x;
            const velocityY = this.fireworkConfig.velocity.y;
            const begin = this.fireworkConfig.begin || 0;

            Rocket.validateNumericValue(duration, 'duration');
            Rocket.validateNumericValue(initialX, 'position.x');
            Rocket.validateNumericValue(initialY, 'position.y');
            Rocket.validateNumericValue(velocityX, 'velocity.x');
            Rocket.validateNumericValue(velocityY, 'velocity.y');

            const particle = PIXI.Sprite.from('./assets/rocket.png');
            particle.anchor.set(0.5);
            particle.x = initialX;
            particle.y = initialY;
            particle.height = 50;
            particle.width = 50;
            particle.tint = this.fireworkConfig.colour;
            particle.alpha = 0;
            particle.blur = 0;

            let startTime = 0;

            const startAnimation = () => {
                this.container.addChild(particle);
                startTime = Date.now();

                this.ticker.add(() => {
                    const currentTime = Date.now();
                    const elapsedTime = currentTime - startTime;

                    if (elapsedTime < duration) {
                        const progress = elapsedTime / duration;
                        const distanceX = velocityX * progress * (elapsedTime / 1000);
                        const distanceY = velocityY * progress * (elapsedTime / 1000);

                        particle.x = initialX + distanceX;
                        particle.y = initialY + distanceY;
                        particle.alpha = progress;
                        particle.blur = progress;
                    } else {
                        this.ticker.stop();

                        this.container.removeChild(particle);

                        this.startParticleEffect(particle.x, particle.y);
                    }
                });

                this.ticker.start();
            };

            if (begin > 0) {
                setTimeout(startAnimation, begin);
            } else {
                startAnimation();
            }
        } catch (error) {
            console.error("Error creating rocket:", error.message);
        }
    }

    startParticleEffect(posX, posY) {
        var emitter = new PIXI.particles.Emitter(
            this.container,
            {
                lifetime: { min: 0.1, max: 0.5 },
                frequency: 0.0005,
                spawnChance: 1,
                particlesPerWave: 1,
                emitterLifetime: 0.2,
                maxParticles: 200,
                pos: { x: posX, y: posY },
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
            }
        );

        var startTime = Date.now();

        var update = function () {
            requestAnimationFrame(update);

            var now = Date.now();

            emitter.update((now - startTime) * 0.001);
            startTime = now;
        };

        update();
    }
}
