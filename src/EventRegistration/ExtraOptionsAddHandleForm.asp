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

ExtraOptionsName= Request.Form("ExtraOptionsName")
ExtraOptionsDescription = Request.Form("ExtraOptionsDescription")
ExtraOptionsPrice= Request.Form("ExtraOptionsPrice") 
ExtraOptionsQTYAvailable =request.Form("ExtraOptionsQTYAvailable")
AvaliableWithSponsorships =request.Form("AvaliableWithSponsorships")
AvaliableByItself =request.Form("AvaliableByItself")


response.write("Action=" & Action & "<br>")
response.write("ExtraOptionsDescription=" & ExtraOptionsDescription & "<br>")	

str1 =ExtraOptionsDescription
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ExtraOptionsDescription= Replace(str1,  str2, "''")
	End If  

	str1 =ExtraOptionsName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ExtraOptionsName= Replace(str1,  str2, "''")
	End If  
	
 




	
Query =  "INSERT INTO ExtraOptions (ExtraOptionsName, EventID, OptionType,    " 

if len(ExtraOptionsPrice) > 0 then
		Query =  Query &   " ExtraOptionsPrice ,"
end if
if len(ExtraOptionsQTYAvailable) > 0 then
		Query =  Query &  " ExtraOptionsQTYAvailable ,"
end if

Query =  Query &   " AvaliableWithSponsorships, AvaliableByItself, ExtraOptionsDescription)"

Query =  Query & " Values ('" &  ExtraOptionsName & "' ,"
Query =  Query & " " &  EventID & " ,"
Query =  Query & " 'ExtraOption',"
if len(ExtraOptionsPrice) > 0 then
		Query =  Query &   " " & ExtraOptionsPrice & ","
end if
if len(ExtraOptionsQTYAvailable) > 0 then
		Query =  Query &   " " & ExtraOptionsQTYAvailable & ","
end if
		Query =  Query &   " " & AvaliableWithSponsorships & ","
		Query =  Query &   " " & AvaliableByItself & ","

 Query =  Query &   " '" & ExtraOptionsDescription & "' )" 

'response.write("Query=" & Query)	

	
	Conn.Execute(Query) 

End If 


If Action = "Update" Then

	TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1
dim ExtraOptionsDescription(1000)
dim	ExtraOptionsName(1000)
dim	ExtraOptionsPrice(1000) 
dim	ExtraOptionsQTYAvailable(1000)
dim	VendorLevelID(1000)
dim Delete(1000)


while (rowcount < TotalCount + 1)
	ExtraOptionsNamecount = "ExtraOptionsName(" & rowcount & ")"	
	'response.write("ExtraOptionsNamecount=" & ExtraOptionsNamecount)
	ExtraOptionsDescriptioncount = "ExtraOptionsDescription(" & rowcount & ")"	
	ExtraOptionsPricecount = "ExtraOptionsPrice(" & rowcount & ")"
	ExtraOptionsQTYAvailablecount = "ExtraOptionsQTYAvailable(" & rowcount & ")"
	VendorLevelIDcount = "VendorLevelID(" & rowcount & ")"
	
	Deletecount = "Delete(" & rowcount & ")"
	
	ExtraOptionsDescription(rowcount)=Request.Form(ExtraOptionsDescriptioncount) 
	ExtraOptionsName(rowcount)=Request.Form(ExtraOptionsNamecount) 
	ExtraOptionsPrice(rowcount)=Request.Form(ExtraOptionsPricecount) 
	ExtraOptionsQTYAvailable(rowcount)=Request.Form(ExtraOptionsQTYAvailablecount )
	VendorLevelID(rowcount)=Request.Form(VendorLevelIDcount)
	
	Delete(rowcount)=Request.Form(Deletecount)
			
	rowcount = rowcount +1
	
Wend

 rowcount =1

while (rowcount < TotalCount + 1)

str1 = ExtraOptionsName(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	ExtraOptionsName(rowcount)= Replace(str1, "'", "''")
End If


str1 = ExtraOptionsDescription(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	ExtraOptionsDescription(rowcount)= Replace(str1, "'", "''")
End If

response.write("delete = " & Delete(rowcount))	
if Delete(rowcount) = "Yes" then
 Query =  "Delete * From ExtraOptions where VendorLevelID = " & VendorLevelID(rowcount) & ";" 



Else

	Query =  " UPDATE ExtraOptions Set ExtraOptionsName = '" &  ExtraOptionsName(rowcount) & "', " 
	if len(ExtraOptionsPrice(rowcount))> 0 then
	Query =  Query & "  ExtraOptionsPrice = " & ExtraOptionsPrice(rowcount) & "," 
	end if 
	if len(ExtraOptionsQTYAvailable(rowcount))> 0 then
    Query =  Query & "  ExtraOptionsQTYAvailable = " & ExtraOptionsQTYAvailable(rowcount) & "," 
    end if
    if len(VendorStallMaxQtyPer(rowcount))> 0 then
    	Query =  Query & "  VendorStallMaxQtyPer = " & VendorStallMaxQtyPer(rowcount) & "," 
    end if
    Query =  Query & "  ExtraOptionsDescription = '" & ExtraOptionsDescription(rowcount) & "', " 
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
	Response.Redirect("ExtraOptionsAdd.asp?EventID=" & EventID & "&Message=Your changes have been made.") 
 else 
 	Response.Redirect("ExtraOptionsAdd.asp?EventID=" & EventID & "&Message=Your changes have been made.") 
 end if %>
</Body>
</HTML>