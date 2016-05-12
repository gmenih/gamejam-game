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

## Protocol
> Definitions for server to client (and vice-versa) communication.

Every package consists of:

* `package {Object}` - *Wrapper object*
  * `c {String}` - *Name of command, `$1:$2`, where `$1` is the root of command (load, update, ...) and `$2` is the target of command.*
  * `d {Mixed}` - *The data that is required for current command. Can be `null`.*
* Definitions for `$1`:
  * `l` - Load: Something must be loaded, `$2` is what.
  * `u` - Update: Something must be updated, `$2` is what.
  * `r` - Result: Result of previous package, `$2` is the result.
  * `a` - Attack: Attack, `$2` marks the type of attack.

### Client to server
> Commands that can be send from client to server.

|Command|Data|Description|
|:--|:--|:::|
|`l:p`|`playerId {ObjectId}`|Load the <u>p</u>layer by `playerId`. Must respond with `l:p`, having `{Player}` as data. Meant to be called only on startup.|
|`l:m`|`null`|Load the <u>m</u>ap. Must respond with `l:m`, having `[Tile][Tile]` as data.|
|`l:o`|`null`|Load  <u>o</u>ther players. Must respond with `l:o`, having `[{Player}]` as data.|
|`u:p`|`location {x, y}`|Update the location of player to `location`. Must respond with `r:k`, having no data.|
|`u:o`|`null`|Update the positions and states of other players. Must respond with a `u:o`, having a Map of `playerId` and `keyState`, which tells us what buttons the player is holding.|
|`a:r`|`angle {Number}`|Send a ranged attack to `angle` from the player. Must respond with `r:k`.|
|`a:m`|`null`|Perform a melee attack to the direction player is facing. Must respond with `r:k`.|

### Server to client
> Commands that the server will respond back to the client.

|Command|Data|Description|
|:--|:--|:::|
|`r:k`|`null`|General response when everything is okay.|
|`l:p`|`player {Player}`|Response to `l:p` from client, to send the client the loaded `player`.|
|`l:m`|`map [{Tile}][{Tile}]`|Response to `l:m`, to send the client the loaded `map`.|
|`l:o`|`players[{Player}]`|Response to `l:o`, to send the client the loaded `players`.|
|`u:o`|`players[{Map}]`|Response to `u:o`, to send the client updated states of `players`.|
