# Clipers Frontend - Deployment Guide

## Coolify Deployment

This Next.js application has been configured for deployment on Coolify on port 3005.

### Files Added/Modified for Deployment:

1. **Dockerfile** - Multi-stage Docker build for production
2. **docker-compose.yml** - Local testing with Docker
3. **next.config.mjs** - Added standalone output configuration
4. **package.json** - Updated scripts for port 3005
5. **coolify.json** - Coolify configuration file
6. **env.example** - Environment variables template
7. **.dockerignore** - Docker ignore patterns

### Quick Start

#### Local Development
```bash
npm run dev
# Runs on http://localhost:3005
```

#### Docker Build & Run
```bash
# Build Docker image
npm run docker:build

# Run Docker container
npm run docker:run
# Access on http://localhost:3005
```

#### Using Docker Compose
```bash
docker-compose up --build
# Access on http://localhost:3005
```

### Coolify Deployment Steps

1. **Connect Repository**: Add your Git repository to Coolify
2. **Create Application**: Choose "Docker" as the build pack
3. **Configuration**: 
   - Port: 3005
   - Dockerfile: Use the provided Dockerfile
   - Environment variables: Set according to env.example
4. **Deploy**: Coolify will automatically build and deploy

### Environment Variables

Copy `env.example` to `.env.local` and configure:

```bash
cp env.example .env.local
```

Key variables:
- `PORT=3005` - Application port
- `NODE_ENV=production` - Environment mode
- `NEXT_TELEMETRY_DISABLED=1` - Disable Next.js telemetry

### Production Considerations

- The app uses Next.js standalone output for optimized Docker images
- Images are unoptimized (set in next.config.mjs)
- TypeScript and ESLint errors are ignored during build
- Health check endpoint available at `/`

### Troubleshooting

If you encounter issues:
1. Check port 3005 is available
2. Verify environment variables are set correctly
3. Ensure Docker is running for containerized deployment
4. Check Coolify logs for deployment errors

### Project Structure

This is a Next.js 14 project with:
- App Router architecture
- TypeScript support
- Tailwind CSS styling
- Radix UI components
- Zustand for state management
