import json
from user_location import lambda_handler

with open("event.json") as f:
    event = json.load(f)

result = lambda_handler(event, None)
print(result)