// Example utility function test
// Suppose you have a utility function in backend/utils.js
// For demo, we'll define a simple add function here

function add(a, b) {
  return a + b;
}

describe("Utils", () => {
  it("should add two numbers", () => {
    expect(add(2, 5)).toBe(7);
  });
});
