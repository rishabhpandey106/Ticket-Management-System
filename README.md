# Ticket Management System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rishabhpandey106/Ticket-Management-System/blob/master/LICENSE)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Introduction

The Ticket Management System is a web-based application designed to streamline and automate the process of managing tickets, issues, or tasks within an organization or project. It provides a user-friendly interface for creating, updating, and tracking tickets, making it easier for teams to collaborate and resolve issues efficiently.

![Screenshot](screenshot.png)

## Features

- User authentication and authorization.
- Create, view, edit, and delete tickets.
- Assign tickets to specific team members.
- Set priority levels and due dates for tickets.
- Comment and collaborate on ticket updates.
- Email notifications for ticket updates.
- Dashboard for an overview of ticket status.
- Detailed reporting and analytics.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed.
- MongoDB installed and running.
- SMTP server details (for email notifications).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rishabhpandey106/Ticket-Management-System.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Ticket-Management-System
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory with the following environment variables:

   ```env
   MONGODB_URI=<Your_MongoDB_URI>
   SECRET_KEY=<Your_Secret_Key>
   SMTP_HOST=<Your_SMTP_Host>
   SMTP_PORT=<Your_SMTP_Port>
   SMTP_USER=<Your_SMTP_Username>
   SMTP_PASS=<Your_SMTP_Password>
   ```

5. Start the application:

   ```bash
   npm start
   ```

The application should now be running locally.

## Usage

1. Open your web browser and navigate to `http://localhost:3000`.
2. Register for an account or log in if you already have one.
3. Create, update, and manage tickets as needed.
4. Collaborate with your team to resolve issues efficiently.

## Contributing

Contributions are welcome! Please follow these steps to contribute to the project:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add new feature'`
4. Push to your branch: `git push origin feature-name`
5. Create a pull request on the original repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to [contributors](https://github.com/rishabhpandey106/Ticket-Management-System/graphs/contributors) for their contributions to this project.
- This project was inspired by the need for efficient issue tracking and management in various organizations.

