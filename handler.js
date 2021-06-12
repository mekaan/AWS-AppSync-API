'use strict';
const client = new AWS.DynamoDB.DocumentClient();

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

export async function add (event, context) {
  try{
    //event body -> id, name, surname
    const data = event.body

    if (!('phoneNumber' in data)) {
      return failure({status: false, error: "Phone number is required for creation."});
    }else if(data.email=="") {
      return failure({status: false, error: "Please enter phone number."});
    }

    const date = new Date()
    data.created_at = date.toISOString()
    data.updated_at = date.toISOString()

    const params = {
      TableName: process.env.tableName,
      Item: data
    }

    return client.transactWrite(params).promise()

  } catch (e) {
    return failure({status: false, error: e.message});
  }
}
