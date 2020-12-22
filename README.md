# SF-Dispatch-backend

```
node_modules/
secret.json
```
These two files are ignored by git, to start, 
1. Install the required modules by
```
npm i
```
2. Create a secret.json file in the root with the following content 
```
{
    "token_private_key": "xxxx",
    "google_api_key": "xxxxxxxxxxxxxxxxxxxxxxx",
    "DB_url": "mongodb+srv://xxxxxxxxxxxxxxxxxxxxxxxx"
}
```
where token_private_key is used to encrypt the token. It can be set to whatever you like. 

To debug, import the file 'SFD-project.postman_collection.json' to Postman.