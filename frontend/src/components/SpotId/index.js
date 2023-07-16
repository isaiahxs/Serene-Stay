import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { spotDetails } from '../../store/spots';
import { useParams } from 'react-router-dom';
import { ReactComponent as Star } from '../../assets/star.svg'
import { clearDetails } from '../../store/spots';
import ReviewContainer from '../ReviewContainer';
import { reviewThunk } from '../../store/reviews';
import './SpotId.css'

export default function SpotId() {
    //following are for immediate renders of reviews
    const reviewSlice = useSelector(state => state.review);
    // console.log('reviewSlice', reviewSlice)
    const currentSpotReviews = useSelector(state => state.review.currSpotReviews);
    // console.log('currentSpotReviews', currentSpotReviews)
    // const currentSpotReviewsArray = Object.values(currentSpotReviews);
    // console.log('currentSpotReviewsArray', currentSpotReviewsArray)
    // console.log(currentSpotReviewsArray.length)

    let currentSpotReviewsArray = [];
    if (currentSpotReviews) {
        currentSpotReviewsArray = Object.values(currentSpotReviews);
        const totalStars = currentSpotReviewsArray.reduce((total, review) => total + review.stars, 0);
        const averageStars = currentSpotReviewsArray.length > 0 ? totalStars / currentSpotReviewsArray.length : 0;
    }

    const totalStars = currentSpotReviewsArray.reduce((total, review) => total + review.stars, 0);
    // console.log('totalStars', totalStars)
    const averageStars = totalStars / currentSpotReviewsArray.length;
    // console.log('averageStars', averageStars)

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const dispatch = useDispatch();
    const { spotId } = useParams();

    const state = useSelector(state => state);
    console.log('state in SpotId', state)

    //use useSelector hook to get spotDetails object from the spot slice of the Redux store
    //return null if spotDetails is falsy and render nothing
    const detailState = useSelector(state => state.spot.spotDetails);
    console.log('detailState in SpotId', detailState)

    const prevImg = detailState?.spotImages?.find(img => img.preview);
    console.log('prevImg in SpotId', prevImg)
    const smallImages = detailState?.spotImages?.filter(img => !img.preview);
    console.log('smallImages in SpotId', smallImages)

    //dispatch two thunks to fetch the spot details and reviews using dispatch and the thunks for getting the location's details as well as the thunk for getting the reviews
    //use useEffect which run on mount and update whenever the dispatch or spotId dependencies change
    useEffect(() => {
        dispatch(spotDetails(spotId));
        dispatch(reviewThunk(spotId));

        // clear the spot details when the component unmounts
        return () => {
            dispatch(clearDetails())
        }
    }, [dispatch, spotId])

    useEffect(() => {
        if (reviewToDelete !== null) {
            setShowDeleteModal(true);
        }
    }, [reviewToDelete])

    if (detailState && currentSpotReviews) {
        return (
            <div className='outer-container'>
                <div className='inner-container'>

                    <h1 className='name'>{detailState.name}</h1>

                    <h2 className='heading'>
                        <div>{detailState.city}, {detailState.state}, {detailState.country}</div>
                    </h2>
                    <div className='images-container'>
                        <div className='large-image-container'>
                            <img className='preview-image' src={prevImg.url} alt={`${detailState.name}`} />
                        </div>
                        <div className='small-image-container'>

                            {smallImages.map((image, i) => (
                                <img key={i} src={image.url} alt={detailState.name} className='small-images' />
                            ))}
                        </div>
                    </div>

                    <div className='details-bottom-container'>
                        <div className='owner-info'>
                            <h2 className='host-name'>Hosted by {detailState.Owner.firstName} {detailState.Owner.lastName}</h2>
                            <h3 className='detail-description'>{detailState.description}</h3>
                        </div>
                        <div className='reservation-container'>
                            <div className='price-reviews-wrapper'>
                                <div className='prices-and-stars'>
                                    <div className='detail-price'>
                                        <span className='amount'>${detailState.price}</span>
                                        night
                                    </div>
                                </div>
                                <div className='total-reviews-container'>
                                    {Number(averageStars) ? (
                                        <div className='reviews'>
                                            <div className='stars'>
                                                <Star className='star-icon' alt='little-star' />
                                                {Number(averageStars).toFixed(1)}
                                                <span className='dot'>•</span>
                                            </div>
                                            <div className='review-count'>
                                                {currentSpotReviewsArray.length === 1 ? '1 Review' : `${currentSpotReviewsArray.length} Reviews`}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='stars'>
                                            <Star alt='little-star' />
                                            New
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className='reserve-button' onClick={() => window.alert('Feature coming soon!')}>Reserve</button>
                        </div>
                    </div>
                    <ReviewContainer />
                </div>
            </div>
        )
    } else {
        return (
            <div className='loading'>Loading...</div>
        )
    }
}
