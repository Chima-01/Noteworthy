
---
# Noteworthy Web App

Welcome to Noteworthy, a user-friendly note-taking web application designed to help you organize your thoughts and ideas effortlessly.

## Features
- User signup and login.
- Create, edit, delete and retreive notes.
- Categorize notes as confidential for added privacy.
- Search functionality to easily find specific notes.
- Jwt Authentication using cookies.

## Techhnologies
- NodeJs
- Express js
- Mongodb
- Jwt for Authentication.
- Other dependencies (refer to package.json file)

## Installation
1. Clone the repository
```bash
    git clone https://github.com/Chima-01/Noteworthy.git
    cd Noteworthy
```

2. Install the dependencies
``` bash
    npm install
```

3. Set up environment variables:
		- Create a `.env` file in the root directory
		- Define the following variables:
			  ``` bash
				  PORT=5000
				  SECRET_KEY='your_secret_key' (for jwt auth and crytojs)
          USER='Mongo cluster username'
          PASSWORD='Mongo cluster password'
          DURATION=duration for cookies to expire (number)
          EMAIL='your email'
          E_PASSWORD='email password'

          EMAIL and E_PASSWORD will be used by nodemailer to send otp
				```

4. Start the application:
	```bash
		  npm start
  ```

5. Access the application in your browser at `http://localhost:5000`

6. Use postman to access and test the following endpoints

## Usage
### REGISTRATION
1. To **Signup** a User send a **POST** request to this endpoint `http://localhost:5000/user/signup`
  - End points expects a body consisting of (firstname, lastname, email, password)
  example
  ```bash
    {
      'firstname': 'your firstname',
      'lastnane': 'your lastname',
      'email': 'your email',
      'password': 'password'
    }
  ```

 2. To **login** a registered user send a **POST** request to the endpoint `http://localhost:5000/user/login`
 - Endpoint expects a body consisting of (email, password)

 Note: For signup and login endpoints a jwt token is created and forwarded as a cookie to the browser.
 user created by the database will be returned

 3. To delete a user send a **DELETE** request to this endpoint  `http://localhost:5000/user/:id`
  - **id** is the user Id.
  
 4. The system is designed to allow a user to access the note schema only if a user is logged in or signed up.

## NOTE
 1. To create a note send a **POST** request to this endpoint `http://localhost:5000/user/:id/note`
  - Endpoint will accept a body consiting of:
    * Title - Title or heading of note
    * Body - body of note
    * userId - User Id created when signing up.
    * Confidentiality - This accepts a boolean default is false. (when set to true the body is encrypted before going to the database)
  - **id** is the user Id created when a user signs up.
  - endpoint will return the note id.

 2. To get all notes send a **GET** request to this endpoint `http://localhost:5000/user/:id/note`
  - After validation this will return only notes title.

 3. To get information of a specific note send a **GET** request to this endpoint  `http://localhost:5000/user/:id/note/:noteId`
  - **noteId** is the id of the note you want to access.
  - returns all information of the note unless if the note is confidential then an OTP is sent to the user's registered mail.
  - send OTP recieved as a **POST** request to this endpoint  `http://localhost:5000/user/:id/note/noteId/verify-otp`.
  Example
  ```
  {
    otp: "123456"
  }
  ```

4. To perform a soft delete on a note send a **GET** request to this endpoint `http://localhost:5000/user/:id/note/:noteId/delete`

5. To retrieve deleted note send a **GET** request to this endpoint `http://localhost:5000/user/:id/note/:noteId/:noteId/retrieve`

6. To perform an hard delete send a **DELETE** request to this endpoint `http://localhost:5000/user/:id/note/:noteId`

## Contributing
	Contributions are welcome! If you'd like to contribute to this project, please follow these steps:
	1. Fork the repository
	2. Create a new branch (`git checkout -b feature`)
	3. Make your changes
	4. Commit your changes (`git commit -am 'Add new feature'`)
	5. Push to the branch (`git push origin feature`)
	6. Create a new Pull Request

## License
	This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

