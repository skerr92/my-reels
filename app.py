"""
LICENSE: GPL-3.0

Name: app.py

Desc: MyReels Locally Managed Parts and Project Inventory Server

Author: Seth Kerr (skerr92)

Copyright (C) 2022 Seth Kerr and Oak Development Technology, All Rights Reserved 

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
"""
import os, json
from flask import Flask
from flaskr import auth, db

secrets_file = 'local-secrets.json'

class Server:
  def __init__(self, test_config=None, install_config=None):
    self._app = Flask("MyReels", instance_relative_config=True)
    file = open(secrets_file)
    contents = json.load(file)
    file.close()
    app_secret = contents['app-secrets'][0]['secrets']
    self._app.config.from_mapping(
      SECRET_KEY="app_secret",

      DATABASE=os.path.join(self._app.instance_patth, "flaskr.sqlite"),
    )

    if test_config is None:
      self._app.config.from_pyfile("config.py", silent=True)
    else:
      self._app.update(test_config)

    try:
      os.makedirs(self._app.instance_path)
    except OSError:
      pass

    @self._app.route("dashboard")

    db.init_app(self._app)

    self._app.register_blueprint(auth.bp)

    self._app.add_url_rule("/", endpoint="index")

  def dashboard(self):
    return "Hello, World!"



  def run(self):
    print("hello world")

app = Server()
app.run()
