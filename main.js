import XmlLoader from "./app/xmlLoader.js";
import Fountain from "./app/fountain.js";
import Rocket from "./app/rocket.js";

let app, container, fireworksInstances, totalDuration, restartTime = 2000;

async function startApp() {
    app = new PIXI.Application({ backgroundColor: 0x000000, width: 1024, height: 768 });
    document.body.appendChild(app.view);
    container = createContainer();
    fireworksInstances = [];

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

function createFireworks(fireworksData) {
    let longestDuration = 0;

    fireworksData.forEach(fireworkData => {
        try {
            const FireworkClass = fireworkData.type === "Fountain" ? Fountain : fireworkData.type === "Rocket" ? Rocket : null;

            if (FireworkClass) {
                const fireworkInstance = new FireworkClass(container, fireworkData);
                const fireworkEndTime = fireworkData.begin + fireworkData.duration;

                if (fireworkEndTime > longestDuration) {
                    longestDuration = fireworkEndTime;
                }

                fireworkInstance.create();
                fireworksInstances.push({ instance: fireworkInstance, config: fireworkData });
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
