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
    
    return true;
}