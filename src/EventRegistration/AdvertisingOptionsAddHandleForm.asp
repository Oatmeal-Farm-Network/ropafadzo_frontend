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

AdvertisingLevelName= Request.Form("AdvertisingLevelName")
AdvertisingLevelDescription = Request.Form("AdvertisingLevelDescription")
AdvertisingLevelPrice= Request.Form("AdvertisingLevelPrice") 
AdvertisingLevelQTYAvailable =request.Form("AdvertisingLevelQTYAvailable")
AdvertisingDimensions= request.Form("AdvertisingDimensions")
AvaliableWithSponsorships= request.Form("AvaliableWithSponsorships")
AvaliableByItself= request.Form("AvaliableByItself")
AdvertisingLocation= request.Form("AdvertisingLocation")



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
	
	str1 =AdvertisingDimensions
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AdvertisingDimensions= Replace(str1,  str2, "''")
	End If  

Response.Write("AdvertisingLevelName=" & AdvertisingLevelName)
Response.Write("AdvertisingLevelPrice=" & AdvertisingLevelPrice)

if len(AdvertisingLevelName) > 1 and len(AdvertisingLevelPrice) > 1 then
	
Query =  "INSERT INTO AdvertisingLevels (AdvertisingLevelName, EventID,  " 

if len(AdvertisingLevelPrice) > 0 then
		Query =  Query &   " AdvertisingLevelPrice ,"
end if
if len(AdvertisingLevelQTYAvailable) > 0 then
		Query =  Query &  " AdvertisingLevelQTYAvailable ,"
end if
Query =  Query &  " AvaliableWithSponsorships , AvaliableByItself , AdvertisingLocation, AdvertisingDimensions, AdvertisingLevelDescription)"
Query =  Query & " Values ('" &  AdvertisingLevelName & "' ,"
Query =  Query & " " &  EventID & " ,"
if len(AdvertisingLevelPrice) > 0 then
		Query =  Query &   " " & AdvertisingLevelPrice & ","
end if
if len(AdvertisingLevelQTYAvailable) > 0 then
		Query =  Query &   " " & AdvertisingLevelQTYAvailable & ","
end if

Query =  Query &   " " & AvaliableWithSponsorships & ","

Query =  Query &   " " & AvaliableByItself & ","

Query =  Query &   " '" & AdvertisingLocation & "',"



Query =  Query &   " '" & AdvertisingDimensions & "',"


 Query =  Query &   " '" & AdvertisingLevelDescription & "' )" 

response.write("Query=" & Query)	

	
	Conn.Execute(Query) 
	
	
	Query =  "INSERT INTO ExtraOptions (ExtraOptionsName, EventID, OptionType,    " 

if len(AdvertisingLevelPrice) > 0 then
		Query =  Query &   " ExtraOptionsPrice ,"
end if
if len(AdvertisingLevelQTYAvailable) > 0 then
		Query =  Query &  "ExtraOptionsQTYAvailable ,"
end if

Query =  Query &   "  ExtraOptionsDescription)"

Query =  Query & " Values ('" &  AdvertisingLevelName & "' ,"
Query =  Query & " " &  EventID & " ,"
Query =  Query & " 'Advertising',"
if len(AdvertisingLevelPrice) > 0 then
		Query =  Query &   " " & AdvertisingLevelPrice & ","
end if
if len(AdvertisingLevelQTYAvailable) > 0 then
		Query =  Query &   " " & AdvertisingLevelQTYAvailable & ","
end if

 Query =  Query &   " '" & AdvertisingLevelDescription & "' )" 

response.write("Query=" & Query)	

Conn.Execute(Query) 




 end if 
End If 


If Action = "Update" Then

	TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1
dim AdvertisingLevelDescription(1000)
dim	AdvertisingLevelName(1000)
dim	AdvertisingLevelPrice(1000) 
dim	AdvertisingLevelQTYAvailable(1000)
dim	VendorLevelID(1000)
dim AdvertisingDimensions(1000)
dim Delete(1000)
dim VendorStallMaxQtyPer(10000)

