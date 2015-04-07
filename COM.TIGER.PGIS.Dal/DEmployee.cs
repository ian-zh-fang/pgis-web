using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    /// <summary>
    /// 从业人员信息处理模块
    /// </summary>
    public class DEmployee : DBase
    {
        private const string CONTROLLERNAME = "Employee";

        public Model.TotalClass<List<Model.MEmployee>> QueryEmployees(string name, string code, string addr, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MEmployee>>>("QueryEmployees", CONTROLLERNAME,
                string.Format("name={0}", name),
                string.Format("code={0}", code),
                string.Format("addr={0}", addr),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MEmployee>> GetEmployeesOnCompany(string id, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MEmployee>>>("GetEmployeesOnCompany", CONTROLLERNAME,
                   string.Format("id={0}", id),
                   string.Format("index={0}", index),
                   string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MEmployee>> GetQuitEmployeesOnCompany(string id, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MEmployee>>>("GetQuitEmployeesOnCompany", CONTROLLERNAME,
                   string.Format("id={0}", id),
                   string.Format("index={0}", index),
                   string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MEmployee>> QueryEmployeesOnCompany(string name, string code, string addr, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MEmployee>>>("QueryEmployeesOnCompany", CONTROLLERNAME,
                string.Format("name={0}", name),
                string.Format("code={0}", code),
                string.Format("addr={0}", addr),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MEmployee>> QueryEmployeesOnHotel(string name, string code, string addr, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MEmployee>>>("QueryEmployeesOnHotel", CONTROLLERNAME,
                string.Format("name={0}", name),
                string.Format("code={0}", code),
                string.Format("addr={0}", addr),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MEmployee>> GetEmployeesOnHotel(string id, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MEmployee>>>("GetEmployeesOnHotel", CONTROLLERNAME,
                   string.Format("id={0}", id),
                   string.Format("index={0}", index),
                   string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MEmployee>> GetQuitEmployeesOnHotel(string id, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MEmployee>>>("GetQuitEmployeesOnHotel", CONTROLLERNAME,
                   string.Format("id={0}", id),
                   string.Format("index={0}", index),
                   string.Format("size={0}", size)).Result;
        }
    }
}
