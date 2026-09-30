<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4+0 Transitional//EN">
<HTML>
<HEAD>
 <title>Delete Instructor Page</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">

</HEAD>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">


<!--#Include file="globalvariablesNotLoggedIn.asp"--> 

<%
AddressID = request.querystring("AddressID")
PeopleID = request.querystring("PeopleID")
EventID = request.querystring("EventID")

rowcount = 1

Query =  "Delete * From People where PeopleID = " & PeopleID & ";" 
Conn.Execute(Query) 

Query =  "Delete * From Address where AddressID = " & AddressID & ";" 
Conn.Execute(Query)

'Dim ID
EventID=Request.querystring("EventID") 

response.write("EventID = " & EventID & "<br/>")

Dim cmdDC, RecordSet
Dim RecordToEdit, Updated
Query =  "Delete * From Event where EventID = " &  EventID
Conn.Execute(Query) 

response.redirect("ClassesEditInstructors.asp?EventID=" & EventID & "&PeopleID=" & PeopleID)

%>


</Body>
</HTML>
