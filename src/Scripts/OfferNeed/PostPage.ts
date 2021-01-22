import { requireProductService, breadcrumbProductServices } from 'Scripts/OfferNeed/ProductServiceType';

/**
 * Returns whether on an OffersNeeds post type page (new post or edit post)
 */
export function isOfPostPage():boolean {
    return /post-(new-)?php/.test(document.body.className) &&
           (new RegExp(`post-type-${cdData.postType.offersNeeds}`)).test(document.body.className);
}

export function initPostPage():boolean {
    if (!isOfPostPage()) return false;

    requireProductService();
    breadcrumbProductServices();
    autofillHashtagTitle();
    
    return true;
}

export function autofillHashtagTitle() {
    const $titleInput:HTMLInputElement = <HTMLInputElement> jQuery('#title')[0];
    const $hashtagTitleInput:HTMLInputElement =
        <HTMLInputElement> jQuery(`#acf-${cdData.pages.offersNeeds.acf.hashtag_title}`)[0];

    $titleInput.onkeyup = event => {
        $hashtagTitleInput.value = hashtagify(event.target.value);
    }

}

function hashtagify(text:string):string {
    return `#${text.split(' ').map(val => val[0].toUpperCase() + val.substr(1)).join('')}`;
}