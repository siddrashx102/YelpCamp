# YelpCamp

![Image 1](https://res.cloudinary.com/dyyvmhxqt/image/upload/v1704387210/YelpCamp/ilcxiq6kcovn5f8czkuc.png)  
![Image 2](https://res.cloudinary.com/dyyvmhxqt/image/upload/v1704387209/YelpCamp/l42nc5xe3wljr79jekbj.png)  
![Image 3](https://res.cloudinary.com/dyyvmhxqt/image/upload/v1704387210/YelpCamp/nqaljfepwaej8wn1qatr.png)  
![Image 4](https://res.cloudinary.com/dyyvmhxqt/image/upload/v1704387209/YelpCamp/oeas6yktf2oakqx1lsx7.png)  
![Image 5](https://res.cloudinary.com/dyyvmhxqt/image/upload/v1704387210/YelpCamp/ws3pcalbvz0a2ikpfscs.png)  

YelpCamp is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account. This project was part of Colt Steele's web dev course on udemy.  

This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.  

## Features
* YelpCamp is a full-stack website project where users can create and review campgrounds.
* Everyone can view the camps and see reviews without signing up or logging in.
* Users can create, edit, and remove campgrounds
* The user can only edit/delete the campgrounds and comments that they have added.
* Users can review campgrounds once, and edit or remove their review.
* All the data will be persistent and is stored in the cloud.

### Technologies Used: 
HTML5, CSS3, Bootstrap, JavaScript, jQuery, Node.js, Express.js, RESTful, MongoDB, PassportJS

## Run it locally
1. Install [mongodb](https://www.mongodb.com/)
2. Create a cloudinary account to get an API key and secret code

```
git clone https://github.com/siddrashx102/YelpCamp.git
cd yelpcamp
npm install
```

Create a .env file (or just export manually in the terminal) in the root of the project and add the following:  

```
CLOUDINARY_CLOUD_NAME=<cloudinary_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_SECRET=<cloudinary_secret>
DB_URL=<url>
```

Run ```mongod``` in another terminal and ```node app.js``` in the terminal with the project.  

Then go to [localhost:3000](http://localhost:3000/).
