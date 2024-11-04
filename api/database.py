from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://theovesque171201:02DcofDMMegqJuOw@cluster0.uezr7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['exercice-fastapi'] 
