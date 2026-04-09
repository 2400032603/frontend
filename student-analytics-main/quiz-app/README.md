# Quiz Application

This is a simple quiz application that allows users to take quizzes on various subjects. The application is built using TypeScript and follows a modular structure for easy maintenance and scalability.

## Features

- Multiple-choice quizzes on four subjects: Math, Science, History, and Literature.
- Each quiz consists of a series of questions with multiple options.
- Users can submit their answers and receive results.

## Project Structure

```
quiz-app
├── src
│   ├── app.ts                # Entry point of the application
│   ├── quizzes               # Contains quiz questions for different subjects
│   │   ├── math.ts           # Math quiz questions
│   │   ├── science.ts        # Science quiz questions
│   │   ├── history.ts        # History quiz questions
│   │   └── literature.ts     # Literature quiz questions
│   ├── controllers           # Contains controllers for handling requests
│   │   └── quizController.ts # Quiz controller
│   ├── routes                # Contains route definitions
│   │   └── quiz.ts           # Quiz routes
│   └── types                 # Type definitions
│       └── question.ts       # Question interface
├── package.json              # npm configuration file
├── tsconfig.json             # TypeScript configuration file
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd quiz-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run the following command:
```
npm start
```

You can access the quiz application in your web browser at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you would like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for details.