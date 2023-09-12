/* import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Home } from "../pages";
import { BrowserRouter } from "react-router-dom";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const renderComponent = () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </QueryClientProvider>,
  );
  return { queryClient };
};

describe("Home component", () => {
  it("", async () => {
    renderComponent();
  });
}); */
