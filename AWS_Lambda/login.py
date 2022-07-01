import json
import boto3
import hashlib

dynamodb = boto3.resource("dynamodb", region_name="eu-west-2")
users_table = dynamodb.Table("QM_users")

def lambda_handler(event, context):
    user = event

    email = user["email"]
    password = user["password"]
    
    username = hashlib.sha256(email.encode()).hexdigest()
    
    user = users_table.get_item(Key={"userId": username}, ConsistentRead=True)
    
    if "Item" not in user:
        output = {"Status": "Failed", "message": "An account with that email does not exist."}
        
        return {"statusCode": 200, "body": json.dumps(output)}
    
    user = user["Item"]
    
    if user["password"] == hashlib.sha256(password.encode()).hexdigest():
        output = {"Status": "Success", "userRole": user["role"], "userId": user["userId"]}
        
        return {"statusCode": 200, "body": json.dumps(output)}
    else:
        output = {"Status": "Failed", "message": "The supplied password does not match our records."}
        
        return {"statusCode": 200, "body": json.dumps(output)}
