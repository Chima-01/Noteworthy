# Noteworthy Web App

Welcome to **Noteworthy**, a user-friendly note-taking RESTful API designed to help developers create and manage notes securely.
The Noteworthy API is a robust and secure RESTful web service designed to manage and organize notes for users. It provides a seamless platform for users to create, get, update, and delete notes while ensuring data integrity and confidentiality. The API offers endpoints to handle user authentication, note management, and user-specific operations. By following REST principles, the Noteworthy API delivers a scalable and efficient solution for users to store and access their notes securely.

## Features
- User signup and login
- Create, edit, delete, and retrieve notes
- Categorize notes as confidential for added privacy
- Search functionality to easily find specific notes
- JWT Authentication using cookies

## Technologies
- Node.js
- Express.js
- MongoDB
- JWT for Authentication
- Other dependencies (refer to `package.json` file)

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/Chima-01/Noteworthy.git
    cd Noteworthy
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Define the following variables:
     ```bash
     PORT=5000
     SECRET_KEY='your_secret_key'  # for JWT auth and CryptoJS
     USER='Mongo cluster username'
     PASSWORD='Mongo cluster password'
     DURATION=duration for cookies to expire (number)
     EMAIL='your email'
     E_PASSWORD='email password'
     
     # EMAIL and E_PASSWORD will be used by Nodemailer to send OTP
     ```

4. Start the application:
    ```bash
    npm start
    ```

5. Access the application in your browser at `http://localhost:5000`.

6. Use Postman to access and test the following endpoints.

## Usage

### Registration
1. To **sign up** a user, send a **POST** request to the endpoint `http://localhost:5000/user/signup`.
   - The endpoint expects a body consisting of:
     ```json
     {
       "firstname": "your firstname",
       "lastname": "your lastname",
       "email": "your email",
       "password": "your password"
     }
     ```

2. To **login** a registered user, send a **POST** request to the endpoint `http://localhost:5000/user/login`.
   - The endpoint expects a body consisting of:
     ```json
     {
       "email": "your email",
       "password": "your password"
     }
     ```

   - Note: For signup and login endpoints, a JWT token is created and forwarded as a cookie to the browser. The user created will be returned from the database.

3. To delete a user, send a **DELETE** request to this endpoint: `http://localhost:5000/user/:id`.
   - **id** is the user ID.

4. The system is designed to allow a user to access the note schema only if they are logged in or signed up.

### Note Management
1. To create a note, send a **POST** request to the endpoint `http://localhost:5000/user/:id/note`.
   - The endpoint will accept a body consisting of:
     - **Title**: Title or heading of the note
     - **Body**: Body of the note
     - **userId**: User ID created when signing up
     - **Confidentiality**: This accepts a boolean (default is false). When set to true, the body is encrypted before being stored in the database.
   
   - **id** is the user ID created when a user signs up.
   - The endpoint will return the note ID.

2. To get all notes, send a **GET** request to this endpoint: `http://localhost:5000/user/:id/note`.
   - After validation, this will return only the titles of the notes.

3. To get information about a specific note, send a **GET** request to this endpoint: `http://localhost:5000/user/:id/note/:noteId`.
   - **noteId** is the ID of the note you want to access.
   - Returns all information about the note. If the note is confidential, an OTP will be sent to the user's registered email.
   - Send the OTP received as a **POST** request to this endpoint: `http://localhost:5000/user/:id/note/:noteId/verify-otp`.
   - Example:
     ```json
     {
       "otp": "123456"
     }
     ```

4. To perform a soft delete on a note, send a **GET** request to this endpoint: `http://localhost:5000/user/:id/note/:noteId/delete`.

5. To retrieve a deleted note, send a **GET** request to this endpoint: `http://localhost:5000/user/:id/note/:noteId/retrieve`.

6. To perform a hard delete, send a **DELETE** request to this endpoint: `http://localhost:5000/user/:id/note/:noteId`.

## Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:
1. Fork the repository
2. Create a new branch (`git checkout -b feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature`)
6. Create a new Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.