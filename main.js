import XmlLoader from "./app/xmlLoader.js";
import FireworkFactory from './app/fireworkFactory.js';

export default class MainApp {
    constructor() {
        try {
            this.fireworksInstances = [];
            this.restartTime = 2000;
            this.app = new PIXI.Application({ backgroundColor: 0x000000, width: 1024, height: 768 });
            document.body.appendChild(this.app.view);
            this.container = this.createContainer();
            // this.createCounters();

            document.addEventListener("DOMContentLoaded", () => this.startApp());
        } catch (error) {
            console.error("Error starting:", error.message);
        }
    }

    async startApp() {
        try {
            const fireworksData = await XmlLoader.load("xml/fireworks.xml");

            this.createFireworks(fireworksData);

            this.updateFireworks();

            const totalDuration = Math.max(...fireworksData.map(({ begin, duration }) => begin + duration + this.restartTime), 0);
            setTimeout(() => this.restartFireworks(totalDuration), totalDuration);
        } catch (error) {
            console.error("Error starting App:", error.message);
        }
    }

    createFireworks(fireworksData) {
        try {
            this.fireworksInstances = fireworksData.map(fireworkData => FireworkFactory.createFirework(this.container, fireworkData));
        } catch (error) {
            console.error("Error creating fireworks:", error.message);
        }
    }

    updateFireworks() {
        try { 
            let lastUpdateTime = 0;
            const frameRate = 60;
            const update = () => {
                const currentTime = Date.now();
                const elapsed = currentTime - lastUpdateTime;

                if (elapsed > 1000 / frameRate) {
                    this.fireworksInstances.forEach(instance => instance.update(currentTime));
                    lastUpdateTime = currentTime;
                }
                requestAnimationFrame(update);
            }
            update();
        } catch (error) {
            console.error("Error updating fireworks:", error.message);
        }
    }
    
    restartFireworks(totalDuration) {
        try { 
            this.fireworksInstances.forEach(instance => instance.restart(totalDuration));
            setTimeout(() => this.restartFireworks(totalDuration), totalDuration);
        } catch (error) {
            console.error("Error restarting fireworks:", error.message);
        }
    }

    createContainer() {
        const container = new PIXI.Container();
        container.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
        container.pivot.set(container.width / 2, container.height / 2);
        this.app.stage.addChild(container);
        return container;
    }

    createCounters() {
        this.frameCounter = this.createCounter("FPS", "10px", "0px");
        this.memoryCounter = this.createCounter("Memory (MB)", "30px", "0px");

        this.frameCount = 0;
        this.lastFrameTime = Date.now();

        this.app.ticker.add(() => {
            this.updateFrameCounter();
            this.updateMemoryCounter();
        });
    }

    createCounter(label, top, left) {
        const counter = document.createElement("div");
        counter.style.position = "absolute";
        counter.style.top = top;
        counter.style.left = left;
        counter.style.color = "white";
        counter.textContent = `${label}: 0`;
        document.body.appendChild(counter);
        return counter;
    }

    updateFrameCounter() {
        const now = Date.now();
        const deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;
        const fps = 1000 / deltaTime;

        this.frameCount++;
        if (this.frameCount % 10 === 0) {
            this.frameCounter.textContent = `FPS: ${fps.toFixed(2)}`;
        }
    }

    updateMemoryCounter() {
        const memoryUsageMB = (window.performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2);
        this.memoryCounter.textContent = `Memory (MB): ${memoryUsageMB}`;
    }
}

new MainApp();
