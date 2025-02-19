# Backend Project Generator

This is a CLI tool to quickly generate a backend project with predefined templates and dependencies. It sets up a basic Node.js and Express server, with MongoDB support, and common utilities like CORS, and dotenv. This tool is ideal for developers who want to quickly scaffold out backend applications with best practices already in place.

## Features

- **Automatic project initialization**: Run a simple command to scaffold a backend project.
- **Predefined structure**: Automatically creates directories `config`, `controllers`, `models`, `middlewares`, `routes`, `services` and `utils`.
- **Template files**: Copies common backend files like `server.js`, `db.js`, `app.js`, etc.
- **Dependencies**: Installs commonly used packages `express`, `mongoose`, `cors`, `dotenv` and `morgan`.
- **Configuration setup**: Asks for basic configuration like port number, MongoDB URL, and database name.
- **Dev Setup**: Installs nodemon for auto-restarting during development.

## Prerequisites

Before using this tool, make sure you have the following installed:

- [Node](https://nodejs.org)
- [npm](https://www.npmjs.com)

## Installation

**Option 1: As a global command (for easy use anywhere)**
To install the tool globally on your system, run the following command:

```bash
  npm install -g gen-backend
```

Once installed, you can create a new backend project by running:

```bash
gen-backend --yes
```

This will initialize a project in the current directory and automatically set up everything for you.

**Option 2: As a local project generator**
To use the generator within a specific project, you can run the following:

1. Clone the repository:

```bash
https://github.com/ashikurrafi/Gen-Backend.git
```

2. change directory

```bash
cd gen-backend
```

3. Install the dependencies:

```bash
npm install
```

4. Run the generator:

```bash
node index.js --yes
```

The tool will automatically:

- Initialize the project (`npm init --yes`).
- Install the necessary dependencies.
- Create the project structure.
- Copy predefined template files.
- Update the `package.json` file.
- Set up the `.env` configuration.

## Usage

After setting up the project, you can start the server by running the following command:

```bash
npm run dev
```

This will start the server using `nodemon`, which watches for changes and restarts the server automatically.

## Configuration

During the setup process, the tool will ask you for the following inputs:

- **Port Number**: The port on which your server will run (default: `8000`).
- **Database Name**: The name of your MongoDB database (default: `My_DB`).
- **MongoDB URL**: The MongoDB connection URL (default: `mongodb://0.0.0.0:27017`).

These values will be stored in a `.env` file for use in your application.

## File Structure

After running the generator, your project will have the following structure:

```
📦 Your project directory
    +---src
        +---config
            +---db.js
        +---controllers
        +---middlewares
        +---models
        +---routes
            +---api.js
            +---index.js
        +---services
        +---utils
        +---app.js
        +---server.js
```

## API Route (/api/v1/demo)

Once the project is generated, it will include a simple API route (`http://localhost:<PORT>/api/v1/demo`) that returns a success message:

```bash
GET /api/v1/demo
```

Response:

```json
{
  "message": "API is working"
}
```

## Dependencies

This project uses the following dependencies:

- **express**: Fast, unopinionated, minimalist web framework for Node.js.
- **mongoose**: MongoDB object modeling for Node.js.
- **cors**: Provides a middleware for enabling Cross-Origin Resource Sharing (CORS).
- **dotenv**: Loads environment variables from a .env file.
- **morgan**: HTTP request logger middleware.
- **nodemon**: Development tool to automatically restart the server on code changes.

## Contributing

Feel free to fork the repository and submit pull requests with improvements or bug fixes. If you encounter any issues, please open an issue, and we’ll try to address it as soon as possible.

### How to contribute:

1. Fork the repository.
2. Create a new branch for your changes (git checkout -b your-feature).
3. Commit your changes.
4. Push to your forked repository.
5. Create a pull request.

## License

This project is open-source and available under the MIT License.

## Acknowledgements

Inspired by various Node.js starter templates.
Thanks to the contributors for improvements and feedback!
