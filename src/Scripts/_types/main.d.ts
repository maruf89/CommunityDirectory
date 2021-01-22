
declare var window:Window & typeof globalThis
declare var L:typeof L
declare const cdData:cdData;
declare function tb_remove(): void

interface cdData {
    restBase:string
    ajaxUrl:string
    translations: {
        [name:string]:string
    }
    postType: {
        [name:string]:string
    }
    pages?: {
        [name:string]: {
            acf: { [name:string]:string }
        }
    }
    taxonomyType: {
        [name:string]:string
    }
    map: {
        accessToken:string
        defaultCoords:[number, number]
    },
    wp_nonce:string
    edit_others_entities:boolean
}