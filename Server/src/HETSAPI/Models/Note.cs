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
    /// Text entered about an entity in the application - e.g. piece of Equipment, an Owner, a Project and so on.
    /// </summary>
        [MetaDataExtension (Description = "Text entered about an entity in the application - e.g. piece of Equipment, an Owner, a Project and so on.")]

    public partial class Note : AuditableEntity, IEquatable<Note>
    {
        /// <summary>
        /// Default constructor, required by entity framework
        /// </summary>
        public Note()
        {
            this.Id = 0;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Note" /> class.
        /// </summary>
        /// <param name="Id">A system-generated unique identifier for a Note (required).</param>
        /// <param name="Text">Notes entered by users about instance of entities - e.g. School Buses and School Bus Owners (required).</param>
        /// <param name="IsNoLongerRelevant">A user set flag that the note is no longer relevant. Allows the note to be retained for historical reasons,  but identified to other users as no longer applicable..</param>
        public Note(int Id, string Text, bool? IsNoLongerRelevant = null)
        {   
            this.Id = Id;
            this.Text = Text;

            this.IsNoLongerRelevant = IsNoLongerRelevant;
        }

        /// <summary>
        /// A system-generated unique identifier for a Note
        /// </summary>
        /// <value>A system-generated unique identifier for a Note</value>
        [MetaDataExtension (Description = "A system-generated unique identifier for a Note")]
        public int Id { get; set; }
        
        /// <summary>
        /// Notes entered by users about instance of entities - e.g. School Buses and School Bus Owners
        /// </summary>
        /// <value>Notes entered by users about instance of entities - e.g. School Buses and School Bus Owners</value>
        [MetaDataExtension (Description = "Notes entered by users about instance of entities - e.g. School Buses and School Bus Owners")]
        [MaxLength(2048)]
        
        public string Text { get; set; }
        
        /// <summary>
        /// A user set flag that the note is no longer relevant. Allows the note to be retained for historical reasons,  but identified to other users as no longer applicable.
        /// </summary>
        /// <value>A user set flag that the note is no longer relevant. Allows the note to be retained for historical reasons,  but identified to other users as no longer applicable.</value>
        [MetaDataExtension (Description = "A user set flag that the note is no longer relevant. Allows the note to be retained for historical reasons,  but identified to other users as no longer applicable.")]
        public bool? IsNoLongerRelevant { get; set; }
        
        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class Note {\n");
            sb.Append("  Id: ").Append(Id).Append("\n");
            sb.Append("  Text: ").Append(Text).Append("\n");
            sb.Append("  IsNoLongerRelevant: ").Append(IsNoLongerRelevant).Append("\n");
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
            return Equals((Note)obj);
        }

        /// <summary>
        /// Returns true if Note instances are equal
        /// </summary>
        /// <param name="other">Instance of Note to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(Note other)
        {

            if (ReferenceEquals(null, other)) { return false; }
            if (ReferenceEquals(this, other)) { return true; }

            return                 
                (
                    this.Id == other.Id ||
                    this.Id.Equals(other.Id)
                ) &&                 
                (
                    this.Text == other.Text ||
                    this.Text != null &&
                    this.Text.Equals(other.Text)
                ) &&                 
                (
                    this.IsNoLongerRelevant == other.IsNoLongerRelevant ||
                    this.IsNoLongerRelevant != null &&
                    this.IsNoLongerRelevant.Equals(other.IsNoLongerRelevant)
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
                                   
                hash = hash * 59 + this.Id.GetHashCode();                if (this.Text != null)
                {
                    hash = hash * 59 + this.Text.GetHashCode();
                }                
                                if (this.IsNoLongerRelevant != null)
                {
                    hash = hash * 59 + this.IsNoLongerRelevant.GetHashCode();
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
        public static bool operator ==(Note left, Note right)
        {
            return Equals(left, right);
        }

        /// <summary>
        /// Not Equals
        /// </summary>
        /// <param name="left"></param>
        /// <param name="right"></param>
        /// <returns></returns>
        public static bool operator !=(Note left, Note right)
        {
            return !Equals(left, right);
        }

        #endregion Operators
    }
}
