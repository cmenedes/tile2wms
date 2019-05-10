module.exports = (request, response) => {
  response.send(JSON.stringify(request.params))
}