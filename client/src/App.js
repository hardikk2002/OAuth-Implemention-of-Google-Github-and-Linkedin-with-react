import { BrowserRouter, Route, Switch } from "react-router-dom"
import Home from './components/Home';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/home" exact component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
