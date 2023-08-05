import { csrfFetch } from "./csrf"

//action type strings
const GET_USER_BOOKINGS = `bookings/GET_USER_BOOKINGS`
const DELETE_BOOKING = `bookings/DELETE_BOOKING`

//action creators
const getUserBookings = (bookings) => ({
    type: GET_USER_BOOKINGS,
    bookings
})

export const deleteBooking = (bookingId) => ({
    type: DELETE_BOOKING,
    bookingId
})

//booking thunk action creators
export const userBookingsThunk = () => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/current`);

    if (response.ok) {
        const data = await response.json();
        dispatch(getUserBookings(data));
        return data;
    }
}

export const deleteBookingThunk = (bookingId) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        dispatch(deleteBooking(bookingId));
    }
}


const initialState = {};

const bookingReducer = (state = initialState, action) => {
    let newState = { ...state };

    switch (action.type) {
        case GET_USER_BOOKINGS:
            newState = action.bookings
            return newState;

        case DELETE_BOOKING:
            const deletedBookingId = action.bookingId;
            newState.Bookings = newState.Bookings.filter(booking => booking.id !== deletedBookingId);
            return newState;

        default:
            return state;
    }
}

export default bookingReducer;