while (rowcount < TotalCount + 1)
	AdvertisingLevelNamecount = "AdvertisingLevelName(" & rowcount & ")"	
	'response.write("AdvertisingLevelNamecount=" & AdvertisingLevelNamecount)
	AdvertisingLevelDescriptioncount = "AdvertisingLevelDescription(" & rowcount & ")"	
	AdvertisingLevelPricecount = "AdvertisingLevelPrice(" & rowcount & ")"
	AdvertisingLevelQTYAvailablecount = "AdvertisingLevelQTYAvailable(" & rowcount & ")"
	VendorLevelIDcount = "VendorLevelID(" & rowcount & ")"
	AdvertisingDimensionscount = "AdvertisingDimensions(" & rowcount & ")"
	VendorStallMaxQtyPercount = "VendorStallMaxQtyPer(" & rowcount & ")"
	
	Deletecount = "Delete(" & rowcount & ")"
	
	AdvertisingLevelDescription(rowcount)=Request.Form(AdvertisingLevelDescriptioncount) 
	AdvertisingLevelName(rowcount)=Request.Form(AdvertisingLevelNamecount) 
	AdvertisingLevelPrice(rowcount)=Request.Form(AdvertisingLevelPricecount) 
	AdvertisingLevelQTYAvailable(rowcount)=Request.Form(AdvertisingLevelQTYAvailablecount )
	VendorLevelID(rowcount)=Request.Form(VendorLevelIDcount)
	AdvertisingDimensions(rowcount)=Request.Form(AdvertisingDimensionscount)	
	VendorStallMaxQtyPer(rowcount)=Request.Form(VendorStallMaxQtyPercount)
	
	Delete(rowcount)=Request.Form(Deletecount)
			
	rowcount = rowcount +1
	
Wend

 rowcount =1

while (rowcount < TotalCount + 1)

str1 = AdvertisingLevelName(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	AdvertisingLevelName(rowcount)= Replace(str1, "'", "''")
End If


str1 = AdvertisingLevelDescription(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	AdvertisingLevelDescription(rowcount)= Replace(str1, "'", "''")
End If

response.write("delete = " & Delete(rowcount))	
if Delete(rowcount) = "Yes" then
' Query =  "Delete * From VendorLevels where VendorLevelID = " & VendorLevelID(rowcount) & ";" 



Else

	Query =  " UPDATE VendorLevels Set AdvertisingLevelName = '" &  AdvertisingLevelName(rowcount) & "', " 
	if len(AdvertisingLevelPrice(rowcount))> 0 then
	Query =  Query & "  AdvertisingLevelPrice = " & AdvertisingLevelPrice(rowcount) & "," 
	end if 
	if len(AdvertisingLevelQTYAvailable(rowcount))> 0 then
    Query =  Query & "  AdvertisingLevelQTYAvailable = " & AdvertisingLevelQTYAvailable(rowcount) & "," 
    end if
    if len(VendorStallMaxQtyPer(rowcount))> 0 then
    	Query =  Query & "  VendorStallMaxQtyPer = " & VendorStallMaxQtyPer(rowcount) & "," 
    end if
    Query =  Query & "  AdvertisingLevelDescription = '" & AdvertisingLevelDescription(rowcount) & "', " 
    Query =  Query & "  AdvertisingDimensions = " & AdvertisingDimensions(rowcount) & " " 
	Query =  Query & " where VendorLevelID = " & VendorLevelID(rowcount) & ";" 

End if 
response.write(Query)	
Dim cmdDC, RecordSet
Dim RecordToEdit, Updated
Conn.Execute(Query) 

	  rowcount= rowcount +1
	Wend

End If 

%>
</td></tr></table>

<% 
response.write("Action=" & Action & "<br>")

If Action = "Add" Then 
	    if len(AdvertisingLevelName) < 2 then
            MissingName = True
        else
            MissingName = False
        end if
        if len(AdvertisingLevelPrice) < 2 then
                MissingPrice = True
        else
             MissingPrice = False
        end if

	 
	  Response.Redirect("AdvertisingsAddOptions.asp?EventID=" & EventID & "&Submitted=True&MissingPrice=" & MissingPrice & "&missingName=" & MissingName & "&AdvertisingLevelName=" & AdvertisingLevelName & "&AdvertisingLevelPrice=" & AdvertisingLevelPrice & "&AdvertisingLevelQTYAvailable=" & AdvertisingLevelQTYAvailable & "&AdvertisingDimensions=" & AdvertisingDimensions & "&AvaliableWithSponsorships=" & AvaliableWithSponsorships & "&AvaliableByItself=" & AvaliableByItself & "&AdvertisingLocation=" & AdvertisingLocation) 


 else 
 	Response.Redirect("AdvertisingsAddOptions.asp?EventID=" & EventID & "&Message=Your changes have been made.") 
 end if %>
</Body>
</HTML>