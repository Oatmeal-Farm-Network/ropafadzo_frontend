<HTML>
<HEAD>

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
dim ClassOrderArray(10000) 
dim ClassInfoIDArray(10000)


Action= Request.Form("Action")
EventID = Request.Form("EventID")

response.write("action = " & Action )

If Action = "Add" Then

PeopleFirstName = Request.Form("PeopleFirstName")
PeopleLastName= Request.Form("PeopleLastName")
PeopleEmail= Request.Form("PeopleEmail")
PeoplePhone= Request.Form("PeoplePhone")
PeopleCell= Request.Form("PeopleCell")
PeopleFax= Request.Form("PeopleFax")
AddressStreet= Request.Form("AddressStreet")
AddressApt= Request.Form("AddressApt")
AddressCity= Request.Form("AddressCity")
AddressState= Request.Form("AddressState")
AddressCountry= Request.Form("AddressCountry")
AddressZip= Request.Form("AddressZip")

TotalCount= Request.Form("TotalCount")

response.write("ClassPaidAmount =" & ClassPaidAmount  )
str1 =PeopleFirstName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleFirstName= Replace(str1,  str2, "''")
	End If  

	str1 =PeopleLastName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleLastName= Replace(str1,  str2, "''")
	End If  

str1 =PeopleEmail
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleEmail= Replace(str1,  str2, "''")
	End If 
	
	
	str1 =PeoplePhone
		str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeoplePhone= Replace(str1,  str2, "''")
	End If 
	
	
	str1 =PeopleCell
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleCell= Replace(str1,  str2, "''")
	End If 
	
	str1 =PeopleFax
		str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleFax= Replace(str1,  str2, "''")
	End If 
	
	str1 =AddressStreet 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressStreet= Replace(str1,  str2, "''")
	End If 
	
	str1 =AddressApt 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressApt = Replace(str1,  str2, "''")
	End If 

	str1 =AddressCity 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressCity = Replace(str1,  str2, "''")
	End If 

	str1 =AddressState 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressState = Replace(str1,  str2, "''")
	End If 


	str1 =AddressState 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressState = Replace(str1,  str2, "''")
	End If 



	str1 =AddressZip 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressZip = Replace(str1,  str2, "''")
	End If 


if len(PeopleFirstName) > 0 or len(PeopleLastName) > 0 or len(PeopleEmail) > 0 or len(PeoplePhone) > 0 or len(PeopleCell) > 0 or len(PeopleFax) > 0 or len(AddressStreet) > 0 or len(AddressApt) > 0 or len(AddressCity) > 0 or len(AddressState) then 


Query =  "INSERT INTO Address (AddressStreet, AddressApt, AddressCity, AddressState, AddressZip)" 
	    Query =  Query + " Values ('" & AddressStreet  & "'," 
	    Query =  Query & " '" &  AddressApt & "', " 
		Query =  Query & " '" &  AddressCity & "', " 
		Query =  Query & " '" &  AddressState & "', " 
		Query =  Query & " '" &  AddressZip & "')" 

 sql = "select AddressID from Address where AddressStreet = '" & AddressStreet & "' and AddressCity= '" & AddressCity & "' and AddressZip = '" & AddressZip  & "' order by AddressID Desc "
response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
			AddressID = rs("AddressID")
	response.write("AddressID=" & AddressID)

	End If 
rs.close



	
Query =  "INSERT INTO People (PeopleFirstName, AddressID, PeopleLastName, PeoplePhone, PeopleCell, Peoplefax, Peopleemail ) " 
Query =  Query & " Values ('" &  PeopleFirstName & "' ,"
Query =  Query & " " &  AddressID & " ,"
Query =  Query & " '" &  PeopleLastName & "' ,"
Query =  Query & " '" &  PeoplePhone & " ',"
Query =  Query & " '" &  PeopleCell & " ',"
Query =  Query & " '" &  Peoplefax & "' ,"
Query =  Query & " '" & Peopleemail & "' )" 

response.write("Query=" & Query)	
Conn.Execute(Query) 

sql = "select PeopleID from People where AddressID = " & AddressID  & " order by PeopleID Desc;"
	
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	If Not rs.eof Then
		PeopleID = rs("PeopleID")
	End If 
rs.close

dim SAuctionTitle(1000)
dim SAuctionItemNum(1000)
dim SAuctionValue(1000)
dim SAuctionMinBid(1000)
dim SAuctionDescription(10000)


while cint(rowcount) < cint(TotalCount) 
	SAuctionTitlecount =  "SAuctionTitle(" & rowcount & ")"	
	SAuctionItemNumcount = "SAuctionItemNum(" & rowcount & ")"	
	SAuctionValuecount = "SAuctionValue(" & rowcount & ")"	
	SAuctionMinBidcount = "SAuctionMinBid(" & rowcount & ")"
	SAuctionDescriptioncount = "SAuctionDescription(" & rowcount & ")"


	SAuctionTitle(rowcount)=Request.Form(SAuctionTitlecount) 
	SAuctionItemNum(rowcount)=Request.Form(SAuctionItemNumcount) 
	SAuctionValue(rowcount)=Request.Form(SAuctionValuecount) 
	SAuctionMinBid(rowcount)=Request.Form(SAuctionMinBidcount) 
	SAuctionDescription(rowcount)=Request.Form(SAuctionDescriptioncount )
	
	
	'response.write("rowcount = " & rowcount)
	rowcount = rowcount +1
	
	
	





