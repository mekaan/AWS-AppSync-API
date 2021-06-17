export function success(body) {
    return body
  }
export function failure(body) {
  return buildResponse(500, body);
}
function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body)
  };
}