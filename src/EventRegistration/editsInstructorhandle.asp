<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
<!--#Include file="GlobalVariables.asp"-->

<title>Edit Instructor</title>
       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<%
PeopleBio = request.form("PeopleBio")
AddressID = request.form("AddressID")
response.write("AddressID = " & AddressID & "<br>")
PeopleID = request.form("PeopleID")
BusinessID= request.form("BusinessID")
response.write("BusinessID = " & BusinessID & "<br>")
SponsorID = request.form("SponsorID")
BusinessName = request.form("BusinessName")
PeopleFirstName = request.form("PeopleFirstName")
PeopleLastName = request.form("PeopleLastName")
response.write("PeopleFirstName = " & PeopleFirstName & "<br>")
PeopleEmail = request.form("PeopleEmail")
PeoplePhone = request.form("PeoplePhone")
PeopleCell = request.form("PeopleCell")
PeopleFax = request.form("PeopleFax")
AddressStreet = request.form("AddressStreet")
AddressApt = request.form("AddressApt")
AddressCity = request.form("AddressCity")
AddressState = request.form("AddressState")
AddressZip = request.form("AddressZip")			
AddressCountry = request.form("AddressCountry")
Delete= request.querystring("Delete")
EventID = Request.Form("EventID")
WebsitesID = Request.Form("WebsitesID")
Website = Request.Form("Website")

rowcount = 1

if Delete = "Yes" then
	Query =  "Delete * From People where PeopleID = " & PeopleID & ";" 
	Conn.Execute(Query) 
	
	Query =  "Delete * From Address where AddressID = " & AddressID & ";" 
	Conn.Execute(Query)
Else



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
	
	str1 = PeopleBio
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleBio= Replace(str1, "'", "''")
	End If

	str1 = PeopleFirstName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleFirstName= Replace(str1, "'", "''")
	End If
	
	str1 = PeopleLastName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleLastName= Replace(str1, "'", "''")
	End If

	str1 = PeopleEmail
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleEmail= Replace(str1, "'", "''")
	End If

	str1 = PeoplePhone
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeoplePhone= Replace(str1, "'", "''")
	End If

	str1 = PeopleCell
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleCell= Replace(str1, "'", "''")
	End If

	str1 = PeopleFax
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		PeopleFax= Replace(str1, "'", "''")
	End If

	str1 = AddressStreet
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressStreet= Replace(str1, "'", "''")
	End If

	str1 = AddressApt
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressApt= Replace(str1, "'", "''")
	End If

	str1 = AddressCity
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressCity= Replace(str1, "'", "''")
	End If

	str1 = AddressState
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressState= Replace(str1, "'", "''")
	End If

	str1 = AddressZip
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressZip= Replace(str1, "'", "''")
	End If

	str1 = AddressCountry
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		AddressCountry= Replace(str1, "'", "''")
	End If
				
'****************************************************************************************************
'  UPDATE THE  ADDRESS INTO THE ADDRESS TABLE 
'****************************************************************************************************
Query =  " UPDATE Address Set AddressStreet = '" &  AddressStreet & "' ,"
Query =  Query & " AddressApt  = '" &  AddressApt & "'," 
Query =  Query & " AddressCity  = '" &  AddressCity & "'," 
Query =  Query & " AddressState  = '" &  AddressState & "'," 
Query =  Query & " AddressZip = '" &  AddressZip & "'," 
Query =  Query & " AddressCountry = '" &   AddressCountry & "'" 
Query =  Query & " where AddressID = " & AddressID & ";" 
response.write("address update query = " & Query & "<br>")
Conn.Execute(Query) 

'****************************************************************************************************
'  UPDATE THE  ADDRESS INTO THE ADDRESS TABLE 
'****************************************************************************************************
Query =  " UPDATE Websites Set Website = '" &  Website & "' "
Query =  Query & " where WebsitesID = " & WebsitesID & ";" 
response.write("website update query = " & Query & "<br>")
Conn.Execute(Query) 


'****************************************************************************************************
'  UPDATE THE  ADDRESS INTO THE Business TABLE 
'****************************************************************************************************
if len(BusinessID) > 0 then

Query =  " UPDATE Business Set BusinessName = '" &  BusinessName & "' "
Query =  Query & " where BusinessID = " & BusinessID & ";" 
response.write("Update Business = " & Query & "<br>")
Conn.Execute(Query) 
end if

'****************************************************************************************************
'   UPDATE PEOPLE TABLE
'****************************************************************************************************
Query =  " UPDATE People Set PeopleFirstName = '" &  PeopleFirstName & "' ,"
Query =  Query & " PeopleLastName  = '" &  PeopleLastName & "'," 
Query =  Query & " Peoplefax  = '" &  Peoplefax & "',"
Query =  Query & " Peopleemail  = '" &  Peopleemail & "',"
Query =  Query & " PeopleCell  = '" &  PeopleCell & "',"
Query =  Query & " PeopleBio  = '" &  PeopleBio & "',"
Query =  Query & " PeoplePhone = '" &  PeoplePhone & "'"
Query =  Query & " where PeopleID = " & PeopleID & ";" 

response.write(Query)
Conn.Execute(Query) 

end if


if Delete = "Yes" then
	response.redirect("ClassesEditInstructors.asp?EventID=" & EventID & "&PeopleID=" & PeopleID)
Else

 response.redirect("ClassesEditInstructorsDetails.asp?EventID=" & EventID & "&PeopleID=" & PeopleID & "&Completion=True")
end if
%>
 </Body>
</HTML>
