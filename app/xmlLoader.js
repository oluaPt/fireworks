export default class XmlLoader {
    static load(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Fetch failed with status ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                return Array.from(xmlDoc?.querySelectorAll("FireworkDisplay")?.[0]?.children || []).map(child => this.parseFirework(child));
            })
            .catch(error => {
                console.error("Error loading XML:", error.message);
                throw error;
            });
    }

    static parseFirework(child) {
        const parseNumberAttribute = (element, attributeName, defaultValue) => {
            const value = Number(element?.getAttribute(attributeName)) || defaultValue;
            return isNaN(value) ? defaultValue : value;
        };

        return {
            type: child.getAttribute("type") || "",
            begin: parseNumberAttribute(child, "begin", 0),
            colour: child.getAttribute("colour") || "",
            duration: parseNumberAttribute(child, "duration", 0),
            position: {
                x: parseNumberAttribute(child.querySelector("Position"), "x", 0),
                y: parseNumberAttribute(child.querySelector("Position"), "y", 0),
            },
            ...(child.getAttribute("type") === "Rocket" && {
                velocity: {
                    x: parseNumberAttribute(child.querySelector("Velocity"), "x", 0),
                    y: parseNumberAttribute(child.querySelector("Velocity"), "y", 0),
                },
            }),
        };
    }
}
