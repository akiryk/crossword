import { render, screen } from "@testing-library/react";
import LandingPage from "./LandingPage";

describe("LandingPage", () => {
  test("it does what it says it does", () => {
    render(<LandingPage />);
    expect(
      screen.getByText("Make and Play Crossword Puzzles!")
    ).toBeInTheDocument();
  });
});
