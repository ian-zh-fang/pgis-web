using System;
using System.Collections.Generic;
using CommonHttp = COM.TIGER.PGIS.Common.Http;
using CommonAttr = COM.TIGER.PGIS.Common.Attr;
using COM.TIGER.PGIS.Model;

namespace COM.TIGER.PGIS.Dal
{
    public class DBase
    {
        /// <summary>
        /// 获取WEBAPI服务根地址
        /// </summary>
        /// <returns></returns>
        protected  virtual string GetWebApiUri()
        {
            try
            {
                return System.Configuration.ConfigurationManager.ConnectionStrings["WebApiUrl"].ConnectionString;
            }
            catch { return string.Empty; }
        }

        /// <summary>
        /// 获取资源服务器的请求地址。 
        /// </summary>
        /// <param name="action">操作名称。</param>
        /// <param name="controller">模块名称。</param>
        /// <param name="args">请求操作时需要的参数，如果需要的话。</param>
        /// <returns></returns>
        protected virtual string GetUrl(string action, string controller, params string[] args)
        {
            var urlroot = GetWebApiUri();
            if (string.IsNullOrEmpty(urlroot)) 
                throw new System.Configuration.ConfigurationErrorsException("no found config item.");

            var ret = string.Format("{0}{1}/{2}", urlroot, controller, action);
            if (args.Length > 0)
            {
                var param = string.Join("&", args);
                ret = string.Format("{0}?{1}", ret, param);
            }
            return ret;
        }

        /// <summary>
        /// 通过URL向资源服务请求数据。
        /// </summary>
        /// <typeparam name="T">执行结果返回的类型。</typeparam>
        /// <param name="action">请求数据的操作名称。</param>
        /// <param name="controller">请求数据的模块名称。</param>
        /// <param name="method">URL请求资源的方法。</param>
        /// <param name="args">请求数据的操作需要的参数，如果需要的话。</param>
        /// <returns></returns>
        protected CommonHttp.RequestHandler.RequestResult<T> Request<T>(string action, string controller,
            CommonHttp.RequestHandler.RequestMethod method, params string[] args)
            where T : new()
        {
            var url = GetUrl(action, controller, args);
            return Request<T>(url, method);
        }

        /// <summary>
        /// GET请求方式通过URL地址请求数据
        /// </summary>
        /// <typeparam name="T">执行结果返回的类型。</typeparam>
        /// <param name="action">请求数据的操作名称。</param>
        /// <param name="controller">请求数据的模块名称。</param>
        /// <param name="args">请求数据的操作需要的参数，如果需要的话。</param>
        /// <returns></returns>
        protected CommonHttp.RequestHandler.RequestResult<T> Get<T>(string action, string controller, params string[] args)
            where T : new()
        {
            return Request<T>(action, controller, CommonHttp.RequestHandler.RequestMethod.GET, args);
        }

        /// <summary>
        /// POST请求方式通过URL地址请求数据
        /// </summary>
        /// <typeparam name="T">执行结果返回的类型。</typeparam>
        /// <param name="action">请求数据的操作名称。</param>
        /// <param name="controller">请求数据的模块名称。</param>
        /// <param name="args">请求数据的操作需要的参数，如果需要的话。</param>
        /// <returns></returns>
        protected CommonHttp.RequestHandler.RequestResult<T> Post<T>(string action, string controller, params string[] args)
            where T : new()
        {
            return Request<T>(action, controller, CommonHttp.RequestHandler.RequestMethod.POST, args);
        }

        /// <summary>
        /// 通过URL地址请求数据
        /// </summary>
        /// <typeparam name="T">执行结果返回的类型</typeparam>
        /// <param name="url">远程API地址</param>
        /// <param name="method">REQUEST请求方式</param>
        /// <returns></returns>
        protected CommonHttp.RequestHandler.RequestResult<T> Request<T>(string url,
            CommonHttp.RequestHandler.RequestMethod method)
            where T : new()
        {
            return CommonHttp.RequestHandler.Handler.Execute<T>(url, method);
        }

