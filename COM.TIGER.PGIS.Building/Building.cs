using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.Building
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IBuilding))]
    public class Building:IFun.IBuilding
    {
        private Dal.DBuilding _instance = new Dal.DBuilding();

        public Model.TotalClass<List<Model.MOwnerInfoEx>> PageBuildings(string name, int index, int size)
        {
            return _instance.PageBuildings(name, index, size);
        }
        
        public int AddStruct(Model.MParam e)
        {
            return _instance.AddStruct(e);
        }

        public int UpdateStruct(Model.MParam e)
        {
            return _instance.UpdateStruct(e);
        }

        public int DeleteStructs(params string[] ids)
        {
            return _instance.DeleteStructs(ids);
        }

        public int AddUseType(Model.MParam e)
        {
            return _instance.AddUseType(e);
        }

        public int UpdateUseType(Model.MParam e)
        {
            return _instance.UpdateUseType(e);
        }

        public int DeleteUseTypes(params string[] ids)
        {
            return _instance.DeleteUseTypes(ids);
        }

        public int AddProperty(Model.MParam e)
        {
            return _instance.AddProperty(e);
        }

        public int UpdateProperty(Model.MParam e)
        {
            return _instance.UpdateProperty(e);
        }

        public int DeleteProperties(params string[] ids)
        {
            return _instance.DeleteProperties(ids);
        }

        public List<Model.MParam> GetStructs()
        {
            return _instance.GetStructs();
        }

        public List<Model.MParam> GetUseTypes()
        {
            return _instance.GetUseTypes();
        }

        public List<Model.MParam> GetProperties()
        {
            return _instance.GetProperties();
        }
        
        public int AddOwnerInfo(Model.MOwnerInfoEx e)
        {
            return _instance.AddOwnerInfo(e);
        }

        public int UpdateOwnerInfo(Model.MOwnerInfoEx e)
        {
            return _instance.UpdateOwnerInfo(e);
        }

        public int DeleteOwnerInfos(params string[] ids)
        {
            return _instance.DeleteOwnerInfos(ids);
        }
        
        public int AddUnit(Model.MUnitEx e)
        {
            return _instance.AddUnit(e);
        }

        public int UpdateUnit(Model.MUnitEx e)
        {
            return _instance.UpdateUnit(e);
        }

        public int DeleteUnits(params string[] ids)
        {
            return _instance.DeleteUnits(ids);
        }
        
        public List<Model.MUnit> GetUnitsOnBuilding(params string[] ids)
        {
            return _instance.GetUnitsOnBuilding(ids);
        }
        
        public int AddRoom(Model.MRooms e)
        {
            return _instance.AddRoom(e);
        }

        public int UpdateRoom(Model.MRooms e)
        {
            return _instance.UpdateRoom(e);
        }

        public int DeleteRooms(params string[] ids)
        {
            return _instance.DeleteRooms(ids);
        }

        public List<Model.MRooms> GetRoomsOnUnit(string id)
        {
            return _instance.GetRoomsOnUnit(id);
        }
        
        public int AddPic(Model.MOwnerPic e)
        {
            return _instance.AddPic(e);
        }

        public int UpdatePic(Model.MOwnerPic e)
        {
            return _instance.UpdatePic(e);
        }

        public int DeletePics(params string[] ids)
        {
            return _instance.DeletePics(ids);
        }

        public List<Model.MOwnerPic> GetPics(string id)
        {
            return _instance.GetPics(id);
        }
        
        public List<Model.MParam> GetGenders()
        {
            return _instance.GetGenders();
        }

        public List<Model.MParam> GetLiveTypes()
        {
            return _instance.GetLiveTypes();
        }

        public List<Model.MParam> GetEducations()
        {
            return _instance.GetEducations();
        }

        public List<Model.MParam> GetProvinces()
        {
            return _instance.GetProvinces();
        }

        public List<Model.MParam> GetCities()
        {
            return _instance.GetCities();
        }

        public List<Model.MParam> GetPoliticalStatus()
        {
            return _instance.GetPoliticalStatus();
        }

        public List<Model.MParam> GetBloodTypes()
        {
            return _instance.GetBloodTypes();
        }

        public List<Model.MParam> GetSoldierStatus()
        {
            return _instance.GetSoldierStatus();
        }

        public List<Model.MParam> GetMarriageStatus()
        {
            return _instance.GetMarriageStatus();
        }

        public List<Model.MParam> GetPsychosisTypes()
        {
            return _instance.GetPsychosisTypes();
        }

        public List<Model.MParam> GetHRelation()
        {
            return _instance.GetHRelation();
        }
        
        public int AddPopulation(Model.MPopulationBasicInfoEx e)
        {
            return _instance.AddPopulation(e);
        }

        public int UpdatePopulation(Model.MPopulationBasicInfoEx e)
        {
            return _instance.UpdatePopulation(e);
        }

        public int DeletePopulations(params string[] ids)
        {
            return _instance.DeletePopulations(ids);
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetPopulationsOnBuilding(string id, int index, int size)
        {
            return _instance.GetPopulationsOnBuilding(id, index, size);
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetPopulationsOnUnit(string id, int index, int size)
        {
            return _instance.GetPopulationsOnUnit(id, index, size);
        }

        public List<Model.MPopulationBasicInfoEx> GetPopulationsOnRoom(string id)
        {
            return _instance.GetPopulationsOnRoom(id);
        }
        
        public List<Model.MPopulationBasicInfoEx> GetPopulationHRelation(string number)
        {
            return _instance.GetPopulationHRelation(number);
        }

        public List<Model.MTemporaryPopulation> GetTemporaryRecords(string id)
        {
            return _instance.GetTemporaryRecords(id);
        }

        public List<Model.MAbroadPerson> GetAbroadRecords(string id)
        {
            return _instance.GetAbroadRecords(id);
        }

        public List<Model.MCompanyEmployee> GetCompanyRecords(string number)
        {
            return _instance.GetCompanyRecords(number);
        }
        
        public Model.TotalClass<List<Model.MOwnerInfoEx>> PageBuildingOnNameAndAddr(string name, string addr, int index, int size)
        {
            return _instance.PageBuildingOnNameAndAddr(name, addr, index, size);
        }
        
        public List<Model.MRooms> GetRoomsOnBuilding(string id)
        {
            return _instance.GetRoomsOnBuilding(id);
        }

        public List<Model.MCompany> GetCompneysOnBuilding(string id)
        {
            return _instance.GetCompneysOnBuilding(id);
        }

        public List<Model.MCompany> GetCompneysOnUnit(string id)
        {
            return _instance.GetCompneysOnUnit(id);
        }
        
        public List<object> TotalPopAndCom(string id)
        {
            return _instance.TotalPopAndCom(id);
        }
        
        public List<Model.MCompany> GetCompanysOnRoom(string id)
        {
            return _instance.GetCompanysOnRoom(id);
        }
        
        public int CompanyAdd(string addr, string ids)
        {
            return _instance.CompanyAdd(addr, ids);
        }

        public int PopuAdd(string addr, string ids)
        {
            return _instance.PopuAdd(addr, ids);
        }
    }
}
