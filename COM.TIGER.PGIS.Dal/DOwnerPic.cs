using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DOwnerPic:DBase
    {
        /// <summary>
        /// 批量插入楼房图片
        /// </summary>
        /// <param name="files"></param>
        /// <returns></returns>
        public int InsertEntity(params Model.MFile[] files)
        {
            var v = Newtonsoft.Json.JsonConvert.SerializeObject(files);
            return Post<int>("InsertNewForJson", "OwnerPic", string.Format("v={0}", v)).Result;
        }
    }
}
