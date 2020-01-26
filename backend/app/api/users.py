from flask import jsonify, request
from app import db

from app.api import bp
from app.models import User

from bson import json_util

import json

import pymongo
import pyowm

import random


from pyowm.caches.lrucache import LRUCache
cache = LRUCache()

owm = pyowm.OWM('cfa1daf4b91327f47abfe400df171f12')

mgr = owm.agro_manager()
from pyowm.utils.geo import Polygon as GeoPolygon

from numpy import loadtxt
from tensorflow import keras

grains = [
  "Cotton",
  "Jute",
  "Groundnut",
  "Rice",
  "Sesamum",
  "Rapeseed & Mustard",
  "Coconut",
  "Soyabean"
]

# model = keras.models.load_model('ResNet_plant 97.h5')


# gp = GeoPolygon([[
#         [-121.1958, 37.6683],
#         [-121.1779, 37.6687],
#         [-121.1773, 37.6792],
#         [-121.1958, 37.6683]]])



myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["harvy"]
mycol = mydb["user"]


@bp.route('/api/v1/user.add', methods=['POST'])
def addUser():
  data = request.get_json(force=True)
  # user = User(username=data["username"],email=data["email"],north=data["north"],south=data["south"],east=data["east"],west=data["west"])
  user = { "username": data["username"], "email":data["email"] }

  mycol.insert_one(user)
  return jsonify({"success": "true"}), 200

@bp.route('/api/v1/users')
def getUsers():
  users = User.to_collection_dict()
  return jsonify(users), 200

@bp.route('/api/v1/login', methods=['POST'])
def getUser():
  data = request.get_json(force=True)
  email = data["email"]
  user = mycol.find_one({"email":email})
  return json.dumps(user ,default=json_util.default), 200

@bp.route('/api/v1/updatePath', methods=['POST'])
def updatePath():
  data = request.get_json(force="true")
  query = { "email": data["email"] }
  for w in data["data"]["lands"]:
    v = w["lands"]
    x = []
    for y in v:
      t = []
      t.append(y["longitude"])
      t.append(y["latitude"])
      x.append(t)
    x.append(x[0])
    gpx = GeoPolygon([x])
    polygon = mgr.create_polygon(gpx, 'new polygon')
    soil = mgr.soil_data(polygon)
    surfaceTemp = soil.surface_temp(unit='celsius')
    uvi = owm.uvindex_around_coords(x[0][1], x[0][0])
    obs = owm.weather_at_coords(x[0][1], x[0][0])
    w["surfaceTemp"] = surfaceTemp
    w["uvivalue"] = uvi.get_value()
    w["uviexposerisk"] = uvi.get_exposure_risk()
    z = obs.get_weather()
    w["humidity"] = z.get_humidity()
    temp = z.get_temperature(unit='celsius')
    w["temperature"] = temp["temp"]
    w["suggested"] = random.choice(grains)
  newvalues = { "$set": { "landData": data["data"] } }
  mycol.update_one(query, newvalues)
  return jsonify({"success":"true"}), 200


@bp.route('/api/v1/test')
def test():
  polygon = mgr.create_polygon(gp, 'my new shiny polygon')
  soil = mgr.soil_data(polygon)
  model.summary()
  # print(soil.surface_temp(unit='kelvin')

