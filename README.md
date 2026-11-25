# foodie

POC on foodie hub. The repo has two ways to serve the site:

- **Static site** at the repo root (`index.html`, `favorites.html`, and the root `.js` files). These files are already ready for a browser.
- **Vite app** in `vite/`. `npm run build` writes the finished site to `vite/dist/`.

Each one has its own Dockerfile. Both images serve the built files with nginx.

## Docker setup

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and wait until the engine is running. In PowerShell, `docker version` should print a **Client** section and a **Server** section. The Server section is the engine.

### Static site

From the repo root:

```powershell
docker build -t foodie-static .
docker run --rm -p 8080:80 foodie-static
```

Open `http://localhost:8080`. Ctrl+C stops the container. `--rm` deletes it when it stops. `-p 8080:80` publishes the container's port 80 on your machine as port 8080.

### Vite app

`node:22-alpine` is only used to build. The running image is nginx and contains `dist/` only.

```powershell
docker build -t foodie-vite ./vite
docker run --rm -p 8081:80 foodie-vite
```

Open `http://localhost:8081`. Port 8081 keeps it separate from the static container, so both can run at the same time.

### Run from Docker Desktop

Stop any container already published on that port, then:

1. Open **Images** and click **Run** on `foodie-static` or `foodie-vite`.
2. In the optional settings, set the host port (`8080` or `8081`) and the container port (`80`).
3. Click **Run**.

The **Containers** list shows the mapping in the **Port(s)** column, for example `8080:80`. Click that port to open the site. A container started without a host port is running, but the browser cannot reach it.

### If the image pull times out

`docker pull` and `docker build` download `nginx` and `node` from Docker Hub. A `TLS handshake timeout` while the engine is running means the connection to `registry-1.docker.io` stalled. On this project that happened when IPv6 to Docker Hub hung and IPv4 worked. Uncheck **Internet Protocol Version 6 (TCP/IPv6)** on the active network adapter, quit Docker Desktop, open it again, and retry:

```powershell
docker pull nginx:1.27-alpine
```
