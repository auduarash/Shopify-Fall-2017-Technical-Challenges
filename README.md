# Shopify Fall 2017 Internship Problems Solution

## Usage

The backend solution was developed using Node.JS version 7.10.0 which was the stable release as of this writing. To run, you need to install the npm dependencies using 
```
npm install
```
And then to run, you do
```
npm run backend
```

The two assumptions I used regarding the API are as follows:

1. The available_cookies was representative for every page i.e the number of available cookies did not aggregate across pages but was the same
2. Orders with fulfilled set to true did not required any precessing as they had already been fulfilled.