import random
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Define questions and outcomes
questions = [
    {
        'question': 'You are in a Dark Cave and four tunnels appear',
        'answers': ['1. Go Right', '2. Go left', '3. Go center', '4. Go toward the light']
    },
    {
        'question': 'You encounter a monster',
        'answers': ['1. Attack', '2. Sneak by', '3. Feed them', '4. Throw a hammer at them']
    },
    {
        'question': 'You enter a large open space',
        'answers': ['1. You rest', '2. You Party', '3. You keep going thru the tunnel', '4. You access other tunnels connected to the opening']
    },
    {
        'question': 'You are attacked by Giant Spiders',
        'answers': ['1. Everyone attacks', '2. Everyone Defends', '3.You go into a blood rage and start attacking everything in sight with +50 added to your strength', '4. You and your party run away']
    },
    {
        'question': 'One of your team members starts asking suspicious',
        'answers': ['1. You confront them', '2. You pretend nothing is wrong, maybe they will reveal to you later', '3. You pay extra close attention from now on', '4. You hold an intervention']
    },
    {
        'question': 'You run out of food',
        'answers': ['1. You eat cave mushrooms which glow in a neon pink', '2. You cannibalize the smallest member of your party', '3. You try to return back to the beginning of the cave ', '4. You keep going because surely you are almost there']
    },
    {
        'question': 'Suddenly the tunnel starts shaking like there is an earthquake, you see something huge spinning toward you',
        'answers': ['1. You stay and fight', '2. You run in the other direction', '3. You try flattening yourself on the walls', '4. You command the mysterious creature to stop']
    },
    {
        'question': 'Suddenly you feel dizzy',
        'answers': ['1. You rest', '2. You tough it out', '3. You ask if your party if they have potion to help you', '4. You ask to be carried']
    },
    {
        'question': 'You reach a treasure chest',
        'answers': ['1. You open it', '2. You carry it out of the cave', '3. You keep going thru the tunnel', '4. You think about the old prophecy about the cave... you almost remember']
    }
]

@app.route("/")
def start():
    return 'Start the game player'

# Maintain a list of questions that have been asked
asked_questions = []


@app.route('/submit', methods=['POST'])
def submit_form():
    global asked_questions
    
    # Check if all questions have been asked or no available questions are left
    if len(asked_questions) == len(questions) or not [q for q in questions if q not in asked_questions]:
        # Reset the list of asked questions
        asked_questions = []
        return jsonify({'question': None, 'answers': []})

 # Filter out None values from the questions list
    valid_questions = [q for q in questions if q is not None]
    print(valid_questions)
    # Randomly select a question that hasn't been asked yet
    available_questions = [q for q in valid_questions if q not in asked_questions]
    if available_questions:
            selected_question = random.choice(available_questions)
            # Add the selected question to the list of asked questions
            asked_questions.append(selected_question)
            return jsonify({'question': selected_question['question'], 'answers': selected_question['answers']})
    else:
            return jsonify({'question': None, 'answers': []})

if __name__ == "__main__":
   if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)