import { Inject, Injectable } from '@nestjs/common';
import { WXOFFIACCOUNT_MODULE_OPTIONS_TOKEN } from './wx-offiaccount.module-definition';
import { WxOffiaccountModuleOptions } from './wx-offiaccount.module.interface';
import { RequestService } from '@app/request';
import { BatchgetMaterialData, CreateMenuData, CreateQrcodeData } from './interfaces/req.interface';
import { CreateQrcodeRes, GetUserInfoRes } from './interfaces/res.interface';
@Injectable()
export class WxOffiaccountService {
    constructor(
        @Inject(WXOFFIACCOUNT_MODULE_OPTIONS_TOKEN)
        private readonly options: WxOffiaccountModuleOptions,
        private readonly requestService: RequestService
    ) {
        this.getAccessToken();
    }

    private token: string
    private tokenTime = 0;

    public async get<T>(url: string, query: Record<string, any> = {}) {
        return new Promise<T>((resolve, rejects) => {
            this.requestService.get(url).query({
                access_token: this.token,
                ...query
            }).then(({ body }) => {
                if (body.errcode) {
                    return rejects(body)
                }
                resolve(body)
            })
        })
    }
    public async post<T>(url: string, data: any) {
        return new Promise<T>((resolve, rejects) => {
            this.requestService.get(url).query({
                access_token: this.token
            }).send(data).then(({ body }) => {
                if (body.errcode) {
                    return rejects(body)
                }
                resolve(body)
            })
        })
    }

    /**
     * @description
     * 获取access_token
     * @method GET
     * @link
     * https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
     */
    public async getAccessToken() {
        const now = Date.now();
        if (now - this.tokenTime < 60 * 60 * 2 - 5 * 60) {
            return this.token;
        }
        await this.getToken();
        return this.token;
    }

    private async getToken() {
        const res = await this.requestService.get("token").query({
            grant_type: "client_credential",
            appid: this.options.appid,
            secret: this.options.secret
        })
        if (!!res.body.errcode) {
            throw new Error(JSON.stringify(res.body))
        }
        this.token = res.body.access_token;
        this.tokenTime = Date.now();
    }

    /**
     * @description
     * 创建菜单 
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN
     */
    public createMenu(data: CreateMenuData) {
        return this.post("menu/create", data)
    }

    /**
     * @description
     * 查询菜单
     * @method GET
     * @link
     * https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info?access_token=ACCESS_TOKEN
     */
    public getCurrentSelfmenuInfo() {
        return this.get("get_current_selfmenu_info")
    }

    /**
     * @description
     * 删除菜单
     * @method GET
     * @link
     * https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=ACCESS_TOKEN
     */
    public deleteMenu() {
        return this.get("menu/delete")
    }

    /**
     * @description
     * 创建个性化菜单
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/menu/addconditional?access_token=ACCESS_TOKEN
     */
    public addConditional(data: CreateMenuData) {
        return this.post("menu/addconditional", data)
    }

    /**
     * @description
     * 获取自定义菜单配置
     * @method GET
     * @link
     * https://api.weixin.qq.com/cgi-bin/menu/get?access_token=ACCESS_TOKEN
     */
    public async getConditional() {
        return this.get("menu/get")
    }

    /**
     * @description
     * 新增永久素材
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=ACCESS_TOKEN
     */
    public uploadimgMedia() { }

    /**
     * @description
     * 新增临时素材
     * @method POST
     * @link
     * https https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=TYPE
     */
    public uploadMedia(filePath: string) {
        const form = new FormData();
        // const file = readFileSync(filePath)
        // form.append("media", file)
        return this.post("media/upload", {})
    }

    /**
     * @description
     * 获取临时素材
     * @method GET
     * @link
     * https://api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESS_TOKEN&media_id=MEDIA_ID
     */
    public getMedia(media_id: string) {
        return this.get("media/get", {
            media_id
        })
    }

    /**
     * @description
     * 获取永久素材
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=ACCESS_TOKEN
     */
    public getMaterial(media_id: string) {
        return this.post("material/get_material", {
            media_id
        })
    }

    /**
     * @description
     * 删除永久素材
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/material/del_material?access_token=ACCESS_TOKEN
     */
    public delMaterial(media_id: string) {
        return this.post("material/del_material", {
            media_id
        })
    }

    /**
     * @description
     * 获取素材总数
     * @method GET
     * @link
     * https://api.weixin.qq.com/cgi-bin/material/get_materialcount?access_token=ACCESS_TOKEN
     */
    public getMaterialcount() {
        return this.get("material/get_materialcount")
    }

