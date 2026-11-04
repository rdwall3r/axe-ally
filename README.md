# a11y-llm-scanner

A command-line tool that scans a web page with [axe-core](https://github.com/dequelabs/axe-core), then uses Claude to explain the results from a screen reader user's point of view.

## Why

Axe tells you which accessibility rules a page breaks. It doesn't tell you what that's like for the person using the page. a11y-llm-scanner adds that layer:

- **What the user actually experiences**, such as hearing "button" with nothing after it.
- **How to fix it**, most severe first.
- **What doesn't affect screen readers**, such as color contrast, so you can prioritize.
- **What axe couldn't decide**, which is reported as a possible issue rather than a confirmed one.

## Getting started

You'll need Node.js 22 or later (developed and tested on Node 25), and an [Anthropic API key](https://platform.claude.com/) if you want the Claude analysis.

```sh
git clone https://github.com/rdwall3r/a11y-llm-scanner.git
cd a11y-llm-scanner
npm install
npx playwright install chromium
cp .env.example .env
```

Then add your key to `.env`, which is ignored by git.

## Usage

```sh
npm start
```

The tool asks for a URL, including `http://` or `https://`, and whether you want the Claude analysis. Answer `y` for the review, or `n` to print the raw axe results without calling the API.

```text
Which URL would you like to scan? https://example.com
Would you like to use an LLM to analyze the results? (y/n) y
Scanning https://example.com/ ...
Analyzing results ...
```

## Example output

This is an excerpt from a real run against a small test page with deliberate problems:

```html
<button></button>
<input type="text" />
<p style="color: #ccc; background: #fff">Low contrast text</p>
```

> **1. Button with no name (`button-name`)**
> A screen reader announces this as "button" with nothing after it, so the user can't tell what it does. If it's an icon-only control, the button needs an accessible name.
>
> **3. Input with no label (`label`)**
> The user hears "edit text, blank" with no indication of what to enter. Screen reader users can't rely on placeholder text, since many screen readers don't announce it consistently and it disappears once typing begins.
>
> **Color contrast (`color-contrast`): not a screen reader issue.** The `#ccc` text on white is hard to read for low-vision users, but screen readers ignore color, so this doesn't affect screen reader users.

## How it works

1. **Scan:** Playwright loads the page in headless Chromium, waits for client-rendered content to settle, and runs axe-core. HTTP errors stop the scan, so you don't get a report on an error page.
2. **Slim down:** only violations and items axe couldn't decide are kept. Passing rules are dropped to save tokens.
3. **Review:** the findings go to Claude in a single request. Page HTML is untrusted, so it's escaped and marked as data, which makes it harder for a page to inject instructions.

If the analysis fails, the raw scan results are still printed.

## Limitations

- **It only reviews what axe flags.** Problems that pass axe's rules, such as a confusing reading order or vague link text, can go unnoticed because Claude doesn't see the rest of the page.
- **It's not a substitute for testing.** The review describes likely behavior; it hasn't been checked with real screen readers or their users.
- **AI output can be wrong.** Treat the review as a starting point and verify its fixes.
- **Only public pages work reliably.** There's no login support, so a page behind a login may be scanned as the login page. The tool prints the final URL when a page redirects.
- **The page wait is limited.** The scan waits up to 10 seconds for network activity to stop, so content that renders later or needs interaction isn't scanned.

## Privacy

When you choose the analysis, HTML snippets from the failing elements and the page URL are sent to the Anthropic API. Be careful with internal pages or pages containing personal data. Answering `n` sends nothing to Anthropic.

## Development

```sh
npm test        # build and run the unit tests
npm run format  # format with Prettier
```

## License

[MIT](LICENSE)

## Trademarks

axe® and axe-core® are trademarks of Deque Systems, Inc. in the US and other countries. This project is not affiliated with or endorsed by Deque.
