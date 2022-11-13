# Crossword Puzzle

## Get started

```sh
git clone https://github.com/akiryk/crossword.git
cd crossword
npm install

# start the app!
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

This app is created with create react app, so all the usual commands apply

```sh
# Launch a test runner
npm test

# Builds the app for production to the `build` folder.
npm run build
```

## Make it better

### Site and App structure

The app is built with React Router, and there are three pages

- Welcome
- Create - where you create a new puzzle or continue working on one that's in progress
- Play - play a crossword

The app is structured such that each page is its own route.

#### Create

In the Create route, the parent is CrosswordMakerContainer, which keeps track of whether the
puzzle or the hints are being edited. When a user is filling in cells to make words, I call that
editing the puzzle. When the user is adding hints for the across and down directions, I call that
editing the hints.

These two states — puzzle-making and hint-making — are kept distinct: you can only do one at a time.

#### Play

Not done yet...

### State management

The app needs to manage state in a few ways, and which is used depends on the current "mode" of game creation or play.

When creating a puzzle — that is, filling in each cell with a letter or empty space — state is handled locally.
Each cell tracks its own value and doesn't care about the value of other cells. When you click on a cell and enter a letter, say, "C", the
cell calls its change handler, which uses `React.useState()` to keep track of the value: `setValue('C')`.

The cell _does_ need access to some global state - or, at least, state maintained higher in the tree. It needs to know whether the user is typing in a left/right direction or a top/down direction. This information is kept in

#### Grid state

The grid keeps track of every cell, but only for the purpose of enabling hint-making
and playing. During the course of creating or editing your puzzle, the grid state remains static.

One your puzzle is complete — that is, every cell is filled in the way you'd like — you're ready to create hints. At this point, when you click the "Make Hints" button, the grid state is populated with information
about cell values and words, both across and down words.

### To Dos

- create the Play route
- enable user to toggle between puzzle-making and hint-making
