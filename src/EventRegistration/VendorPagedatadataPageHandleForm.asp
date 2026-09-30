<HEAD>

       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >

		<!--#Include virtual="Globalvariables.asp"-->

 
<table width = "680" height = "300"  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>

		
<td class = "body" valign = "top">
 jhgjkagshjkasghjdas
<% 
'rowcount = CInt
rowcount = 1

Set DataConnection = Server.CreateObject("ADODB.Connection")
	DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath) 	& ";" 
Action= Request.Form("Action")
EventID = Request.Form("EventID")

rresponse.write("Action=" & Action)
If Action = "Add" Then

VendorLevelName= Request.Form("VendorLevelName")
VendorLevelDescription = Request.Form("VendorLevelDescription")
VendorLevelPrice= Request.Form("VendorLevelPrice") 
VendorLevelQTYAvailable =request.Form("VendorLevelQTYAvailable")
VendorStallPower= request.Form("VendorStallPower")

'response.write("Action=" & Action & "<br>")
'response.write("VendorLevelName=" & VendorLevelName & "<br>")	

str1 =VendorLevelDescription
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		VendorLevelDescription= Replace(str1,  str2, "''")
	End If  

	str1 =VendorLevelName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		VendorLevelName= Replace(str1,  str2, "''")
	End If  


if len(VendorLevelID) > 0 or len(VendorLevelName) > 0 or len(VendorLevelDescription) > 0 or len(VendorLevelPrice) > 0 then
	
Query =  "INSERT INTO VendorLevels (VendorLevelName, EventID, " 
if len(VendorLevelPrice) > 0 then
		Query =  Query &   " VendorLevelPrice ,"
end if
if len(VendorLevelQTYAvailable) > 0 then
		Query =  Query &  " VendorLevelQTYAvailable ,"
end if
Query =  Query &  " VendorStallPower, VendorLevelDescription)"

Query =  Query & " Values ('" &  VendorLevelName & "' ,"
Query =  Query & " " &  EventID & " ,"
if len(VendorLevelPrice) > 0 then
		Query =  Query &   " " & VendorLevelPrice & ","
end if
if len(VendorLevelQTYAvailable) > 0 then
		Query =  Query &   " " & VendorLevelQTYAvailable & ","
end if


Query =  Query &   " '" & VendorStallPower & "',"


 Query =  Query &   " '" & VendorLevelDescription & "' )" 

response.write("Query=" & Query)	

	
	DataConnection.Execute(Query) 
 end if 
End If 


If Action = "Update" Then

	TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1
dim VendorLevelDescription(100)
dim	VendorLevelName(100)
dim	VendorLevelPrice(100) 
dim	VendorLevelQTYAvailable(100)
dim	VendorLevelID(100)

while (rowcount < TotalCount + 1)
	VendorLevelNamecount = "VendorLevelName(" & rowcount & ")"	
	'response.write("VendorLevelNamecount=" & VendorLevelNamecount)
	VendorLevelDescriptioncount = "VendorLevelDescription(" & rowcount & ")"	
	VendorLevelPricecount = "VendorLevelPrice(" & rowcount & ")"
	VendorLevelQTYAvailablecount = "VendorLevelQTYAvailable(" & rowcount & ")"
	VendorLevelIDcount = "VendorLevelID(" & rowcount & ")"
	
	VendorLevelDescription(rowcount)=Request.Form(VendorLevelDescriptioncount) 
	VendorLevelName(rowcount)=Request.Form(VendorLevelNamecount) 
	VendorLevelPrice(rowcount)=Request.Form(VendorLevelPricecount) 
	VendorLevelQTYAvailable(rowcount)=Request.Form(VendorLevelQTYAvailablecount )
	VendorLevelID(rowcount)=Request.Form(VendorLevelIDcount)
	
	rowcount = rowcount +1
	
Wend

 rowcount =1

while (rowcount < TotalCount + 1)

str1 = VendorLevelName(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	VendorLevelName(rowcount)= Replace(str1, "'", "''")
End If


str1 = VendorLevelDescription(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	VendorLevelDescription(rowcount)= Replace(str1, "'", "''")
End If


	Query =  " UPDATE VendorLevels Set VendorLevelName = '" &  VendorLevelName(rowcount) & "', " 
	if len(VendorLevelPrice(rowcount))> 0 then
	Query =  Query & "  VendorLevelPrice = " & VendorLevelPrice(rowcount) & "," 
	end if 
	if len(VendorLevelQTYAvailable(rowcount))> 0 then
    Query =  Query & "  VendorLevelQTYAvailable = " & VendorLevelQTYAvailable(rowcount) & "," 
    end if
    Query =  Query & "  VendorLevelDescription = '" & VendorLevelDescription(rowcount) & "' " 
	Query =  Query & " where VendorLevelID = " & VendorLevelID(rowcount) & ";" 


response.write(Query)	
Dim DataConnection, cmdDC, RecordSet
Dim RecordToEdit, Updated
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(databasepath) & ";" 

DataConnection.Execute(Query) 

	  rowcount= rowcount +1
	Wend

End If 

	DataConnection.Close
	Set DataConnection = Nothing 

%>
</td></tr></table>

<% 'Response.Redirect("vendorspagedata.asp?EventID=" & EventID ) %>
</Body>
</HTML>