import os
from os.path import join, dirname
from dotenv import load_dotenv

from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
from datetime import datetime

dotenv_path = join(dirname(__file__), ".env")
load_dotenv(dotenv_path)

connection_string = os.environ.get("MONGODB_URl")
db_name = os.environ.get("DB_NAME")

client = MongoClient(connection_string)
db = client[db_name]
app = Flask(__name__)


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/diary", methods=["GET"])
def show_diary():
    articles = list(db.diary.find({}, {"_id": False}))
    return jsonify({"articles": articles})


@app.route("/diary", methods=["POST"])
def save_diary():
    title_receive = request.form.get("title_give")
    content_receive = request.form.get("content_give")

    today = datetime.now()
    mytime = today.strftime("%Y-%m-%d-%H-%M-%S")

    # Post File photo
    file = request.files["file_give"]
    extension = file.filename.split(".")[-1]
    filename = f"static/img/post-{mytime}.{extension}"
    file.save(filename)
    # Post file profile
    profile = request.files["profile_give"]
    extension = profile.filename.split(".")[-1]
    profilname = f"static/img/Profile-{mytime}.{extension}"
    profile.save(profilname)

    time = today.strftime("%Y-%m-%d")

    doc = {
        "file": filename,
        "profile": profilname,
        "title": title_receive,
        "content": content_receive,
        "time": time,
    }
    db.diary.insert_one(doc)
    return jsonify({"message": "Data was saved!"})


if __name__ == "__main__":
    app.run("0.0.0.0", port=5000, debug=True)
