using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using DTcms.Common;
using DTcms.EFAPI;
using System.Web.SessionState;

namespace DTcms.Web.tools
{
    /// <summary>
    /// hospital_api 的摘要说明
    /// </summary>
    public class hospital_api : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string action = DTRequest.GetFormString("action");
            switch (action)
            {
                #region  news related
                case "get_channel_article_news":
                    OutPut(context, HospicalAPI.get_channel_article_news());
                    break;
   
                case "get_channel_article_news_detail":
                    OutPut(context, HospicalAPI.get_channel_article_news_detail(
                        DTRequest.GetFormIntValue("id")));
                    break;
                #endregion
 
                #region content related
                case "get_channel_article_content":
                    OutPut(context, HospicalAPI.get_channel_article_content());
                    break;
                case "get_channel_article_content_detail":
                    OutPut(context, HospicalAPI.get_channel_article_content_detail(DTRequest.GetFormIntValue("id")));
                    break;
                #endregion
 
                #region others
                case "getOpenId":
                    OutPut(context, HospicalAPI.getOpenId(
                        DTRequest.GetFormString("code"),
                        DTRequest.GetFormString("source")));//不填source参数默认为罗托鲁瓦 kkl表示凯库拉
                    break;
                case "add_or_update_user":
                    OutPut(context, HospicalAPI.add_or_update_user(
                        DTRequest.GetFormString("openid"),
                        DTRequest.GetFormString("unionid"),
                        DTRequest.GetFormString("photo"),
                        DTRequest.GetFormIntValue("sex"),
                        DTRequest.GetFormString("nickname"),
                        DTRequest.GetFormIntValue("age"),
                        DTRequest.GetFormString("phone"),
                        DTRequest.GetFormString("interest"),
                        DTRequest.GetFormFloat("latitude", -1),
                        DTRequest.GetFormFloat("longitude", -1),
                        DTRequest.GetFormFloat("accuracy", -1)));
                    break;
                case "getUnionId":
                    OutPut(context, HospicalAPI.getUnionId(
                        DTRequest.GetFormString("session_key"),
                        DTRequest.GetFormString("iv"),
                        DTRequest.GetFormString("encryptedData")));
                    break;
              

                #endregion

                default:
                    OutPut(context, "not implement action : " + action);
                    break;
            }
        }

        private void OutPut(HttpContext context, string strContent)
        {
            context.Response.ContentEncoding = Encoding.UTF8;
            context.Response.ContentType = "application/json";
            context.Response.AddHeader("Access-Control-Allow-Origin", "*");
            context.Response.Write(strContent);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}