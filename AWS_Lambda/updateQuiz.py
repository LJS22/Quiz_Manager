import json
import boto3

dynamodb = boto3.resource("dynamodb", region_name="eu-west-2")
quiz_table = dynamodb.Table("QM_Quizzes")

def lambda_handler(event, context):
    print(event)
    new_quiz = event
    
    try:
        quiz_table.put_item(Item=new_quiz)
    
        output = {"Status": "Success"}
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