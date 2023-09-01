import { screen, render } from "@testing-library/react";
import { Home } from "../pages";

/*
 * Deve mostrar a data atual no formato correto
 * Deve mostrar a hora atual no formato correto
 */
const renderComponent = () => {
  render(<Home />);
};

describe("Home component", () => {
  it("should show current date in correct format", () => {
    renderComponent();
  });
});
