from flask import Flask, jsonify
from prometheus_client import make_wsgi_app, Counter
from werkzeug.middleware.dispatcher import DispatcherMiddleware

app = Flask(__name__)

# A counter to count the total number of requests
c = Counter('my_requests_total', 'Total number of requests to my app')

@app.route('/users/<user_id>')
def get_user(user_id):
    c.inc() # Increment the counter
    user_data = {
        "id": user_id,
        "name": "Jane Doe",
        "email": f"jane.doe.{user_id}@example.com"
    }
    return jsonify(user_data)

# Add prometheus wsgi middleware to route /metrics to prometheus exporter
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)