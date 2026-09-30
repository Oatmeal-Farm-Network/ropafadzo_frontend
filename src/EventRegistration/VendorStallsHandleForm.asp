<HTML><HEAD>

       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >

		<!--#Include virtual="Globalvariables.asp"-->

 
<table width = "680" height = "300"  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>

		
<td class = "body" valign = "top">

<% 
'rowcount = CInt
rowcount = 1

Action= Request.Form("Action")
EventID = Request.Form("EventID")
response.Write("Action=" & Action)




If Action = "Add" Then

VendorStallName= Request.Form("VendorStallName")
VendorStallDescription = Request.Form("VendorStallDescription")
VendorStallPrice= Request.Form("VendorStallPrice") 
VendorStallQTYAvailable =request.Form("VendorStallQTYAvailable")
VendorStallPower= request.Form("VendorStallPower")
VendorStallMaxQtyPer= request.Form("VendorStallMaxQtyPer")
Numfreetables = request.Form("Numfreetables")
Costpertable= request.Form("Costpertable")
MaxExtraTables= request.Form("MaxExtraTables")

response.write("MaxExtraTables=" & MaxExtraTables & "<br>")
response.write("VendorStallDescription=" & VendorStallDescription & "<br>")	



str1 =VendorStallDescription
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		VendorStallDescription= Replace(str1,  str2, "''")
	End If  

	str1 =VendorStallName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		VendorStallName= Replace(str1,  str2, "''")
	End If  
 DuplicateName = False
 sql = "select * from VendorLevels where EventID = " & EventID & " and UCase(VendorStallName) = '" & UCase(VendorStallName)  & "';"
 response.write("sql=" & sql )
 Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then
   DuplicateName = True
   Message = "Add Vendor Failed! There is already a Vendor Booth option with that name. Please enter a new name and select resubmit the form."
end if

if len(VendorStallName) > 0 then
  VendorStallNameFound = True
else
    VendorStallNameFound = False
end if


if len(VendorStallPrice) > 0 then
   PriceFound = True
else
    PriceFound = False
end if


if (len(VendorStallName) > 0 or len(VendorStallDescription) > 0 or len(VendorStallPrice) > 0) and  DuplicateName = False and    PriceFound = True and VendorStallNameFound = True then

	
Query =  "INSERT INTO VendorLevels (VendorStallName, EventID,  " 

if len(VendorStallMaxQtyPer) > 0 then
		Query =  Query &   " VendorStallMaxQtyPer, "
end if

if len(Numfreetables) > 0 then
		Query =  Query &   " Numfreetables, "
end if

if len(Costpertable) > 0 then
		Query =  Query &   " Costpertable, "
end if

if len(MaxExtraTables) > 0 then
		Query =  Query &   " MaxExtraTables, "
end if



if len(VendorStallPrice) > 0 then
		Query =  Query &   " VendorStallPrice ,"
end if
if len(VendorStallQTYAvailable) > 0 then
		Query =  Query &  " VendorStallQTYAvailable ,"
end if



Query =  Query &  " VendorStallPower, VendorStallDescription)"
Query =  Query & " Values ('" &  VendorStallName & "' ,"
Query =  Query & " " &  EventID & " ,"
if len(VendorStallMaxQtyPer ) > 0 then
		Query =  Query &   " " & VendorStallMaxQtyPer  & ","
end if

if len(Numfreetables) > 0 then
		Query =  Query &  " " &  Numfreetables & ","
end if

if len(Costpertable) > 0 then
		Query =  Query &  " " &  Costpertable & ","
end if

if len(MaxExtraTables) > 0 then
		Query =  Query &  " " &  MaxExtraTables & ","
end if


if len(VendorStallPrice) > 0 then
		Query =  Query &   " " & VendorStallPrice & ","
end if
if len(VendorStallQTYAvailable) > 0 then
		Query =  Query &   " " & VendorStallQTYAvailable & ","
end if


Query =  Query &   " " & VendorStallPower & ","


 Query =  Query &   " '" & VendorStallDescription & "' )" 

response.write("Query=" & Query)	

	
	Conn.Execute(Query) 
	   Message = "Your vendor booth option has successfully been added."
 end if 
 
 
 
 
 
 
 if (len(VendorStallName) > 0 or len(VendorStallDescription) > 0 or len(VendorStallPrice) > 0) and  DuplicateName = False and    PriceFound = True and VendorStallNameFound = True then
 
 
 Query =  "INSERT INTO ExtraOptions (ExtraOptionsName, EventID, OptionType,    " 

