// src/App.tsx

import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './Router';

const App: React.FC = () => {
  const routeElement = useRoutes(routes);
  return <div className="App">{routeElement}</div>;
};

export default App;
