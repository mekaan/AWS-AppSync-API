import { success, failure } from "./libs/response-lib";
import AWS from "aws-sdk";
const client = new AWS.DynamoDB.DocumentClient();


export async function add (event, context) {
  try{
    //event body -> id, name, surname
    const data = event.body;

    if (!('id' in data)) {
      return failure({status: false, error: "ID is required for creation."});
    }else if(data.id=="") {
      return failure({status: false, error: "Please enter ID."});
    }

    const date = new Date();
    data.created_at = date.toISOString();
    data.updated_at = date.toISOString();

    const params = {
      TableName: process.env.tableName,
      Item: data
    };

    await client.put(params).promise();

    return success(data);

  } catch (e) {
    return failure({status: false, error: e.message});
  }
}

export async function getById (event, context) {
  try{
    const id = event.id
    const params ={
      TableName: process.env.tableName,
      Key:{
        id: id,
      },
    };

    const data = await client.get(params).promise();
    if(data.Item) {
      return success(data.Item);
    } else {
      return failure({status: false, error : "Student do not exists!"});
    }

  } catch (e){
    return failure({status: false, error: e.message});
  }
}