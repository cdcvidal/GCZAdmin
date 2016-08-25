# Humm Application

Web application for viewing and managing a cluster of HummBoxes.

Project management is on [trello](https://trello.com/b/vCmhhi37/backlog-appli-v1).

# Get started

Note: the developpement environment relies on [Git](https://git-scm.com/downloads), [NodeJS with NPM](https://nodejs.org/en/download/) and [Grunt](http://gruntjs.com/getting-started), you'll need to install these tools system-wide before starting to work on the projet.

Application is 100% Javascript, you can deploy a development environnement with:

```
git clone git@github.com:francosi/hummApplication.git .
npm install
grunt build
```

Before proceeding, please take the time to configure the project. To do so, go
to `modules/main/` directory and copy `localConfig.example.js` to
`localConfig.js`. Then, edit this file and set a values for variables. For
example:

```
cat localConfig.example.js | sed -e "s/<APIURL>/https:\/\/gcz-management.mybluemix.net\/api/" > localConfig.js
```

The Grunt configuration includes linting, unit test, JS/CSS/templates bundling. You can also run a developement server with file watching and livereload with `grunt dev`.

# Architecture

The application is based on the [Backbone](http://backbonejs.org/)/[Marionette](http://marionettejs.com/) pair and the UI integration rely on [Bootstrap3](http://getbootstrap.com/). It is designed as a [single-page application](https://en.wikipedia.org/wiki/Single-page_application).

It gets its data from the [GreenCityZen API](https://gcz-management.mybluemix.net/api/), developed as a separate project.

# Production server

Continuous integration is handled by IBM Devops service. It listens to Github push events and rebuild/deploy as soon as new commits are pushed to the master branch on the Github repository.

Demonstration server is at http://humm-application-preprod.eu-gb.mybluemix.net/.

