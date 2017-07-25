import { IClipPhotoConfig } from './clip-photo-config';
import { IClipSizeConfig } from './clip-size-config';

export class IClipConfig {
  public id?: string;
  public photo?: IClipPhotoConfig;
  public font?: string;
  public lines: string[];
  public previewRatio: number;
  public textFill: string;
  public textPos: string;
  public textFit: string;
  public size: IClipSizeConfig;
}
