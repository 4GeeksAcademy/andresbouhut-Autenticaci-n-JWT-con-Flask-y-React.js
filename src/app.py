"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from api.models import db, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)

# Configuración JWT
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_KEY', 'super-secret')
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Configuración DB
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
Migrate(app, db)
db.init_app(app)

# Registro de usuario
@app.route('/register', methods=['POST'])
def register():
    body = request.get_json(silent=True)
    if body is None or 'email' not in body or 'password' not in body:
        return jsonify({'msg': 'Email y password son obligatorios'}), 400
    new_user = User()
    new_user.email = body['email']
    new_user.password = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    new_user.is_active = True
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': f'Usuario {new_user.email} creado'}), 201

# Login de usuario
@app.route('/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    if body is None or 'email' not in body or 'password' not in body:
        return jsonify({'msg': 'Email y password son obligatorios'}), 400
    user = User.query.filter_by(email=body['email']).first()
    if not user or not bcrypt.check_password_hash(user.password, body['password']):
        return jsonify({'msg': 'Usuario o contraseña incorrecta'}), 401
    access_token = create_access_token(identity=user.email)
    return jsonify({'token': access_token})

# Ruta protegida
@app.route('/private', methods=['GET'])
@jwt_required()
def private():
    current_user = get_jwt_identity()
    return jsonify({'msg': f'Accediste a tu información privada {current_user}'})

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