if len(VendorStallPrice) > 0 then
		Query =  Query &   " ExtraOptionsPrice ,"
end if
if len(VendorStallQTYAvailable) > 0 then
		Query =  Query &  " ExtraOptionsQTYAvailable ,"
end if

Query =  Query &   "  ExtraOptionsDescription)"

Query =  Query & " Values ('" &  VendorStallName & "' ,"
Query =  Query & " " &  EventID & " ,"
Query =  Query & " 'Vendor',"
if len(VendorStallPrice) > 0 then
		Query =  Query &   " " & VendorStallPrice & ","
end if
if len(VendorStallQTYAvailable) > 0 then
		Query =  Query &   " " & VendorStallQTYAvailable & ","
end if

 Query =  Query &   " '" & VendorStallDescription & "' )" 

response.write("Query=" & Query)	

Conn.Execute(Query) 

 end if
 
End If 


If Action = "Update" Then

	TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1

	VendorStallDescription=Request.Form("VendorStallDescription") 
	VendorStallName=Request.Form("VendorStallName") 
	VendorStallPrice=Request.Form("VendorStallPrice") 
	VendorStallQTYAvailable=Request.Form("VendorStallQTYAvailable" )
	VendorLevelID=Request.Form("VendorLevelID")
	VendorStallPower=Request.Form("VendorStallPower")	
	VendorStallMaxQtyPer=Request.Form("VendorStallMaxQtyPer")
	Numfreetables=Request.Form("Numfreetables")
	Costpertable=Request.Form("Costpertable")
	MaxExtraTables=Request.Form("MaxExtraTables")
			

str1 = VendorStallName
str2 = "'"
If InStr(str1,str2) > 0 Then
	VendorStallName= Replace(str1, "'", "''")
End If


str1 = VendorStallDescription
str2 = "'"
If InStr(str1,str2) > 0 Then
	VendorStallDescription= Replace(str1, "'", "''")
End If

'response.write("delete = " & Delete)	
if Delete = "Yes" then
 Query =  "Delete * From VendorLevels where VendorLevelID = " & VendorLevelID & ";" 
'Conn.Execute(Query) 

 Query =  "Delete * From ExtraOptions where ExtraOptionsName = '" & VendorStallName & "' and EventID=" & EventID & ";" 

Else

	Query =  " UPDATE VendorLevels Set VendorStallName = '" &  VendorStallName & "', " 
	if len(VendorStallPrice)> 0 then
	Query =  Query & "  VendorStallPrice = " & VendorStallPrice & "," 
	end if 
	if len(VendorStallQTYAvailable)> 0 then
    Query =  Query & "  VendorStallQTYAvailable = " & VendorStallQTYAvailable & "," 
    end if
    if len(VendorStallMaxQtyPer)> 0 then
    	Query =  Query & "  VendorStallMaxQtyPer = " & VendorStallMaxQtyPer & "," 
    end if
    
    if len(Numfreetables)> 0 then
    	Query =  Query & "  Numfreetables = " & Numfreetables & "," 
    end if

    if len(Costpertable)> 0 then
    	Query =  Query & "  Costpertable = " & Costpertable & "," 
    end if


    if len(MaxExtraTables)> 0 then
    	Query =  Query & "  MaxExtraTables = " & MaxExtraTables & "," 
    end if

    Query =  Query & "  VendorStallDescription = '" & VendorStallDescription & "', " 
    Query =  Query & "  VendorStallPower = " & VendorStallPower & " " 
	Query =  Query & " where VendorLevelID = " & VendorLevelID & ";" 

End if 
response.write(Query)	
Dim cmdDC, RecordSet
Dim RecordToEdit, Updated
Conn.Execute(Query) 


End If 

%>
</td></tr></table>

<% 
response.write("Action=" & Action & "<br>")

If Action = "Add" Then 

