import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory, NavLink } from 'react-router-dom';
import { oneRestaurant } from '../../store/restaurant';
import { liveSearch, clearSearch } from '../../store/search';



const SearchResultPage = () => {

    // const parsed = queryString.parse(params.location.search);
    // const search = props.location.search;
    // const params = new URLSearchParams(search);
    // const find = params.get('find');

    const searchRes = useSelector(state => Object.values(state.search))
    const dispatch = useDispatch();
    const history = useHistory();

    const search = useLocation().search;
    const find = new URLSearchParams(search).get('find');

    const [searchArr, setSearchArr] = useState([])

    useEffect(()=>{
        if (searchRes) setSearchArr(searchRes)
    },[])

    const getOneRestaurant = async (e, resId) => {
        e.preventDefault();

        await dispatch(oneRestaurant(resId))
        await dispatch(clearSearch())
        history.push(`/restaurants/${resId}`)
    }

    const isResults = () => {
        if (searchArr.length) {
            return (
                <>
                    <div>
                        <h2>{`Results for '${find}'`}:</h2>
                    </div>
                    <ul id='card-list'>
                        {searchArr.map((res) => {
                            return (
                                <li className="restaurant-container" key={searchArr.indexOf(res)}>
                                    <div className={'restaurant_container'}>
                                        <img className={'restaurant-photo'} src={res.imgSrc} alt={"Restaurant Image"}></img>
                                        <div className={'restaurant-info'}>
                                            <div className='name-and-location-container' onClick={(e)=>getOneRestaurant(e, res.id)} >
                                                    <h2 className='restaurant-name'>{res.name}</h2>
                                                <div className="restaurant-location-container">
                                                    {res.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </>
            )
        } else {
            return (
                <div>
                    <h2>{`Could not find results for ${find}`}</h2>
                </div>
            )
        }
    }

    return (
        <div className="all-restaurants-container">
            {searchRes && isResults()}
        </div>
    )
}

export default SearchResultPage;