    /**
     * @description
     * 获取素材列表
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=ACCESS_TOKEN
     */
    public batchgetMaterial(data: BatchgetMaterialData) {
        return this.post("material/batchget_material", data)
    }

    /**
     * @description
     * 新增草稿箱
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/draft/add?access_token=ACCESS_TOKEN
     */
    public addDraft() {

    }

    /**
     * @description
     * 获取草稿箱
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/draft/get?access_token=ACCESS_TOKEN
     */
    public getDraft() { }

    /**
     * @description
     * 删除草稿箱
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/draft/delete?access_token=ACCESS_TOKEN
     */
    public delDraft() { }

    /**
     * @description
     * 修改草稿箱
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/draft/update?access_token=ACCESS_TOKEN
     */
    public updDraft() { }

    /**
     * @description
     * 获取草稿总数
     * @method GET
     * @link
     * https://api.weixin.qq.com/cgi-bin/draft/count?access_token=ACCESS_TOKEN
     */
    public draftCount() { }

    /**
     * @description
     * 获取草稿列表
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/draft/batchget?access_token=ACCESS_TOKEN
     */
    public getDraftList() { }

    /**
     * @description
     * 发布接口
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/freepublish/submit?access_token=ACCESS_TOKEN
     */
    public async freePublishSubmit() { }

    /**
     * @description
     * 发布状态轮询
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/freepublish/get?access_token=ACCESS_TOKEN
     */
    public async freePublishGet() { }

    /**
     * @description
     * 删除发布
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/freepublish/delete?access_token=ACCESS_TOKEN
     */
    public async freePublishDelete() { }

    /**
     * @description
     * 通过 article_id 获取已发布文章
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/freepublish/getarticle?access_token=ACCESS_TOKEN
     */
    public async freePublishGetArticle() { }

    /**
     * @description
     * 获取成功发布列表
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token=ACCESS_TOKEN
     */
    public async freePublishBatchget() { }

    /**
     * @description
     * 生成二维码
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=TOKEN
     */
    public async createQrcode(data: CreateQrcodeData) {
        return this.post<CreateQrcodeRes>("qrcode/create", data)
    }

    /**
     * @description
     * ticket换取二维码
     * @method GET
     * @link
     * https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=TICKET 
     */
    public async showQrcode(ticket: string) {
        return this.get("showqrcode", {
            ticket
        })
    }

    /**
     * @description
     * 创建用户标签
     * @method POST
     * @link
     *  https://api.weixin.qq.com/cgi-bin/tags/create?access_token=ACCESS_TOKEN
     */
    public async createTags() { }

    /**
     * @description
     * 获取公众号已创建的标签
     * @method GET
     * @link
     * https://api.weixin.qq.com/cgi-bin/tags/get?access_token=ACCESS_TOKEN
     */
    public async getTags() { }


    /**
     * @description
     * 编辑标签
     * @method POST
     * @link
     *  https://api.weixin.qq.com/cgi-bin/tags/update?access_token=ACCESS_TOKEN
     */
    public updateTags() { }

    /**
     * @description
     * 删除标签
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/tags/delete?access_token=ACCESS_TOKEN
     */
    public deleteTags() { }


    /**
     * @description
     * 获取标签下粉丝列表
     * @method POST
     * @link
     *  https://api.weixin.qq.com/cgi-bin/user/tag/get?access_token=ACCESS_TOKEN
     */
    public getTagUsers() { }

    /**
     * @description
     * 批量为用户打标签
     * @method POST
     * @link
     *  https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging?access_token=ACCESS_TOKEN
     */
    public batchTaggingMembersTag() { }

    /**
     * @description
     * 批量为用户取消标签
     * @method POST
     * @link
     *  https://api.weixin.qq.com/cgi-bin/tags/members/batchuntagging?access_token=ACCESS_TOKEN
     */
    public batchUntaggingMembersTag() { }

    /**
     * @description
     * 获取用户身上的标签列表
     * @method POST
     * @link
     * https://api.weixin.qq.com/cgi-bin/tags/getidlist?access_token=ACCESS_TOKEN
     */
    public getIdListTags() { }

    /**
     * @description
     * 获取用户基本信息
     * @method GET
     * @link
     * GET https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
     */
    public getUserInfo(openid: string) {
        return this.get<GetUserInfoRes>("user/info", {
            openid,
            lang: "zh_CN"
        })
    }

    /**
     * @description
     * 批量获取用户基本信息
     * @method POST
     * @link
     *  https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=ACCESS_TOKEN
     */
    public batchGetUserInfo() { }


}