Wend

 rowcount =1


	
while cint(rowcount) < cint(TotalCount)
	if len(SAuctionItemNum(rowcount))> 0 or len(SAuctionTitle(rowcount)) > 0 or len(SAuctionDescription(rowcount)) > 0 or len(SAuctionValue(rowcount)) > 0 or  len(SAuctionMinBid(rowcount))> 0 then
		
		
		str1 =SAuctionTitle(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		SAuctionTitle(rowcount)= Replace(str1,  str2, "''")
	End If 

	str1 =SAuctionItemNum(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		SAuctionItemNum(rowcount)= Replace(str1,  str2, "''")
	End If 

	str1 =SAuctionValue(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		SAuctionValue(rowcount)= Replace(str1,  str2, "''")
	End If 

	str1 =SAuctionMinBid(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		SAuctionMinBid(rowcount)= Replace(str1,  str2, "''")
	End If 


	str1 =SAuctionDescription(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		SAuctionDescription(rowcount)= Replace(str1,  str2, "''")
	End If 

		
		
	Query =  "INSERT INTO SilentAuctionItems (SAuctionItemNum, EventID, SAuctionTitle, SAuctionDescription, "
	if len(SAuctionValue(rowcount)) > 0 then
		Query =  Query & "SAuctionValue, "
	end if 
	if len(SAuctionMinBid(rowcount)) > 0 then
		Query =  Query & " SAuctionMinBid, "
	end if 
    Query =  Query & " PeopleID ) " 
	Query =  Query & " Values ('" & SAuctionItemNum(rowcount) & "' ,"
	Query =  Query & " " &  EventID & " ,"
	Query =  Query & " '" &  SAuctionTitle(rowcount) & "' ,"
	Query =  Query & " '" &  SAuctionDescription(rowcount) & "' ,"
	if len(SAuctionValue(rowcount)) > 0 then
		Query =  Query & " " &  SAuctionValue(rowcount) & " ,"
	end if 
	if len(SAuctionMinBid(rowcount)) > 0 then
		Query =  Query & " " & SAuctionMinBid(rowcount) & ", "
	end if 
Query =  Query & " " & PeopleID & " )" 

response.write("Query=" & Query)
Conn.Execute(Query) 

end if 

rowcount = rowcount +1
	
Wend

 end if 
end if


If Action = "Update" Then

	TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1

dim delete2(10000)
dim AddressID2(10000)
dim SAuctionID2(10000)
dim SAuctionItemNum2(10000)
dim SAuctionTitle2(10000)
dim SAuctionValue2(10000)
dim SAuctionMinBid2(1000)
dim SAuctionDescription2(10000)


while cint(rowcount) < cint(TotalCount)
	SAuctionTitlecount =  "SAuctionTitle(" & rowcount & ")"	
	SAuctionItemNumcount = "SAuctionItemNum(" & rowcount & ")"	
	SAuctionValuecount = "SAuctionValue(" & rowcount & ")"	
	SAuctionMinBidcount = "SAuctionMinBid(" & rowcount & ")"
	SAuctionDescriptioncount = "SAuctionDescription(" & rowcount & ")"
	AddressIDcount = "AddressID(" & rowcount & ")"	
	Deletecount = "Delete(" & rowcount & ")"
	SAuctionIDcount = "SAuctionID(" & rowcount & ")"

	SAuctionItemNum2(rowcount)=Request.Form(SAuctionItemNumcount) 
	SAuctionTitle2(rowcount)=Request.Form(SAuctionTitlecount) 
	SAuctionValue2(rowcount)=Request.Form(SAuctionValuecount) 
	SAuctionMinBid2(rowcount)=Request.Form(SAuctionMinBidcount) 
	SAuctionDescription2(rowcount)=Request.Form(SAuctionDescriptioncount )
	AddressID2(rowcount)=Request.Form(AddressIDcount )
	Delete2(rowcount)=Request.Form(Deletecount )
	SAuctionID2(rowcount) = Request.Form(SAuctionIDcount)

	rowcount = rowcount +1
Wend

 rowcount =1

while cint(rowcount) < cint(TotalCount)

response.write("Delete=" & Delete2(rowcount))

if Delete2(rowcount) = "on" then
 Query =  "Delete * From SilentAuctionItems where SAuctionID = " & SAuctionID2(rowcount) & ";" 
 response.write("query=" & Query)
 Conn.Execute(Query)

Else


Query =  " UPDATE SilentAuctionItems Set SAuctionTitle = '" & SAuctionTitle2(rowcount) & "' ," 
if len(SAuctionValue2(rowcount)) > 0 then
    Query =  Query & "  SAuctionValue = " & SAuctionValue2(rowcount) & ", " 
end if
if len(SAuctionMinBid2(rowcount)) > 0 then
    Query =  Query & "  SAuctionMinBid = " & SAuctionMinBid2(rowcount) & ", " 
end if
    Query =  Query & "  SAuctionDescription = '" & SAuctionDescription2(rowcount) & "' " 
    Query =  Query & " where SAuctionID  = " & SAuctionID2(rowcount) & ";" 

response.write("Query=" & query)

Conn.Execute(Query)

end if
	  rowcount= rowcount +1
Wend

End If 

%>
</td></tr></table>

<% Response.Redirect("SilentAuctionItemsEdit.asp?EventID=" & EventID ) %>
</Body>
</HTML>