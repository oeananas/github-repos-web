import React, {useReducer} from 'react'
import { GithubContext } from './githubContext'
import { githubReducer } from './githubReducer'
import axios from 'axios'
import { SEARCH_USERS, GET_USER, GET_REPOS, CLEAR_USERS, SET_LOADING } from '../types'

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET


export const GithubState = ({children}) => {
    const initialState = {
        user: {},
        users: [],
        loading: false,
        repos: []
    }
    const [state, dispatch] = useReducer(githubReducer, initialState)

    const search = async value => {
        setLoading()
        const response = await axios.get(
            `https://api.github.com/search/users`,
            {
                params: {
                    q: value,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET
                }
            }
        )
        dispatch({
            type: SEARCH_USERS,
            payload: response.data.items
        })
    }

    const getUser = async name => {
        setLoading()
        const response = await axios.get(
            `https://api.github.com/users/${name}`,
            {
                params: {
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET
                }
            }
        )
        dispatch({
            type: GET_USER,
            payload: response.data
        })
    }

    const getRepos = async name => {
        setLoading()
        const response = await axios.get(
            `https://api.github.com/users/${name}/repos`,
            {
                params: {
                    per_page: 5,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET
                }
            }
        )
        dispatch({
            type: GET_REPOS,
            payload: response.data
        })
    }

    const clearUsers = () => {
        //...
        dispatch({
            type: CLEAR_USERS
        })
    }

    const setLoading = () => {
        //...
        dispatch({
            type: SET_LOADING
        })
    }

    const {users, user, repos, loading} = state

    return (
        <GithubContext.Provider value={{
            search, getUser, getRepos, clearUsers, setLoading,
            users, user, repos, loading
        }}>
            {children}
        </GithubContext.Provider>
    )
}