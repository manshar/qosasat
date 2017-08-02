npm run build:prod
npm run precache
cd dist/
gsutil -m rsync -d -R . gs://qosas.at
gsutil -m acl set -R -a public-read gs://qosas.at/*
gsutil -m setmeta -R -h "Cache-Control:public, max-age=7884000" gs://qosas.at/*
gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://qosas.at/index.html
gsutil -m setmeta -h "Cache-Control:public, max-age=0" gs://qosas.at/assets/service-worker.js
cd ..
