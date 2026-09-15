# School Site Showcase

make me a school website with a modern look and pictures and working buttons

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8da8583d-743c-4eb1-8646-ce130d597124).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Cloudflare Workers deployment

After signing in with Wrangler (`pnpm dlx wrangler login`), deploy the production build with:

```sh
pnpm deploy:cloudflare
```

The deployment uses the Worker name `TestName`. If the Cloudflare account subdomain is `TestAztx`, the public address will be `https://testname.testaztx.workers.dev` (domain names are case-insensitive).
