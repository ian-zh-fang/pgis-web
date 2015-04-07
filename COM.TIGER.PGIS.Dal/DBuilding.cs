using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using COM.TIGER.PGIS.Model;

namespace COM.TIGER.PGIS.Dal
{
    public class DBuilding : DBase
    {
        private const string CONTROLNAME = "Building";

        public Model.TotalClass<List<Model.MOwnerInfoEx>> PageBuildings(string name, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MOwnerInfoEx>>>("PagingBuildings", CONTROLNAME,
                string.Format("name={0}", name),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MOwnerInfoEx>> PageBuildingOnNameAndAddr(string name, string addr, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MOwnerInfoEx>>>("PagingBuildings", CONTROLNAME,
                string.Format("name={0}", name),
                string.Format("address={0}", addr),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public int AddOwnerInfo(Model.MOwnerInfoEx e)
        {
            return Post<int>("AddOwnerInfo", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdateOwnerInfo(Model.MOwnerInfoEx e)
        {
            return Post<int>("UpdateOwnerInfo", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeleteOwnerInfos(params string[] ids)
        {
            return Post<int>("DeleteOwnerInfos", CONTROLNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public int AddUnit(Model.MUnitEx e)
        {
            return Post<int>("AddUnit", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdateUnit(Model.MUnitEx e)
        {
            return Post<int>("UpdateUnit", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeleteUnits(params string[] ids)
        {
            return Post<int>("DeleteUnits", CONTROLNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public int AddStruct(Model.MParam e)
        {
            return Post<int>("AddStruct", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdateStruct(Model.MParam e)
        {
            return Post<int>("UpdateStruct", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeleteStructs(params string[] ids)
        {
            return Post<int>("DeleteStructs", CONTROLNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public int AddUseType(Model.MParam e)
        {
            return Post<int>("AddUseType", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdateUseType(Model.MParam e)
        {
            return Post<int>("UpdateUseType", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeleteUseTypes(params string[] ids)
        {
            return Post<int>("DeleteUseTypes", CONTROLNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public int AddProperty(Model.MParam e)
        {
            return Post<int>("AddProperty", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdateProperty(Model.MParam e)
        {
            return Post<int>("UpdateProperty", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeleteProperties(params string[] ids)
        {
            return Post<int>("DeleteProperties", CONTROLNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public int AddRoom(Model.MRooms e)
        {
            return Post<int>("AddRoom", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdateRoom(Model.MRooms e)
        {
            return Post<int>("UpdateRoom", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeleteRooms(params string[] ids)
        {
            return Post<int>("DeleteRooms", CONTROLNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public int AddPic(Model.MOwnerPic e)
        {
            return Post<int>("AddPic", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdatePic(Model.MOwnerPic e)
        {
            return Post<int>("UpdatePic", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeletePics(params string[] ids)
        {
            return Post<int>("DeletePics", CONTROLNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public List<Model.MOwnerPic> GetPics(string id)
        {
            return Post<List<Model.MOwnerPic>>("GetPics", CONTROLNAME, string.Format("id={0}", id)).Result;
        }

        public List<Model.MRooms> GetRoomsOnUnit(string id)
        {
            return Post<List<Model.MRooms>>("GetRoomsOnUnit", CONTROLNAME, string.Format("id={0}", id)).Result;
        }

        public List<Model.MParam> GetStructs()
        {
            return Post<List<Model.MParam>>("GetStructs", CONTROLNAME).Result;
        }

        public List<Model.MParam> GetUseTypes()
        {
            return Post<List<Model.MParam>>("GetUseTypes", CONTROLNAME).Result;
        }

        public List<Model.MParam> GetProperties()
        {
            return Post<List<Model.MParam>>("GetProperties", CONTROLNAME).Result;
        }

        public List<Model.MUnit> GetUnitsOnBuilding(params string[] ids)
        {
            return Post<List<Model.MUnit>>("GetUnitsOnBuilding", CONTROLNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public List<Model.MParam> GetGenders()
        {
            return Post<List<Model.MParam>>("GetGenders", "Params").Result;
        }

        public List<Model.MParam> GetLiveTypes()
        {
            return Post<List<Model.MParam>>("GetLiveTypes", "Params").Result;
        }

        public List<Model.MParam> GetEducations()
        {
            return Post<List<Model.MParam>>("GetEducations", "Params").Result;
        }

        public List<Model.MParam> GetProvinces()
        {
            return Post<List<Model.MParam>>("GetProvinces", "Params").Result;
        }

        public List<Model.MParam> GetCities()
        {
            return Post<List<Model.MParam>>("GetCities", "Params").Result;
        }

        public List<Model.MParam> GetPoliticalStatus()
        {
            return Post<List<Model.MParam>>("GetPoliticalStatus", "Params").Result;
        }

        public List<Model.MParam> GetBloodTypes()
        {
            return Post<List<Model.MParam>>("GetBloodTypes", "Params").Result;
        }

        public List<Model.MParam> GetSoldierStatus()
        {
            return Post<List<Model.MParam>>("GetSoldierStatus", "Params").Result;
        }

        public List<Model.MParam> GetMarriageStatus()
        {
            return Post<List<Model.MParam>>("GetMarriageStatus", "Params").Result;
        }

        public List<Model.MParam> GetPsychosisTypes()
        {
            return Post<List<Model.MParam>>("GetPsychosisTypes", "Params").Result;
        }

        public List<Model.MParam> GetHRelation()
        {
            return Post<List<Model.MParam>>("GetHRelation", "Params").Result;
        }
        
        public int AddPopulation(Model.MPopulationBasicInfoEx e)
        {
            return Post<int>("AddPopulation", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int UpdatePopulation(Model.MPopulationBasicInfoEx e)
        {
            return Post<int>("UpdatePopulation", CONTROLNAME, string.Format("v={0}", Newtonsoft.Json.JsonConvert.SerializeObject(e))).Result;
        }

        public int DeletePopulations(params string[] ids)
        {
            return Post<int>("DeletePopulations", CONTROLNAME, string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetPopulationsOnBuilding(string id, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MPopulationBasicInfoEx>>>("GetPopulationsOnBuilding", CONTROLNAME, 
                string.Format("id={0}", id),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetPopulationsOnUnit(string id, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MPopulationBasicInfoEx>>>("GetPopulationsOnUnit", CONTROLNAME,
                string.Format("id={0}", id),
                string.Format("index={0}", index),
                string.Format("size={0}", size)).Result;
        }

        public List<Model.MPopulationBasicInfoEx> GetPopulationsOnRoom(string id)
        {
            return Post<List<Model.MPopulationBasicInfoEx>>("GetPopulationsOnRoom", CONTROLNAME, string.Format("id={0}", id)).Result;
        }
        
        public List<Model.MPopulationBasicInfoEx> GetPopulationHRelation(string number)
        {
            return Post<List<Model.MPopulationBasicInfoEx>>("GetHouseOwner", CONTROLNAME, string.Format("n={0}", number)).Result;
        }

        public List<Model.MTemporaryPopulation> GetTemporaryRecords(string id)
        {
            return new List<MTemporaryPopulation>();
        }

        public List<Model.MAbroadPerson> GetAbroadRecords(string id)
        {
            return new List<MAbroadPerson>();
        }

        public List<Model.MCompanyEmployee> GetCompanyRecords(string number)
        {
            return new List<MCompanyEmployee>();
        }

        public List<Model.MRooms> GetRoomsOnBuilding(string id)
        {
            return Post<List<Model.MRooms>>("GetRoomsOnBuilding", CONTROLNAME, string.Format("id={0}", id)).Result;
        }

        public List<Model.MCompany> GetCompneysOnBuilding(string id)
        {
            return Post<List<Model.MCompany>>("GetCompneysOnBuilding", CONTROLNAME, string.Format("id={0}", id)).Result;
        }

        public List<Model.MCompany> GetCompneysOnUnit(string id)
        {
            return Post<List<Model.MCompany>>("GetCompneysOnUnit", CONTROLNAME, string.Format("id={0}", id)).Result;
        }

        public List<object> TotalPopAndCom(string id)
        {
            var sy = 0;//@  实有人口
            var cz = 0;//@  常住人口
            var zz = 0;//@  暂住人口
            var zd = 0;//@  重点人口
            var jw = 0;//@  境外人口
            var dw = 0;//@  单位数量

            var data = Post<List<Model.Pop>>("TotalPop", CONTROLNAME, string.Format("id={0}", id)).Result;
            foreach (var e in data)
            {
                switch (e.Type)
                {
                    case 1:
                        cz = e.Count;
                        sy += e.Count;
                        break;
                    case 2:
                        zz = e.Count;
                        sy += e.Count;
                        break;
                    case 3:
                        zd = e.Count;
                        sy += e.Count;
                        break;
                    case 4:
                        jw = e.Count;
                        sy += e.Count;
                        break;
                    default:
                        break;
                }
            }
            dw = GetCompneysOnBuilding(id).Count;

            return new List<object>() 
            {
                new {name="常口", count=cz},
                new {name="暂口", count=zz},
                new {name="重口", count=zd},
                new {name="境外", count=jw},
                new {name="人口总数", count=sy, flag = true},
                new {name="单位总数", count=dw, flag = true}
            };
        }

        public List<Model.MCompany> GetCompanysOnRoom(string id)
        {
            return Post<List<Model.MCompany>>("GetCompanysOnRoom", CONTROLNAME, string.Format("id={0}", id)).Result;
        }

        public int CompanyAdd(string addr, string ids)
        {
            return Post<int>("CompanyAdd", CONTROLNAME,
                string.Format("addr={0}", addr),
                string.Format("ids={0}", ids)).Result;
        }

        public int PopuAdd(string addr, string ids)
        {
            return Post<int>("PopuAdd", CONTROLNAME,
                string.Format("addr={0}", addr),
                string.Format("ids={0}", ids)).Result;
        }
    }
}
