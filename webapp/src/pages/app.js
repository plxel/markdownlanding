import React from 'react';
import { Router } from '@reach/router';
import EditPage from '../components/EditPage';
import PublishPage from '../components/PublishPage';
import Layout from '../components/layout';
import Dashboard from '../components/Dashboard';

const App = () => (
  <Layout>
    <Router basepath="/app">
      <Dashboard path="/" />
      <EditPage path="/edit/:id" />
      <PublishPage path="/publish/:id" />
    </Router>
  </Layout>
);
export default App;
