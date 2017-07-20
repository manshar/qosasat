const UNSPLASH_REFERRAL_STRING =
    '?utm_source=manshar-clips&utm_medium=referral&utm_campaign=api-credit';

export class Photo {
  public showCredits: boolean = false;
  public servingUrl: string;
  public sourceId: string;
  public sourceLink: string;
  public sourceName: string;
  public photographerName: string;
  public photographerLink: string;

  private resizableServeUrlTemplate: string;

  constructor(data: any) {
    switch (data['source_name'] || data['sourceName']) {
      case 'Unsplash':
        this._initFromUnsplash(data);
        break;
      case 'CarbonUpUp':
        this._initFromCarbonUpUp(data);
        break;
      default:
        this._initFromOther(data);
        break;
    }
  }

  public getSrc(width: number, height: number, crop: boolean = true) {
    switch (this.sourceName) {
      case 'Unsplash':
        return `${this.servingUrl}?w=${width}&h=${height}&fit=crop`;
      case 'CarbonUpUp':
        return `${this.servingUrl}=w${width}-h${height}-c`;
      default:
        return this.servingUrl;
    }
  }

  private _initFromUnsplash(data: any) {
    this.servingUrl = data['original_serve_url'] || data['url'];
    this.resizableServeUrlTemplate = data['resizable_serve_url_template'];
    this.sourceId = data['source_id'];
    this.sourceLink = data['source_link'] + UNSPLASH_REFERRAL_STRING;
    this.sourceName = data['source_name'] || data['sourceName'];

    this.photographerName = data['source_photographer_name'];
    this.photographerLink = data['source_photographer_link'] + UNSPLASH_REFERRAL_STRING;
    this.showCredits = true;
  }

  private _initFromCarbonUpUp(data: any) {
    this.servingUrl = data['image_url'] || data['url'];
    this.resizableServeUrlTemplate = data['image_url'] + '=wWIDTH-hHEIGHT-FIT';
    this.sourceId = data['key'];
    this.sourceName = data['source_name'] || data['sourceName'];
  }

  private _initFromOther(data: any) {
    this.servingUrl = data['image_url'] || data['url'];
    this.resizableServeUrlTemplate = data['image_url'];
  }

}



  // googleServedImageUrlBase_(photo:string) {
  //   const indexOfEq = photo.indexOf('=');
  //   return indexOfEq === -1 ? photo : photo.substring(0, indexOfEq);
  // }

  // googleServedImageUrl_(photo:string, width, height, crop) {
  //   const parts = [this.googleServedImageUrlBase_(photo), '='];
  //   if (width) {
  //     parts.push(`w${width}-`);
  //   }
  //   if (height) {
  //     parts.push(`h${height}-`);
  //   }
  //   if (crop) {
  //     parts.push('-c');
  //   }
  //   return parts.join('');
  // }