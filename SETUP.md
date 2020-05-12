# TrackCOVID-community Setup Instructions

There are 3 modules in this codebase:
- Server (located in root directory): the codebase which provides the API and serves static files.
- App (located in `/app`): the web-based interface for the app.
- Admin (located in `/admin`): a web-based interface for the admin panel.

Below are setup instructions for each. Before you begin, you should fork this repository to your own Github account so that you have your own copy of the code.

## Server

The server is a node.js web application. This provides the backend API and also serves up the static files for the App and Admin modules.

The server is configured such that it can be easily deployed to [Heroku](https://www.heroku.com/). However, you may host using whatever service you like.

### Server local development
You will need to have [mongodb](https://www.mongodb.com/) installed locally. Run the following commands from the root directory of this repository.

- Configure environment variables: `cp .env.sample .env` and then edit this `.env` file to suit your preferences. See the list of environment variables below.
- Setup: `npm install`
- Run: `npm start`. This will host the server on `localhost:8000`.

### Server production deployment

This can be easily deployed to Heroku as follows:

1. Create a new Heroku app
2. Connect the Heroku app to your forked Github repository. This will allow you to deploy from Github. You can even enable automatic deploys whenever new code is pushed.
3. Configure the environment variables (config vars) in the Heroku app. See description of environment variables below.

### Server environment variables

- `APP_NAME`: Whatever your app will be called.
- `APP_URL`: The web address where your app will be hosted.
- `MONGODB_URI`: The mongodb database URL. (This will be automatically set in Heroku if you use the [mLab](https://elements.heroku.com/addons/mongolab) addon.)
- `SESSION_KEY`: A secret key which encrypts user sessions for the admin panel. This can be anything but it should be random and secret.
- `WEB_CLIENT_DOMAIN`: The domain where your app will be hosted (should be same as APP_URL).
- `REDIRECT_HTTPS`: Whether to automatically redirect http to https; should be `true` in production.
- `CHECKPOINT_KEY_LENGTH`: How many characters should be in the checkpoint key; set this to `16` unless you have some reason to change it.
- `ESTIMATED_DX_DELAY_DAYS`: How many days prior to check for possible contacts (e.g. 7 for one week). Should be guided by advice of public health experts.

## App

The app module is a React web application. This provides the source code for the main app interface.

The server will render the *built* app code at the root url. If you make changes to the source code, they will not be visible until you run `npm build` from the `/app` directory.

### App local development

Run the following commands from the `/app` directory of this repository.

- Configure environment variables: `cp .env.sample .env` and then edit this `.env` file to suit your preferences. See the list of environment variables below.
- Setup: `npm install`
- Build: `npm run build`

### App production deployment

The built source code will automatically be rendered by the server and does not rely on any additional steps other than the production instructions for the server, above. If you are using Heroku with automatic deploys from Github (as described above), you will need to commit all of the build file changes for the app to update in production.

### App environment variables

- `REACT_APP_NAME`: The name for your app
- `REACT_APP_THEME`: Specify either `dark` or `light` depending on how you want your app to look.
- `REACT_APP_ESTIMATED_DX_DELAY_DAYS`: How many days prior to check for possible contacts (e.g. 7 for one week). Should be guided by advice of public health experts.
- `REACT_APP_CONTACT_WINDOW_HOURS_BEFORE`: How many hours before an exposed checkpoint occurred for others that scanned the same checkpoint to be considered a contact
- `REACT_APP_CONTACT_WINDOW_HOURS_AFTER`: How many hours after an exposed checkpoint occurred for others that scanned the same checkpoint to be considered a contact

## Admin

The admin module is also a React web application. This provides the source code for the admin panel interface. This is the system which doctors will use to upload QR code history files on behalf of patients.

The server will render the *built* admin code at the root url. If you make changes to the source code, they will not be visible until you run `npm build` from the `/admin` directory.

### Admin local development

Run the following commands from the `/admin` directory of this repository.

- Configure environment variables: `cp .env.sample .env` and then edit this `.env` file to suit your preferences. See the list of environment variables below.
- Setup: `npm install`
- Build: `npm run build`

### Admin production deployment

The built source code will automatically be rendered by the server and does not rely on any additional steps other than the production instructions for the server, above. If you are using Heroku with automatic deploys from Github (as described above), you will need to commit all of the build file changes for the app to update in production.

### Admin environment variables

- `REACT_APP_NAME`: The name for your app
- `REACT_APP_WEB_APP_URL`: The url for the *main web app*.
- `REACT_APP_REGISTRATION_URL`: An optional environment variable. It is intended to provide a link to a Google form where you can collect requests for admin access. You may create a form similar to the following: https://forms.gle/J38BLRpFtRFT846Z8. When this environment variable is set, the link will be provided on the admin login page.


## Additional setup

### Creating your first admin user

You can create your first admin user by running the following from the root directory of this project: `npm run create-user`. This will prompt you for your mongodb url, desired username, and password. Be sure to use the appropriate mongodb url depending on whether you are trying to create a user in your production database or your local database.

Once this user is created, you can log in to the admin panel using these credentials, and create other user accounts from within that interface.

### Scheduling job to clean database

Data that is older than the period of time set by `ESTIMATED_DX_DELAY_DAYS` is no longer needed or useful and should be deleted. This can be done by running `node clean-database.js` from the root of the project. To continually clean the database, this should be scheduled as a job. On Heroku, this can be easily done using the [Heroku Scheduler addon](https://devcenter.heroku.com/articles/scheduler). Just create a job for the command `node clean-database.js` and have it execute either every hour or every day, depending on how often you want the cleaning to occur.
