##Specifications
> Technologies used for development

* **Backend**: NodeJS
* **Web framework**: ExpressJS
* **Websocket lib**: ws

###File architecture
* `root`
  * `/bin` - This directory only holds the startup file, `www`
  * `/models` - This directory holds the models
    * `m.js` - File to expose all models, so you dont have to include every model file.
  * `/views` - This directory holds the views
  * `/ctrl` - This directory holds the controllers
  * `/public` - Directory for publicly available files
    * `/css` - CSS Styles
    * `/js`/ - JS Files
  * `/config.js` - Configuration file for the entire project
  * `/app.js` - Express app setup file
  * `/package.json` - NodeJS package file