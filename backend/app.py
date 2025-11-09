from flask import Flask, jsonify

app = Flask(__name__)

# Example route
@app.route('/')
def home():
    return "Hello! Your backend is running."

# Example API route
@app.route('/api/data')
def data():
    return jsonify({"message": "This is data from backend."})

if __name__ == '__main__':
    app.run(debug=True)
