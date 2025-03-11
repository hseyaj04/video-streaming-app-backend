# Video Streaming App Backend ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## 📌 Overview

The Video Streaming App Backend is a robust and scalable backend solution designed to support a video streaming platform. Built with Node.js, Express, and MongoDB, this backend provides essential functionalities such as user authentication, video upload and management, commenting, and more. It ensures secure and efficient handling of user data and media content, making it an ideal choice for modern video streaming applications.

This project aims to deliver a seamless experience for both users and administrators, offering features like JWT-based authentication, cloud storage integration for media files, and comprehensive API endpoints for various operations. Whether you're building a new video streaming service or enhancing an existing one, this backend serves as a solid foundation.

## ✨ Features

- User authentication and authorization
- Video upload, update, and deletion
- Commenting on videos
- User profile management
- Secure JWT-based authentication
- Cloudinary integration for media storage
- Comprehensive API documentation

## 🚀 Getting Started

### Prerequisites

Ensure you have the following software installed:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.x or higher)
- [Cloudinary](https://cloudinary.com/) account for media storage

### Installation

Follow these steps to set up the project:

1. Clone the repository:
    ```sh
    git clone [TODO: REPO_URL]
    cd video-streaming-app-backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=8000
    MONGO_URI=mongodb://localhost:27017
    ACCESS_TOKEN_SECRET=[TODO: YOUR_ACCESS_TOKEN_SECRET]
    REFRESH_TOKEN_SECRET=[TODO: YOUR_REFRESH_TOKEN_SECRET]
    ACCESS_TOKEN_EXPIRY=1h
    REFRESH_TOKEN_EXPIRY=7d
    CLOUDINARY_CLOUD_NAME=[TODO: YOUR_CLOUDINARY_CLOUD_NAME]
    CLOUDINARY_API_KEY=[TODO: YOUR_CLOUDINARY_API_KEY]
    CLOUDINARY_API_SECRET=[TODO: YOUR_CLOUDINARY_API_SECRET]
    ```

4. Start the development server:
    ```sh
    npm run dev
    ```

### Environment Variables

Example `.env` template:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017
ACCESS_TOKEN_SECRET=[TODO: YOUR_ACCESS_TOKEN_SECRET]
REFRESH_TOKEN_SECRET=[TODO: YOUR_REFRESH_TOKEN_SECRET]
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=[TODO: YOUR_CLOUDINARY_CLOUD_NAME]
CLOUDINARY_API_KEY=[TODO: YOUR_CLOUDINARY_API_KEY]
CLOUDINARY_API_SECRET=[TODO: YOUR_CLOUDINARY_API_SECRET]
```

<!-- ## 🔧 API Documentation -->

<!-- The API documentation is available via [Postman](TODO: LINK_TO_POSTMAN_COLLECTION) or [Swagger](TODO: LINK_TO_SWAGGER_DOCS). -->

### Key Endpoints

- **User Registration:** `POST /api/v1/users/register`
- **User Login:** `POST /api/v1/users/login`
- **Publish Video:** `POST /api/v1/videos`
- **Get Video by ID:** `GET /api/v1/videos/:videoId`
- **Update Video:** `PATCH /api/v1/videos/:videoId`
- **Delete Video:** `DELETE /api/v1/videos/:videoId`
<!--
## 🧪 Testing

To run tests, use the following command:
```sh
npm test
```
-->
## ⚙️ Configuration

Important service configurations can be found in the `.env` file. Ensure all required environment variables are set correctly.
<!--
## 📦 Deployment

### Docker

1. Build the Docker image:
    ```sh
    docker build -t video-streaming-app-backend .
    ```

2. Run the Docker container:
    ```sh
    docker run -p 8000:8000 --env-file .env video-streaming-app-backend
    ```

### Heroku

1. Create a new Heroku app:
    ```sh
    heroku create [APP_NAME]
    ```

2. Set environment variables on Heroku:
    ```sh
    heroku config:set PORT=8000 MONGO_URI=[YOUR_MONGO_URI] ACCESS_TOKEN_SECRET=[YOUR_ACCESS_TOKEN_SECRET] REFRESH_TOKEN_SECRET=[YOUR_REFRESH_TOKEN_SECRET] CLOUDINARY_CLOUD_NAME=[YOUR_CLOUDINARY_CLOUD_NAME] CLOUDINARY_API_KEY=[YOUR_CLOUDINARY_API_KEY] CLOUDINARY_API_SECRET=[YOUR_CLOUDINARY_API_SECRET]
    ```

3. Deploy to Heroku:
    ```sh
    git push heroku main
    ```
-->
<!-- ### AWS

Refer to the [AWS Deployment Guide](TODO: LINK_TO_AWS_DEPLOYMENT_GUIDE) for detailed instructions. -->

## 🤝 Contributing

We welcome contributions! 
<!-- Please read our [Contributing Guidelines](TODO: LINK_TO_CONTRIBUTING_GUIDELINES) before submitting a pull request. -->

<!-- ## 📄 License

This project is licensed under the [MIT License](LICENSE). -->

## 📬 Contact

For support or inquiries, please contact [email](codex.hseyaj26@gmail.com) or visit our [GitHub](https://github.com/hseyaj04) page.

---

Thank you for using the Video Streaming App Backend! We hope it serves your needs well. Happy coding! 🚀
