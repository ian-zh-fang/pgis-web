﻿using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.Linq;
using System.Text;
using System.Web;

namespace COM.TIGER.PGIS.Web
{
    public class PageBase : System.Web.UI.Page
    {
        protected const string CONFIGPATH = "Config\\";
        //文件物理路径
        protected string MapPth
        {
            get { return string.Format("{0}", HttpContext.Current.Server.MapPath("/")); }
        }

        protected CompositionContainer _container;
        protected StringBuilder sb = new StringBuilder();
        protected HttpRequest Request
        {
            get { return HttpContext.Current.Request; }
        }

        /// <summary>
        /// 分页数据，当前页码
        /// </summary>
        protected int CurrentPage = 0;
        /// <summary>
        /// 分页数据，每页条目数
        /// </summary>
        protected int PagerSize = 10;

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
        }

        protected void InitContainer()
        {
            var catalog = new AggregateCatalog();
            catalog.Catalogs.Add(new DirectoryCatalog(MapPath("~/Plugins")));
            _container = new CompositionContainer(catalog);
            try
            {
                this._container.ComposeParts(this);
            }
            catch (CompositionException compositionException)
            {
                Console.WriteLine(compositionException.ToString());
            }
        }

        protected void InitContainer(HttpContext context)
        {
            var catalog = new AggregateCatalog();
            catalog.Catalogs.Add(new DirectoryCatalog(context.Server.MapPath("~/Plugins")));
            _container = new CompositionContainer(catalog);
            try
            {
                this._container.ComposeParts(this);
            }
            catch (CompositionException compositionException)
            {
                Console.WriteLine(compositionException.ToString());
            }
            GetPagerIndexAndSize(context);
        }

        /// <summary>
        /// 获取数据分页参数
        /// <para>1，当前页码</para>
        /// <para>2，每页条目数</para>
        /// </summary>
        /// <param name="context"></param>
        private void GetPagerIndexAndSize(HttpContext context)
        {
            var indexname = "start";
            var sizename = "limit";
            int index = context.Request[indexname] == null ? 0 : Convert.ToInt32(context.Request[indexname]);
            int size = context.Request[sizename] == null? 0 : Convert.ToInt32(context.Request[sizename]);
            CurrentPage = 0;
            if (size > 0)
                CurrentPage = index / size + 1;
            PagerSize = size;
        }

        /// <summary>
        /// 执行请求回发数据
        /// </summary>
        /// <param name="context">请求上下文</param>
        /// <param name="obj">回发数据正文</param>
        protected void Execute(HttpContext context, object obj)
        {
            var result = GetResponseData(obj,false);
            ExecuteCore(result, context);
        }

        protected void Execute(HttpContext context, object obj, bool s)
        {
            var result = GetResponseData(obj, s);
            ExecuteCore(result, context);
        }

        protected void Execute(object result, bool serialiable = false)
        {
            if (serialiable)
            {
                ExecuteSerialzor(result);
                return;
            }

            ExecuteObj(result);
        }

        protected void ExecuteObj(object result, bool success = true, string message = "OKay", System.Web.HttpContext context = null)
        {
            var data = GetResponseData(result, message, success);
            ExecuteCore(data, context);
        }

        protected void ExecuteSerialzor(object result, System.Web.HttpContext context = null)
        {
            var data = Newtonsoft.Json.JsonConvert.SerializeObject(result);
            ExecuteCore(data, context);
        }

        protected void ExecuteCore(string result, System.Web.HttpContext context = null)
        {
            context = context ??  System.Web.HttpContext.Current;
            //context.Response.ContentType = "text/plain";
            context.Response.ContentType = "text/html";
            context.Response.Write(result);
        }

        /// <summary>
        /// 获取发送数据的字符串
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        private string GetResponseData(object obj,bool s)
        {
            var flg = true;
            var msg = "OK";
            //object result = null;
            if (s)
            {
               return Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            }
            var o = new { success = flg, msg = msg, result = obj };
            return Newtonsoft.Json.JsonConvert.SerializeObject(o);
        }

        private string GetResponseData(object result, string message, bool success)
        {
            var obj = new { success = success, msg = message, result = result };
            return Newtonsoft.Json.JsonConvert.SerializeObject(obj);
        }

        /// <summary>
        /// 获取查询参数
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        protected T GetQueryParamsCollection<T>() where T : new()
        {
            return GetQueryParamsCollection<T>(new T());
        }

