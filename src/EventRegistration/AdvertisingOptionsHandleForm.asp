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

If Action = "Add" Then
AdvertisingLevelID = rs("AdvertisingLevelID")
	AdvertisingLevelName = rs("AdvertisingLevelName")
	AdvertisingLevelDescription = rs("AdvertisingLevelDescription")
	AdvertisingLevelPrice= rs("AdvertisingLevelPrice")
	AdvertisingLevelQTYAvailable = rs("AdvertisingLevelQTYAvailable")
	AdvertisingDimensions= rs("AdvertisingDimensions")

AdvertisingLevelName= Request.Form("AdvertisingLevelName")
AdvertisingLevelDescription = Request.Form("AdvertisingLevelDescription")
AdvertisingLevelPrice= Request.Form("AdvertisingLevelPrice") 
AdvertisingLevelQTYAvailable =request.Form("AdvertisingLevelQTYAvailable")
AdvertisingDimensions= request.Form("AdvertisingDimensions")
AdvertisingLevelQTYAvailable= request.Form("AdvertisingLevelQTYAvailable")

response.write("Action=" & Action & "<br>")
response.write("AdvertisingLevelDescription=" & AdvertisingLevelDescription & "<br>")	

str1 =AdvertisingLevelDescription
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AdvertisingLevelDescription= Replace(str1,  str2, "''")
	End If  

	str1 =AdvertisingLevelName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AdvertisingLevelName= Replace(str1,  str2, "''")
	End If  


if len(AdvertisingLevelName) > 0 or len(AdvertisingLevelDescription) > 0 or len(AdvertisingLevelPrice) > 0 then
	
Query =  "INSERT INTO AdvertisingLevels (AdvertisingLevelName, EventID,  " 

if len(AdvertisingLevelQTYAvailable) > 0 then
		Query =  Query &   " AdvertisingLevelQTYAvailable, "
end if

if len(AdvertisingLevelPrice) > 0 then
		Query =  Query &   " AdvertisingLevelPrice ,"
end if
if len(AdvertisingLevelQTYAvailable) > 0 then
		Query =  Query &  " AdvertisingLevelQTYAvailable ,"
end if
Query =  Query &  " AdvertisingDimensions, AdvertisingLevelDescription)"
Query =  Query & " Values ('" &  AdvertisingLevelName & "' ,"
Query =  Query & " " &  EventID & " ,"
if len(AdvertisingLevelQTYAvailable ) > 0 then
		Query =  Query &   " " & AdvertisingLevelQTYAvailable  & ","
end if

if len(AdvertisingLevelPrice) > 0 then
		Query =  Query &   " " & AdvertisingLevelPrice & ","
end if
if len(AdvertisingLevelQTYAvailable) > 0 then
		Query =  Query &   " " & AdvertisingLevelQTYAvailable & ","
end if


Query =  Query &   " " & AdvertisingDimensions & ","


 Query =  Query &   " '" & AdvertisingLevelDescription & "' )" 

response.write("Query=" & Query)	

	
	Conn.Execute(Query) 
 end if 
End If 


If Action = "Update" Then

	TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1

	
	AdvertisingLevelDescription=Request.Form("AdvertisingLevelDescription") 
	AdvertisingLevelName=Request.Form("AdvertisingLevelName") 
	AdvertisingLevelPrice=Request.Form("AdvertisingLevelPrice") 
	AdvertisingLevelQTYAvailable=Request.Form("AdvertisingLevelQTYAvailable" )
	AdvertisingLevelID=Request.Form("AdvertisingLevelID")
	AdvertisingDimensions=Request.Form("AdvertisingDimensions")	
	AdvertisingLevelQTYAvailable=Request.Form("AdvertisingLevelQTYAvailable")
	AvaliableWithSponsorships= Request.Form("AvaliableWithSponsorships")
	AvaliableByItself= Request.Form("AvaliableByItself")
	AdvertisingLocation= Request.Form("AdvertisingLocation")

	

str1 = AdvertisingDimensions
str2 = "'"
If InStr(str1,str2) > 0 Then
	AdvertisingDimensions= Replace(str1, "'", "''")
End If


str1 = AdvertisingLevelPrice
str2 = "'"
If InStr(str1,str2) > 0 Then
	AdvertisingLevelPrice= Replace(str1, "'", "''")
End If



str1 = AdvertisingLevelName
str2 = "'"
If InStr(str1,str2) > 0 Then
	AdvertisingLevelName= Replace(str1, "'", "''")
End If


str1 = AdvertisingLevelDescription
str2 = "'"
If InStr(str1,str2) > 0 Then
	AdvertisingLevelDescription= Replace(str1, "'", "''")
End If


if Delete = "Yes" then
 Query =  "Delete * From AdvertisingLevels where AdvertisingLevelID = " & AdvertisingLevelID & ";" 



Else

	Query =  " UPDATE AdvertisingLevels Set AdvertisingLevelName = '" &  AdvertisingLevelName & "', " 
	Query =  Query & "  AdvertisingLevelPrice = '" & AdvertisingLevelPrice & "'," 
	if len(AdvertisingLevelQTYAvailable)> 0 then
    Query =  Query & "  AdvertisingLevelQTYAvailable = " & AdvertisingLevelQTYAvailable & "," 
    end if
    Query =  Query & "  AvaliableWithSponsorships= " & AvaliableWithSponsorships & ", " 
    Query =  Query & "  AvaliableByItself= " & AvaliableByItself & ", " 
	Query =  Query & "  AdvertisingLocation= '" & AdvertisingLocation & "', " 
	
	
    Query =  Query & "  AdvertisingLevelDescription = '" & AdvertisingLevelDescription & "', " 
    Query =  Query & "  AdvertisingDimensions = '" & AdvertisingDimensions & "' " 
	Query =  Query & " where AdvertisingLevelID = " & AdvertisingLevelID & ";" 

End if 
response.write(Query)	
Dim cmdDC, RecordSet
Dim RecordToEdit, Updated
Conn.Execute(Query) 


End If 

%>
</td></tr></table>

<% 

If Action = "Add" Then 
	Response.Redirect("Advertisingspagedata.asp?EventID=" & EventID & "&Message=Your changes have been made.") 
 else 
 	Response.Redirect("advertisingEditPageData.asp?AdvertisingLevelID=" & AdvertisingLevelID & "&EventID=" & EventID & "&Message=Your changes have been made.") 
 end if %>
</Body>
</HTML>