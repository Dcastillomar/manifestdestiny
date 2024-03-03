import React, { useState, useEffect } from 'react';
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
    const [gameState, setGameState] = useState('playing'); // Initialize gameState with 'playing'
    const [askedQuestions, setAskedQuestions] = useState([]);
    const [usedQuestions, setUsedQuestions] = useState([]);

    const getNextQuestion = async () => {
        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();
            setQuestion(data.question);
            setOutcomes(data.answers.join(', '));
            setAskedQuestions([...askedQuestions, data.question]);
        } catch (error) {
            console.error('Error fetching next question:', error);
        }
    };

    useEffect(() => {
        if (gameState === 'playing') {
            getNextQuestion();
        }
    }, [gameState]);

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
            setOutcomes(data.answers.join(', '));
            setUsedQuestions([...usedQuestions, data.question]); // Add the used question to the list
            
            // Assign random health changes based on the user's response
            const healthChange = getRandomHealthChange();
            const newHealthScore = Math.max(0, Math.min(10, healthScore + healthChange));
            setHealthScore(newHealthScore);

            if (newHealthScore <= 0) {
                setOutcome('You lost all your health points!');
                setGameState('lost'); // Update game state
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
        const healthChanges = {
            '1': getRandomInt(-4, 4),
            '2': getRandomInt(-4, 4),
            '3': getRandomInt(-4, 4),
            '4': getRandomInt(-4, 4),
        };
        return healthChanges[text] || 0;
    };

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // const getNextQuestion = async () => {
    //     try {
    //         const response = await fetch('/submit', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({}),
    //         });
    //         const data = await response.json();
    //         setQuestion(data.question);
    //         setOutcomes(data.answers.join(', '));
    //         setAskedQuestions([...askedQuestions, data.question]);
    //     } catch (error) {
    //         console.error('Error fetching next question:', error);
    //     }
    // };

    const restartGame = () => {
        setGameState('playing');
        setUsedQuestions([]);
        setAskedQuestions([]);
        setHealthScore(10);
        setOutcome('');
        if (gameState === 'won' || gameState === 'lost') {
            window.location.reload();
        }
    };

    return (
        <div className="wrapper">
            <div className="modal-container">
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Survive</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {gameState === 'playing' ? (
                            <>
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
                                    <button type="submit" className="btn btn-primary mt-2">Submit</button>
                                </form>
                            </>
                        ) : (
                            <div>
                                <p>{gameState === 'won' ? 'Congratulations! You won the game!' : 'You lost the game!'}</p>
                                <button className="btn btn-primary mt-2" onClick={restartGame}>
                                    {gameState === 'won' ? 'Restart the Game' : 'Restart Game'}
                                </button>
                            </div>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <p>{outcome}</p>
                        <p>Health Score: {healthScore}</p>
                        {healthScore <= 0 && <p>You lost!</p>}
                    </Modal.Footer>
                </Modal.Dialog>
            </div>

            <div className='container'>
                <img src={pic} alt="Logo" className="centered-image" />
            </div>
        </div>
    );
}

export default App;