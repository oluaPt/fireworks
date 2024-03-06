import Fountain from "./fountain.js";
import Rocket from "./rocket.js";

export default class FireworkFactory {
    static createFirework(container, fireworkConfig) {
        switch (fireworkConfig.type) {
            case 'Fountain':
                return new Fountain(container, fireworkConfig);
            case 'Rocket':
                return new Rocket(container, fireworkConfig);
            default:
                throw new Error(`Unknown firework type: ${fireworkConfig.type}`);
        }
    }
}