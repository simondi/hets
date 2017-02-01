SET TARGET_SERVER=http://localhost:55217
SET TARGET_SERVER=http://server-tran-hets-dev.pathfinder.gov.bc.ca

curl -c cookie %TARGET_SERVER%/api/authentication/dev/token?userId=

call load.bat "cities\cities_city.json" api/cities/bulk "%TARGET_SERVER%"
call load.bat "Regions\Regions_Region.json" api/regions/bulk "%TARGET_SERVER%"
call load.bat "Districts\Districts_District.json" api/districts/bulk "%TARGET_SERVER%"
call load.bat "ServiceAreas\ServiceAreas_ServiceArea.json" api/serviceareas/bulk "%TARGET_SERVER%"
call load.bat "LocalAreas\LocalAreas_LocalArea.json" api/localareas/bulk "%TARGET_SERVER%"

call load.bat "ContactAddress\ContactAddress_ContactAddress.json" api/contactaddresses/bulk "%TARGET_SERVER%"
call load.bat "ContactPhones\ContactPhones_ContactPhones.json" api/contactphones/bulk "%TARGET_SERVER%"
call load.bat "Contacts\Contacts_Contact.json" api/contacts/bulk "%TARGET_SERVER%"

call load.bat "Owners\Owners_Owner.json" api/owners/bulk "%TARGET_SERVER%"

call load.bat "EquipmentTypes\EquipmentTypes_EquipmentType.json" api/equipmenttypes/bulk "%TARGET_SERVER%"
call load.bat "Equipment\Equipment_Equipment.json" api/equipment/bulk "%TARGET_SERVER%"









