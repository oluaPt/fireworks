[Check it working here](https://fireworkspixi.playcode.io/){:target="_blank"}  
&nbsp;
&nbsp;

- **File Structure:**
   1. **`main.js`:**
      - Orchestrates the fireworks display.
      - Initializes PIXI.js application and manages the overall flow.
      - Loads firework configurations from `fireworks.xml`.
      - Utilizes `XmlLoader` to fetch and parse XML data.
      - Creates and manages instances of specific fireworks using the `FireworkFactory`.
      - Implements a restart mechanism for continuous display.

   2. **`fireworkFactory.js`:**
      - Factory class responsible for creating specific fireworks based on configurations.
      - Used by `main.js` to generate instances of `Fountain` and `Rocket`.

   3. **`xmlLoader.js`:**
      - Asynchronous module handling XML file loading and parsing.
      - Parses XML data using the DOMParser and returns an array of firework configurations.

   4. **`fireworks.js`:**
      - Base class for shared functionality among all fireworks.
      - Contains common methods such as parameter validation and creation of emitters.

   5. **`fountain.js`:**
      - Specialized class extending `Firework`.
      - Generates fountain-type fireworks using PIXI particles.
      - Implements specific validation, creation, update, and restarting functionality.

   6. **`rocket.js`:**
      - Specialized class extending `Firework`.
      - Generates rocket-type fireworks with PIXI particles and sprite.
      - Implements specific validation, creation, update and restarting functionality.

   7. **`fireworks.xml`:**
      - XML file specifying detailed firework configurations.
      - Defines attributes such as type, color, position, velocity, and duration for each firework.

- **Usage:**
   - The application must be hosted on a web server to address CORS issues.
   - Customize the fireworks display by adjusting parameters in `fireworks.xml`.
