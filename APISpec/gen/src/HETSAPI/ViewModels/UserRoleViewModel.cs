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
using System.Linq;
using System.IO;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using HETSAPI.Models;

namespace HETSAPI.ViewModels
{
    /// <summary>
    /// 
    /// </summary>
    [DataContract]
    public partial class UserRoleViewModel : IEquatable<UserRoleViewModel>
    {
        /// <summary>
        /// Default constructor, required by entity framework
        /// </summary>
        public UserRoleViewModel()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="UserRoleViewModel" /> class.
        /// </summary>
        /// <param name="EffectiveDate">EffectiveDate (required).</param>
        /// <param name="UserId">UserId (required).</param>
        /// <param name="RoleId">RoleId (required).</param>
        /// <param name="Id">Id.</param>
        /// <param name="ExpiryDate">ExpiryDate.</param>
        public UserRoleViewModel(DateTime EffectiveDate, int UserId, int RoleId, int? Id = null, DateTime? ExpiryDate = null)
        {   
            this.EffectiveDate = EffectiveDate;
            this.UserId = UserId;
            this.RoleId = RoleId;


            this.Id = Id;
            this.ExpiryDate = ExpiryDate;
        }

        /// <summary>
        /// Gets or Sets EffectiveDate
        /// </summary>
        [DataMember(Name="effectiveDate")]
        public DateTime EffectiveDate { get; set; }

        /// <summary>
        /// Gets or Sets UserId
        /// </summary>
        [DataMember(Name="userId")]
        public int UserId { get; set; }

        /// <summary>
        /// Gets or Sets RoleId
        /// </summary>
        [DataMember(Name="roleId")]
        public int RoleId { get; set; }

        /// <summary>
        /// Gets or Sets Id
        /// </summary>
        [DataMember(Name="id")]
        public int? Id { get; set; }

        /// <summary>
        /// Gets or Sets ExpiryDate
        /// </summary>
        [DataMember(Name="expiryDate")]
        public DateTime? ExpiryDate { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class UserRoleViewModel {\n");
            sb.Append("  EffectiveDate: ").Append(EffectiveDate).Append("\n");
            sb.Append("  UserId: ").Append(UserId).Append("\n");
            sb.Append("  RoleId: ").Append(RoleId).Append("\n");
            sb.Append("  Id: ").Append(Id).Append("\n");
            sb.Append("  ExpiryDate: ").Append(ExpiryDate).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        /// <summary>
        /// Returns the JSON string presentation of the object
        /// </summary>
        /// <returns>JSON string presentation of the object</returns>
        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }

        /// <summary>
        /// Returns true if objects are equal
        /// </summary>
        /// <param name="obj">Object to be compared</param>
        /// <returns>Boolean</returns>
        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) { return false; }
            if (ReferenceEquals(this, obj)) { return true; }
            if (obj.GetType() != GetType()) { return false; }
            return Equals((UserRoleViewModel)obj);
        }

        /// <summary>
        /// Returns true if UserRoleViewModel instances are equal
        /// </summary>
        /// <param name="other">Instance of UserRoleViewModel to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(UserRoleViewModel other)
        {

            if (ReferenceEquals(null, other)) { return false; }
            if (ReferenceEquals(this, other)) { return true; }

            return                 
                (
                    this.EffectiveDate == other.EffectiveDate ||
                    this.EffectiveDate != null &&
                    this.EffectiveDate.Equals(other.EffectiveDate)
                ) &&                 
                (
                    this.UserId == other.UserId ||
                    this.UserId.Equals(other.UserId)
                ) &&                 
                (
                    this.RoleId == other.RoleId ||
                    this.RoleId.Equals(other.RoleId)
                ) &&                 
                (
                    this.Id == other.Id ||
                    this.Id != null &&
                    this.Id.Equals(other.Id)
                ) &&                 
                (
                    this.ExpiryDate == other.ExpiryDate ||
                    this.ExpiryDate != null &&
                    this.ExpiryDate.Equals(other.ExpiryDate)
                );
        }

        /// <summary>
        /// Gets the hash code
        /// </summary>
        /// <returns>Hash code</returns>
        public override int GetHashCode()
        {
            // credit: http://stackoverflow.com/a/263416/677735
            unchecked // Overflow is fine, just wrap
            {
                int hash = 41;
                // Suitable nullity checks
                   
                if (this.EffectiveDate != null)
                {
                    hash = hash * 59 + this.EffectiveDate.GetHashCode();
                }                                   
                hash = hash * 59 + this.UserId.GetHashCode();                                   
                hash = hash * 59 + this.RoleId.GetHashCode();                if (this.Id != null)
                {
                    hash = hash * 59 + this.Id.GetHashCode();
                }                
                                if (this.ExpiryDate != null)
                {
                    hash = hash * 59 + this.ExpiryDate.GetHashCode();
                }                
                
                return hash;
            }
        }

        #region Operators
        
        /// <summary>
        /// Equals
        /// </summary>
        /// <param name="left"></param>
        /// <param name="right"></param>
        /// <returns></returns>
        public static bool operator ==(UserRoleViewModel left, UserRoleViewModel right)
        {
            return Equals(left, right);
        }

        /// <summary>
        /// Not Equals
        /// </summary>
        /// <param name="left"></param>
        /// <param name="right"></param>
        /// <returns></returns>
        public static bool operator !=(UserRoleViewModel left, UserRoleViewModel right)
        {
            return !Equals(left, right);
        }

        #endregion Operators
    }
}
