from flask import Flask, request, jsonify
from flask_cors import CORS
from services.assistant_service import AssistantService
from persistence.storage import Storage
from jsonschema import validate, ValidationError
import os

# load .env variables if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    # python-dotenv is optional; environment variables can also be set in the OS
    pass

def create_app(test_config: dict = None):
    app = Flask(__name__)
    CORS(app)

    # configure storage location
    storage_path = os.environ.get('EUROASSIST_STORAGE', 'backend/data/chats.json')
    storage = Storage(storage_path)
    assistant = AssistantService(storage)

    @app.route('/api/query', methods=['POST'])
    def query():
        payload = request.get_json() or {}
        user_query = payload.get('query', '').strip()
        chat_id = payload.get('chat_id')

        if not user_query:
            return jsonify({'error': 'Missing `query` in request body.'}), 400

        try:
            result = assistant.handle_query(user_query, chat_id=chat_id)
            return jsonify(result)
        except ValidationError as ve:
            return jsonify({'error': 'Response validation failed', 'details': str(ve)}), 500
        except Exception as e:
            return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

    @app.route('/api/chats', methods=['GET'])
    def list_chats():
        return jsonify(storage.list_chats())

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
