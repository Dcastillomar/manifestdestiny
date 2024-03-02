import random
from flask import Flask, request, jsonify

app = Flask(__name__)

# Define questions and outcomes
questions = [
    {
        'question': 'What is your favorite color?',
        'answers': ['Red', 'Blue', 'Green', 'Yellow']
    },
    {
        'question': 'What is your favorite animal?',
        'answers': ['Dog', 'Cat', 'Bird', 'Fish']
    },
    {
        'question': 'What is your favorite food?',
        'answers': ['Pizza', 'Burger', 'Pasta', 'Sushi']
    },
    {
        'question': 'What is your favorite movie?',
        'answers': ['The Shawshank Redemption', 'The Godfather', 'Inception', 'Pulp Fiction']
    }
]

@app.route("/start")
def start():
    return 'Start the game player'

@app.route('/submit', methods=['POST'])
def submit_form():
    # Randomly select a question
    selected_question = random.choice(questions)
    
    # Return the selected question and possible answers
    return jsonify({'question': selected_question['question'], 'answers': selected_question['answers']})

if __name__ == "__main__":
    app.run(debug=True)