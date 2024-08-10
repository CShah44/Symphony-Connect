# 🎵 Symphony Connect 🎶

#### A platform where music profiles harmonize! Discover like-minded artists, showcase your talent, and send jam requests. Socialize, post, and connect in perfect rhythm. 🎶

### Chosen Problem Statement:

Music Profile App: An app where people can display their music profiles, including instruments/vocal skills and music listening tastes. Features:
🎧 Find people with similar music tastes.
🥁 Post if you're looking for a drummer, guitarist, singer, etc. to jam with.

## Deployment

https://symphony-connect.vercel.app/

## Badges

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## Tech Stack

_Framework:_ NextJS with TypeScript

_UI_: ShadCN UI with TailwindCSS, Framer Motion

_Database_: MongoDB

_Forms_: React-Hook-Forms with Zod Validation

#### Other Tools Used:

_ML API_: HuggingFace's Inference API

_Realtime Capabilities_: PusherJS

_File Storage_: Uploadthing

_Authentication_: Clerk

### Why this stack?

This stack was chosen for its ability to deliver a highly performant, scalable, and maintainable application. Next.js with TypeScript ensures that the core of the application is robust and easy to work with. It leverages the use of server components making it more powerful to work with. Clerk simplifies authentication along with webhook capabilities, making it secure and straightforward. MongoDB allows for a dynamic and flexible schema that be easily expanded. Pusher introduces real-time capabilities, essential for a dynamic user experience. Finally, shadcn and Tailwind CSS allow for rapid UI development with a clean and modern design.

## Features

- Create a Music Profile through an onboarding process
- Users can post, submit an event/opportunity
- Multiple Image uploads
- Realtime Chatting
- Discover users based on the profile match
- Sending Jam Requests
- Follow other users, connect with them
- Like, Comment and repost
- Post stories (that are deleted after a day)
- See the trends on the community
- Subtle animations and clean, modern UI for best User experience
- OTP email verification while signing up
- Admin Dashboard to manage users
- Trending Community Stats on feed

## Challenges faced

Here are some of the challenges I faced:

#### 1. Onboarding functionality

This is the biggest challenge faced in this application since it invloves using webhooks and then an onboarding form which updates the user's details. It is tricky due to the flow of events ie, creation of the user in database and then updating that same user with new data.

#### 2. Discover Users functionality

A simple looking yet pretty tricky to implement feature of this app which was done through profile matching using ML Models of HuggingFace. It also invloves searching, and profile matching.

#### 3. Multiple File Upload

One of the features that makes this app stand out. It was quite difficult to implement this feature, given the no. of resources available to do so.

#### 4. Admin Dashboard

The app provides functionality to manage users on the app. This was made easy by Clerk's Documentation.

#### 5. Stories

An instagram story like feature that lets users post a story which is automatically deleted after 24 hours by a cron job. It was a tricky feature to implement.

#### 6. Realtime 1 on 1 and Group Chat

One of the most important feature of the app, that lets users interact with each other with a click of a button through any user's profile page. The app also provides for the users to form groups with their followers. The realtime functionality was achieved through pusher. This was also expanded upon to send special Jam request with the click of a button which lets any user sent a Jam request to others with an auto generated message.

#### 7. Role based access system

One of the advanced features for any web application. This was made very easy through Clerk and their documentation which would otherwise have required much more time and effort to achieve

## Run Locally

Clone the project

```bash
  git clone https://github.com/CShah44/Symphony-Connect.git
```

Go to the project directory

```bash
  cd Symphony-Connect
```

Install dependencies

```bash
  npm install
```

Start the development server

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Provided by clerk

`CLERK_SECRET_KEY`: Provided by clerk

`NEXT_PUBLIC_CLERK_SIGN_IN_URL`: Used for custom signin page

`NEXT_PUBLIC_CLERK_SIGN_UP_URL`: Used for custom signup page

`NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`: Used for custom redirected page which was the onboarding page.

`MONGODB_URI`: The mongoDB connection URL, found when creating the cluster

`WEBHOOK_SECRET`: Given by clerk when you register the endpoint

`UPLOADTHING_SECRET` : Uploadthing's app secret

`UPLOADTHING_APP_ID`: From pusher after creating the app.

`PUSHER_APP_ID`: From pusher after creating the app.

`NEXT_PUBLIC_PUSHER_APP_KEY`: From pusher after creating the app.

`PUSHER_APP_SECRET`: From pusher after creating the app.

`HF_TOKEN`: The generated token from hugging face

## Further Improvements/Features

- Searching through posts.
- Being able to actually host events on the app (similar to unstop)
- Allowing users to post vidoes of their work. (which requires more storage than what most free tier offer, ie, 2GB for uploadthing)
- Users can search through their selected tags
- Connecting user's spotify account and fetching data from spotify api to build a better music profile and suggestion system

## Documentation about how I implemented certain features

[Documentation](https://1drv.ms/w/s!AjEYjNI8O0WhjjNdacZr8pMSy58d)

### Note

The initial page might take a few seconds to load. After the sign up page, you will be shown loading screen before onboarding which takes quite sometime since MongoDB database is not connected to the server and hence webhooks call can not be completed quickly. Consider reloading the welcome page (if it take more than ~15-20s) so that the "complete onboarding" button appears. I tried my best to lower the load time.

#### Made with ❤️ by [Chaitya Shah](https://github.com/CShah44) for Zense-IIITB recruitment 2024
