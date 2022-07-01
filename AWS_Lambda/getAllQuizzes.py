import json
import boto3

dynamodb = boto3.resource("dynamodb", region_name="eu-west-2")
quiz_table = dynamodb.Table("QM_Quizzes")

def lambda_handler(event, context):
    role = event["userRole"]
    
    quizzes = quiz_table.scan()["Items"]
    
    output = {"Status": "Success", "quizzes": quizzes}
    
    print(output)
    
    return {
        "statusCode": 200,
        "body": json.dumps(output),
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }