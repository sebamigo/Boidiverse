# Boidiverse
Hierbei handelt es sich um eine Java Script Implementierung
der von Craig Reynold vorgestellten Boids (Vgl. http://www.red3d.com/cwr/boids/).

Das Ziel ist es mithilfe der implementierten Boids ein
Vogelschwarm zu simulieren, indem mithilfer einer
Schwarmintelligenz gearbeitet wird. Ein einzelner Boid 
arbeitet lediglich mit 3 Regeln, welche dann in der
Gesamtheit ein intelligentes System darstellen.

## Testing
in _/dist_ befindet sich eine fertige statische Webseite,
welche in jedem Browser geöffnet werden kann.

## Install
In diesem Projekt wurde mit **Webpack** (Vgl. https://webpack.js.org/) gearbeitet
um das Projekt in diverse Module einteilen zu können.
Um das Projekt zu Bündeln muss folgender CLI aufgerufen werden:

`npm run build:js`

Die gebündelte Datei _bundle.js_ befindet sich in _/dist_

Um diese nun in einer HTML-Datei zu einzubeziehen muss im
body-tag der Datei ein div-tag mit der id `boids-js` hinzugefügt werden

`<div id="boids-js"></div>`

außerdem muss das Script mit eingefügt werden:

`<script src="bundle.js"></script>`