<html>

<head>

<!--#Include virtual="/Conn.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Registration</title>

<meta name="author" content="AndresenEvents.com">
<link rel="stylesheet" type="text/css" href="Style.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >


<%
EventID= Request.querystring("EventID")
EventDescription= Request.form("EventDescription")



'*******  Payment data checked for single quote



str1 = EventDescription
str2 = "'"
If InStr(str1,str2) > 0 Then
	EventDescription= Replace(str1,  str2, "''")
End If 



'**************************************************************************************************************
'  UPDATE THE EVENT INFORMATION INTO THE EVENT TABLE
'**************************************************************************************************************


Query =  " UPDATE Event Set  EventDescription = '" &  EventDescription & "'" 
Query =  Query & " where EventID = " & EventID & ";" 

response.write("Query = " & Query)
Conn.Execute(Query) 

response.redirect("RegManageHome.asp?EventID=" & EventID & "&DescriptionMessage=Your Event Description Has Been Updated#Description")
%>

	
		</Body>
</HTML>

