# Watson Discovery News Search Web App [![Build Status](https://travis-ci.org/ankurp/watson-discovery-news-search.svg?branch=master)](https://travis-ci.org/ankurp/watson-discovery-news-search)

This repo contains code for
1. Responsive Frontend web application built using React
2. Backend Web and API Server built using express
3. Slackbot built using botkit

The purpose of this repo is to demonstrate how ot use the Watson Discovery Service to get news articles related to a certain industry or topic. There is also a slackbot integration to show how you can integrate this into an existing worflow such as getting news straight from your slack channel or setting up a job every morning to email news articles related to a certain industry every day for the past 24 hours.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/ankurp/watson-discovery-news-search)

# Architecture

![Architecture Diagram](https://raw.githubusercontent.com/ankurp/watson-discovery-news-search/master/docs/architecture.png)

## Backend Server

Backend server is responsible for server side rendering of the views to be displayed on the browser. It is servers as an API server where the API endpoint hits Watson Natural Language Understanding service first to make sense of the search query and then forwards the category/taxonomy extract from the search query to the Watson Discovery News service to get the most relevant news stories.

This backend is written using express and uses express-react-views engine to render views written using React.

## Frontend Web App

The frontend uses React to render search results and can reuse all of the views that are used by the backend for server side rendering. The frontend is using watson-react-component and is responsive. It is also using rechart as the charting library for the Sentiment tab in the web application.

## Slackbot

The slackbot is written using botkit and runs along with the backend server. It responds to queries in the slack channel once the bot is invited to that channel. It uses the backend API server to get news stories similar to how the frontend web application queries the backend for its news stories.

# Getting Started

Run the following commands in order to get started running the backend, frontend and the slackbot. For this project we are using `yarn` instead of `npm`.

1. Run `yarn` to install of the dependencies
2. Run `yarn bootstrap` to copy the `.env.sample` to `.env` and fill in the credentials in the `.env` file
3. Start the app by running `yarn start`. If you are developing and making changes to the app and would like the server to restart every time then run `yarn start:watch`
4. Open the browser and go to `http://localhost:3333`
