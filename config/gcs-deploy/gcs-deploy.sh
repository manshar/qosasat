npm run build:prod
npm run precache
cd dist/
gsutil -m rsync -d -R . gs://qosasat.manshar.com
gsutil -m acl set -R -a public-read gs://qosasat.manshar.com/*
gsutil -m setmeta -R -h "Cache-Control:public, max-age=7884000" gs://qosasat.manshar.com/*
gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://qosasat.manshar.com/index.html
cd ..