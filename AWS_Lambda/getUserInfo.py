import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb", region_name="eu-west-2")
user_table = dynamodb.Table("QM_users")

def lambda_handler(event, context):
    print(event)
    userId = event["userId"]
    
    try:
        user = user_table.get_item(
            Key={"userId": userId}, ConsistentRead=True
        )["Item"]
        
        output = {"Status": "Success", "user": user}
    except Exception as e:
        print(e)
        
        output = {"Status": "Failed"}
    finally:
        return {
            "statusCode": 200,
            "body": json.dumps(output),
            "headers": {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        }