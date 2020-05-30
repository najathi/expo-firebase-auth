# expo-firebase - Najathi

## Instructions

Follow This before running the Project

#### first create env.js file and configure them..
```
const variables = {
	development: {
		apiKey: "api-key",
  	authDomain: "project-id.firebaseapp.com",
  	databaseURL: "https://project-id.firebaseio.com",
  	projectId: "project-id",
  	storageBucket: "project-id.appspot.com",
  	messagingSenderId: "sender-id",
  	appId: "app-id",
  	measurementId: "G-measurement-id",
	},
	production: {
		apiKey: "api-key",
  	authDomain: "project-id.firebaseapp.com",
  	databaseURL: "https://project-id.firebaseio.com",
  	projectId: "project-id",
  	storageBucket: "project-id.appspot.com",
  	messagingSenderId: "sender-id",
  	appId: "app-id",
  	measurementId: "G-measurement-id",
	}
};

const getEnvVariables = () => {
	if (__DEV__) {
		return variables.development; // return this if in development mode
	}
	return variables.production; // otherwise, return this
};

export default getEnvVariables; // export a reference to the function
```


#### Install Packages
````
npm install
````

#### Start Application
you can use `expo start` to run the project