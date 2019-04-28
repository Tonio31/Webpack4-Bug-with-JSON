-------------------------
# Webpack bug
-------------------------

This repo helps demonstrate a bug in webpack, it has now been fixed

Stackoverflow question about this bug:
 https://stackoverflow.com/questions/49918588/webpack-4-error-with-malformatted-json

Steps to reproduce the bug:

npm install

npm start

Modify JSON file located in client/app/mockBackEndResponse/
(the json file is included in appMockBackEnd)

Webpack exits

