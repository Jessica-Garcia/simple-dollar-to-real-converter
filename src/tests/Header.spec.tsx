import { screen, render } from "@testing-library/react";
import { Header } from "../components/Header";

/*
 * Deve mostrar a data atual no formato correto
 * Deve mostrar a hora atual no formato correto
 */
const renderComponent = () => {
  render(<Header />);
};

const dateNow = () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(Date.now()));

  return new Date();
};

describe("Header component", () => {
  it("should show current date in correct format", () => {
    renderComponent();

    const formatedDate = dateNow().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "2-digit",
      timeZone: "UTC",
    });
    const dateElement = screen.getByTestId("date");

    expect(dateElement).toHaveTextContent(formatedDate);
  });

  it("should show current time in correct format", () => {
    renderComponent();

    const formatedTime = dateNow().toLocaleTimeString(undefined, {
      hour: "2-digit",
      hour12: false,
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    });
    const timeElement = screen.getByTestId("time");

    expect(timeElement).toHaveTextContent(formatedTime);
  });
});
