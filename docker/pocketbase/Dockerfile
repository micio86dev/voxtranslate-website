# PocketBase CMS for the VoxTranslate blog.
# Migrations in pb_migrations/ auto-apply on boot; hooks in pb_hooks/ trigger a
# Vercel rebuild when a post is published.
FROM alpine:3.20

# Bump with care: PocketBase >= 0.23 changed the JS migration API (Dao -> app,
# schema -> fields). The migrations here target the 0.22.x API.
ARG PB_VERSION=0.22.0
# Set automatically by BuildKit (amd64 on Railway, arm64 on Apple Silicon).
ARG TARGETARCH

RUN apk add --no-cache unzip ca-certificates wget

RUN ARCH="${TARGETARCH:-amd64}" \
    && wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${ARCH}.zip" -O /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /pb/ \
    && rm /tmp/pb.zip

COPY pb_migrations /pb/pb_migrations
COPY pb_hooks /pb/pb_hooks

EXPOSE 8090

# Honor Railway's injected $PORT (falls back to 8090 locally).
CMD ["sh", "-c", "/pb/pocketbase serve --http=0.0.0.0:${PORT:-8090} --dir=/pb/pb_data --migrationsDir=/pb/pb_migrations --hooksDir=/pb/pb_hooks"]
