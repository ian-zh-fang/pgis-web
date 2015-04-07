using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using COM.TIGER.PGIS.Common.XML;

namespace COM.TIGER.PGIS.Dal
{
    public class Capture:DBase
    {
        protected CaptureXMLConfig _xmlConfig = null;

        public Capture() { }
        public Capture(string path)
        {
            _xmlConfig = new CaptureXMLConfig(path);
        }

        public Model.TotalClass<List<Model.Capture>> Page(int index, int size)
        {
            var data = PagingEntities<Model.Capture>(index, size);
            var types = GetTypes();
            data.Data.ForEach(t => t.TypeInfo = types.FirstOrDefault(x => t.Type == x.ID));
            return data;
        }

        public List<Model.Capture> GetEntities()
        {
            return GetEntities<Model.Capture>();
        }

        public List<Model.CaptureType> GetCaptureForTree()
        {
            var captures = GetEntities();
            var types = GetTypes();
            types.ForEach(t => t.AddRange(captures));
            types.Sort();
            return types;
        }

        public List<Model.CaptureType> GetTypes()
        {
            return GetEntities<Model.CaptureType>();
        }

        public int InsertType(Model.CaptureType e)
        {
            return AddEntity<Model.CaptureType>(e);
        }

        public int UpdateType(Model.CaptureType e)
        {
            return UpdateEntity<Model.CaptureType>(e);
        }

        public int DeleteTypes(params string[] ids)
        {
            return DeleteEntities<Model.CaptureType>(ids);
        }
    }

    public class CaptureXMLConfig
    {
        /// <summary>
        /// XML文件配置节点名称
        /// </summary>
        protected const string NODENAME = "NType";

        /// <summary>
        /// 配置文件全路径信息
        /// </summary>
        protected readonly string _path = "";

        protected readonly Common.XML.XMLHandler _xmlHandler = null;

        public CaptureXMLConfig(string path)
        {
            _path = path;
            _xmlHandler = Common.XML.XMLHandler.CreateXML(path);
        }

        public List<Model.CaptureType> GetEntities()
        {
            return ParseEntities();
        }

        public void AppendElement(Model.CaptureType e)
        {
            //e.ID = Guid.NewGuid().ToString();
            var t = ParseElement(e);
            _xmlHandler.Root.AppendChild(t);
            _xmlHandler.Save();
        }

        public void UpdateElement(Model.CaptureType e)
        {
            var elements = _xmlHandler.Root.GetElements(new string[] { "ID" }, string.Format("{0}", e.ID));
            for (var i = 0; i < elements.Length; i++)
            {
                UpdateElement(elements[i], e);
            }
            _xmlHandler.Save();
        }

        public void DeleteElement(params string[] ids)
        {
            var elements = _xmlHandler.Root.GetElements(new string[] { "ID" }, ids);
            for (var i = 0; i < elements.Length; i++)
            {
                _xmlHandler.Root.RemoveChild(elements[i]);
            }
            _xmlHandler.Save();
        }

        protected void UpdateElement(System.Xml.XmlElement e, Model.CaptureType t)
        {
            var properties = GetProperties();
            for (var i = 0; i < properties.Length; i++)
            { 
                var property = properties[i];
                var val = string.Format("{0}", property.GetValue(t, null));
                e.SetAttribute(property.Name, val);
            }
        }

        protected System.Xml.XmlElement[] GetCfg()
        {
            return _xmlHandler.Root.GetElementsByTagName(NODENAME).ToArray<System.Xml.XmlElement>();
        }

        protected System.Xml.XmlElement[] GetCfg(params string[] attributeNames)
        {
            return _xmlHandler.Root.GetElements(attributeNames);
        }

        protected List<Model.CaptureType> ParseEntities()
        {
            var names = GetPropertyNames();
            //获取包含对象属性
            var items = GetCfg(names);
            var list = new List<Model.CaptureType>();
            for (var i = 0; i < items.Length; i++)
            {
                var t = ParseEntity(items[i]);
                list.Add(t);
            }
            return list;
        }

        protected Model.CaptureType ParseEntity(System.Xml.XmlElement e)
        {
            var t = new Model.CaptureType();
            var properties = GetProperties();
            for (var i = 0; i < properties.Length; i++)
            {
                var property = properties[i];
                var val = e.GetAttribute(property.Name);

                if (string.IsNullOrWhiteSpace(val))
                    continue;

                if (property.PropertyType == typeof(int))
                {
                    property.SetValue(t, int.Parse(val), null);
                    continue;
                }
                property.SetValue(t, val, null);
            }
            return t;
        }

        protected System.Xml.XmlElement ParseElement(Model.CaptureType e)
        {
            var t = _xmlHandler.Doc.CreateElement(NODENAME);
            var properties = GetProperties();
            for (var i = 0; i < properties.Length; i++)
            {
                var property = properties[i];
                t.SetAttribute(property.Name, string.Format("{0}", property.GetValue(e, null)));
            }
            return t;
        }

        /// <summary>
        /// 获取类型 COM.TIGER.PGIS.Model.CaptureType 没有标注 COM.TIGER.PGIS.Common.Attr.CaptureInfoAttribute 特性的属性
        /// <para>获取的属性必须具有 public 标识，并且同时具有 getter 和 setter 方法的</para>
        /// </summary>
        /// <returns></returns>
        protected System.Reflection.PropertyInfo[] GetProperties()
        {
            var properties = typeof(Model.CaptureType).GetProperties();
            //获取没有标注 COM.TIGER.PGIS.Common.Attr.CaptureInfoAttribute 特性的属性名称数组
            properties = (from t in properties where t.GetCustomAttributes(typeof(Common.Attr.CaptureInfoAttribute), false).Length == 0 select t).ToArray();
            return properties;
        }

        /// <summary>
        /// 获取类型 COM.TIGER.PGIS.Model.CaptureType 没有标注 COM.TIGER.PGIS.Common.Attr.CaptureInfoAttribute 特性的属性名称数组
        /// <para>获取的属性必须具有 public 标识，并且同时具有 getter 和 setter 方法的</para>
        /// </summary>
        /// <returns></returns>
        protected string[] GetPropertyNames()
        {
            var properties = GetProperties();
            //获取没有标注 COM.TIGER.PGIS.Common.Attr.CaptureInfoAttribute 特性的属性名称数组
            var names = (from t in properties select t.Name).ToArray();
            return names;
        }
    }
}
