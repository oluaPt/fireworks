import XmlLoader from "./app/xmlLoader.js";
import Fountain from "./app/fountain.js";
import Rocket from "./app/rocket.js";

let app, container, fireworks;

function startApp() {
    app = new PIXI.Application({ backgroundColor: 0x000000, width: 1024, height: 768 });
    document.body.appendChild(app.view);
    container = createContainer();
    
    new XmlLoader("xml/fireworks.xml").get()
        .then(data => Array.isArray(fireworks = data) && createFireworks())
        .catch(error => console.error("Error loading fireworks data:", error.message));

    document.body.appendChild(createRestartButton());
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
            if (firework.type === "Fountain") new Fountain(container, firework).create();
            else if (firework.type === "Rocket") new Rocket(container, firework).create();
            else console.warn("Unknown firework type:", firework.type);
        } catch (error) {
            console.error("Error creating firework:", error.message);
        }
    });
}

function createRestartButton() {
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Fireworks";
    restartButton.addEventListener("click", () => (app.stage.removeChildren(), container = createContainer(), createFireworks()));
    return restartButton;
}

document.addEventListener("DOMContentLoaded", startApp);