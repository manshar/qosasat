npm build:prod
cd dist/
gsutil -m rsync -d . gs://clips.manshar.com
gsutil -m acl set -R -a public-read gs://clips.manshar.com/*
gsutil -m setmeta -h "Cache-Control:public, max-age=7884000" gs://clips.manshar.com/*
gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://clips.manshar.com/index.html
cd ..