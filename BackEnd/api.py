#api local com flask e flask_cors para simular crud com json
from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/users', methods=['GET'])
def get_users():
    users = []
    # Caminho para o arquivo JSON
    caminho_arquivo = 'db/users.json'

    # Abrindo e lendo o arquivo JSON
    with open(caminho_arquivo, 'r', encoding='utf-8') as arquivo:
        dados = json.load(arquivo)
    for user in dados:
        users.append(
            {"id":user["id"],"nome": user['nome']}
            )
    return jsonify(users)

  


if __name__ == '__main__':
    app.run(debug=True, port=5000)