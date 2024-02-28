import XmlLoader from "./app/xmlLoader.js";
import Fountain from "./app/fountain.js";
import Rocket from "./app/rocket.js";

function startApp() {
    const app = new PIXI.Application({ background: '#000000', width: 1024, height: 768 });
    document.body.appendChild(app.view);

    let container = createContainer(app);

    const fireworksPromise = new XmlLoader("xml/fireworks.xml").get();

    fireworksPromise.then((fireworks) => {
        if (Array.isArray(fireworks)) {
            createFireworks(container, fireworks);
        } else {
            console.error("Failed to load fireworks data. Ensure the XML file is valid.");
        }
    }).catch((error) => {
        console.error("Error loading fireworks data:", error.message);
    });

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Fireworks";
    restartButton.addEventListener("click", () => {
        app.stage.removeChild(container);
        container = createContainer(app);
        fireworksPromise.then((fireworks) => {
            if (Array.isArray(fireworks)) {
                createFireworks(container, fireworks);
            } else {
                console.error("Failed to load fireworks data during restart. Ensure the XML file is valid.");
            }
        }).catch((error) => {
            console.error("Error loading fireworks data during restart:", error.message);
        });
    });

    document.body.appendChild(restartButton);
}

function createContainer(app) {
    const container = new PIXI.Container();
    container.position.set(app.screen.width / 2, app.screen.height / 2);
    container.pivot.set(container.width / 2, container.height / 2);
    app.stage.addChild(container);
    return container;
}

function createFireworks(container, fireworks) {
    fireworks.forEach((firework) => {
        try {
            if (firework.type === "Fountain") {
                new Fountain(container, firework).create();
            } else if (firework.type === "Rocket") {
                new Rocket(container, firework).create();
            } else {
                console.warn("Unknown firework type:", firework.type);
            }
        } catch (error) {
            console.error("Error creating firework:", error.message);
        }
    });
}

document.addEventListener("DOMContentLoaded", startApp);