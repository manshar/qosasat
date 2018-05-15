# [Qosas.at](https://qosas.at/)
Qosasat (Arabic for Clippings) is a simple graphical editor that allows users to design
simple text-over-photo clips and export them as images.

The app mainly uses browser technoligies to export the final image through Canvas API. However, it'll fallback to server-side rendering using Headless Chrome or using ImageMagick. This allows the app to work on browsers that have more restrictions on some of the APIs.


There are few services that are used in the app including:

* [Yorwa](http://www.yorwa.com/) API for getting Arabic Quotes
* Carbon SrcSrc - an index of photos from [Unsplash](https://unsplash.com/?utm_source=manshar-clips&utm_medium=referral&utm_campaign=api-credit) that are indexed in Arabic
* Carbon UpUp - Photo Uploading service to allow custom photos to be uploaded to be used in the design
* [FontFace.me](https://fontface.me/) - Arab Web Fonts hosting service



# Carbon UpUp Service
You can [deploy your own version of Carbon UpUp](https://github.com/carbon-tools/upup). The service runs easily as a Google AppEngine app. The only setup you'd need to change is the endpoint in `src/app/carbon-upup/carbon-upup.service.ts` file to point to your own service endpoint.



# License
 [MIT](/LICENSE)
