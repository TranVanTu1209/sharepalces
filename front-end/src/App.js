import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIComponents/LoadingSpinner';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hooks/auth-hooks';

const Users = React.lazy(() => import('./user/pages/Users'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const Auth = React.lazy(() => import('./user/pages/Auth'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));

const App = () => {
  const { token, login, logout, userId } = useAuth();
  let routes;
  if (token)
  {
    routes = (
      <Switch>
        <Route exact path="/" >
          <Users />
        </Route>
        <Route exact path="/:userId/places" >
          <UserPlaces />
        </Route>
        <Route exact path="/places/new" >
          <NewPlace />
        </Route>
        <Route exact path="/places/:placeId" >
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  } else
  {
    routes = (
      <Switch>
        <Route exact path="/" >
          <Users />
        </Route>
        <Route exact path="/:userId/places" >
          <UserPlaces />
        </Route>
        <Route exact path="/auth" >
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider value={{ isLoggedin: !!token, login: login, logout: logout, userId: userId, token: token }}>
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={<div className="center">
            <LoadingSpinner />
          </div>}>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