if    DuplicateName = True and PriceFound = False then

		Response.Redirect("Vendorspagedata.asp?PriceFound=False&DuplicateName=True&EventID=" & EventID & "&VendorlevelID=" & VendorlevelID & "&Message=Add Vendor Failed! There is already a Vendor Booth option with that name. Please enter a new name and select the form.&VendorStallDescription=" & VendorStallDescription & "&VendorStallName=" & VendorStallName & "&VendorStallPrice=" & 	VendorStallPrice & "&VendorStallQTYAvailable=" & VendorStallQTYAvailable & "&VendorLevelID=" & VendorLevelID & "&VendorStallPower=" & VendorStallPower & "&VendorStallMaxQtyPer=" & VendorStallMaxQtyPer &     "&	Numfreetables=" & Numfreetables & "&Costpertable=" & Costpertable & "&MaxExtraTables=" & MaxExtraTables )
	
end if

	
if    DuplicateName = True then

		Response.Redirect("Vendorspagedata.asp?DuplicateName=True&EventID=" & EventID & "&VendorlevelID=" & VendorlevelID & "&Message=Add Vendor Failed! There is already a Vendor Booth option with that name. Please enter a new name and resubmit the form.&VendorStallDescription=" & VendorStallDescription & "&VendorStallName=" & VendorStallName & "&VendorStallPrice=" & 	VendorStallPrice & "&VendorStallQTYAvailable=" & VendorStallQTYAvailable & "&VendorLevelID=" & VendorLevelID & "&VendorStallPower=" & VendorStallPower & "&VendorStallMaxQtyPer=" & VendorStallMaxQtyPer &     "&	Numfreetables=" & Numfreetables & "&Costpertable=" & Costpertable & "&MaxExtraTables=" & MaxExtraTables )
	
end if
if  VendorStallNameFound = False and PriceFound = False then
	Response.Redirect("Vendorspagedata.asp?VendorStallNameFound=False&EventID=" & EventID & "&VendorlevelID=" & VendorlevelID & "&Message=Add Vendor Failed! Please enter a valid Name and Price, then resubmit the form.&VendorStallDescription=" & VendorStallDescription & "&VendorStallName=" & VendorStallName & "&VendorStallPrice=" & 	VendorStallPrice & "&VendorStallQTYAvailable=" & VendorStallQTYAvailable & "&VendorLevelID=" & VendorLevelID & "&VendorStallPower=" & VendorStallPower & "&VendorStallMaxQtyPer=" & VendorStallMaxQtyPer &     "&	Numfreetables=" & Numfreetables & "&Costpertable=" & Costpertable & "&MaxExtraTables=" & MaxExtraTables )
end if

if  PriceFound = False then
	Response.Redirect("Vendorspagedata.asp?PriceFound=False&EventID=" & EventID & "&VendorlevelID=" & VendorlevelID & "&Message=Add Vendor Failed! Please enter a valid Price and resubmit the form.&VendorStallDescription=" & VendorStallDescription & "&VendorStallName=" & VendorStallName & "&VendorStallPrice=" & 	VendorStallPrice & "&VendorStallQTYAvailable=" & VendorStallQTYAvailable & "&VendorLevelID=" & VendorLevelID & "&VendorStallPower=" & VendorStallPower & "&VendorStallMaxQtyPer=" & VendorStallMaxQtyPer &     "&	Numfreetables=" & Numfreetables & "&Costpertable=" & Costpertable & "&MaxExtraTables=" & MaxExtraTables )
end if


if  VendorStallNameFound = False then
	Response.Redirect("Vendorspagedata.asp?VendorStallNameFound=False&EventID=" & EventID & "&VendorlevelID=" & VendorlevelID & "&Message=Add Vendor Failed! Please enter a valid Name and resubmit the form.&VendorStallDescription=" & VendorStallDescription & "&VendorStallName=" & VendorStallName & "&VendorStallPrice=" & 	VendorStallPrice & "&VendorStallQTYAvailable=" & VendorStallQTYAvailable & "&VendorLevelID=" & VendorLevelID & "&VendorStallPower=" & VendorStallPower & "&VendorStallMaxQtyPer=" & VendorStallMaxQtyPer &     "&	Numfreetables=" & Numfreetables & "&Costpertable=" & Costpertable & "&MaxExtraTables=" & MaxExtraTables )
end if


	Response.Redirect("Vendorspagedata.asp?EventID=" & EventID & "&VendorlevelID=" & VendorlevelID & "&Message=" & Message) 

 else 
 	Response.Redirect("VendorsEditPageData.asp?EventID=" & EventID & "&VendorlevelID=" & VendorlevelID & "&Message=Your changes have been made.") 
 end if %>
</Body>
</HTML>