        /// <summary>
        /// 获取查询参数
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns></returns>
        protected T GetQueryParamsCollection<T>(T t) where T : new()
        {
            t = GetQueryParams<T>(t);
            t = GetFormParams<T>(t);
            return t;
        }

        /// <summary>
        /// 获取System.Collections.Specialized.NameValueCollection中的查询信息
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        private T GetQueryParamsCollection<T>(T t, System.Collections.Specialized.NameValueCollection args) where T:new()
        {
            if (args.Count == 0) return t;

            var properties = t.GetType().GetProperties();
            foreach (var kp in args.AllKeys)
            {
                var p = properties.FirstOrDefault(x => x.Name.Trim().ToLower() == kp.Trim().ToLower());
                if (!string.IsNullOrWhiteSpace(args[kp]) && p != null && p.CanWrite)
                {
                    var o = ParseObject(p.PropertyType, args[kp]);
                    p.SetValue(t, o, null);
                }
            }
            return t;
        }

        /// <summary>
        /// 获取URL中的查询数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns></returns>
        private T GetQueryParams<T>(T t) where T : new()
        {
            var args = System.Web.HttpContext.Current.Request.QueryString;
            return GetQueryParamsCollection<T>(t, args);
        }

        /// <summary>
        /// 获取FORM表单中的查询信息
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns></returns>
        private T GetFormParams<T>(T t) where T : new()
        {
            var args = System.Web.HttpContext.Current.Request.Form;
            return GetQueryParamsCollection<T>(t, args);
        }

        /// <summary>
        /// 调用Parse(string)方法将string数据类型转换成其他数据类型
        /// <para>如果需要转换的类型为string类型，将直接返回原数据</para>
        /// <para>如果需要转换的类型为非string类型，将调用Parse(string)方法转换数据，并返回新类型的数据</para>
        /// <para>如果需要转换的类型，或者继承类型中不存在Parse(string)方法，将抛出异常System.ArgumentNullException</para>
        /// </summary>
        /// <param name="t">需要转换的类型</param>
        /// <param name="value">需要转换的值</param>
        /// <returns></returns>
        private object ParseObject(Type tp, string value)
        {
            if (tp == typeof(string)) return value;

            //判断类型是否可以为空。
            //  如果可以为空那么返回不可以为空的Type，否者返回原Type
            if (tp.IsGenericType && (tp.GetGenericTypeDefinition() == typeof(Nullable) || tp.GetGenericTypeDefinition() == typeof(Nullable<>)))
            {
                tp = tp.GetGenericArguments()[0];
            }
            //转换数据
            //  调用Parse方法直接转换
            var m = tp.GetMethod("Parse", new Type[] { typeof(string) });
            if (m == null) throw new ArgumentNullException("getmethod", "Parse(string)方法不存在，无法转换数据");

            var o = m.Invoke(null, new object[] { value });
            return o;
        }

        /// <summary>
        /// 保存文件到指定的相对路径
        /// <para>如果没有指定相对路径，那么保存站点根目录底下的Uploads文件根目录底下</para>
        /// </summary>
        /// <param name="file">需要保存的路径</param>
        /// <param name="path">需要指定的相对路径</param>
        /// <returns></returns>
        protected FileInfoExtention SaveFile(HttpPostedFile file, string path = null)
        {
            var c = HttpContext.Current;
            var root = c.Server.MapPath("/");
            return new FileInfoExtention().SaveAs(file, string.Format("{0}Uploads\\{1}", root, path));
        }

        /// <summary>
        /// 保存文件到指定的路径，并返回当前文件的基本信息
        /// </summary>
        /// <param name="file"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        protected FileInfoExtention SaveFileAt(HttpPostedFile file, string path)
        {
            var c = HttpContext.Current;
            var root = c.Server.MapPath("/");
            return new FileInfoExtention().SaveAs(file, string.Format("{0}{1}", root, path));
        }

        /// <summary>
        /// 下载指定文件
        /// </summary>
        /// <param name="e"></param>
        protected void DownLoadFile(Model.MFile e)
        {
            var filepath = string.Format("{0}{1}{2}.{3}", HttpContext.Current.Server.MapPath("/"), e.Path, e.Name, e.Suffix).Replace("\\\\", "\\");
            Common.File.FileDownload.HttpDownLoad(string.Format("{0}.{1}", e.Alias, e.Suffix), filepath);
        }

