import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './DisCarouselWebPart.module.scss';
import * as strings from 'DisCarouselWebPartStrings';
import { IRotatingBannerItem } from './ISPList';;
import { SPRotatingBannerListService } from './SpServiceList';
import * as $ from 'jquery';
import 'slick-carousel';
import { SPComponentLoader } from '@microsoft/sp-loader';
import 'bootstrap';
export interface IDisCarouselWebPartProps {
  description: string;
  libraryName:string;
  NumberofItems:string;
  bannerDuration:string;
  
  
}

export default class DisCarouselWebPart extends BaseClientSideWebPart<IDisCarouselWebPartProps> {

  public render(): void {
    
  
    SPComponentLoader.loadCss(this.context.pageContext.site.absoluteUrl + `/SiteAssets/Spfx/bootstrap.min.css`);
    //SPComponentLoader.loadCss(`https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css`);
    //SPComponentLoader.loadCss(this.context.pageContext.site.absoluteUrl + `/SiteAssets/Spfx/elegantfonts.min.css`);
    //SPComponentLoader.loadCss(this.context.pageContext.site.absoluteUrl + `/SiteAssets/Spfx/css-new.css`);
    SPComponentLoader.loadCss(this.context.pageContext.site.absoluteUrl + `/SiteAssets/Spfx/style.css`);
    //SPComponentLoader.loadCss(this.context.pageContext.site.absoluteUrl + `/SiteAssets/Spfx/responsive.css`);
    //SPComponentLoader.loadCss(this.context.pageContext.site.absoluteUrl + `/SiteAssets/Spfx/suss-style.css`);
    this.domElement.innerHTML = `
    <div id="page-top">
    <!-- Home -->
    <div id="">
        <div class="">
            <div class="">
                <div class="">
                    <div class="">
                        <div class="">
                            <div class="slider_container">
                            <a href="#" class="add" id="add-Banner-Icon"  style="display:none" ></a>
                                <div id="demo" class="carousel slide" data-ride="carousel" data-interval="${parseInt(this.properties.bannerDuration+'000')}">
                                    <ul class="carousel-indicators" id="rotatingBannerDots">
                                       
                                    </ul>
                                    <div class="carousel-inner" id="rotatingBannerContent">
                                       
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    </div>
</div>
     `;
    
    this.renderRotatingBannerItems();
  }

 
  protected renderRotatingBannerItems(){
    var today = new Date();
    var todayIsoString = today.toISOString();
    todayIsoString = todayIsoString.split('T')[0] + "T00:00:00Z";
  
  let rotatingBannerService:SPRotatingBannerListService= new SPRotatingBannerListService(this.properties, this.context);
  let rotatingBannerQuery=this.context.pageContext.web.absoluteUrl+"/_api/web/lists/getbytitle('BannerImages')/items?$select=Title,Image,Description&$top=5";
  rotatingBannerService.getRotatingBannerItems(rotatingBannerQuery)
  .then((response)=>{
    var responseVal = response.value;
    let bannerDotsHtml="";
    let bannerHtml="";
    responseVal.map((object:IRotatingBannerItem, i:number) => {
      var itemurl=object.Image['Url']
      let bannerClass="";
    
      if (i==0) {
        bannerClass="carousel-item active";
        bannerDotsHtml+=`<li data-target="#demo" data-slide-to="${i}" class="active"></li>`;
      }
      else{
        bannerClass="carousel-item";
        bannerDotsHtml+=`<li data-target="#demo" data-slide-to="${i}"></li>`;
      }
  
      bannerHtml+=` <div class="${bannerClass}">
      <a href=""><img src="${itemurl}?RenditionID=8" alt="Slider" class="img-fluid"></a>
      <div class="caption">
          
          <p><a href="#">${object.Title}</a></p>
          <p><a href="#">${object.Description}</a></p>
          
      </div>
  </div>`;
  
  
  
  
    })
    this.domElement.querySelector('#rotatingBannerDots').innerHTML=bannerDotsHtml;
    this.domElement.querySelector('#rotatingBannerContent').innerHTML=bannerHtml;
  })
  }
  
  protected getForamttedDate(currentDate){
    var formattedDate=new Date(currentDate);
    var arrayMonths=['Jan','Feb','Mar,','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var finalDateString= formattedDate.getDate()+" "+arrayMonths[formattedDate.getMonth()]+" "+ formattedDate.getFullYear();
    return finalDateString;
    }
  
    
    
      protected get dataVersion(): Version {
        return Version.parse('1.0');
      } 

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
      return {
        pages: [
          {
            header: {
              description: strings.PropertyPaneDescription
            },
            groups: [
              {
                groupName: strings.BasicGroupName,
                groupFields: [
                  PropertyPaneTextField('description', {
                    label: strings.DescriptionFieldLabel
                  }),
                  PropertyPaneTextField('libraryName', {
                    label: "Library Name",
                    value:"BannerImages"
                  }),
                PropertyPaneSlider('bannerDuration',{
                  label:'Banner Duration In Secs',
                  min:2,
                  max:5,
                  value:5
                  }), 
                  PropertyPaneSlider('NumberofItems',{
                    label:"Max Items",
                    min:1,
                    max:6,
                    value:6
                  }),
                ]
              }
            ]
          }
        ]
      };
    }
  }

   