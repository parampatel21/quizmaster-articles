# QuizMaster: An Interactive Article Editor

Welcome to **QuizMaster**! This project is an interactive article editor with quiz functionality built from scratch using modern technologies such as Next.js, TypeScript, Tailwind CSS (with Daisy UI), TipTap editor, and SQLite for data persistence.

Feel free to explore the features and functionality of QuizMaster.

## Table of Contents

- [Setup](#setup)
- [Features](#features)
- [Design Decisions](#design-decisions)
- [Future Improvements](#future-improvements)
- [Project Structure](#project-structure)

## Setup

Getting started is straightforward.

Create an `.env.local` in the root dir, set the `GEMINI_API_KEY` variable to a valid API key.

- You can get one here:
  https://aistudio.google.com

Navigate into the `quizmaster/` directory and run the following commands:

- `npm install`
- `npm run dev`

This will start both the Next.js development server and the SQLite database server concurrently.

Once the application is running, open your browser and navigate to http://localhost:3000.

**Make sure to click the Help button in the top-left corner for a guide on how to use the app.**

## Features

- **Instructor Mode:**

  - **Rich Text Editing:**
    - Write and edit your own articles with rich text formatting.
    - Use the Command Menu (type "/") to insert headings, images, and MCQs.
    - Utilize the Bubble Menu by highlighting text to apply formatting styles.

  - **Create and Edit MCQs:**
    - Add MCQs directly within the article.
    - Edit question text, add or remove answer choices.
    - Set the correct answer for each MCQ.
    - Toggle between Editable and Finalized states for each MCQ.
    - View past submissions made by readers.
    - Click on an MCQ block to select it (green highlight border will appear).

  - **AI-Generated Hints:**
    - Enable AI-powered hints for MCQs using the Gemini API.
    - Configure whether readers can request hints for each question.

- **Reader Mode:**
  - View articles in a read-only mode.
  - Interact with the embedded MCQs and submit answers.
  - Request AI-generated hints, if enabled by the instructor.

## Design Decisions

1. **MCQ Block Design:**
   - Each MCQ block has two states: **editable** (instructor) and **finalized** (reader). This separation simplifies UX for content creators while ensuring a clean interface for readers.
   - The MCQ block has sub-states within Instructor mode to enhance usability. I modeled the file structure around this design pattern to improve onboarding for future developers.

2. **Asynchronous Autosave and Persistence:**
   - Integrated autosaving using Hocuspocus and TipTap's SQLite extension, ensuring that changes are asynchronously saved to **SQLite** without blocking the UI.
     - I have two tables:
       - **past_submissions**: stores submissions from Reader mode.
       - **documents**: stores TipTap editor's document states for autosave.
     - Locally persisted toggle state for mode management (see `localStorage.ts`).

3. **Error Handling and User Feedback:**
   - Custom error boundaries and skeleton loaders were implemented globally to enhance the user experience during asynchronous actions and data fetching.
   - Used Zod for API schema validation and frontend input validation (`utils/validation.ts`).

4. **Linting/Styling:**
   - Configured ESLint and Prettier for consistent styling and code quality:
     - `npm run lint`
     - `npm run format`

5. **API Design:**
   - The `/mcq/[mcq_id]` route handles MCQ submissions, while `/hint` is used for AI hint generation using the Gemini API.
   - The Hocuspocus extension handles most of the persistence and real-time collaboration out of the box.

6. **State Management and Context:**
   - Utilized React's Context API to manage global state, such as the instructor/reader mode toggle.
   - Implemented custom hooks to encapsulate logic and state management for MCQs, improving code reusability and separation of concerns.

## Future Improvements

- Implement a dedicated MCQ table to keep track of all MCQ blocks as a whole.
- Improve the editing experience by addressing issues with the Dropcursor in MCQ nodes.
- Integrate additional TipTap editor extensions to provide a more robust editor.
- Support multiple correct answers in MCQ blocks.
- Expand client-side validation with Zod.
- Implement testing with Jest and React Testing Library for enhanced reliability and maintainability.

## Project Structure

Most files contain a one-liner comment at the top to explain their purpose. Feel free to browse through the structure.

```plaintext
.
├── README.md
├── db
│   └── db.sqlite
├── server
│   └── server.mjs
├── src
│   ├── app
│   │   ├── api
│   │   │   └── mcq
│   │   │       ├── [mcq_id]
│   │   │       └── hint
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── editor
│   │   │   ├── BasicEditor.tsx
│   │   │   └── BubbleMenu.tsx
│   │   ├── extensions
│   │   │   └── mcq
│   │   │       ├── MCQComponent.tsx
│   │   │       └── reader
│   │   │           └── MCQReaderView.tsx
│   ├── context
│   ├── services
│   ├── styles
│   └── utils
├── tailwind.config.ts
└── tsconfig.json
```