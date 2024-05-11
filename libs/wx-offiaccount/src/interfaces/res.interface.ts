export interface ResError {
    errcode: string
    errmsg: string
}

export type CreateQrcodeRes = {
    ticket: string
    expire_seconds: number
    url: string
}

export type GetUserInfoRes = {
    subscribe: number
    openid: string
    language: string
    subscribe_time: string
    unionid?: string
    remark?: string
    groupid?: string
    tagid_list?: string[]
    subscribe_scene: "ADD_SCENE_SEARCH" | "ADD_SCENE_ACCOUNT_MIGRATION" | "ADD_SCENE_PROFILE_CARD" | "ADD_SCENE_QR_CODE" | "ADD_SCENE_PROFILE_LINK" | "ADD_SCENE_PROFILE_ITEM" | "ADD_SCENE_PAID" | "ADD_SCENE_WECHAT_ADVERTISEMENT" | "ADD_SCENE_REPRINT" | "ADD_SCENE_LIVESTREAM" | "ADD_SCENE_CHANNELS" | "ADD_SCENE_WXA" | "ADD_SCENE_OTHERS"
    qr_scene?: string
    qr_scene_str?: string
}