export type CreateMenuData = {
    button: {
        name: string
        sub_button?: {
            type: string
            name: string
            url?: string
            appid?: string
            pagepath?: string,
            key?: string
        }[]
        type?: string
    }[],
    matchrule?: {
        tag_id: string,
        sex: string,
        country: string,
        province: string,
        city: string,
        client_platform_type: string,
        language: string
    }
}
export type BatchgetMaterialData = {
    type: "image" | "video" | "voice" | "news",
    offset: number,
    count: number
}
/**
 * @description QR_SCENE 临时的整型参数值
 * @description QR_STR_SCENE 临时的字符串参数值
 * @description QR_LIMIT_SCENE 永久的整型参数值
 * @description QR_LIMIT_STR_SCENE 永久的字符串参数值
 */
export type CreateQrcodeData = {
    expire_seconds: number,
    action_name: "QR_SCENE" | "QR_STR_SCENE" | "QR_LIMIT_SCENE" | "QR_LIMIT_STR_SCENE",
    action_info: string,
    scene_id?: number,
    scene_str?: string
}