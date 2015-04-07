using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;

namespace COM.TIGER.PGIS.Common.XML
{
    /// <summary>
    /// XML文件处理程序扩展
    /// </summary>
    public static class XMLHelper
    {
        /// <summary>
        /// 转换System.Xml.XmlNodeList类型到System.Xml.XmlNode[]
        /// </summary>
        /// <param name="collection">System.Xml.XmlNodeList类型实例</param>
        /// <returns></returns>
        public static XmlNode[] ToArray(this XmlNodeList collection)
        {
            return collection.ToArray<XmlNode>();
        }

        /// <summary>
        /// 转换System.Xml.XmlNodeList类型到System.Array
        /// </summary>
        /// <param name="collection">System.Xml.XmlNodeList类型实例</param>
        /// <returns></returns>
        public static T[] ToArray<T>(this XmlNodeList collection)
        {
            if (collection == null)
                throw new ArgumentNullException("collection");

            return collection.Cast<T>().ToArray();
        }
        
        /// <summary>
        /// 返回一个 System.Xml.XmlElement[]，它包含与指定 属性 和 属性值匹配 的所有子代元素的列表。
        /// <para>> 如果没有指定参数 attributes 的值，返回一个零长度的 System.Xml.XmlElement[]。参数 attributes 的值为NULL或者长度为 0，均表示没有指定 要匹配的属性组</para>
        /// <para>> 如果没有指定参数 attributesValue 的值，返回一个零长度的 System.Xml.XmlElement[]。参数 attributesValue 的长度为 0，表示没有指定 要匹配的属性组</para>
        /// <para>> 排除子代元素中没有包含指定属性的元素</para>
        /// <para>> 排除子代元素中包含了指定属性，并没有相匹配的属性的属性值</para>
        /// <para>> eg.&lt;root>&lt;tag t1="1" t2="2" t3="3" />&lt;tag t1="1" t2="2" t3="3" />&lt;tag t1="1" t2="2" t3="3" />&lt;/root></para>
        /// <para>> GetElements(new string[]{"t1"}, new string[]{"*"});返回元素包含属性”t1“的所有子代元素。”*“匹配属性的任意值</para>
        /// <para>> GetElements(new string[]{"t1"}, new string[]{"1", "*"});返回元素包含属性”t1“的所有子代元素。”*“匹配属性的任意值</para>
        /// <para>> GetElements(new string[]{"t1"}, new string[]{"1", "2"});返回元素包含属性”t1“，并且该属性的值等于”1“或者”2“</para>
        /// <para>> GetElements(new string[]{"t1", "t2"}, new string[]{"1", "2"});返回元素包含属性”t1“和”t2“，并且"t1"和"t2"的值等于”1“或者”2“</para>
        /// </summary>
        /// <param name="node">当前节点</param>
        /// <param name="attributes">要匹配的属性组</param>
        /// <param name="attributesValue">要匹配的属性组值。”*“是一个特殊值，匹配属性存在，并且属性值为任意的所有子代元素</param>
        /// <returns></returns>
        public static XmlElement[] GetElements(this XmlElement node, string[] attributes, params string[] attributesValue)
        {
            if (node == null)
                throw new ArgumentNullException("node", "节点不存在");

            if (attributes == null)
                return new XmlElement[0];

            if (attributes.Length == 0)
                return new XmlElement[0];

            if (attributesValue.Length == 0)
                return new XmlElement[0];

            //全局匹配属性，"*"匹配属性任意值
            var glob = attributesValue.FirstOrDefault(t => t.Trim() == "*") != default(string);
            //匹配属性和属性值
            var arr = node.ChildNodes.ToArray<XmlElement>().Where(t => 
            {
                var flag = true;
                for (var i = 0; i < attributes.Length; i++)
                {
                    //属性不存在，终止当前匹配
                    if (t.Attributes[attributes[i]] == null)
                    {
                        flag = false;
                        break;
                    }
                    //通配符”*“匹配任意值，匹配下一个属性
                    if (glob) continue;
                    //属性没有匹配的值，终止当前匹配
                    if (attributesValue.FirstOrDefault(x => x.Trim() == t.GetAttribute(attributes[i])) == null)
                    {
                        flag = false;
                        break;
                    }
                }
                return flag;
            }).ToArray();
            
            return arr;
        }

        /// <summary>
        /// 返回一个 System.Xml.XmlElement[]。它包含指定属性的子代元素列表。
        /// <para>不指定属性，则返回一个长度为零的System.Xml.XmlElement[]</para>
        /// </summary>
        /// <param name="node">当前节点</param>
        /// <param name="attributes">属性组</param>
        /// <returns></returns>
        public static XmlElement[] GetElements(this XmlElement node, params string[] attributes)
        {
            if (attributes.Length == 0)
                return new XmlElement[0];

            return node.ChildNodes.ToArray<XmlElement>().Where(t =>
            {
                bool flag = true;
                for (var i = 0; i < attributes.Length; i++)
                {
                    if (t.Attributes[attributes[i]] == null)
                    {
                        flag = false;
                        break;
                    }
                }
                return flag;
            }).ToArray();
        }
    }
}
