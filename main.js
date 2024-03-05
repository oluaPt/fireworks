import XmlLoader from "./app/xmlLoader.js";
import Fountain from "./app/fountain.js";
import Rocket from "./app/rocket.js";

let app, container, fireworksInstances = [], totalDuration, restartTime = 2000;
let frameCounter, memoryCounter;
let frameCount = 0, lastFrameTime = Date.now();

async function startApp() {
    app = new PIXI.Application({ backgroundColor: 0x000000, width: 1024, height: 768 });
    document.body.appendChild(app.view);
    container = createContainer();
    createCounters();

    try {
        const fireworksData = await XmlLoader.load("xml/fireworks.xml");
        totalDuration = createFireworks(fireworksData);
        setTimeout(restartFireworks, totalDuration + restartTime);
    } catch (error) {
        console.error("Error loading fireworks data:", error.message);
    }
}

function createFireworks(fireworksData) {
    let longestDuration = 0;

    fireworksData.forEach(fireworkData => {
        try {
            const FireworkClass = fireworkData.type === "Fountain" ? Fountain : fireworkData.type === "Rocket" ? Rocket : null;

            if (FireworkClass) {
                const fireworkInstance = new FireworkClass(container, fireworkData);
                fireworkInstance.create();
                fireworksInstances.push({ instance: fireworkInstance });

                const fireworkEndTime = fireworkData.begin + fireworkData.duration;
                if (fireworkEndTime > longestDuration) {
                    longestDuration = fireworkEndTime;
                }
            } else {
                console.warn("Unknown firework type:", fireworkData.type);
            }
        } catch (error) {
            console.error("Error creating firework:", error.message);
        }
    });

    return longestDuration;
}

function restartFireworks() {
    fireworksInstances.forEach(({ instance }) => {
        instance.restart();
    });

    setTimeout(restartFireworks, totalDuration + restartTime);
}

function createContainer() {
    const container = new PIXI.Container();
    container.position.set(app.screen.width / 2, app.screen.height / 2);
    container.pivot.set(container.width / 2, container.height / 2);
    app.stage.addChild(container);
    return container;
}

function createCounters() {
    frameCounter = createCounter("FPS", "10px", "0px");
    memoryCounter = createCounter("Memory (MB)", "30px", "0px");
    app.ticker.add(() => {
        updateFrameCounter();
        updateMemoryCounter();
    });
}

function createCounter(label, top, left) {
    const counter = document.createElement("div");
    counter.style.position = "absolute";
    counter.style.top = top;
    counter.style.left = left;
    counter.style.color = "white";
    counter.textContent = `${label}: 0`;
    document.body.appendChild(counter);
    return counter;
}

function updateFrameCounter() {
    const now = Date.now();
    const deltaTime = now - lastFrameTime;
    lastFrameTime = now;
    const fps = 1000 / deltaTime;

    frameCount++;
    if (frameCount % 10 === 0) {
        frameCounter.textContent = `FPS: ${fps.toFixed(2)}`;
    }
}

function updateMemoryCounter() {
    const memoryUsageMB = (window.performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2);
    memoryCounter.textContent = `Memory (MB): ${memoryUsageMB}`;
}

document.addEventListener("DOMContentLoaded", startApp);
