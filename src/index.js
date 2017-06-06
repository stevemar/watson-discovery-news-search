const React = require('react');
const DefaultLayout = require('./layouts/default');
const Main = require('./main');
const objectWithoutProperties = require('./utils').objectWithoutProperties;

class Application extends React.Component {
  render() {
    const props = objectWithoutProperties(this.props, ['settings', '_locals', 'cache']);

    return (
      <DefaultLayout title={props.title} initialData={JSON.stringify(props)}>
        <Main {...props} />
      </DefaultLayout>
    );
  }
}

module.exports = Application;
