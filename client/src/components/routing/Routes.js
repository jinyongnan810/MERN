import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from '../routing/PrivateRoute';
import CreateProfile from '../profile/CreateProfile';
import EditProfile from '../profile/EditProfile';
import AddExperience from '../profile/AddExperience';
import AddEducation from '../profile/AddEducation';
import Profiles from '../profile/Profiles';
import Profile from '../profile/Profile';
import Posts from '../post/Posts';
import Post from '../post/Post';
import { Notfound } from '../layout/Notfound';
import Alert from '../layout/Alert'
import Login from '../auth/Login'
import Register from '../auth/Register'
import Dashboard from '../dashboard/Dashboard';

const Routes = props => {
    return (
        <section className="container">
            <Alert />
            <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                <PrivateRoute exact path="/add-experience" component={AddExperience} />
                <PrivateRoute exact path="/add-education" component={AddEducation} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/profile/:id" component={Profile} />
                <PrivateRoute exact path="/posts" component={Posts} />
                <PrivateRoute exact path="/posts/:id" component={Post} />
                <Route component={Notfound} />
            </Switch>
        </section>
    )
}


export default Routes

