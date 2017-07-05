## 3D Viewer

If running locally, open the terminal and run "grunt serve" in client directory or "npm run develop-client" in root directory. Then run "npm test" in server directory in another tab, and also run "mongod" in server directory in a third tab. The minified production application currently does not work due to the Grunt issue https://github.com/yeoman/grunt-usemin/issues/266 . Once this issue is resolved, you should be able to type "grunt build" in client directory to get the production ready app. After which, you can type "npm start" in the server directory in place of "npm test" to test the minified production app locally.

### Front-end

The 3D Viewer Wix app allows site creators to upload their 3D models to an environment configurable through the settings panel. Site visitors will be able to see the model on a canvas that the site owner can customize. The application is not compatible with mobile devices.

Site owners can control:
* Lighting
* Shading
* Colors
* Background color
* Default camera settings

Settings Panel Screenshots:

![alt tag](http://i.imgur.com/FNbHX8x.png)
___
![alt tag](http://i.imgur.com/iMSrvhb.png)
___
![alt tag](http://i.imgur.com/yJhHSkd.png)
___
![alt tag](http://i.imgur.com/h2rY5PQ.png)
___
![alt tag](http://i.imgur.com/w7zSTTM.png)

The site visitors will be able to control the camera using their mouse:
* Left click and hold to orbit/rotate camera
* Right click and hold to translate camera
* Middle scroll wheel to zoom in/out

Target Widget Display & Controls (taken from SketchFab):

![alt tag](http://i.imgur.com/yI9MCKV.png)
![alt tag](http://i.imgur.com/loQI95O.png)
![alt tag](http://i.imgur.com/sG0VWRU.png)
![alt tag](http://i.imgur.com/cwtId1z.png)

Site visitors will not be able to change the model, background, or settings, but they can change their view/perspective. This way, site owners can display their original work as intended. 

### Back-end

The back end is written in Node.js and the database uses MongoDB/Mongoose. The models themselves are saved on Amazon S3 web services.

To start up MongoDB with logs, run "mongod -dbpath data/db/ --logpath data/logs/mongodb.log --logappend" in the terminal while in the server directory. Logs will be appended in server/data/logs.

### Development notes

The 3D environment completely works in localhost:9000 (when running "grunt serve" in /client or "npm run develop-client" in root). But does not work in localhost:3000 (when running "npm test" in /server). The backend saves the user identification (instance and compId) to MongoDB when the widget is opened in the Wix editor.

Because the Safari browser does not yet support WebGL, the application will not work in Safari.


## Agenda/Review

1. Description of the app can be found on the github README www.github.com/gorlanwix/3d-viewer
2. App was made with Node.js, MongoDB (MongoJS), Three.js (WebGL library), AngularJS, Grunt, Yeoman
3. There are some JavaScript libraries used as well that are not npm packages. They are located in the /client/app/libraries directory.
Detector.js detects if the user's browser can be used to display WebGL canvases.
io_mesh_threejs is a folder that contains code to convert imported models that that do fit the .obj file criteria (not currently being used in the app).
MTLLoader.js is a loader that loads the object's material. Could be used if your model, material, textures do not fit the .obj, .mtl, .png format, but it is not currently used.
OBJLoader.js loads the object itself. Used for same reason as above, but not currently used.
OBJMTLLoader.js is a loader that takes two parameters, one for the object and one for the material. And the texture for the object is specified in the .mtl file. This is the loader that the app currently uses.
three.min.js is the minified Three.js library that allows the rendering of a 3D environment. You can also load it straight from the source online. I put it in locally, so that you can test offline.
TrackballControls.js sets controls for your mouse so that clicking, holding, and dragging different mouse buttons will do different things to the camera.
4. The index.html file in client/app loads the libraries and scripts needed to create the environment and load the model.
In the client/app/views directory, only settings.html is used. The other files are for testing.
In the client/app/scripts/controllers directory, model.js is the AngularJS controller for the widget (index.html) and settings.js is the controller for the settings panel.
In client/app/scripts/services, id.js is used to identify the user based on their instance and compId, which both the widget and settings use through dependency injection.
In client/app/scripts/three, exampletextures.js is the JavaScript Three.js main file that loads the canvas for 3D rendering. The other files in this directory are/were for testing and are not needed.
app.js in client/app/scripts is to initialize the Angular application.

In server/, the app.js is the main file that handles requests and database management. Refactoring of code has not happened yet.
There is a test file in server/test to get an understanding of how Node.js and MongoJS work together. You can call the functions in that file to see how the database looks. Output is console.logged to the terminal tab that is running "npm test".
server/uploads is the directory in which multer (a node module) will upload the user's model after the user clicks the Upload button in the settings panel on the front end.
More information about specific functions and variables can be found in the files themselves.

5. the io_mesh_threejs library can be found at https://github.com/mrdoob/three.js/tree/master/utils/exporters/blender/2.65/scripts/addons/io_mesh_threejs

MTLLoader.js - https://github.com/mrdoob/three.js/blob/cbb711950dab74bd8be6c8cf295296aa31f07e6c/examples/js/loaders/MTLLoader.js

OBJLoader.js - https://github.com/mrdoob/three.js/blob/cbb711950dab74bd8be6c8cf295296aa31f07e6c/examples/js/loaders/OBJLoader.js

OBJMTLLoader.js - https://github.com/mrdoob/three.js/blob/cbb711950dab74bd8be6c8cf295296aa31f07e6c/examples/js/loaders/OBJMTLLoader.js

three.js/three.min.js - https://github.com/mrdoob/three.js/tree/cbb711950dab74bd8be6c8cf295296aa31f07e6c/build

TrackballControls.js - https://threejsdoc.appspot.com/doc/three.js/src.source/extras/controls/TrackballControls.js.html

All other modules are easy to find/included in node_modules/package.json

6. App key - 1387fb60-3f85-6660-19f8-947b02168e02
App Secret key - ca1de435-73b3-4ea5-adee-1a11ebc68693 (I don't believe either of these are used)

8. Just run "grunt serve" in your terminal while in the client directory to see the widget with a sample model.

9. Run "npm test" in another terminal tab while in the server directory to run the backend along with the front end. More info in the GitHub

10. N/A

11. See GitHub

12. N/A

13. To be determined

14. To be determined

15. Three.js's OBJMTLLoader may not be compatible with Express (current problem that I am looking into). Settings panel does not display right in Safari. WebGL not supported by Safari. To Do list is in root directory named todo.txt



