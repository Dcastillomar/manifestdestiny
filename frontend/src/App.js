import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import './style.css';
import pic from './covered-wagon-2967229_1280.png';

const App = () => {
    const [text, setText] = useState('');
    const [question, setQuestion] = useState('');
    const [outcome, setOutcome] = useState('');
    const [outcomes, setOutcomes] = useState('');
    const [healthScore, setHealthScore] = useState(10);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidInput()) {
            setErrorMessage('Please enter a number between 1 and 4.');
            return;
        }
        setErrorMessage('');
        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            const data = await response.json();
            setQuestion(data.question);
            setOutcomes(data.answers.join(', ')); // Joining the possible answers into a string
            
            // Assign random health changes based on the user's response
            const healthChange = getRandomHealthChange();
            const newHealthScore = Math.max(0, Math.min(10, healthScore + healthChange)); // Ensure health score stays within 0 and 10
            setHealthScore(newHealthScore);

            if (newHealthScore <= 0) {
                setOutcome('You lost all your health points!');
            } else {
                setOutcome(`Your health ${healthChange >= 0 ? 'increased by' : 'decreased by'} ${Math.abs(healthChange)}.`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const isValidInput = () => {
        const userInput = parseInt(text);
        return !isNaN(userInput) && userInput >= 1 && userInput <= 4;
    };

    const getRandomHealthChange = () => {
        // Define possible health changes for each answer
        const healthChanges = {
            '1': getRandomInt(-4, 4), // Random integer between -4 and 4
            '2': getRandomInt(-4, 4),
            '3': getRandomInt(-4, 4),
            '4': getRandomInt(-4, 4),
        };
        return healthChanges[text] || 0; // Return the corresponding health change for the user's response, default to 0 if not found
    };

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const restartGame = () => {
        setHealthScore(10);
        setOutcome('');
        setQuestion('');
        setText('');
        setErrorMessage('');
    };

    return (
        <div className="wrapper">
            {/* Modal */}
            <div className="modal-container">
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Survive</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>{question || 'Pick a number to start.'}</p>
                        <form onSubmit={handleSubmit}>
                            <Form.Label htmlFor="userResponse">Your Response:</Form.Label>
                            <Form.Control
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                id="userResponse"
                                aria-describedby="userResponseBlock"
                            />
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                            <p>{outcomes}</p>
                            <Form.Text id="userResponseBlock" muted>
                                Pick 1, 2, 3, 4
                            </Form.Text>
                            {healthScore <= 0 ? (
                                <button type="button" className="btn btn-primary mt-2" onClick={restartGame}>Restart Game</button>
                            ) : (
                                <button type="submit" className="btn btn-primary mt-2">Submit</button>
                            )}
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <p>{outcome}</p>
                        <p>Health Score: {healthScore}</p>
                        {healthScore <= 0 && <p>You lost!</p>}
                    </Modal.Footer>
                </Modal.Dialog>
            </div>

            {/* Image Container */}
            <div className='container'>
                <img src={pic} alt="Logo" className="centered-image" />
            </div>
        </div>
    );
}

export default App;