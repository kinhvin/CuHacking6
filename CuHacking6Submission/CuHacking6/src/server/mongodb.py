# server/mongodb.py
import pymongo
import os
from dotenv import load_dotenv
from typing import List, Dict

# Load environment variables from .env file
load_dotenv()

def connect_to_mongodb():
    try:
        mongo_uri = os.getenv("VITE_MONGO_URI")

        if not mongo_uri:
            raise ValueError("VITE_MONGO_URI environment variable not set.")

        client = pymongo.MongoClient(mongo_uri)

        client.admin.command('ping')
        print("Pinged your deployment. You have successfully connected to MongoDB!")

        db_name = os.getenv("VITE_MONGO_DB_NAME")
        if not db_name:
            raise ValueError("VITE_MONGO_DB_NAME environment variable not set.")

        db = client[db_name]

        return client, db

    except pymongo.errors.ConnectionFailure as e:
        print(f"Could not connect to MongoDB: {e}")
        return None, None
    except ValueError as e:
        print(e)
        return None, None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None, None

def add_to_mongodb(username: str, top_songs: List[Dict]) -> None:
    client, db = connect_to_mongodb()

    if client == None or db == None:
        print("Failed to connect to MongoDB. Cannot add user data.")
        return

    try:
        collection = db["User"]
        existing_user = collection.find_one({"username": username})

        if existing_user:
            collection.update_one(
                {"username": username},
                {"$set": {"top_songs": top_songs}}
            )

        else:
            user_data = {
                "username": username,
                "top_songs": top_songs,
            }
            result = collection.insert_one(user_data)
            print(f"Added new user '{username}' with ID: {result.inserted_id}")

    except pymongo.errors.PyMongoError as e:
        print(f"An error occurred while interacting with MongoDB: {e}")
    finally:
        client.close()

def return_all_songs(username: str):
    client, db = connect_to_mongodb()
    if client == None or db == None:
        print("Failed to connect to MongoDB. Cannot get user data.")
        return None
    try:
        collection = db["User"]
        user_data = collection.find_one({"username": username}, {"_id": 0, "username": 1, "top_songs": 1})

        if user_data:
            return user_data
        else:
            return None

    except pymongo.errors.PyMongoError as e:
        print(f"An error occurred while interacting with MongoDB: {e}")
        return None
    finally:
        client.close()



def get_all_songs():
    client, db = connect_to_mongodb()
    if client == None or db == None:
        print("Failed to connect to MongoDB. Cannot get user data.")
        return None
    try:
        collection = db["User"]
        all_docs = list(collection.find())
        return all_docs

    except pymongo.errors.PyMongoError as e:
        print(f"An error occurred while interacting with MongoDB: {e}")
        return None
    finally:
        client.close()    