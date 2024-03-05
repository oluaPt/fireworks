


1. **Main Script (`main.js`):**
   - Orchestrates the entire fireworks display project.
   - Initializes the PIXI.js application, loads fireworks data, and creates instances of fountains and rockets.
   - Manages counters for frame rate and memory usage.
   - Periodically updates counters and restarts fireworks for an ongoing display.

2. **Rocket (`rocket.js`):**
   - Represents a rocket-style firework with a trajectory animation.
   - Utilizes PIXI.Ticker for smooth animation updates.
   - Creates and manages PIXI.particles.Emitter for the rocket's particle effect.
   - Restarts the animation when needed, triggering additional particle effects.

3. **Fountain (`fountain.js`):**
   - Represents a fountain-style firework with a continuous particle effect.
   - Utilizes PIXI.particles.Emitter for the fountain's particle display.
   - Starts the fountain animation and restarts it periodically for a continuous display.

4. **XML Loader (`xmlLoader.js`):**
   - Handles the loading and parsing of fireworks configuration data from an XML file.
   - Creates an array of firework configurations, including details such as timing, type, color, and positioning.
   - Used by the main script to dynamically generate firework instances.

5. **Fireworks Configuration (`fireworks.xml`):**
   - An XML file specifying the parameters for various firework displays.
   - Includes attributes such as begin time, type (fountain or rocket), color, duration, position, and velocity.
   - Provides input data for the XML Loader and subsequent creation of firework instances in the main script.




**Note: Please run this files on a web server due to CORS restrictions.**