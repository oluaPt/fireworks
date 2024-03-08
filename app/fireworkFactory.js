import Fountain from "./fountain.js";
import Rocket from "./rocket.js";

export default class FireworkFactory {
    static createFirework(container, fireworkConfig, longestDuration = false) {
        switch (fireworkConfig.type) {
            case 'Fountain':
                return new Fountain(container, fireworkConfig, longestDuration);
            case 'Rocket':
                return new Rocket(container, fireworkConfig, longestDuration);
            default:
                throw new Error(`Unknown type: ${fireworkConfig.type}`);
        }
    }

    static validateTypeAttribute(value) {
        switch (value) {
            case 'Fountain':
                return value;
            case 'Rocket':
                return value;
            default:
                throw new Error(`XML config file, unknown 'type' or is missing: ${value}`);
        }
    }
}