        /// <summary>
        /// GET请求方式通过URL地址请求数据
        /// </summary>
        /// <typeparam name="T">执行结果返回的类型</typeparam>
        /// <param name="url">远程API地址</param>
        /// <returns></returns>
        protected CommonHttp.RequestHandler.RequestResult<T> Get<T>(string url) where T : new()
        {
            return Request<T>(url, CommonHttp.RequestHandler.RequestMethod.GET);
        }

        /// <summary>
        /// POST请求方式通过URL地址请求数据
        /// </summary>
        /// <typeparam name="T">执行结果返回的类型</typeparam>
        /// <param name="url">远程API地址</param>
        /// <returns></returns>
        protected CommonHttp.RequestHandler.RequestResult<T> Post<T>(string url) where T : new()
        {
            return Request<T>(url, CommonHttp.RequestHandler.RequestMethod.POST);
        }

        /// <summary>
        /// 获取远程控制器的数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        protected CommonAttr.RemoteControllerAttribute GetRemoteControllerAttribute<T>()
        { 
            var tp = typeof(T);
            var attr = tp.GetCustomAttributes(typeof(CommonAttr.RemoteControllerAttribute), false);
            if (attr.Length == 0) return null;
            return attr[0] as CommonAttr.RemoteControllerAttribute;
        }
        
        //================================================================
        //通用处理程序

        /// <summary>
        /// 获取所有数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public List<T> GetEntities<T>()
        {
            var attr = GetRemoteControllerAttribute<T>();
            var action = string.Format("Get{0}", attr.ModelName);
            return Post<List<T>>(action, attr.ControllerName).Result;
        }

        /// <summary>
        /// 分页获取数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="index">当前页码</param>
        /// <param name="size">每页显示条目数</param>
        /// <returns></returns>
        public TotalClass<List<T>> PagingEntities<T>(int index, int size)
        {
            var attr = GetRemoteControllerAttribute<T>();
            var action = string.Format("Paging{0}", attr.ModelName);
            return Post<TotalClass<List<T>>>(action, attr.ControllerName,
                string.Format("index={0}", index), string.Format("size={0}", size)).Result;
        }

        /// <summary>
        /// 添加新的记录
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns></returns>
        public int AddEntity<T>(T t)
        {
            var attr = GetRemoteControllerAttribute<T>();
            var action = "InsertNewForJson";
            var v = Newtonsoft.Json.JsonConvert.SerializeObject(t);
            return Post<int>(action, attr.ControllerName, string.Format("v={0}", v)).Result;
        }

        /// <summary>
        /// 更新指定的记录
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns></returns>
        public int UpdateEntity<T>(T t)
        {
            var attr = GetRemoteControllerAttribute<T>();
            var action = "UpdateNewJson";
            var v = Newtonsoft.Json.JsonConvert.SerializeObject(t);
            return Post<int>(action, attr.ControllerName, string.Format("v={0}", v)).Result;
        }

        /// <summary>
        /// 批量删除指定ID的记录信息
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="ids"></param>
        /// <returns></returns>
        public int DeleteEntities<T>(params string[] ids)
        {
            var attr = GetRemoteControllerAttribute<T>();
            var action = "DeleteEntities";
            var v = string.Join(",", ids);
            return Post<int>(action, attr.ControllerName, string.Format("ids={0}", v)).Result;
        }
    }

    public abstract class DBase<T> : DBase where T : new()
    {
        protected CommonHttp.RequestHandler.RequestResult<T> Request(string action, string controller,
            CommonHttp.RequestHandler.RequestMethod method, params string[] args)
        {
            return base.Request<T>(action, controller, method, args);
        }

        protected CommonHttp.RequestHandler.RequestResult<T> Get(string action, string controller, params string[] args)
        {
            return base.Get<T>(action, controller, args);
        }

        protected CommonHttp.RequestHandler.RequestResult<T> Post(string action, string controller, params string[] args)
        {
            return base.Post<T>(action, controller, args);
        }

        protected CommonHttp.RequestHandler.RequestResult<T> Request(string url, 
            CommonHttp.RequestHandler.RequestMethod method)
        {
            return base.Request<T>(url, method);
        }

        protected CommonHttp.RequestHandler.RequestResult<T> Get(string url)
        {
            return base.Get<T>(url);
        }

        protected CommonHttp.RequestHandler.RequestResult<T> Post(string url)
        {
            return base.Post<T>(url);
        }
    }
}
