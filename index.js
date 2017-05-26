require('dotenv').config({ silent: true });

const server = require('./server');
const port = process.env.PORT || 4321;

server.then(app => {
  app.listen(port, () => {
    console.log('Server running on port: %d', port);
  });
});
