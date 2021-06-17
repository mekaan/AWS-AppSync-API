import { success, failure } from "./libs/response-lib";
import AWS from "aws-sdk";
const client = new AWS.DynamoDB.DocumentClient();


export async function create (event, context) {
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
    const id = event.body.id
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

export async function update (event, context) {
  try{
    const id = event.body.id
    const attrbs = event.body

    //create update expression
    const date = new Date()
    let update_expression = "set #updated_at = :updated_at"
    const expression_attribute_names = {
      '#updated_at': 'updated_at'
    }
    const expression_attribute_values = {
      ':updated_at': date.toISOString()
    }
    const keys = Object.keys(attrbs).filter(x => x !== "id")
    for (let i = 0; i < keys.length; i++) {
      update_expression += ', '
      const name = '#' + keys[i]
      const val = ':' + keys[i]
      expression_attribute_names[name] = keys[i]
      expression_attribute_values[val] = attrbs[keys[i]]
      update_expression = update_expression + name + ' = ' + val
    }
    //return {expression_attribute_names,expression_attribute_values}
    //
    const params = {
      TableName: process.env.tableName,
      Key: {
        id: id
      },
      UpdateExpression: update_expression,
      ExpressionAttributeNames: expression_attribute_names,
      ExpressionAttributeValues: expression_attribute_values
    }
    await client.update(params).promise();
    return success({ message: 'success'})
  } catch (e) {
    return failure({status: false, error: e.message});
  }
}

export async function deleteStudent (event, context) {
  try{
    const id = event.body.id
    const params = {
      TableName: process.env.tableName,
      Key: {
        id: id
      },
    }; 
    await client.delete(params).promise();
    return success({ message: 'success'}) 
  } catch (e) {
    return failure({status: false, error: e.message});
  }
}