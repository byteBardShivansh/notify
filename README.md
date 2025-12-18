# Notification Delivery API

This is an internal Notification Delivery API used to send transactional emails and notifications in a standardized, compliant way.

## Features

-   **Template-based notifications**: Ensures that all notifications follow a predefined format.
-   **Validation**: Validates notifications against templates to ensure all required variables are present.
-   **Policy Enforcement**: Applies policies to notifications before delivery.
-   **Rate Limiting**: Limits the number of requests to the API.
-   **Authentication**: Protects the API with an API key.

## Getting Started

### Prerequisites

-   Node.js
-   npm

### Installation

1.  Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```

### Running the application

```sh
npm run dev
```

The server will start on port 3000.

### Running tests

```sh
npm test
```

## API Endpoints

-   `POST /api/notifications`: Accepts a notification for delivery.
-   `POST /api/templates`: Creates a new template.
-   `GET /api/templates/:templateId`: Retrieves a template.
-   `GET /health`: Health check endpoint.

## Environment Variables

-   `PORT`: The port the server should run on. Defaults to 3000.
-   `API_KEY`: The API key for authentication. Defaults to `a-secure-api-key`.
