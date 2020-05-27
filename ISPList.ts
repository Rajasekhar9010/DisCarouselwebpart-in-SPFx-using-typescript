/**
 * @interface
 * Defines a SharePoint RotatingBanner List Items
 */
export interface IRotatingBannerItems{
  value:IRotatingBannerItem[];
}

/**
* @interface
* Defines a SharePoint RotatingBanner
*/
export interface IRotatingBannerItem{
    Title:string;
    Image:string;
    Description:string;
    
    
    
}