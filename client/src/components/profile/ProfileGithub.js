import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { getRepos } from '../../actions/profile'
import { useEffect } from 'react'
import { connect } from 'react-redux'

const ProfileGithub = ({ username, getRepos, repos }) => {
    useEffect(() => {
        getRepos(username)
    }, [getRepos, username])
    return (
        <div className="profile-github">
            <h2 className="text-primary my-1">
                <i className="fab fa-github"></i> Github Repos
          </h2>
            {
                repos.length === 0 ? <h4>No Github Repos</h4> :
                    <Fragment>{
                        repos.map(repo => (
                            <div className="repo bg-white p-1 my-1" key={repo.id}>
                                <div>
                                    <h4><a href={repo.html_url} target="_blank"
                                        rel="noopener noreferrer">{repo.name}</a></h4>
                                    {repo.description && <p>{repo.description}</p>}
                                </div>
                                <div>
                                    <ul>
                                        <li className="badge badge-primary">Stars: {repo.stargazers_count}</li>
                                        <li className="badge badge-dark">Watchers: {repo.watchers_count}</li>
                                        <li className="badge badge-light">Forks: {repo.forks_count}</li>
                                    </ul>
                                </div>
                            </div>
                        ))
                    }
                    </Fragment>

            }

        </div>

    )
}

ProfileGithub.propTypes = {
    username: PropTypes.string.isRequired,
    getRepos: PropTypes.func.isRequired,
    repos: PropTypes.array.isRequired,
}
const mapStateToProps = state => ({
    repos: state.profile.repos
})

export default connect(mapStateToProps, { getRepos })(ProfileGithub)
