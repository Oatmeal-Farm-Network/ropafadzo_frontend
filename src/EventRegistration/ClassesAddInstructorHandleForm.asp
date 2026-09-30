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


'****************************************************************************************************
'  FIND THE Points of Interest
'****************************************************************************************************
i=0
sql = "select * from ClassInfo where EventID = " & EventID  &  ""
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

while Not rs.eof 
i=i +1
ClassInfoID = rs("ClassInfoID")

sql3 = "select * from Classinfo where EventID = " & EventID 
'response.write(sql3)
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
	ClassOrderArray(i) =  i 
	ClassInfoIDArray(i) = request.Form("class" & i )
    response.write("ClassOrderArray(i) =" & ClassOrderArray(i) & "<br>")
    response.write("ClassInfoIDArray(i) =" & ClassInfoIDArray(i) & "<br>")
end if 

 rs.movenext
wend
rs.close

InstructorBio = Request.Form("InstructorBio")
PeopleFirstName = Request.Form("PeopleFirstName")
PeopleLastName= Request.Form("PeopleLastName")
BusinessName= Request.Form("BusinessName")
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
Website= Request.Form("Website")


	str1 = lcase(Website)
	str2 = "http://"
	If InStr(str1,str2) > 0 Then
		Website= Replace(str1, str2, "")
	End If
	
		str1 = lcase(Website)
	str2 = "http:/"
	If InStr(str1,str2) > 0 Then
		Website= Replace(str1, str2, "")
	End If
	
		str1 = lcase(Website)
	str2 = "http:"
	If InStr(str1,str2) > 0 Then
		Website= Replace(str1, str2, "")
	End If
	
		str1 = lcase(Website)
	str2 = "http"
	If InStr(str1,str2) > 0 Then
		Website= Replace(str1, str2, "")
	End If
	
	
	str1 =Website
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		Website= Replace(str1,  str2, "''")
	End If 
	
	str1 =InstructorBio
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		InstructorBio= Replace(str1,  str2, "''")
	End If  

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

Conn.Execute(Query) 

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


Query =  "INSERT INTO Websites (Website)" 
Query =  Query & " Values ('" & Website & "')" 

Conn.Execute(Query) 

sql = "select WebsitesID from Websites where Website = '" & Website  & "' order by WebsitesID Desc "
response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
			WebsitesID = rs("WebsitesID")
	End If 
rs.close




Query =  "INSERT INTO Business (BusinessName)" 
Query =  Query & " Values ('" & BusinessName & "')" 

Conn.Execute(Query) 

sql = "select BusinessID from Business where BusinessName = '" & BusinessName  & "' order by BusinessID Desc "
response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
			BusinessID = rs("BusinessID")
	End If 
rs.close




Query =  "INSERT INTO People (PeopleFirstName, AddressID, WebsitesID, BusinessID, Instructor, PeopleLastName, PeoplePhone, PeopleCell, Peoplefax, PeopleBio, Peopleemail ) " 
Query =  Query & " Values ('" &  PeopleFirstName & "' ,"
Query =  Query & " " &  AddressID & " ,"
Query =  Query & " " &  WebsitesID & " ,"
Query =  Query & " " &  BusinessID & " ,"
Query =  Query & " Yes ,"
Query =  Query & " '" &  PeopleLastName & "' ,"
Query =  Query & " '" &  PeoplePhone & " ',"
Query =  Query & " '" &  PeopleCell & " ',"
Query =  Query & " '" &  Peoplefax & "' ,"
Query =  Query & " '" &  InstructorBio & "' ,"
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





Query =  "INSERT INTO Instructors (PeopleID, AddressID, WebsitesID, EventID ) " 
Query =  Query & " Values ('" &  PeopleID & "' ,"
Query =  Query & " " &  AddressID & " ,"
Query =  Query & " " &  WebsitesID & " ,"
Query =  Query & " " &  EventID  & " )" 

	response.write("Query=" & Query)	

	Conn.Execute(Query) 
	sql = "select PeopleID from People where AddressID = " & AddressID  & " order by PeopleID Desc;"
	
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	If Not rs.eof Then
		PeopleID = rs("PeopleID")
	End If 
rs.close




 end if 
end if

	
%>
</td></tr></table>

<% Response.Redirect("/ClassesAddInstructors.asp?completion=True&EventID=" & EventID ) %>
</Body>
</HTML>