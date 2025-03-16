# server/server.py
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from mongodb import add_to_mongodb
from mongodb import return_all_songs
from mongodb import get_all_songs
from openai import OpenAI


# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app) 

@app.route('/api/users', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        username = data.get("username")
        top_songs = data.get("top_songs")

        if not username or not top_songs:
            return jsonify({"error": "Missing 'username' or 'top_songs' in request data"}), 400

        add_to_mongodb(username, top_songs)
        return jsonify({"message": "User added/updated successfully"}), 201
    except Exception as e:
        return jsonify({"error": "An internal server error occurred"}), 500


def ai_app(prompt: str):
    client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY"))
    response = client.chat.completions.create(
                                                model="meta-llama/Meta-Llama-3.1-8B-Instruct",
                                                max_tokens=1024,
                                                temperature=0.65,
                                                top_p=0.9,
                                                extra_body={
                                                    "top_k": 50
                                                },
                                                messages=[
                                                    {
                                                        "role": "system",
                                                        "content": """You will be given a list of 20 songs, list the top 5 genres out of those songs.
                                                                        You must list only the genres and nothing else! AND SEPARATE THEM BY A COMMA"""
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": prompt
                                                    }
                                                ]
                                             )
    return response.to_json()

def matchy_ai(prompt: str):
    client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY"))
    response = client.chat.completions.create(
                                                model="meta-llama/Meta-Llama-3.1-70B-Instruct",
                                                max_tokens=512,
                                                temperature=0.7,
                                                top_p=0.9,
                                                extra_body={
                                                    "top_k": 50
                                                },
                                                messages=[
                                                    {
                                                        "role": "system",
                                                        "content": """You will be given a list of songs, find 5 other songs that closely match the user's taste. ONLY display the 5 songs in a list and NOTHING ELSE AND SEPARATE THEM BY A COMMA."""
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": prompt
                                                    }
                                                ]
                                             )
    return response.to_json()

def matchy_ai2(prompt: str, username: str):
    client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY"))
    response = client.chat.completions.create(
                                                model="meta-llama/Meta-Llama-3.1-70B-Instruct",
                                                max_tokens=512,
                                                temperature=0.4,
                                                top_p=0.9,
                                                extra_body={
                                                    "top_k": 50
                                                },
                                                messages=[
                                                    {
                                                        "role": "system",
                                                        "content": """You are given a list of users and their top 20 songs, and a username to match with another username that has a similar music taste. YOU MUST PROVIDE THE MATCHING USER'S NAME AND A BRIEF EXPLANATION (LESS THAN 50 WORDS) OF WHY THEY MATCH AND NOTHING ELSE. PLEASE NOTE THAT THERE ARE DUPLICATED ENTRIES, TREAT THEM AS ONE!"""
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": f"List: {prompt}\n User to match: {username}"
                                                    }
                                                ]
                                             )
    return response.to_json()
@app.route('/api/matchUser', methods=['POST'])
def match_songs():
    data = request.get_json()
    username = data.get("username")
    
    if not username:
        return jsonify({"error": "Missing 'username' in request data"}), 400
    
    try:
        all_songs = get_all_songs()
        print(all_songs)
        if all_songs:
            return matchy_ai2(str(all_songs), username)
        else:
            return jsonify({"error": f"User '{username}' not found or has no songs."}), 404
    except Exception as e:
        print(f"Server error: {e}")  # Debugging log
        return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500

@app.route('/api/matchSongs', methods=['POST'])
def match_user():
    data = request.get_json()
    username = data.get("username")
    
    if not username:
        return jsonify({"error": "Missing 'username' in request data"}), 400
    
    try:
        user_songs = return_all_songs(username)
        if user_songs:
            return matchy_ai(str(user_songs))
        else:
            return jsonify({"error": f"User '{username}' not found or has no songs."}), 404
    except Exception as e:
        print(f"Server error: {e}")  # Debugging log
        return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500   
    

@app.route('/api/getTop5Genres', methods=['POST'])
def get_top_5_genres():
    data = request.get_json()
    username = data.get("username")
    
    if not username:
        return jsonify({"error": "Missing 'username' in request data"}), 400
    
    try:
        user_songs = return_all_songs(username)
        if user_songs:
            return ai_app(str(user_songs))
        else:
            return jsonify({"error": f"User '{username}' not found or has no songs."}), 404
    except Exception as e:
        print(f"Server error: {e}")  # Debugging log
        return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500

    


if __name__ == "__main__":
    app.run(debug=True)
