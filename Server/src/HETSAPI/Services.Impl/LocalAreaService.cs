/*
 * REST API Documentation for the MOTI Hired Equipment Tracking System (HETS) Application
 *
 * The Hired Equipment Program is for owners/operators who have a dump truck, bulldozer, backhoe or  other piece of equipment they want to hire out to the transportation ministry for day labour and  emergency projects.  The Hired Equipment Program distributes available work to local equipment owners. The program is  based on seniority and is designed to deliver work to registered users fairly and efficiently  through the development of local area call-out lists. 
 *
 * OpenAPI spec version: v1
 * 
 * 
 */

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using HETSAPI.Models;
using HETSAPI.ViewModels;

namespace HETSAPI.Services.Impl
{
    /// <summary>
    /// 
    /// </summary>
    public class LocalAreaService : ILocalAreaService
    {
        private readonly DbAppContext _context;

        /// <summary>
        /// Create a service and set the database context
        /// </summary>
        public LocalAreaService(DbAppContext context)
        {
            _context = context;
        }

        private void AdjustRecord(LocalArea item)
        {
            // Adjust the record to allow it to be updated / inserted
            if (item.ServiceArea != null)
            {
                int servicearea_id = item.ServiceArea.Id;
                bool servicearea_exists = _context.ServiceAreas.Any(a => a.Id == servicearea_id);
                if (servicearea_exists)
                {
                    ServiceArea servicearea = _context.ServiceAreas.First(a => a.Id == servicearea_id);
                    item.ServiceArea = servicearea;
                }
                else
                {
                    item.ServiceArea = null;
                }
            }

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="items"></param>
        /// <response code="201">LocalArea created</response>
        public virtual IActionResult LocalAreasBulkPostAsync(LocalArea[] items)
        {
            if (items == null)
            {
                return new BadRequestResult();
            }
            foreach (LocalArea item in items)
            {
                AdjustRecord(item);

                // determine if this is an insert or an update            
                bool exists = _context.LocalAreas.Any(a => a.Id == item.Id);
                if (exists)
                {
                    _context.Update(item);
                }
                else
                {
                    _context.Add(item);
                }
            }
            // Save the changes
            _context.SaveChanges();
            return new NoContentResult();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <response code="200">OK</response>
        public virtual IActionResult LocalAreasGetAsync()
        {
            var result = _context.LocalAreas
        .Include(x => x.ServiceArea.District.Region)
        .ToList();
            return new ObjectResult(result);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">id of LocalArea to delete</param>
        /// <response code="200">OK</response>
        /// <response code="404">LocalArea not found</response>
        public virtual IActionResult LocalAreasIdDeletePostAsync(int id)
        {
            var result = "";
            return new ObjectResult(result);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">id of LocalArea to fetch</param>
        /// <response code="200">OK</response>
        /// <response code="404">LocalArea not found</response>
        public virtual IActionResult LocalAreasIdGetAsync(int id)
        {
            var result = "";
            return new ObjectResult(result);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">id of LocalArea to fetch</param>
        /// <param name="item"></param>
        /// <response code="200">OK</response>
        /// <response code="404">LocalArea not found</response>
        public virtual IActionResult LocalAreasIdPutAsync(int id, LocalArea item)
        {
            var result = "";
            return new ObjectResult(result);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="item"></param>
        /// <response code="201">LocalArea created</response>
        public virtual IActionResult LocalAreasPostAsync(LocalArea item)
        {
            var result = "";
            return new ObjectResult(result);
        }
    }
}
