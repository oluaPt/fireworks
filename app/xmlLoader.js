import FireworkFactory from './fireworkFactory.js';

export default class XmlLoader {
    static async load(url) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Fetch failed with status ${response.status}`);
            }

            const data = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");

            return Array.from(xmlDoc?.querySelectorAll("FireworkDisplay")?.[0]?.children || []).map(child => this.parseFirework(child));
        } catch (error) {
            throw error;
        }
    }

    static parseFirework(child) {
        const validateNumberAttribute = (value, attributeName) => {
            const numericRegex = /^-?[0-9]+$/;
            if(numericRegex.test(value) && !isNaN(value)) {
                return (attributeName === 'Position.y' || attributeName === 'Velocity.y') ? -Number(value) : Number(value);
            } else {
                throw new Error(`XML config file, '${attributeName}' needs to be a number or is missing.`);
            }
        };

        const validateTypeAttribute = (value) =>  FireworkFactory.validateTypeAttribute(value);

        const validateAttribute = (value, attributeName) =>  value ? value : 
            (() => { throw new Error(`XML config file, '${attributeName}' needs to be in the correct format or is missing.`); })();

        return {
            type: validateTypeAttribute(child.getAttribute("type")),
            begin: validateNumberAttribute(child.getAttribute("begin"), "begin"),
            colour: validateAttribute(child.getAttribute("colour"), "colour"),
            duration: validateNumberAttribute(child.getAttribute("duration"), "duration"),
            position: {
                x: validateNumberAttribute(child.querySelector("Position").getAttribute("x"), "Position.x"),
                y: validateNumberAttribute(child.querySelector("Position").getAttribute("y"), "Position.y"),
            },
            ...(child.getAttribute("type") === "Rocket" && {
                velocity: {
                    x: validateNumberAttribute(child.querySelector("Velocity").getAttribute("x"), "Velocity.x"),
                    y: validateNumberAttribute(child.querySelector("Velocity").getAttribute("y"), "Velocity.y"),
                },
            }),
        };
    }
}
