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

namespace HETSAPI.Models
{
    /// <summary>
    /// A named entity that is used to create a arbitrary collection of users into a group. For example, the HETS Clerks are in the group Clerks. Groups, like permissions are defined by and referenced in code.
    /// </summary>
        [MetaDataExtension (Description = "A named entity that is used to create a arbitrary collection of users into a group. For example, the HETS Clerks are in the group Clerks. Groups, like permissions are defined by and referenced in code.")]

    public partial class Group : AuditableEntity, IEquatable<Group>
    {
        /// <summary>
        /// Default constructor, required by entity framework
        /// </summary>
        public Group()
        {
            this.Id = 0;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Group" /> class.
        /// </summary>
        /// <param name="Id">A system-generated unique identifier for a Group (required).</param>
        /// <param name="Name">The name of the group, as refenced in the code. (required).</param>
        /// <param name="Description">A description of the group that is presented to the user when they are setting a user into a group. (required).</param>
        public Group(int Id, string Name, string Description)
        {   
            this.Id = Id;
            this.Name = Name;
            this.Description = Description;


        }

        /// <summary>
        /// A system-generated unique identifier for a Group
        /// </summary>
        /// <value>A system-generated unique identifier for a Group</value>
        [MetaDataExtension (Description = "A system-generated unique identifier for a Group")]
        public int Id { get; set; }
        
        /// <summary>
        /// The name of the group, as refenced in the code.
        /// </summary>
        /// <value>The name of the group, as refenced in the code.</value>
        [MetaDataExtension (Description = "The name of the group, as refenced in the code.")]
        [MaxLength(150)]
        
        public string Name { get; set; }
        
        /// <summary>
        /// A description of the group that is presented to the user when they are setting a user into a group.
        /// </summary>
        /// <value>A description of the group that is presented to the user when they are setting a user into a group.</value>
        [MetaDataExtension (Description = "A description of the group that is presented to the user when they are setting a user into a group.")]
        [MaxLength(2048)]
        
        public string Description { get; set; }
        
        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class Group {\n");
            sb.Append("  Id: ").Append(Id).Append("\n");
            sb.Append("  Name: ").Append(Name).Append("\n");
            sb.Append("  Description: ").Append(Description).Append("\n");
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
            return Equals((Group)obj);
        }

        /// <summary>
        /// Returns true if Group instances are equal
        /// </summary>
        /// <param name="other">Instance of Group to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(Group other)
        {

            if (ReferenceEquals(null, other)) { return false; }
            if (ReferenceEquals(this, other)) { return true; }

            return                 
                (
                    this.Id == other.Id ||
                    this.Id.Equals(other.Id)
                ) &&                 
                (
                    this.Name == other.Name ||
                    this.Name != null &&
                    this.Name.Equals(other.Name)
                ) &&                 
                (
                    this.Description == other.Description ||
                    this.Description != null &&
                    this.Description.Equals(other.Description)
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
                                   
                hash = hash * 59 + this.Id.GetHashCode();                if (this.Name != null)
                {
                    hash = hash * 59 + this.Name.GetHashCode();
                }                
                                if (this.Description != null)
                {
                    hash = hash * 59 + this.Description.GetHashCode();
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
        public static bool operator ==(Group left, Group right)
        {
            return Equals(left, right);
        }

        /// <summary>
        /// Not Equals
        /// </summary>
        /// <param name="left"></param>
        /// <param name="right"></param>
        /// <returns></returns>
        public static bool operator !=(Group left, Group right)
        {
            return !Equals(left, right);
        }

        #endregion Operators
    }
}
