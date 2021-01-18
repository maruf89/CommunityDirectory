import debounce from 'Scripts/Helper/debounce';

/**
 * Returns whether on an OffersNeeds post type page (new post or edit post)
 */
export function isOfPostPage():boolean {
    return /post-(new-)?php/.test(document.body.className) &&
           (new RegExp(`post-type-${cdData.postType.offersNeeds}`)).test(document.body.className);
}

export const classNames = {
    listParent: 'ps-parent',
    opened: 'opened',
};

export function breadcrumbProductServices() {
    const containerId = cdData.taxonomyType.productService;
    const $container = jQuery(`#${containerId}checklist`);
    if (!$container.length) return;

    $container.children('li').each(applyChildBreadcrumb);

    $container.on('click', `.${classNames.listParent}`, debounce((event) => {
        const ct = jQuery(event.currentTarget);
        ct.toggleClass(classNames.opened, !ct.hasClass(classNames.opened));
    }, 250, true));
    
}

function applyChildBreadcrumb(index, possibleParent) {
    const $parent = jQuery(possibleParent);
    const $children = $parent.children('.children').children('li');
    if (!$children.length) return;

    $parent.addClass(classNames.listParent);

    $children.each(applyChildBreadcrumb);
}