using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DPopulation:DBase
    {
        private const string CONTROLNAME = "Population";

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetSYPopulation(string name, string addr, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MPopulationBasicInfoEx>>>("PagingEntities", CONTROLNAME,
                string.Format("name={0}", name),
                string.Format("address={0}", addr),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetSYPopulation(string name, string addr, string cardno, string aliasename, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MPopulationBasicInfoEx>>>("PagingEntities", CONTROLNAME,
                string.Format("name={0}", name),
                string.Format("address={0}", addr),
                string.Format("cardno={0}", cardno),
                string.Format("aliasename={0}", aliasename),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetCKPopulation(string name, string addr, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MPopulationBasicInfoEx>>>("PagingCZ", CONTROLNAME,
                string.Format("name={0}", name),
                string.Format("address={0}", addr),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetZAKPopulation(string name, string cno, string hname, string addr, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MPopulationBasicInfoEx>>>("PagingZZ", CONTROLNAME,
                string.Format("name={0}", name),
                string.Format("cardno={0}", cno),
                string.Format("houseoldname={0}", hname),
                string.Format("houseoldtel={0}", string.Empty),
                string.Format("address={0}", addr),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetJWPopulation(string cname, string fname, string lname, string visaid, string portid, string addr, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MPopulationBasicInfoEx>>>("PagingJW", CONTROLNAME,
                string.Format("name={0}", cname),
                string.Format("firstname={0}", fname),
                string.Format("lastname={0}", lname),
                string.Format("countryid={0}", 0),
                string.Format("cardtypeid={0}", 0),
                string.Format("cardtypeno={0}", string.Empty),
                string.Format("visatypeid={0}", string.IsNullOrWhiteSpace(visaid) ? "0" : visaid),
                string.Format("visano={0}", string.Empty),
                string.Format("entryport={0}", portid),
                string.Format("address={0}", addr),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetZHKPopulation(string name, string typeid, string addr, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MPopulationBasicInfoEx>>>("PagingZD", CONTROLNAME,
                string.Format("name={0}", name),
                string.Format("importtypeid={0}", typeid),
                string.Format("address={0}", addr),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.MPopulationBasicInfoEx GetPopulationOnCode(string code)
        {
            return Post<Model.MPopulationBasicInfoEx>("GetEntity", CONTROLNAME, string.Format("cardno={0}", code)).Result;
        }

        public List<Model.Maptheme> GetGroupByOwnerinfo(string x1, string y1, string x2, string y2, string mod)
        {
            return Post<List<Model.Maptheme>>("GetGroupByOwnerinfo", CONTROLNAME,
                string.Format("x1={0}", x1),
                string.Format("y1={0}", y1),
                string.Format("x2={0}", x2),
                string.Format("y2={0}", y2),
                string.Format("mod={0}", mod)).Result;
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> PagePopulation(string query, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MPopulationBasicInfoEx>>>("PagePopulation", CONTROLNAME,
                string.Format("query={0}", query),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.MElementHot LoactionPopu(string addrid)
        {
            return Post<Model.MElementHot>("LoactionPopu", CONTROLNAME, string.Format("addrid={0}", addrid)).Result;
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetKXPopulation(string coords, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MPopulationBasicInfoEx>>>("GetKXPopulation", CONTROLNAME,
                string.Format("coords={0}", coords),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }
    }
}
