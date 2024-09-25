This is an RSS reader. Create your own feed with different sourses. 

[![Linter](https://github.com/EllySmith/frontend-project-11/actions/workflows/lint.yml/badge.svg)](https://github.com/EllySmith/frontend-project-11/actions/workflows/lint.yml) 

[![Maintainability](https://api.codeclimate.com/v1/badges/477c64c8fa7f16177376/maintainability)](https://codeclimate.com/github/EllySmith/frontend-project-11/maintainability)

Link to the online version: https://frontend-project-11-eight-opal.vercel.app

# RSS Reader

An RSS Reader application that allows users to add, validate, and manage RSS feed links, periodically checking for updates. The app features a modal view for displaying post details upon user interaction.

## Features

- **Add RSS Feed**
  - Users can easily add new RSS feed links by providing a valid URL.
  
- **Check for Updates (Every 5 Seconds)**
  - The application automatically checks the added feeds every 5 seconds for new posts or updates, keeping the user informed of the latest content.

- **Link Validation**
  - All RSS feed URLs are validated before being added to the list. This ensures the application only accepts well-formed, accessible links.

- **Control and Error Handling**
  - The app detects and handles various error scenarios such as invalid URLs, network issues, or unsupported RSS formats, providing feedback to the user.

- **Post Details Modal**
  - When a user clicks on a post title, the details of the post are displayed in a modal window for easy reading without leaving the app.

## Usage

- Add an RSS feed by entering the URL in the input field and clicking "Add."
- The app will check the feed every 5 seconds for new posts.
- Click on any post title to open a modal with the full post details.

  ## Technologies

## Technologies

- **JavaScript** for handling core functionality and logic.
- **DOM Manipulation** to dynamically update the page with new feeds and posts.
- **CSS** for styling the application.
- **HTML** for structuring the page layout.


