import json
import boto3
import hashlib

dynamodb = boto3.resource("dynamodb", region_name="eu-west-2")
users_table = dynamodb.Table("QM_users")

users_to_roles = {
    "luke@pixelmax.com": "GlobalAdmin",
    "lstobbart35@gmail.com": "Admin",
    "lstobbart35@outlook.com": "User"
}

def lambda_handler(event, context):
    user = event

    email = user["email"]
    if email not in users_to_roles:
        output = {"Status": "Failed", "message": "You are not part of the predefined user list."}
        
        return {"statusCode": 200, "body": json.dumps(output)}
    
    firstName = user["firstName"]
    lastName = user["lastName"]
    username = hashlib.sha256(email.encode()).hexdigest()
    password = hashlib.sha256(user["password"].encode()).hexdigest()
    
    user = users_table.get_item(Key={"userId": username}, ConsistentRead=True)
    
    if "Item" in user:
        output = {"Status": "Failed", "message": "An account with that email already exists."}
        
        return {"statusCode": 200, "body": json.dumps(output)}
    
    user_info = {
        "userId": username,
        "firstName": firstName,
        "lastName": lastName, 
        "email": email,
        "password": password,
        "role": users_to_roles[email]
    }
    
    try:
        users_table.put_item(Item=user_info)
        
        output = {"Status": "Success", "userRole": users_to_roles[email], "userId": username}
    except Exception as e:
        output = {"Status": "Failed", "message": "Unknown error occured, please contact an admin."}
    finally:
        return {"statusCode": 200, "body": json.dumps(output)}
