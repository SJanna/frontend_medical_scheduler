import React, { useState, useEffect, useContext, useRef } from 'react';


const RatingForm = ({ selectedEvent, closeForm }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleRatingChange = (event) => {
        setRating(Number(event.target.value));
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Aquí puedes enviar los datos de calificación al servidor mediante una solicitud POST

        // Una vez que se ha enviado la calificación, cierra el formulario
        closeForm();
    };

    return (
        <>
            <div className="outside-layout-form row justify-content-center aling-items-center">
                <div className="inside-layout-form m-5 col-auto p-5 shadow p-3 mb-5 rounded">

                    <div className='close' onClick={closeForm}><a href="#" style={{ textDecoration: 'none' }}>X</a></div>
                    <form onSubmit={handleSubmit}>
                        <div className="text-center mb-3">
                            <p>Rate the service:</p>
                        </div>

                        {/* Sede input */}
                        <div className="form-outline mb-4">
                        <select id="rating" value={rating} className='form-select' onChange={handleRatingChange}>
                            <option value={0}>Select a rate</option>
                            <option value={1}>1 star</option>
                            <option value={2}>2 stars</option>
                            <option value={3}>3 stars</option>
                            <option value={4}>4 stars</option>
                            <option value={5}>5 stars</option>
                        </select>
                        </div>

                        <div className="form-outline mb-4">
                        <label htmlFor="comment">Comments:</label>
                        <textarea id="comment" className='form-control' placeholder="Leave a comment here" value={comment} onChange={handleCommentChange}></textarea>
                        </div>


                        {/* Submit button */}
                        <button type="submit" className="btn btn-primary btn-block mb-4">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RatingForm;
