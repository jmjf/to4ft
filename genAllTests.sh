# Simple blog
npm run tbd:dev
npm run tbr:dev
npm run rod:dev
npm run ror:dev

# Train travel
echo "train-tbd"
node --experimental-strip-types src/cli.ts oas2tb \
  -i example/otherspecs/train-travel-api.yaml \
  -o example/train-tbd \
  -c oas2tb4fastify_deref.json

echo "train-tbr"
node --experimental-strip-types src/cli.ts oas2tb \
  -i example/otherspecs/train-travel-api.yaml \
  -o example/train-tbr \
  -c oas2tb4fastify_ref.json

echo "train-rod"
node --experimental-strip-types src/cli.ts oas2ro \
  -i example/otherspecs/train-travel-api.yaml \
  -o example/train-rod \
  -c oas2tb4fastify_deref.json

echo "train-ror"
node --experimental-strip-types src/cli.ts oas2ro \
  -i example/otherspecs/train-travel-api.yaml \
  -o example/train-ror \
  --refDir example/train-tbr \
  -c oas2tb4fastify_ref.json

# museum
echo "museum-tbd"
node --experimental-strip-types src/cli.ts oas2tb \
  -i example/otherspecs/museum-openapi-example.yaml \
  -o example/museum-tbd \
  -c oas2tb4fastify_deref.json

echo "museum-tbr"
node --experimental-strip-types src/cli.ts oas2tb \
  -i example/otherspecs/museum-openapi-example.yaml \
  -o example/museum-tbr \
  -c oas2tb4fastify_ref.json

echo "museum-rod"
node --experimental-strip-types src/cli.ts oas2ro \
  -i example/otherspecs/museum-openapi-example.yaml \
  -o example/museum-rod \
  -c oas2tb4fastify_deref.json

echo "museum-ror"
node --experimental-strip-types src/cli.ts oas2ro \
  -i example/otherspecs/museum-openapi-example.yaml \
  -o example/museum-ror \
  --refDir example/museum-tbr \
  -c oas2tb4fastify_ref.json

# Format
npm run check:ex