import XmlLoader from "./app/xmlLoader.js";
import Fountain from "./app/fountain.js";
import Rocket from "./app/rocket.js";

let app, container, fireworksInstances = [], totalDuration, restartTime = 2000;

// Added frame rate counter variables
let frameCounter, frameCount = 0, lastFrameTime = Date.now();

async function startApp() {
    app = new PIXI.Application({ backgroundColor: 0x000000, width: 1024, height: 768 });
    document.body.appendChild(app.view);
    container = createContainer();
    // uncomment to show frames counter
    // createCounter();
    try {
        const fireworksData = await XmlLoader.load("xml/fireworks.xml");
        totalDuration = createFireworks(fireworksData);
        setTimeout(restartFireworks, totalDuration + restartTime);
    } catch (error) {
        console.error("Error loading fireworks data:", error.message);
    }
}

function createContainer() {
    const container = new PIXI.Container();
    container.position.set(app.screen.width / 2, app.screen.height / 2);
    container.pivot.set(container.width / 2, container.height / 2);
    app.stage.addChild(container);
    return container;
}

function createCounter() {
    frameCounter = document.createElement("div");
    frameCounter.style.position = "absolute";
    frameCounter.style.top = "10px";
    frameCounter.style.left = "10px";
    frameCounter.style.color = "white";
    document.body.appendChild(frameCounter);

    app.ticker.add(() => {
        updateFrameCounter();
    });

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

document.addEventListener("DOMContentLoaded", startApp);
