export default class XmlLoader {
    constructor(url, method = "GET") {
        if (typeof XMLHttpRequest === 'undefined') {
            throw new Error("XMLHttpRequest is not available. This browser may not support the XmlLoader class.");
        }

        this.url = url;
        this.method = method;
    }

    request() {
        return new Promise((resolve, reject) => {
            const xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        resolve(this.responseXML);
                    } else {
                        reject(new Error(`XMLHttpRequest failed with status ${this.status}`));
                    }
                }
            };

            xhttp.open(this.method, this.url, true);
            xhttp.send();
        });
    }

    async get() {
        try {
            const xmlDoc = await this.request();
            const fireworkDisplays = Array.from(xmlDoc.querySelectorAll("FireworkDisplay")[0]?.children || []);

            const fireworks = fireworkDisplays.map((child) => {
                const firework = {
                    type: child.getAttribute("type") || "",
                    begin: Number(child.getAttribute("begin")) || 0,
                    colour: child.getAttribute("colour") || "",
                    duration: Number(child.getAttribute("duration")) || 0,
                    position: {
                        x: Number(child.children[0]?.getAttribute("x")) || 0,
                        y: Number(child.children[0]?.getAttribute("y")) || 0,
                    },
                };

                if (firework.type === "Rocket") {
                    firework.velocity = {
                        x: Number(child.children[1]?.getAttribute("x")) || 0,
                        y: Number(child.children[1]?.getAttribute("y")) || 0,
                    };
                }

                return firework;
            });

            return fireworks;
        } catch (error) {
            console.error("Error loading XML:", error.message);
        }
    }
}
