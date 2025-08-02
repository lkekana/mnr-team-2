const { createClient } = require('@supabase/supabase-js');
const AWS = require('aws-sdk');

// Initialize Supabase (secrets come from ENV vars)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Initialize SNS
const sns = new AWS.SNS();

exports.handler = async (event) => {
  try {
    // 1. Get data from Supabase (example: fetch user's phone number)
    const { data: user, error } = await supabase
      .from('test_table')
      .select('*')
    //   .eq('id', event.user_id) // Trigger with { "user_id": 123 }
    //   .single();

    if (error || !user) throw new Error('User not found');

    // 2. Send SMS via SNS
    const params = {
      Message: 'Your verification code is 123456', // Customize your message
      PhoneNumber: "+27616815221",
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': { // Required for low-cost SMS
          DataType: 'String',
          StringValue: 'Transactional'
        }
      }
    };

    await sns.publish(params).promise();
    return { status: 'SMS sent!' };

  } catch (err) {
    console.error('ERROR:', err);
    throw err; // Lambda will show this in CloudWatch Logs
  }
};