import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        provider: "ollama",
        model: "e2e-local",
        content: "Mock local model response.",
      }),
    });
  });

  await page.route("**/api/search", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        query: "local ai",
        results: [
          {
            title: "Self-hosted search result",
            url: "https://example.local/search",
            snippet: "A private search result returned by the e2e mock.",
            engine: "mock",
          },
        ],
      }),
    });
  });

  await page.route("**/api/workspace/notes/session.md", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        name: "session.md",
        content: "# Workspace notes\n\nSaved by e2e.",
      }),
    });
  });
});

test("renders the local AI workspace shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Oddity AI")).toBeVisible();
  await expect(page.getByText("Local brain online. Ask me something strange but useful.")).toBeVisible();
  await expect(page.getByPlaceholder("Ask your local model...")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Web search" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Local notes" })).toBeVisible();
});

test("sends a chat message through the mocked API", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("Ask your local model...").fill("Summarize my private workspace.");
  await page.getByTitle("Send").click();

  await expect(page.getByText("Summarize my private workspace.")).toBeVisible();
  await expect(page.getByText("Mock local model response.")).toBeVisible();
});

test("runs search and saves local notes", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("Search via SearXNG").fill("local ai");
  await page.getByTitle("Search").click();
  await expect(page.getByText("Self-hosted search result")).toBeVisible();

  await page.getByRole("textbox").last().fill("# Workspace notes\n\nSaved by e2e.");
  await page.getByRole("button", { name: "Save note" }).click();
});

