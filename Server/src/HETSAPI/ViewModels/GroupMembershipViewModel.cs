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
    public partial class GroupMembershipViewModel : IEquatable<GroupMembershipViewModel>
    {
        /// <summary>
        /// Default constructor, required by entity framework
        /// </summary>
        public GroupMembershipViewModel()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="GroupMembershipViewModel" /> class.
        /// </summary>
        /// <param name="Active">Active (required).</param>
        /// <param name="GroupId">GroupId (required).</param>
        /// <param name="UserId">UserId (required).</param>
        /// <param name="Id">Id.</param>
        public GroupMembershipViewModel(bool Active, int GroupId, int UserId, int? Id = null)
        {   
            this.Active = Active;
            this.GroupId = GroupId;
            this.UserId = UserId;


            this.Id = Id;
        }

        /// <summary>
        /// Gets or Sets Active
        /// </summary>
        [DataMember(Name="active")]
        public bool Active { get; set; }

        /// <summary>
        /// Gets or Sets GroupId
        /// </summary>
        [DataMember(Name="groupId")]
        public int GroupId { get; set; }

        /// <summary>
        /// Gets or Sets UserId
        /// </summary>
        [DataMember(Name="userId")]
        public int UserId { get; set; }

        /// <summary>
        /// Gets or Sets Id
        /// </summary>
        [DataMember(Name="id")]
        public int? Id { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class GroupMembershipViewModel {\n");
            sb.Append("  Active: ").Append(Active).Append("\n");
            sb.Append("  GroupId: ").Append(GroupId).Append("\n");
            sb.Append("  UserId: ").Append(UserId).Append("\n");
            sb.Append("  Id: ").Append(Id).Append("\n");
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
            return Equals((GroupMembershipViewModel)obj);
        }

        /// <summary>
        /// Returns true if GroupMembershipViewModel instances are equal
        /// </summary>
        /// <param name="other">Instance of GroupMembershipViewModel to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(GroupMembershipViewModel other)
        {

            if (ReferenceEquals(null, other)) { return false; }
            if (ReferenceEquals(this, other)) { return true; }

            return                 
                (
                    this.Active == other.Active ||
                    this.Active.Equals(other.Active)
                ) &&                 
                (
                    this.GroupId == other.GroupId ||
                    this.GroupId.Equals(other.GroupId)
                ) &&                 
                (
                    this.UserId == other.UserId ||
                    this.UserId.Equals(other.UserId)
                ) &&                 
                (
                    this.Id == other.Id ||
                    this.Id != null &&
                    this.Id.Equals(other.Id)
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
                   
                hash = hash * 59 + this.Active.GetHashCode();
                                                   
                hash = hash * 59 + this.GroupId.GetHashCode();                                   
                hash = hash * 59 + this.UserId.GetHashCode();                if (this.Id != null)
                {
                    hash = hash * 59 + this.Id.GetHashCode();
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
        public static bool operator ==(GroupMembershipViewModel left, GroupMembershipViewModel right)
        {
            return Equals(left, right);
        }

        /// <summary>
        /// Not Equals
        /// </summary>
        /// <param name="left"></param>
        /// <param name="right"></param>
        /// <returns></returns>
        public static bool operator !=(GroupMembershipViewModel left, GroupMembershipViewModel right)
        {
            return !Equals(left, right);
        }

        #endregion Operators
    }
}
