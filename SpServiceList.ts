import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import {IRotatingBannerItem,IRotatingBannerItems} from './ISPList';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import {IDisCarouselWebPartProps} from './DisCarouselWebPart';
/**
 * @interface
 * Service interface definition
 */
export interface IRotatingBannerListService {
    /**
     * @function
     * Gets the Rotating Banners from a SharePoint list
     */
    getRotatingBannerItems(libId: string): Promise<IRotatingBannerItems>;
  }

  export class SPRotatingBannerListService implements IRotatingBannerListService{

    private context: IWebPartContext;
    private props: IDisCarouselWebPartProps;
  
    /**
     * @function
     * Service constructor
     */
    constructor(_props: IDisCarouselWebPartProps, pageContext: IWebPartContext){
        this.props = _props;
        this.context = pageContext;
    }


     /**
   * @function
   * Gets the Rotating Banner Items from a SharePoint list
   */

   public getRotatingBannerItems(queryUrl: string):Promise<IRotatingBannerItems>{
    return this.context.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
        return response.json().then((responseFormated: any) => {
            var formatedResponse: IRotatingBannerItems = { value: []};
            //Fetchs the Json response to construct the final items list
            responseFormated.value.map((object: any, i: number) => {
                var spListItem: IRotatingBannerItem = {
                  'Title': object['Title'],
                  'Image': object['Image'],
                  'Description': object['Description']
                 
                };
                formatedResponse.value.push(spListItem);
            });
            return formatedResponse;
        });
    }) as Promise<IRotatingBannerItems>;
   }
}
