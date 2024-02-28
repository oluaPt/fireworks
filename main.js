import XmlLoader from "./app/xmlLoader.js";
import Fountain from "./app/fountain.js";
import Rocket from "./app/rocket.js";

let app, container, fireworks;

function startApp() {
    app = new PIXI.Application({ backgroundColor: 0x000000, width: 1024, height: 768 });
    document.body.appendChild(app.view);
    container = createContainer();

    loadFireworksData()
        .then(() => createFireworks())
        .then(() => createRestartButton())
        .catch(error => console.error("Error loading fireworks data:", error.message));
}

async function loadFireworksData() {
    try {
        const data = await XmlLoader.load("xml/fireworks.xml");
        if (Array.isArray(data)) {
            fireworks = data;
        }
    } catch (error) {
        console.error("Error loading fireworks data:", error.message);
        throw error; // Propagate the error for global error handling, if needed.
    }
}

function createContainer() {
    const container = new PIXI.Container();
    container.position.set(app.screen.width / 2, app.screen.height / 2);
    container.pivot.set(container.width / 2, container.height / 2);
    app.stage.addChild(container);
    return container;
}

function createFireworks() {
    fireworks.forEach(firework => {
        try {
            const FireworkClass = firework.type === "Fountain" ? Fountain : firework.type === "Rocket" ? Rocket : null;

            if (FireworkClass) new FireworkClass(container, firework).create();
            else console.warn("Unknown firework type:", firework.type);
        } catch (error) {
            console.error("Error creating firework:", error.message);
        }
    });
}

function createRestartButton() {
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Fireworks";
    restartButton.addEventListener("click", () => {
        app.stage.removeChildren();
        container = createContainer();
        createFireworks();
    });
    document.body.appendChild(restartButton);
}

document.addEventListener("DOMContentLoaded", startApp);
