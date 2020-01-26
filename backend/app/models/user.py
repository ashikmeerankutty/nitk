from app import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    north =  db.Column(db.String(120), index=True, unique=False)
    south =  db.Column(db.String(120), index=True, unique=False)
    east =  db.Column(db.String(120), index=True, unique=False)
    west =  db.Column(db.String(120), index=True, unique=False)

    @classmethod
    def to_collection_dict(cls, **kwargs):
        resources = cls.query.paginate(1, 100, False)
        data = {
            'items': [item.to_dict() for item in resources.items],
            '_meta': {
                'page': 1,
                'per_page': 100,
                'total_pages': resources.pages,
                'total_items': resources.total
            }
        }
        return data
    
    def to_dict(self):
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'north': self.north,
            'south': self.south,
            'east': self.east,
            'west': self.west
        }
        return data