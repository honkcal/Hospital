using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;

namespace DTcms.EFAPI
{
    public class HospicalAPI
    {


        private static string APPID = "wxbf6291d5ea4aad91";
        private static string SECRET = "e77c796b819da973df9ca39b1a9a6c25";

        #region 骆驼鲁瓦页面数据呈现

        public static string get_channel_article_news()
        {
            using (var db = new HospitalEntities())
            {
                return Obj2Json(new
                {
                    data = (from t in db.dt_channel_article_news
                            where t.status != 2
                            orderby t.sort_id
                            select new
                            {
                                t.id,
                                t.title,
                                t.sub_title,
                                t.img_url,
                                zhaiyao = t.zhaiyao.Length <= 37 ? t.zhaiyao : t.zhaiyao.Substring(0, 37) + "...",
                                
                                t.is_hot,
                                t.add_time,
                                t.source,

                            })
                            .ToList(),
                    result = 1
                });
            }
        }
        public static string get_channel_article_news_detail(int id)
        {
            using (var db = new HospitalEntities())
            {
                var obj = (from t in db.dt_channel_article_news
                           orderby t.sort_id
                           where t.id == id
                           select new
                           {
                               t.id,
                               t.title,
                               t.sub_title,
                               t.img_url,
                               t.zhaiyao,
                               t.content,
                               t.update_time,
                               t.add_time,
                               t.is_hot,
                              
                               t.source,
                             
                           }).FirstOrDefault();
                var images = (from t in db.dt_article_albums
                              from c in db.dt_channel_article_news
                              where t.article_id == id && t.channel_id == c.channel_id && t.article_id == c.id
                              select new
                              {
                                  img_url = t.original_path.Replace("src=\"/upload", "src=\"http://guomengtech.com/upload")
                              }).ToList();
                return Obj2Json(new
                {
                    data = new
                    {
                        obj.id,
                        obj.title,
                        obj.sub_title,
                        obj.img_url,
                        obj.zhaiyao,
                        obj.update_time,
                        obj.add_time,
                        obj.is_hot,
                      
                        obj.source,
                         
                        content = obj.content.Replace("src=\"/upload", "src=\"http://guomengtech.com/upload"),
                        images
                    },
                    result = 1
                });
            }
        }



        public static string get_channel_article_goods()
        {
            using (var db = new HospitalEntities())
            {
                return Obj2Json(new
                {
                    data = (from t in db.dt_channel_article_goods
                            where t.status != 2
                            orderby t.sort_id
                            select new
                            {
                                t.id,
                                t.title,
                                t.sub_title,
                                t.img_url,
                                zhaiyao = t.zhaiyao.Length <= 37 ? t.zhaiyao : t.zhaiyao.Substring(0, 37) + "...",
                                t.is_hot,
                                t.source,
                                t.add_time,
                            })
                            .ToList(),
                    result = 1
                });
            }
        }
        public static string get_channel_article_goods_detail(int id)
        {
            using (var db = new HospitalEntities())
            {
                var obj = (from t in db.dt_channel_article_goods
                           orderby t.sort_id
                           where t.id == id
                           select new
                           {
                               t.id,
                               t.title,
                               t.sub_title,
                               t.img_url,
                               t.zhaiyao,
                               t.content,
                               t.update_time,
                               t.is_hot,
                               t.source,
                               t.add_time,
                           }).FirstOrDefault();
                var images = (from t in db.dt_article_albums
                              from c in db.dt_channel_article_goods
                              where t.article_id == id && t.channel_id == c.channel_id && t.article_id == c.id
                              select new
                              {
                                  img_url = t.original_path.Replace("src=\"/upload", "src=\"http://guomengtech.com/upload")
                              }).ToList();
                return Obj2Json(new
                {
                    data = new
                    {
                        obj.id,
                        obj.title,
                        obj.sub_title,
                        obj.img_url,
                        obj.zhaiyao,
                        obj.update_time,
                        obj.is_hot,
                        obj.source,
                        obj.add_time,
                        content = obj.content.Replace("src=\"/upload", "src=\"http://guomengtech.com/upload"),
                        images
                    },
                    result = 1
                });
            }
        }

        public static string get_channel_article_content()
        {
            using (var db = new HospitalEntities())
            {
                return Obj2Json(new
                {
                    data = (from t in db.dt_channel_article_content
                            where t.status != 2
                            orderby t.sort_id
                            select new
                            {
                                t.id,
                                t.title,
                                t.sub_title,
                                t.img_url,
                                t.zhaiyao,
                                t.is_hot,
                                t.content,
                                t.add_time,
                            }).ToList(),
                    result = 1
                });
            }
        }
        public static string get_channel_article_content_detail(int id)
        {
            using (var db = new HospitalEntities())
            {
                var obj = (from t in db.dt_channel_article_content
                           orderby t.sort_id
                           where t.id == id
                           select new
                           {
                               t.id,
                               t.title,
                               t.sub_title,
                               t.img_url,
                               t.zhaiyao,
                               t.content,
                               t.update_time,
                               t.add_time,
                           }).FirstOrDefault();
                var images = (from t in db.dt_article_albums
                              from c in db.dt_channel_article_content
                              where t.article_id == id && t.channel_id == c.channel_id && t.article_id == c.id

                              select new
                              {
                                  img_url = t.original_path.Replace("src=\"/upload", "src=\"http://guomengtech.com/upload")
                              }).ToList();
                return Obj2Json(new
                {
                    data = new
                    {
                        obj.id,
                        obj.title,
                        obj.sub_title,
                        obj.img_url,
                        obj.zhaiyao,
                        obj.update_time,
                        obj.add_time,
                        content = obj.content.Replace("src=\"/upload", "src=\"http://guomengtech.com/upload"),
                        images
                    },
                    result = 1
                });
            }
        }

