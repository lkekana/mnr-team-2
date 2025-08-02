import os
import boto3
from supabase import create_client, Client
import dotenv

dotenv.load_dotenv()  # Load environment variables from .env file

# Initialize Supabase (secrets come from ENV vars)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
print(f"SUPABASE_URL: {SUPABASE_URL}")  # Debugging line to check if URL is set
print(f"SUPABASE_KEY: {SUPABASE_KEY}")  # Debugging line to check if KEY is set
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize SNS
sns = boto3.client("sns")

def lambda_handler(event, context):
    try:
        # 1. Get data from Supabase (example: fetch user's phone number)
        response = supabase.table("test_table").select("*").execute()
        user = response.data

        if not user:
            raise Exception("User not found")

        # 2. Send SMS via SNS
        params = {
            "Message": "Your verification code is 123456",  # Customize your message
            "PhoneNumber": "+27616815221",
            "MessageAttributes": {
                "AWS.SNS.SMS.SMSType": {
                    "DataType": "String",
                    "StringValue": "Transactional"
                }
            }
        }

        sns.publish(**params)
        return {
            "statusCode": 200,
            "body": "SMS sent!"
        }

    except Exception as e:
        print(f"ERROR: {e}")
        return {
            "statusCode": 500,
            "body": str(e)
        }