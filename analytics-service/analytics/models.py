from dataclasses import dataclass
from typing import List, Dict
from datetime import datetime
import pymongo
from django.conf import settings

class MongoConnection:
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            try:
                cls._client = pymongo.MongoClient(
                    host=settings.MONGODB_HOST,
                    port=settings.MONGODB_PORT
                )
                cls._db = cls._client[settings.MONGODB_NAME]
            except Exception as e:
                print(f"MongoDB connection error: {e}")
                cls._db = None
        return cls._instance
    
    @property
    def db(self):
        return self._db

class AnalyticsRepository:
    def __init__(self):
        self.mongo = MongoConnection()
        if self.mongo.db is not None:
            self.snippets_collection = self.mongo.db.snippets
            self.users_collection = self.mongo.db.users
        else:
            self.snippets_collection = None
            self.users_collection = None
    
    def get_all_snippets(self):
        """Get all snippets from MongoDB"""
        if self.snippets_collection is None:
            return []
        try:
            return list(self.snippets_collection.find().limit(100))  # Limit for demo
        except Exception as e:
            print(f"Error fetching snippets: {e}")
            return []
    
    def get_language_distribution(self):
        """Get language distribution"""
        if self.snippets_collection is None:
            return []
        
        try:
            pipeline = [
                {"$group": {
                    "_id": "$programmingLanguage",
                    "count": {"$sum": 1}
                }},
                {"$sort": {"count": -1}}
            ]
            return list(self.snippets_collection.aggregate(pipeline))
        except Exception as e:
            print(f"Error getting language distribution: {e}")
            return []
