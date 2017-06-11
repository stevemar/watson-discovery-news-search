# Promises over Callbacks

Promises are a great feature in Javascript that allows you to avoid [callback hell](http://callbackhell.com) especially when you need to wait on response from multiple API request which are asynchronous. Having used the [Discovery node SDK](https://github.com/watson-developer-cloud/node-sdk) for the [Discovery News Search Slack Bot App](https://github.com/ankurp/watson-discovery-news-search) I noticed the APIs relied heavily on the callbacks instead of promises, where the callback gets passed `error` as the first argument and `response` as the second. We then need to check if `error` it not `undefined` or `null` and before we can use the `response`. 

This pattern can results in a lot of nested callbacks and huge callback function body since we need to handle both success and error states in this callback function making the code harder to read and follow.

```js
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

// Initialize the Discovery service with credentials from Bluemix
const discovery = new DiscoveryV1({
  username: '<username>',
  password: '<password>',
  version_date: DiscoveryV1.VERSION_DATE_2017_04_27
});

// Get all of the environments
discovery.getEnvironments({}, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    
    // Find the environemnt id for News collection
    const news_environment_id = response.environments.find((environment) => {
      return environment.read_only == true;
    }).environment_id;

    // Get the New collection ID using the environment
    discovery.getCollections({
      environment_id: news_environment_id
    }, (error, response) => {
      if (error) {
        console.error(error);
      } else {
        const news_collection_id = response.collections[0].collection_id;

        // Now we can query discovery news collection
        discovery.query({
          environment_id: news_environment_id,
          collection_id: news_collection_id
          query: 'my_query'
        }, (error, response) => {
          if (error) {
            console.error(error);
          } else {
            // By the time we get the response we have 6 levels of nesting
            console.log(response);
          }
        });
      }
    });
  })
});
```

To fix this we can use a javascript Promise library called `bluebird` which can convert callback based API's to return promises instead. So now we can use `then` and `catch` to seperate success and error cases and simplify the flow of our code as seen below.

```js
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

// Initialize the Discovery service
const discovery = new DiscoveryV1({
  username: '<username>',
  password: '<password>',
  version_date: DiscoveryV1.VERSION_DATE_2017_04_27
});

// Promisify the API using Bluebird's promisify factory function
discovery.getEnvironments = Promise.promisify(discovery.getEnvironments);
discovery.getCollections = Promise.promisify(discovery.getCollections);
discovery.query = Promise.promisify(discovery.query);

let environmentId;
discovery.getEnvironments({})
.then(response => { // Response for environment gets passed in the then block
  environmentId = response.environments
    .find(env => env.read_only == true).environment_id;

  // Returning a promise inside the then block will cause
  // the next `then` block to fire when the discovery.getCollection
  // async request finishes and passes the result of getCollection
  // as the first argument to the callback in the next `then` function
  return discovery.getCollections({ environment_id: environmentId });
})

// This then block will get called when the getCollection async request
// finished and passed the result in the response
.then(response => {
  collectionId = response.collections[0].collection_id;

  // Now we can run a query against our discovery service
  return discovery.query({
      environment_id: news_environment_id,
      collection_id: news_collection_id
      query: 'my_query'
    })
})

// The response of the discovery query gets passed to this
// then block
.then(response => console.log(response));

// Any errors that occur anywhere in this flow gets caught by this catch
// block and can be logged and handled independently from the success cases above
.catch(error => console.error(error));
```

As seen in the code above we have only one level of nesting vs the 6 levels of nesting and we were able to seperate out the success from the error case in our code making the flow easy to understand.

Another benefit of using promises is that if you return a promise inside of a `then` block for a promise the next `then` block will only gets called when that returned promise inside of the previous `then` block resolves as such:

```js
.then(response => {
  //...

  // Returning a promise results in the next chained
  // then callback function to be called when this promise resolve
  return discovery.query({
      environment_id: news_environment_id,
      collection_id: news_collection_id
      query: 'my_query'
    })
})

// The response of the discovery query gets passed to this
// then block
.then(response => console.log(response));
```

I hope this helps simpily your use of the Discovery API and shows you an example of where Javascript Promises can be used to simiply the workflow in your code.
