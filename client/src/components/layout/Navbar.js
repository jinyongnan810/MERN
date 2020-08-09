import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../../actions/auth'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


const Navbar = (props) => {
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
            </h1>
            {
                !props.auth.loading && props.auth.isAuthenticated ?
                    (
                        <ul>
                            <li><Link to="/dashboard"><i className="fas fa-user"></i> <span className="hide-sm">DashBoard</span></Link></li>
                            <li><Link to="/profiles">Developers</Link></li>
                            <li><a href="#!" onClick={e => props.logout()}><i className="fas fa-sign-out-alt"></i> <span className="hide-sm">Logout</span></a></li>
                        </ul>
                    ) :
                    (
                        <ul>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    )
            }
        </nav>
    )
}

Navbar.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar)
