# Watson Discovery News Search Web App [![Build Status](https://travis-ci.org/ankurp/watson-discovery-news-search.svg?branch=master)](https://travis-ci.org/ankurp/watson-discovery-news-search)

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/ankurp/watson-discovery-news-search)

In this developer journey we will build a News Search API server that uses Watson's Discovery Service to get you the most relevant news articles for a search query straight in your slack channel.

Once you are done with this journey you will know how to:

1. Built and run an API server with a HTML frontend written in React
2. Configure Watson Discovery Service with the App
3. Add Slackbot to your team Slack and configure it with the app
4. Deploy the app to IBM Bluemix using cloudfoundry CLI tool

# Repo Contents

This repo contains code for
1. Responsive Frontend web application built using React
2. Backend Web and API Server built using express
3. Slackbot built using botkit

![Architecture Diagram](https://raw.githubusercontent.com/ankurp/watson-discovery-news-search/master/docs/architecture.png)

# Included components

* [Watson Discovery](https://www.ibm.com/watson/developercloud/discovery.html) - Rapidly build a cognitive search and content analytics engine

# Featured technologies

* [Node.js](https://nodejs.org/en/) - An asynchronous event driven JavaScript runtime, designed to build scalable applications
* [Slack](https://slack.com) - Slack is a cloud-based set of team collaboration tools and services with chat bot integration
* [Botkit](https://www.botkit.ai) - Framework for creating and managing chat bots
* [React](https://facebook.github.io/react/) - Javascript library for building User Interfaces
* [express](https://expressjs.com) - Most popular and minimalistic web framework for creating API and Web server
* [yarn](https://yarnpkg.com) - Fast, reliable and secure dependency manager for node.js

# Getting Started

## Prerequisites

Make sure before you start you have the following tasks done:

1. Install [nodejs](https://nodejs.org/en/) and [yarn](https://yarnpkg.com)
2. Install the [Cloud-foundry CLI](https://github.com/cloudfoundry/cli) tool
3. Have a [Bluemix account](https://console.ng.bluemix.net/registration/)


## Steps

### 1. Clone the repo

Clone the repo by running the following command in the terminal and go into that directory.

```sh
$ git clone https://github.com/ankurp/watson-discovery-news-search/
$ cd watson-discovery-news-search
```

### 2. Install the dependencies and bootstrap

Install all of the dependencies by running `yarn` command. This will install of the node modules specified in the package.json

```sh
$ yarn
```

Then run `yarn bootstrap` to copy the `.env.sample` to `.env` and fill in the credentials in the `.env` file by following the next steps.

```sh
$ yarn bootstrap
```

### 3. Create Bluemix Services

Create the following services:

* [Watson Discovery](https://console.ng.bluemix.net/catalog/services/discovery?env_id=ibm:yp:us-south)

### 4. Configure Watson Discovery

Fill in name you want to give to your service along with a name where credentials will be saved and click *Create*.

![Create Discovery Service Service](https://raw.githubusercontent.com/ankurp/watson-discovery-news-search/master/docs/discovery-1.png)


After the service is created, click on *Service credentials* and then click on *View Credentials* and copy the *username* and *password* values into the `.env` after the `=` sign for `DISCOVERY_SERVICE_USERNAME` and `DISCOVERY_SERVICE_PASSWORD` environment variables.

![Discovery Service Credentials](https://raw.githubusercontent.com/ankurp/watson-discovery-news-search/master/docs/discovery-2.png)

### 5. Create Slackbot for your Slack Team

Create a new slack bot for your slack team by going to https://my.slack.com/services/new/bot. Enter a username for the bot and click `Add bot integration`.

![Create Slackbot](https://raw.githubusercontent.com/ankurp/watson-discovery-news-search/master/docs/slack-1.png)

On the confirmation page copy the `API Token` to the `.env` file after the `=` sign for `SLACK_BOT_TOKEN`.

![Slackbot Token](https://raw.githubusercontent.com/ankurp/watson-discovery-news-search/master/docs/slack-2.png)

### 6. Start Everything

Start the app by running `yarn start`. If you are developing and making changes to the app and would like the server to restart every time then run `yarn start:watch`

```sh
$ yarn start
```

Open the browser and go to `http://localhost:3333`

### 7. Deploy to Bluemix

To deploy to Bluemix make sure you have cloud foundry CLI tool installed. Then run the following commands to connect it with Bluemix and login with your Bluemix credentials.

```sh
$ cf api https://api.ng.bluemix.net
$ cf login
```

Then to deploy just run the following command and it will push the code, deploy it to a server and run it.

```sh
$ cf push
```

Go to the URL that is printed at the end after deployment is done and you can view the app and now the chat bot should be active in your Team Slack and you can message to and ask for news by typing `news please`

![Chatting with Slackbot](https://raw.githubusercontent.com/ankurp/watson-discovery-news-search/master/docs/slack-3.png)

# Architecture

## Backend Server

Backend server is responsible for server side rendering of the views to be displayed on the browser. It is servers as an API server where the API endpoint hits Watson Discovery News service to get the most relevant news stories.

This backend is written using express and uses express-react-views engine to render views written using React.

## Frontend Web App

The frontend uses React to render search results and can reuse all of the views that are used by the backend for server side rendering. The frontend is using watson-react-component and is responsive. It is also using rechart as the charting library for the Sentiment tab in the web application.

## Slackbot

The slackbot is written using botkit and runs along with the backend server. It responds to queries in the slack channel once the bot is invited to that channel. It uses the backend API server to get news stories similar to how the frontend web application queries the backend for its news stories.
