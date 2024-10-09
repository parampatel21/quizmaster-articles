# Uplimit Take Home Project

Hello Uplimit team!

My name is Param, and I'm excited to share with you my solution for the Interactive Articles assignment. I've built an application using Next.js, TypeScript, Tailwind CSS (with Daisy UI), TipTap editor, and SQLite for data persistence.

I hope you enjoy exploring it.

## Table of Contents

- [Setup](#setup)
- [Features](#features)
- [Design Decisions](#design-decisions)
- [Future Improvements](#future-improvements)
- [Project Structure](#project-structure)

## Setup

Getting started is straightforward.

In .env.local, set the GEMINI_API_KEY variable to a valid API key.

- You can get one here:
  https://aistudio.google.com

Navigate into the uplimit-take-home/ directory and run the following commands:

- `npm install`
- `npm run dev`

This will start both the Next.js development server and the SQLite database server concurrently.

Once the application is running, open your browser and navigate to http://localhost:3000.

**Make sure to click the Help button in the top-left corner for a guide on how to use the app.**

## Features

- **Instructor Mode:**

  - Rich Text Editing:

    - Write and edit your own articles with rich text formatting.
    - Use the Command Menu (type "/") to insert headings, images, and MCQs.
    - Utilize the Bubble Menu by highlighting text to apply formatting styles.

  - Create and Edit MCQs:
    - Add MCQs directly within the article.
    - Edit question text, add or remove answer choices.
    - Set the correct answer for each MCQ.
    - Toggle between Editable and Finalized states for each MCQ.
    - View past submissions made by readers.
    - Click on an MCQ block to select it (green highlight border will appear)
  - AI-Generated Hints:
    - Enable AI-powered hints for MCQs using the Gemini API.
    - Configure whether readers can request hints for each question.

- **Reader Mode:**

  - View articles in a read-only mode.
  - Interact with the embedded MCQs and submit answers.
  - Request AI-generated hints, if enabled by the instructor.

## Design Decisions

1. **MCQ Block Design:**

   - Each MCQ block has two states: **editable** (instructor) and **finalized** (reader). This separation simplifies UX for content creators while ensuring a clean interface for readers.
     - As an instructor, the MCQ block has two sub-states, editing and non editing. I found it annoying to stare at a bunch of inputs and also thought that an instructor might value the "finality" of this approach, as the editor itself is asynchronous.
   - I decided to model my file structure around this design pattern, as I found that easiest to follow if I were a new dev onboarding onto this project.

2. **Asynchronous Autosave and Persistence:**

   - I used Hocuspocus w/TipTap to integrate autosaving out of the box: https://tiptap.dev/docs/hocuspocus/server/extensions#sq-lite
     - See BasicEditor.tsx and server.mjs to see how I did this
   - Autosave functionality ensures that changes are asynchronously saved to **SQLite** without blocking the UI. This keeps the writing experience smooth and responsive.
     - I have two tables
       - **past_submissions**: stores any submissions that are made in Reader mode (columns: mcq_id, selected_answer, is_correct, submitted_at...)
       - **documents**: for TipTap editor async saving, made by default
    - Locally persisted toggle state, seperate from other persistence
      - see localStorage.ts

3. **Error Handling and User Feedback:**

   - I've implemented custom error boundaries and skeleton loaders globally to enhance user experience during asynchronous actions and data fetching. This ensures that the app provides feedback when actions are taking place, like saving or retrieving MCQ data.
   - Integrated Zod for API schema validation as well as frontend input validation
     - See utils/validation.ts

4. **Linting/Styling**

   - ESLint and Prettier are configured for this project
     - `npm run lint`
     - `npm run format`

5. **API Design:**

   - The `/mcq/[mcq_id]` route handles MCQ submissions, while `/hint` is used for AI hint generation using Gemini API.
   - I have tried my best to keep this **as simple as possible** because the Hocuspocus extension did most of the heavy lifting here.

6. **State Management and Context:**

   - Utilized React's Context API to manage global state, such as the instructor/reader mode toggle.
   - Implemented custom hooks to encapsulate logic and state management for MCQs, improving code reusability and separation of concerns.

## Future Improvements

A list of possible next steps or improvements:

- Implement a dedicated MCQ table that keeps track of all MCQ blocks as a whole.
- Address the issue where the dropcursor does not work with the MCQ node to improve the editing experience and usability.
- Integrate additional TipTap editor extensions to provide a more holistic editor
- Enhance MCQ blocks to support multiple correct answer choices
- Integrate Zod more deeply client-side
- Since I didn't have time to implement testing, I would plan to integrate Jest for unit tests and React Testing Library for component testing to enhance reliability and maintainability.

## Project Structure

#### Most files have a one-liner comment up top that explains its purpose so feel free to look through.

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