        #endregion



        public static string getUnionId(string session_key, string iv, string encryptedData)
        {
            byte[] data = Convert.FromBase64String(encryptedData);
            RijndaelManaged rm = new RijndaelManaged();
            rm.Key = Convert.FromBase64String(session_key);
            rm.IV = Convert.FromBase64String(iv);
            rm.Mode = CipherMode.CBC;
            rm.Padding = PaddingMode.PKCS7;
            ICryptoTransform transform = rm.CreateDecryptor();
            byte[] buf = transform.TransformFinalBlock(data, 0, data.Length);
            string result = Encoding.UTF8.GetString(buf);

            return Obj2Json(new
            {
                data = new
                {
                    userinfo = JsonConvert.DeserializeObject<dynamic>(result)
                    //result_text,
                },
                result = 1
            });
        }


        public static string getOpenId(string code, string source)
        {
            string _appid = APPID;
            string _secret = SECRET;
            var request = (HttpWebRequest)WebRequest.Create("https://api.weixin.qq.com/sns/jscode2session" +
                "?appid=" + _appid + "&secret=" + _secret + "&js_code=" + code + "&grant_type=authorization_code");
            var response = (HttpWebResponse)request.GetResponse();
            using (var sr = new StreamReader(response.GetResponseStream()))
            {
                string responseString = sr.ReadToEnd();
                var obj = JsonConvert.DeserializeObject<dynamic>(responseString);
                var ret = new
                {
                    obj.unionid,
                    obj.openid,
                    obj,
                    result = 1
                };
                return Obj2Json(ret);
            }
        }

        public static string add_or_update_user(string openid, string unionid, string photo, int sex, string nickname,
    int age, string phone, string interest, float latitude, float longitude, float accuracy)
        {
            using (var db = new HospitalEntities())
            {
                dt_users user = null;
                if (openid != null && openid != "")
                {
                    user = db.dt_users.FirstOrDefault(s => s.openid == openid);
                    if (user == null)
                    {
                        user = new dt_users();
                        user.openid = openid;
                        user.unionid = unionid;
                        user.user_name = nickname;
                        user.password = "123";
                        user.group_id = 1;
                        user.status = 0;
                        user.avatar = photo;
                        user.sex = sex.ToString();
                        user.age = age;
                        user.mobile = phone;
                        user.interest = interest;
                        user.latitude = latitude;
                        user.longitude = longitude;
                         
                        user.reg_time = DateTime.Now;
                        user.GetAddress();
                        db.dt_users.Add(user);
                    }
                    else
                    {
                        if (unionid != null && unionid != "") user.unionid = unionid;
                        if (photo != null && photo != "") user.avatar = photo;
                        if (sex != -1) user.sex = sex.ToString();
                        if (nickname != null && nickname != "") user.user_name = nickname;
                        if (age != -1) user.age = age;
                        if (phone != null && phone != "") user.mobile = phone;
                        if (interest != null && interest != "") user.interest = interest;
                        if (latitude != -1) user.latitude = latitude;
                        if (longitude != -1) user.longitude = longitude;
                        
                        user.GetAddress();
                    }
                    db.SaveChanges();
                }

                return Obj2Json(new
                {
                    user,
                    result = 1
                });
            }
        }

        private static string Obj2Json(object ret)
        {
            IsoDateTimeConverter iso = new IsoDateTimeConverter();
            iso.DateTimeFormat = "yyyy-MM-dd HH:mm:ss";
            return JsonConvert.SerializeObject(ret, iso);
        }
    }

    public partial class dt_users
    {
        public void GetAddress()
        {
            var translate = (HttpWebRequest)WebRequest.Create("http://apis.map.qq.com/ws/coord/v1/translate?locations=" +
                latitude.ToString() + "," + longitude.ToString() + "&type=1&key=I7WBZ-Z4DWJ-EYCFX-K6XIC-R65E3-HJFQD");
            var response1 = (HttpWebResponse)translate.GetResponse();
            using (var sr1 = new StreamReader(response1.GetResponseStream()))
            {
                string responseString = sr1.ReadToEnd();
                var obj = JsonConvert.DeserializeObject<dynamic>(responseString);
                int status = obj.status;
                if (status == 0)
                {
                    latitude = obj.locations[0].lat;
                    longitude = obj.locations[0].lng;
                }
            }
            var request = (HttpWebRequest)WebRequest.Create("http://apis.map.qq.com/ws/geocoder/v1/?location=" +
                latitude.ToString() + "," + longitude.ToString() + "&coord_type=1&key=I7WBZ-Z4DWJ-EYCFX-K6XIC-R65E3-HJFQD");
            var response = (HttpWebResponse)request.GetResponse();
            using (var sr = new StreamReader(response.GetResponseStream()))
            {
                string responseString = sr.ReadToEnd();
                var obj = JsonConvert.DeserializeObject<dynamic>(responseString);
                int status = obj.status;
                if (status == 0)
                {
                    address = obj.result.address;
                    //address_component = obj.result.address_component.ToString();
                }
            }
        }
    }
}