        /// <summary>
        /// 移除指定的文件
        /// </summary>
        /// <param name="files"></param>
        /// <returns></returns>
        protected int RemoveDocument(params Model.MFile[] files)
        {
            if (files.Length == 0) return 0;

            var c = HttpContext.Current;
            var root = c.Server.MapPath("/");
            var fileNames = (from t in files select string.Format("{0}{1}{2}.{3}", root, t.Path, t.Name, t.Suffix)).ToArray();
            return RemoveDocument(fileNames);
        }

        /// <summary>
        /// 修改 Cookie 的值
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="value">值</param>
        protected void SetCookieValue(string key, string value) 
        {
            var cookie = GetCurrentCookie();
            cookie.Values.Set(key, value);
            HttpContext.Current.Response.AppendCookie(cookie);
        }

        /// <summary>
        /// 修改 Cookie 值 
        /// </summary>
        /// <param name="value"></param>
        protected void SetCookieValue(string value)
        {
            var cookie = GetCurrentCookie();
            cookie.Value = value;
            HttpContext.Current.Response.AppendCookie(cookie);
        }

        /// <summary>
        /// 获取当前 Cookie
        /// </summary>
        /// <returns></returns>
        protected HttpCookie GetCurrentCookie()
        {
            return HttpContext.Current.Request.Cookies[System.Web.Security.FormsAuthentication.FormsCookieName];
        }

        /// <summary>
        /// 获取 FORM 认证票据
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        protected System.Web.Security.FormsAuthenticationTicket GetTicket(Model.MUser user)
        {
            var userStr = Newtonsoft.Json.JsonConvert.SerializeObject(user);
            var timeout = double.Parse(System.Configuration.ConfigurationManager.AppSettings["cookietimeout"]);
            var ticket = new System.Web.Security.FormsAuthenticationTicket(1, user.Name, DateTime.Now, DateTime.Now.AddMinutes(timeout), false, userStr);
            return ticket;
        }

        /// <summary>
        /// 获取 FORM 认证票据
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        protected string GetTicketString(Model.MUser user)
        {
            var ticket = GetTicket(user);
            var ticketStr = System.Web.Security.FormsAuthentication.Encrypt(ticket);
            return ticketStr;
        }

        /// <summary>
        /// 移除指定的文件
        /// </summary>
        /// <param name="fileNames"></param>
        /// <returns></returns>
        private int RemoveDocument(params string[] fileNames)
        {
            var result = 0;
            if (fileNames.Length == 0) return result;
            for (var i = 0; i < fileNames.Length; i++)
            {
                var filename = fileNames[i];
                if (string.IsNullOrEmpty(filename)) continue;
                System.IO.File.Delete(filename);
                result++;
            }
            return result;
        }

        /// <summary>
        /// 文件内容
        /// </summary>
        public class FileInfoExtention
        {
            /// <summary>
            /// 文件原名称
            /// </summary>
            public string Name { get; set; }

            private string _alias = Guid.NewGuid().ToString();
            /// <summary>
            /// 文件名称被加密后的名称，文件以加密后的名称保存到指定的路径
            /// </summary>
            public string Alias { get { return _alias; } set { _alias = value; } }

            /// <summary>
            /// 文件大小，单位为byte
            /// </summary>
            public int Size { get; set; }

            /// <summary>
            /// 文件类型，表示为文件后缀
            /// </summary>
            public string Suffix { get; set; }

            /// <summary>
            /// 保存文件到指定的相对路径
            /// <para>如果没有指定相对路径，那么保存站点根目录底下的Uploads文件根目录底下</para>
            /// </summary>
            /// <param name="file">需要保存的路径</param>
            /// <param name="path">需要指定的相对路径</param>
            /// <returns></returns>
            public FileInfoExtention SaveAs(HttpPostedFile file, string path)
            {
                if (file != null && file.ContentLength > 0 && !string.IsNullOrEmpty(path))
                {
                    try
                    {
                        if (!System.IO.Directory.Exists(path))
                            System.IO.Directory.CreateDirectory(path);
                        var suffixs = file.FileName.Split(new char[] { '.' }, StringSplitOptions.RemoveEmptyEntries);
                        var suffix = suffixs.Length > 0 ? suffixs[suffixs.Length - 1] : "";
                        var filename = string.Format("{0}\\{1}.{2}", path, this.Alias, suffix);
                        file.SaveAs(filename);
                        var index = file.FileName.LastIndexOf('.');
                        this.Name = file.FileName.Remove(index < 0 ? file.FileName.Length - 1 : index);
                        this.Size = file.ContentLength;
                        this.Suffix = suffix;
                    }
                    finally { }
                }
                return this;
            }
        }
    }
}