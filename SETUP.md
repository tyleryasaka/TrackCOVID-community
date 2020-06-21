# TrackCOVID-community Setup Instructions

There are 3 modules in this codebase:
- Server (located in root directory): the codebase which provides the API and serves static files.
- App (located in `/app`): the web-based interface for the app.
- Admin (located in `/admin`): a web-based interface for the admin panel.

Before you begin, you should fork this repository to your own Github account so that you have your own copy of the code.


## Server

The server is a node.js web application. This provides the backend API and also serves up the static files for the App and Admin modules.

The server is configured such that it can be easily deployed to [Heroku](https://www.heroku.com/). However, you may host using whatever service you like.

### Local development
You will need to have [mongodb](https://www.mongodb.com/) installed locally. Run the following commands from the root directory of this repository.

- Configure environment variables: `cp .env.example.dev .env` and then edit this `.env` file to suit your preferences. See the list of environment variables below.
- Copy environment variables from above automatically to the react apps: `npm run build-env`
- Setup: `npm install`
- Start the server: `npm start`. This will host the server on `localhost:8000`.
- Start the app (separate terminal window): `cd app && npm start`. This will host the app on `localhost:3000`.
- Start the admin (separate terminal window): `cd admin && npm start`. This will host the admin on `localhost:3001`.
- Test: `npm test`

### Production deployment

This can be easily deployed to Heroku as follows:

1. Create a new Heroku app
2. Configure the environment variables (config vars) in the Heroku app. See description of environment variables below, as well as the example production configuration in `.env.example.prod`.
3. Connect the Heroku app to your forked Github repository. This will allow you to deploy from Github. You can even enable automatic deploys whenever new code is pushed. Heroku will automatically build the `app` and `admin` modules each time the server is deployed.

### Environment variables

- `NODE_ENV`: Indicates whether a `development` or `production` environment
- `APP_NAME`: Whatever your app will be called.
- `APP_DOMAIN`: The domain where your app will be hosted.
- `ADMIN_DOMAIN`: The domain where the admin panel will be hosted (should be the same as `APP_DOMAIN` in production)
- `SERVER_DOMAIN`: The domain where the server will be hosted (should be the same as `APP_DOMAIN` in production)
- `ABOUT_URL`: A web address where people can learn more about your project
- `APP_THEME`: Specify either `dark` or `light` depending on how you want your app to look.
- `ESTIMATED_DX_DELAY_DAYS`: How many days prior to check for possible contacts (e.g. 7 for one week). Should be guided by advice of public health experts.
- `CONTACT_WINDOW_HOURS_BEFORE`: How many hours before an exposed checkpoint occurred for others that scanned the same checkpoint to be considered a contact
- `CONTACT_WINDOW_HOURS_AFTER`: How many hours after an exposed checkpoint occurred for others that scanned the same checkpoint to be considered a contact
- `MONGODB_URI`: The mongodb database URL. (This will be automatically set in Heroku if you use the [mLab](https://elements.heroku.com/addons/mongolab) addon.)
- `SESSION_KEY`: A secret key which encrypts user sessions for the admin panel. This can be anything but it should be random and secret.
- `REDIRECT_HTTPS`: Whether to automatically redirect http to https; should be `true` in production.
- `CHECKPOINT_KEY_LENGTH`: How many characters should be in the checkpoint key; set this to `16` unless you have some reason to change it.
- `ADMIN_REGISTRATION_URL`: An optional environment variable. It is intended to provide a link to a Google form where you can collect requests for admin access. You may create a form similar to the following: https://forms.gle/J38BLRpFtRFT846Z8. When this environment variable is set, the link will be provided on the admin login page.
- `SENDGRID_API_KEY`: Used to send emails to admins for account management. You can create a free account on [Sendgrid](https://app.sendgrid.com/) for local development and testing.
- `ADMIN_EMAIL_FROM`: The "from" address used for emails sent to admins for account management.
- `LOCIZE_PRODUCT_ID`: If you would like to use the [Locize](https://locize.com) service to manage translations, you can provide your Locize product ID here, and the app will automatically use those translations.


## App

The app module is a React web application. This provides the source code for the main app interface.

The server will render the *built* app code at the root url. If you make changes to the source code, they will not be visible until you run `npm run build` from the `/app` directory.

The app module will also be built when you run `npm install` from the server (root directory).


## Admin

The admin module is also a React web application. This provides the source code for the admin panel interface. This is the system which doctors (or other authorized personnel) will use to upload QR code history files on behalf of COVID-positive patients.

The server will render the *built* admin code at the root url. If you make changes to the source code, they will not be visible until you run `npm run build` from the `/admin` directory.

The admin module will also be built when you run `npm install` from the server (root directory).


## Additional setup

### Creating your first admin user

You can create your first admin user by running the following from the root directory of this project: `npm run create-user`. This will prompt you for your mongodb url, desired username, and password. Be sure to use the appropriate mongodb url depending on whether you are trying to create a user in your production database or your local database. Also, if you're using Heroku and mLab, make sure to include `&retryWrites=false` at the end of the mongodb url.

Once this user is created, you can log in to the admin panel using these credentials, and create other user accounts from within that interface.

### Scheduling job to clean database

Data that is older than the period of time set by `ESTIMATED_DX_DELAY_DAYS` is no longer needed or useful and should be deleted. This can be done by running `node clean-database.js` from the root of the project. To continually clean the database, this should be scheduled as a job. On Heroku, this can be easily done using the [Heroku Scheduler addon](https://devcenter.heroku.com/articles/scheduler). Just create a job for the command `node clean-database.js` and have it execute either every hour or every day, depending on how often you want the cleaning to occur.
