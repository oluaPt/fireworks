export default class XmlLoader {
    constructor(url, method = "GET") {
        if (!window.XMLHttpRequest) throw new Error("XMLHttpRequest is not available. This browser may not support the XmlLoader class.");
        this.url = url;
        this.method = method;
    }

    async get() {
        try {
            const xmlDoc = await this.request();
            return Array.from(xmlDoc?.querySelectorAll("FireworkDisplay")?.[0]?.children || []).map(child => this.parseFirework(child));
        } catch (error) {
            console.error("Error loading XML:", error.message);
            throw error;
        }
    }

    async request() {
        return new Promise((resolve, reject) => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => xhttp.readyState === 4 && (xhttp.status === 200 ? resolve(xhttp.responseXML) : reject(new Error(`XMLHttpRequest failed with status ${xhttp.status}`)));
            xhttp.open(this.method, this.url, true);
            xhttp.send();
        });
    }

    parseFirework(child) {
        const parseNumberAttribute = (element, attributeName, defaultValue) => {
            const value = Number(element?.getAttribute(attributeName)) || defaultValue;
            return isNaN(value) ? defaultValue : value;
        };

        const firework = {
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

        return firework;
    }
}
